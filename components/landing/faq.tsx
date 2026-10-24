'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { SectionHeading } from './section-heading'

const FAQS = [
    {
        q: 'Is FlashMind free?',
        a: 'Yes, it is free to start and no credit card is required. Create an account and build your first course right away.',
    },
    {
        q: 'What can I turn into a course?',
        a: 'Pasted text or notes, PDF files, web page URLs, YouTube videos (via their transcript), audio recordings, or simply a topic you type in. For PDFs, text-based files work best; scanned images without selectable text may not extract well.',
    },
    {
        q: 'How long does it take?',
        a: 'Your course outline appears in seconds. Lessons are written in the background and show up one by one as they are ready, so you can start the first lesson while the rest are still being built. Longer material takes a bit longer.',
    },
    {
        q: 'What kind of exam questions does it create?',
        a: 'Multiple choice, fill-in-the-blank and true/false questions generated from your own material. After the exam you see your score and which topics to review.',
    },
    {
        q: 'Which languages are supported?',
        a: 'FlashMind detects the language of your material and builds the course in that language. Most widely spoken languages work; English currently gives the most consistent results.',
    },
    {
        q: 'Is my data private?',
        a: 'Your courses and uploads are tied to your account and are not shown to other users. To generate lessons and questions, your content is sent to Google’s Gemini AI model for processing.',
    },
    {
        q: 'Can I edit what the AI generates?',
        a: 'Yes. You can edit lessons and exam questions so the course matches exactly what you need to learn.',
    },
]

export function Faq() {
    return (
        <section id="faq" className="scroll-mt-20 bg-muted/40 py-20 sm:py-28">
            <div className="mx-auto max-w-3xl px-4 sm:px-6">
                <SectionHeading eyebrow="FAQ" title="Questions, answered" />

                <Accordion type="single" collapsible className="mt-12 space-y-3">
                    {FAQS.map((item, i) => (
                        <AccordionItem
                            key={item.q}
                            value={`faq-${i}`}
                            className="rounded-2xl border border-border bg-card px-5 shadow-sm last:border-b data-[state=open]:shadow-md sm:px-6">
                            <AccordionTrigger className="cursor-pointer py-5 text-left text-base font-semibold hover:no-underline">
                                {item.q}
                            </AccordionTrigger>
                            <AccordionContent className="pb-5 text-base leading-relaxed text-muted-foreground">{item.a}</AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
