import { NextRequest } from "next/server";
import { createChatModel } from "@/utils/ai/model";
import { successResponse, errorResponse, serverErrorResponse, authErrorResponse } from "@/utils/api-helpers";
import { verifyAuth } from "@/utils/auth/server";

export const maxDuration = 60;

const WIKI_API = 'https://en.wikipedia.org/w/api.php';
const WIKI_HEADERS = { 'User-Agent': 'FlashMind/1.0 (course generation; https://flashmind.app)' };
const MIN_WIKI_CHARS = 1500;
const MAX_CONTENT_CHARS = 60_000;

type TopicContent = { content: string; title: string };

async function fetchWikipedia(topic: string): Promise<TopicContent | null> {
    try {
        // Resolve a bare topic ("photosynthesis") to the best matching article.
        const searchParams = new URLSearchParams({
            action: 'query', list: 'search', srsearch: topic, srlimit: '1', format: 'json', origin: '*',
        });
        const searchRes = await fetch(`${WIKI_API}?${searchParams}`, {
            headers: WIKI_HEADERS, signal: AbortSignal.timeout(10_000),
        });
        if (!searchRes.ok) return null;
        const searchData = await searchRes.json();
        const pageTitle: string | undefined = searchData?.query?.search?.[0]?.title;
        if (!pageTitle) return null;

        // Full plain-text article, not just the summary paragraph.
        const extractParams = new URLSearchParams({
            action: 'query', prop: 'extracts', explaintext: '1', redirects: '1',
            titles: pageTitle, format: 'json', origin: '*',
        });
        const extractRes = await fetch(`${WIKI_API}?${extractParams}`, {
            headers: WIKI_HEADERS, signal: AbortSignal.timeout(10_000),
        });
        if (!extractRes.ok) return null;
        const extractData = await extractRes.json();
        const pages = extractData?.query?.pages ?? {};
        const page = Object.values(pages)[0] as { title?: string; extract?: string } | undefined;
        const extract = page?.extract?.trim();
        if (!extract || extract.length < MIN_WIKI_CHARS) return null;

        // Drop trailing reference sections and convert "== Heading ==" to markdown.
        const cleaned = extract
            .split(/\n==\s*(See also|References|Notes|Further reading|External links|Bibliography|Sources)\s*==/i)[0]
            .replace(/^====\s*(.+?)\s*====$/gm, '#### $1')
            .replace(/^===\s*(.+?)\s*===$/gm, '### $1')
            .replace(/^==\s*(.+?)\s*==$/gm, '## $1')
            .replace(/\n{3,}/g, '\n\n')
            .trim();

        const title = page?.title || pageTitle;
        return { title, content: `# ${title}\n\n${cleaned}`.slice(0, MAX_CONTENT_CHARS) };
    } catch (err) {
        console.error('Wikipedia fetch failed:', err);
        return null;
    }
}

async function generateWithAI(topic: string): Promise<TopicContent | null> {
    try {
        const llm = createChatModel({ temperature: 0.4, maxOutputTokens: 8000 });
        const response = await llm.invoke([
            {
                role: 'system',
                content: 'You are an expert educator writing accurate, well-structured study material in markdown.',
            },
            {
                role: 'user',
                content: `Write comprehensive study material (about 2000-3000 words) on the topic: "${topic}".
Structure it with markdown headings and cover:
- An overview and why the topic matters
- Key concepts and precise definitions
- How it works (mechanisms, processes, steps) in depth
- Worked examples and real-world applications
- Common misconceptions and pitfalls
- A short summary of the key takeaways
Write in the language of the topic as given. Output only the material, starting with a "# " title.`,
            },
        ]);
        const content = (typeof response.content === 'string'
            ? response.content
            : response.content.map((p) => ('text' in p && typeof p.text === 'string' ? p.text : '')).join('')
        ).trim();
        if (!content) return null;
        const heading = content.match(/^#\s+(.+)$/m)?.[1]?.trim();
        return { content: content.slice(0, MAX_CONTENT_CHARS), title: heading || topic };
    } catch (err) {
        console.error('AI topic generation failed:', err);
        return null;
    }
}

export async function POST(req: NextRequest) {
    try {
        // Drives Gemini, so it must be authenticated.
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const body = await req.json().catch(() => null);
        const topic = typeof body?.topic === 'string' ? body.topic.trim().slice(0, 300) : '';
        const source = body?.source === undefined || body?.source === 'wikipedia' ? 'wikipedia' : 'ai';

        if (!topic) {
            return errorResponse('Topic is required');
        }

        let result: TopicContent | null = null;
        let usedSource: 'Wikipedia' | 'AI Generated' = 'AI Generated';

        if (source === 'wikipedia') {
            result = await fetchWikipedia(topic);
            if (result) usedSource = 'Wikipedia';
        }
        if (!result) {
            result = await generateWithAI(topic);
        }

        if (!result) {
            return errorResponse('No content could be generated for this topic. Please try again.', 502);
        }

        return successResponse({
            content: result.content,
            title: result.title,
            source: usedSource,
            wordCount: result.content.split(/\s+/).filter(Boolean).length,
        }, 'Topic content generated successfully');
    } catch (error) {
        console.error('Error generating topic content:', error);
        return serverErrorResponse('Failed to generate topic content');
    }
}
