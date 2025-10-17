import { NextRequest } from "next/server";
import { successResponse, errorResponse, serverErrorResponse } from "@/utils/api-helpers";
import { quotaManager } from "@/features/content-import/utils/quotas";
import * as cheerio from 'cheerio';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const { url } = body;

        if (!url) {
            return errorResponse('URL is required');
        }

        // Check quota
        const quotaCheck = quotaManager.checkQuota('url');
        if (!quotaCheck.allowed) {
            return errorResponse(quotaCheck.reason || 'Quota exceeded');
        }

        // Validate URL
        try {
            new URL(url);
        } catch {
            return errorResponse('Invalid URL format');
        }

        // Fetch the webpage
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
        });

        if (!response.ok) {
            return errorResponse(`Failed to fetch URL: ${response.statusText}`);
        }

        const html = await response.text();
        const $ = cheerio.load(html);

        // Remove script and style elements
        $('script, style, nav, header, footer, aside, .advertisement, .ads').remove();

        // Extract title
        const title = $('title').text().trim() || 
                     $('h1').first().text().trim() || 
                     'Web Content';

        // Extract main content
        let content = '';
        
        // Try to find main content areas
        const mainSelectors = [
            'main',
            'article',
            '.content',
            '.post-content',
            '.entry-content',
            '.article-content',
            '[role="main"]'
        ];

        let mainContent = $();
        for (const selector of mainSelectors) {
            mainContent = $(selector);
            if (mainContent.length > 0) break;
        }

        if (mainContent.length > 0) {
            content = mainContent.text();
        } else {
            // Fallback to body content
            content = $('body').text();
        }

        // Clean up the content
        content = content
            .replace(/\s+/g, ' ') // Replace multiple whitespace with single space
            .replace(/\n\s*\n/g, '\n') // Remove empty lines
            .trim();

        if (!content) {
            return errorResponse('No content found on the webpage');
        }

        // Extract description if available
        const description = $('meta[name="description"]').attr('content') || 
                          $('meta[property="og:description"]').attr('content') || 
                          '';

        // Record usage
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
