import React from 'react'

const HowItWorkSection = () => {
    return (
        <section className='w-full bg-[#0F0F0F] bg-repeat-y bg-center py-24 ' id='How' style={{
            backgroundImage: `url('/GridSection.svg')`,
        }} >
            <div className="container mx-auto px-4">
                <h2 className='text-destructive text-2xl font-semibold text-center mb-6'>How It Works</h2>
                <h3 className="text-white text-4xl font-bold text-center mb-16">From Raw Material to Real Understanding in 4 Steps</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Step 1 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">1</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Drop In Your Material</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Paste notes, upload a PDF, share a link or YouTube video, record audio, or just type a topic.</p>
                    </div>
                    
                    {/* Step 2 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">2</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Get a Course</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">FlashMind outlines your course in seconds, then writes short lessons you can read while the rest are generated.</p>
                    </div>
                    
                    {/* Step 3 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">3</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Test Yourself</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Generate an exam from the same material: multiple choice, true/false and fill-in-the-blank questions.</p>
                    </div>
                    
                    {/* Step 4 */}
                    <div className="text-center">
                        <div className="bg-destructive text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">4</div>
                        <h4 className="text-white text-xl font-semibold mb-4">Review What You Missed</h4>
                        <p className="text-gray-300 text-sm leading-relaxed">Your results show every question you got wrong, so you go back to the right lesson instead of rereading everything.</p>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default HowItWorkSection