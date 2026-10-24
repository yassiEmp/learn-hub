import Image from 'next/image'
import Link from 'next/link';
const withoutFlashMind = [
    {
        point: "Rereading the same pages",
        description: "Highlighting and rereading feels productive, but most of it is gone a week later.",
    },
    {
        point: "Hours spent making your own quizzes",
        description: "Turning notes into questions by hand takes longer than studying the material itself.",
    },
    {
        point: "Walls of text, no structure",
        description: "A 40-page PDF or a 2-hour lecture gives you no obvious place to start or stop.",
    },
    {
        point: "False confidence",
        description: "It feels like you know it, until a question asks it a different way.",
    },
    {
        point: "No idea what to review",
        description: "Without a test you can't tell your weak topics from your strong ones.",
    },
];

const withFlashMind = [
    {
        point: "Any material becomes a course",
        description: "Paste notes, upload a PDF, drop a link or YouTube video, record audio, or just type a topic.",
    },
    {
        point: "Short lessons you can finish",
        description: "The AI splits your material into focused lessons with objectives and a key takeaway.",
    },
    {
        point: "An exam built from your content",
        description: "Multiple choice, true/false and fill-in-the-blank questions grounded in what you uploaded.",
    },
    {
        point: "Know exactly what to review",
        description: "Your results show which answers you missed so you go back to the right lesson.",
    },
    {
        point: "Ready in minutes",
        description: "The course outline appears in seconds and lessons fill in while you start reading.",
    },
];

export default function ProblemSection() {
    return (
        <section className='flex flex-col items-center mb-32' id="Benefits">
            <div className="bg-background/50 py-24 pb-6 ">
                <div className="mx-auto w-full max-w-7xl px-6 flex items-center flex-col">
                    <div>
                        <h2 className="text-destructive mt-4 text-xl font-semibold text-center mb-6">The problem</h2>
                        <p className="text-foreground/90 mb-2 mt-4 text-balance text-5xl text-center">Stop guessing. Know what you know before the exam does.</p>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg text-center">Studying harder isn&apos;t the problem. Studying blind is. FlashMind turns your material into lessons and a test, so your time goes to what you haven&apos;t mastered yet.</p>

                    </div>

                    <div className="grid gap-4 grid-col-1 md:grid-cols-2 bg-gray-100/40 w-full mx-auto rounded-3xl p-2 md:p-4">
                        <div className='w-full h-full bg-red-100/40 p-2 md:p-4 rounded-2xl overflow-x-hidden'>
                            <p className='text-2xl font-bold text-foreground text-center mb-4'>Without FlashMind</p>
                            <div className='overflow-x-auto md:overflow-hidden scrollbar-hide'>
                                <div className='flex md:flex-col w-full overflow-visible auto-scroll-horizontal '>
                                    {withoutFlashMind.map((el, index) =>
                                        <div key={index} className='w-full min-w-[245px] bg-background rounded-xl border border-red-200 p-2 mb-2 hover:bg-background/90 transition-colors duration-200 ml-2 mr-2 md:ml-0 md:mr-0 '>
                                            <div className='flex'>
                                                <Image src='./red-cross.svg' width={21} height={21} alt="" className='mr-2' />
                                                <p className='font-medium text-lg'>{el.point}</p>
                                            </div>
                                            <p className='text-muted-foreground text-sm '>{el.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className='w-full h-full bg-green-100/40 p-4 rounded-2xl overflow-x-hidden'>
                            <p className='text-2xl font-bold text-foreground text-center mb-4'>With FlashMind</p>

                            <div className='overflow-x-auto md:overflow-hidden scrollbar-hide'>
                                <div className='flex md:flex-col w-full overflow-visible auto-scroll-horizontal '>
                                    {withFlashMind.map((el, index) =>
                                        <div key={index} className='w-full min-w-[245px]  bg-background rounded-xl border border-green-200 p-2 mb-2 hover:bg-background/90 transition-colors duration-200 ml-2 mr-2 md:ml-0 md:mr-0 '>
                                            <div className='flex'>
                                                <Image src='./green-check.svg' width={21} height={21} alt="" className='mr-2' />
                                                <p className='font-medium text-lg capitalize'>{el.point}</p>
                                            </div>
                                            <p className='text-muted-foreground text-sm '>{el.description}</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Link
                href="/login?mode=signup"
                className="inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium
                            h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200
                            shadow-md shadow-black/10 border border-primary/20
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring/50
                            disabled:pointer-events-none disabled:opacity-50
                            [&_svg]:pointer-events-none [&_svg]:drop-shadow-sm [&_svg]:size-4 [&_svg]:shrink-0 
                            mt-6 hover:shadow-lg hover:shadow-primary/10
                            active:scale-[0.98] transform"
            >
                Build your first course free
            </Link>
        </section>
    )
}



