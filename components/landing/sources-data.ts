import { FileText, Lightbulb, Link2, Mic, Type, Youtube, type LucideIcon } from 'lucide-react'

export type SourceType = {
    id: 'text' | 'pdf' | 'url' | 'youtube' | 'topic' | 'audio'
    label: string
    icon: LucideIcon
    placeholder: string
    title: string
    description: string
    example: string
}

export const SOURCES: SourceType[] = [
    {
        id: 'text',
        label: 'Text',
        icon: Type,
        placeholder: 'Paste your lecture notes, an article, or a chapter…',
        title: 'Paste notes',
        description: 'Drop in lecture notes, a textbook chapter or an article. FlashMind organises it into lessons.',
        example: 'Lecture notes, essays, docs',
    },
    {
        id: 'pdf',
        label: 'PDF',
        icon: FileText,
        placeholder: 'Upload a PDF: slides, a textbook chapter, a paper…',
        title: 'Upload a PDF',
        description: 'Slides, textbook chapters, research papers. The text is pulled out and turned into a course.',
        example: 'Slides, papers, handouts',
    },
    {
        id: 'url',
        label: 'URL',
        icon: Link2,
        placeholder: 'https://… paste any article or docs page',
        title: 'Drop a link',
        description: 'Paste a blog post, documentation page or Wikipedia article and learn it properly.',
        example: 'Blogs, docs, Wikipedia',
    },
    {
        id: 'youtube',
        label: 'YouTube',
        icon: Youtube,
        placeholder: 'https://youtube.com/watch?v=… paste a video link',
        title: 'Use a YouTube video',
        description: 'Turn a lecture or tutorial into structured lessons from its transcript, no rewatching needed.',
        example: 'Lectures, tutorials, talks',
    },
    {
        id: 'topic',
        label: 'Topic',
        icon: Lightbulb,
        placeholder: 'Type a topic, e.g. "Photosynthesis for beginners"',
        title: 'Just type a topic',
        description: 'No material yet? Name what you want to learn and FlashMind drafts a course from scratch.',
        example: '"Intro to SQL joins"',
    },
    {
        id: 'audio',
        label: 'Audio',
        icon: Mic,
        placeholder: 'Record a lecture or voice memo, or upload an audio file…',
        title: 'Record audio',
        description: 'Record a class or a voice memo. FlashMind transcribes it and builds the lessons for you.',
        example: 'Classes, voice memos, podcasts',
    },
]
