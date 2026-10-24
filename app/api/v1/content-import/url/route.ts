import { NextRequest } from "next/server";
import * as cheerio from 'cheerio';
import { successResponse, errorResponse, serverErrorResponse, authErrorResponse } from "@/utils/api-helpers";
import { quotaManager } from "@/features/content-import/utils/quotas";
import { verifyAuth } from "@/utils/auth/server";
import { fetchPublicText, UnsafeUrlError } from "@/features/content-import/server/safeFetch";

export async function POST(req: NextRequest) {
    try {
        const { user, error: authError } = await verifyAuth(req);
        if (authError || !user) {
            return authErrorResponse(authError || 'Authentication required');
        }

        const body = await req.json().catch(() => null);
        const url = typeof body?.url === 'string' ? body.url.trim() : '';
        if (!url) {
            return errorResponse('URL is required');
        }

        const quotaCheck = quotaManager.checkQuota('url');
        if (!quotaCheck.allowed) {
            return errorResponse(quotaCheck.reason || 'Quota exceeded');
        }

        let page: Awaited<ReturnType<typeof fetchPublicText>>;
        try {
            page = await fetchPublicText(url);
        } catch (fetchErr) {
            if (fetchErr instanceof UnsafeUrlError) return errorResponse(fetchErr.message);
            console.error('URL fetch failed:', fetchErr);
            return errorResponse('Could not reach this URL. Check the address and try again.', 502);
        }

        if (!page.ok) {
            return errorResponse(`Failed to fetch URL (HTTP ${page.status})`, 502);
        }

        const $ = cheerio.load(page.text);
        $('script, style, noscript, nav, header, footer, aside, form, iframe, svg, .advertisement, .ads').remove();

        const title = $('title').text().trim() || $('h1').first().text().trim() || 'Web Content';

        const mainSelectors = ['main', 'article', '.content', '.post-content', '.entry-content', '.article-content', '[role="main"]'];
        let mainContent = $();
        for (const selector of mainSelectors) {
            mainContent = $(selector);
            if (mainContent.length > 0) break;
        }

        const content = (mainContent.length > 0 ? mainContent.text() : $('body').text())
            .replace(/\s+/g, ' ')
            .trim();

        if (!content) {
            return errorResponse('No content found on the webpage');
        }

        const description = $('meta[name="description"]').attr('content') ||
            $('meta[property="og:description"]').attr('content') || '';

        quotaManager.recordUsage('url');

        return successResponse({
            content,
            title,
            description,
            url,
            wordCount: content.split(' ').length
        }, 'Content extracted successfully');
    } catch (error) {
        console.error('Error extracting URL content:', error);
        return serverErrorResponse('Failed to extract content from URL');
    }
}
