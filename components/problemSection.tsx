'use client'
import Image from 'next/image'
import Link from 'next/link';
const withoutMasterIt = [
    // Least Impactful (1-3)
    {
        point: "Wasting Time Learning the same thing",
        description: "spending most of your time reading the same thing is not effective , it waste time and lessen the will to learn "
    },
    {
        point: "Feeling Unproductive while Studying",
        description:
            "Learning without a test or a way to grade yourself feels frustrating and unproductive.",
    },
    {
        point: "Difficulty Tracking Progress",
        description: "You can't see if you're improving or what's left to cover.",
    },

    // Low Impact (4-6)
    {
        point: "Ineffective Study Techniques",
        description:
            "Relying on re-reading and highlighting, which aren't really effective methods.",
    },
    {
        point: "Relying Only on Passive Content",
        description:
            "Watching videos/lectures without engagement gives a false sense of productivity and results in memorizing almost nothing.",
    },
    {
        point: "Inconsistent Study Routine",
        description:
            "Bursts of effort followed by long gaps ruin consistency and progress.",
    },

    // Medium Impact (7-8)
    {
        point: "Forgetting Quickly After Studying",
        description: "Knowledge fades fast without recall sessions.",
    },
    {
        point: "Poor Time Management",
        description:
            "Spending too much time on easy topics while neglecting difficult ones.",
    },

    // High Impact (9-10)
    {
        point: "No Test Before Exam",
        description:
            "You don't know what's right or wrong, which prevents improvement and leads to bad results during exams.",
    },
    {
        point: "Misjudging Understanding (False Confidence)",
        description:
            "You think you have mastered a topic, but you fail to respond to questions during the exam.",
    },

    // Most Impactful (11)
    {
        point: "Procrastination",
        description:
            "Constantly delaying learning even when exams are coming, which can result in bad grades and in the worst case failure.",
    },
];

const withMasterIt = [
    // Least Impactful (1-3)
    {
        point: "Reminder System",
        description:
            "Receive alerts and messages before exams so you can start locking in and be ready for your learning.",
    },
    {
        point: "Programmed Study Routine",
        description:
            "Well-structured study routines help you stay consistent in your learning.",
    },
    {
        point: "Advanced Analytics",
        description:
            "Analytics keep your knowledge on track, showing progress and coverage.",
    },

    // Low Impact (4-6)
    {
        point: "Test Your Knowleadge While you are learning ",
        description: "Test your knowleadge while learning with all the different test available on Master-It so you can track your evolution and be sure you are learning effectivelly"
    },
    {
        point: "Automatically Crafted Exams",
        description:
            "Our system creates exams to help you measure progress and stay engaged while studying.",
    },
    {
        point: "Interactive Learning from Content",
        description:
            "Turn videos and lectures into quizzes, multiple-choice, true/false, and fill-in-the-gap questions.",
    },

    // Medium Impact (7-8)
    {
        point: "Science-Backed Study Techniques",
        description:
            "Use active recall, spaced repetition, and other proven methods to study efficiently.",
    },
    {
        point: "Scheduled Recall Sessions",
        description:
            "Recall information after long periods using a structured recall system.",
    },

    // High Impact (9-10)
    {
        point: "Continuous Self-Testing",
        description:
            "Challenge your understanding throughout the learning process to be fully prepared for exams.",
    },
    {
        point: "Planned Tests Before Exams",
        description:
            "Master-It plans test series before your exams to show you what to focus on.",
    },

    // Most Impactful (11)
    {
        point: "Analytics-Driven Learning",
        description:
            "Use exam data to focus on your most challenging topics instead of wasting time on easy ones.",
    },
];

export default function ProblemSection() {
    return (
        <section  className='flex flex-col items-center mb-32' id="Benefitsé">
            <div className="bg-background/50 py-24 pb-6 ">
                <div className="mx-auto w-full max-w-7xl px-6 flex items-center flex-col">
                    <div>
                        <h2 className="text-destructive mt-4 text-xl font-semibold text-center mb-6">Problem We Are Solving</h2>
                        <p className="text-foreground/90 mb-2 mt-4 text-balance text-5xl text-center">stop guessing and be confident about your knowleadge for you exam or work</p>
                        <p className="text-muted-foreground mb-12 mt-4 text-balance text-lg text-center">No more loosing time learning the same things and no more confusion during an exam. Be ready for your top grades </p>

                    </div>

                    <div className="grid gap-4 grid-col-1 md:grid-cols-2 dark:bg-transparent bg-gray-100/40 w-full mx-auto rounded-3xl p-4">
                        <div className='w-full h-full bg-red-100/40 dark:bg-red-950/20 p-4 rounded-2xl'>
                            <p className='text-2xl font-bold text-foreground text-center mb-4'>Without Master-It</p>
                            {withoutMasterIt.map((el, index) =>
                                <div key={index} className='w-full bg-background dark:bg-background/60 rounded-xl border border-red-200 dark:border-red-800/20 p-2 mb-2 hover:bg-background/90 dark:hover:bg-background/70 transition-colors duration-200'>
                                    <div className='flex'>
                                        <Image src='./red-cross.svg' width={21} height={21} alt="a red " className='mr-2' />
                                        <p className='font-medium text-lg'>{el.point}</p>
                                    </div>
                                    <p className='text-muted-foreground text-sm '>{el.description}</p>
                                </div>
                            )}
                        </div>
                        <div className='w-full h-full bg-green-100/40 dark:bg-green-950/20 p-4 rounded-2xl'>
                            <p className='text-2xl font-bold text-foreground text-center mb-4'>With Master-It</p>
                            {withMasterIt.map((el, index) =>
                                <div key={index} className='w-full bg-background dark:bg-background/60 rounded-xl border border-green-200 dark:border-green-800/20 p-2 mb-2 hover:bg-background/90 dark:hover:bg-background/70 transition-colors duration-200'>
                                    <div className='flex'>
                                        <Image src='./green-check.svg' width={21} height={21} alt="a red " className='mr-2' />
                                        <p className='font-medium text-lg capitalize'>{el.point}</p>
                                    </div>
                                    <p className='text-muted-foreground text-sm '>{el.description}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
            <Link
                href="#call"
                className="inline-flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap rounded-md text-sm font-medium
                            h-10 px-4 bg-primary text-primary-foreground hover:bg-primary/90 transition-all duration-200
                            shadow-md shadow-black/10 dark:shadow-black/30 border border-primary/20 dark:border-primary/30
                            focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 focus-visible:border-ring/50
                            disabled:pointer-events-none disabled:opacity-50
                            [&_svg]:pointer-events-none [&_svg]:drop-shadow-sm [&_svg]:size-4 [&_svg]:shrink-0 
                            mt-6 hover:shadow-lg hover:shadow-primary/10 dark:hover:shadow-primary/20
                            active:scale-[0.98] transform"
            >
                Generate Your First Exam For Free
            </Link>
        </section>
    )
}



