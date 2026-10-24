'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsSection() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'What can I turn into a course?',
            answer: 'Pasted text or notes, PDF files, web articles (paste the URL), YouTube videos with captions, audio or video recordings, or simply a topic you want to learn.',
        },
        {
            id: 'item-2',
            question: 'What types of questions does the exam include?',
            answer: 'Multiple choice, true/false and fill-in-the-blank questions, generated from your material.',
        },
        {
            id: 'item-3',
            question: 'How long does it take?',
            answer: 'The course outline is ready in a few seconds. Lessons appear one by one over the next minute or two, and you can start reading the first one right away.',
        },
        {
            id: 'item-4',
            question: 'Is there a size limit?',
            answer: 'Audio and video uploads are limited to 10 MB. Very long documents work, but take longer to process.',
        },
        {
            id: 'item-5',
            question: 'Can I use it on my phone?',
            answer: 'Yes. FlashMind works in any modern browser on phones, tablets and computers.',
        },
        {
            id: 'item-6',
            question: 'Is my content private?',
            answer: 'Your courses and exams are only visible to your account. To generate lessons and questions, your content is processed by an AI model.',
        },
        {
            id: 'item-7',
            question: 'Is it free?',
            answer: 'Yes, you can create your first courses and exams for free. No credit card required.',
        },
        {
            id: 'item-8',
            question: 'How accurate are the generated questions?',
            answer: 'Questions are written from your own material, which keeps them on topic. Like any AI output they can occasionally be wrong, so treat a surprising answer as a reason to check the lesson.',
        },
    ]

    return (
        <section className="py-16 md:py-24 bg-muted " id='FAQ'>
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-muted w-full rounded-2xl p-1">
                        {faqItems.map((item) => (
                            <div
                                className="group"
                                key={item.id}>
                                <AccordionItem
                                    value={item.id}
                                    className="data-[state=open]:bg-card peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm">
                                    <AccordionTrigger className="cursor-pointer text-base hover:no-underline">{item.question}</AccordionTrigger>
                                    <AccordionContent>
                                        <p className="text-base">{item.answer}</p>
                                    </AccordionContent>
                                </AccordionItem>
                                <hr className="mx-7 border-dashed group-last:hidden peer-data-[state=open]:opacity-0" />
                            </div>
                        ))}
                    </Accordion>

                    <p className="text-muted-foreground mt-6 px-8">
                        Still have a question?{' '}
                        <Link
                            href="/login?mode=signup"
                            className="text-primary font-medium hover:underline">
                            Try it free and see for yourself
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
