import React from 'react'

interface ProgressBarProps {
    lenght: number,
    res: Map<number, boolean>
}

const ProgressBar = ({ lenght, res }: ProgressBarProps) => {
    return (
        <div className='w-full h-2 flex mt-8 mb-8 max-w-6xl'>
            {Array.from({ length: lenght }).map((_, idx) => {
                const isCorrect = res.get(idx)
                const barClass = `w-full ml-2 mr-2 h-full rounded-full bg-blue-500/50 ${isCorrect == undefined ? "" : isCorrect ? 'bg-blue-500!' : 'bg-red-500'}`
                return (
                    <div className={barClass} key={idx}>

                    </div>
                )
            })}
        </div>
    )
}

export default ProgressBar