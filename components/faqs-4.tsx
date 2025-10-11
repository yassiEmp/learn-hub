'use client'

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import Link from 'next/link'

export default function FAQsSection() {
    const faqItems = [
        {
            id: 'item-1',
            question: 'How do I upload my study materials?',
            answer: 'You can upload PDFs, Word documents, or paste text directly. Our proprietary system quickly processes everything for exam generation.',
        },
        {
            id: 'item-2',
            question: 'What types of questions can the app generate?',
            answer: 'MCQs, fill-in-the-blank, true/false questions, and flashcards — all automatically generated and tailored to your material.',
        },
        {
            id: 'item-3',
            question: 'Is there a limit to file size?',
            answer: 'Extremely large files may take longer to process. We recommend files under 50MB for optimal performance.',
        },
        {
            id: 'item-4',
            question: 'Can I use the app on mobile devices?',
            answer: 'Yes, it\'s fully responsive for smartphones and tablets.',
        },
        {
            id: 'item-5',
            question: 'Is my data secure?',
            answer: 'Absolutely. We use industry-standard encryption and strict privacy policies to protect your content.',
        },
        {
            id: 'item-6',
            question: 'Can I track my progress over time?',
            answer: 'Yes, our analytics show improvements, identify gaps, and help you optimize your study plan.',
        },
        {
            id: 'item-7',
            question: 'Is there a free trial?',
            answer: 'Yes, generate your first exam for free — no credit card required.',
        },
        {
            id: 'item-8',
            question: 'How accurate are the generated questions?',
            answer: 'Our proprietary system uses AI to ensure questions reflect your material. We recommend reviewing them to suit your study needs.',
        },
        {
            id: 'item-9',
            question: 'Can I customize quizzes?',
            answer: 'Yes, you can edit, add, or remove questions for a personalized experience.',
        },
        {
            id: 'item-10',
            question: 'What if I need support?',
            answer: 'Our team is ready to help — contact us via the website for prompt assistance.',
        },
    ]

    return (
        <section className="py-16 md:py-24 bg-muted dark:bg-background " id='FAQ'>
            <div className="mx-auto max-w-5xl px-4 md:px-6">
                <div className="mx-auto max-w-xl text-center">
                    <h2 className="text-balance text-3xl font-bold md:text-4xl lg:text-5xl">Frequently Asked Questions</h2>
                    <p className="text-muted-foreground mt-4 text-balance">Discover quick and comprehensive answers to common questions about our platform, services, and features.</p>
                </div>

                <div className="mx-auto mt-12 max-w-xl">
                    <Accordion
                        type="single"
                        collapsible
                        className="bg-muted dark:bg-muted/50 w-full rounded-2xl p-1">
                        {faqItems.map((item) => (
                            <div
                                className="group"
                                key={item.id}>
                                <AccordionItem
                                    value={item.id}
                                    className="data-[state=open]:bg-card dark:data-[state=open]:bg-muted peer rounded-xl border-none px-7 py-1 data-[state=open]:border-none data-[state=open]:shadow-sm">
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
                        Can&apos;t find what you&apos;re looking for? Contact our{' '}
                        <Link
                            href="#"
                            className="text-primary font-medium hover:underline">
                            customer support team
                        </Link>
                    </p>
                </div>
            </div>
        </section>
    )
}
