import React from 'react'

const HowItWorkSection = () => {
    return (
        <section className='w-full bg-[#0F0F0F] bg-repeat-y bg-center py-24 ' id='How' style={{
            backgroundImage: `url('/GridSection.svg')`,
        }} >
            <div className="container mx-auto px-4">
                <h2 className='text-destructive text-2xl font-semibold text-center mb-6'>How It Works</h2>
                <h3 className="text-white text-4xl font-bold text-center mb-16">Master Any Subject in 4 Simple Steps</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Upload Your Material</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Paste notes, upload PDFs, or drop a YouTube link — our proprietary system quickly processes your material and gets it ready for learning.</p>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Generate Your Exam</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Our AI-powered engine automatically generates MCQs, fill-in-the-blank, true/false questions, and flashcards — all tailored to your content in seconds.</p>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Take the Exam & Get Feedback</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Complete your exam and instantly receive detailed feedback. See your strengths, weaknesses, and actionable insights to improve faster.</p>
                    </div>
                    
                    {/* Step 4 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Track Your Progress</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Monitor your learning journey with analytics. Our system highlights gaps, tracks improvements, and keeps you on the fastest path to mastery.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorkSection