'use client'
import { useEffect, useId, useRef, useState } from 'react'
import type { ComponentType, CSSProperties, ReactNode } from 'react'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'

// Layout and illustration treatment follow the "Comment ça se passe" section of smoni.fr:
// desktop = sticky art card that cross-fades + progress rail; mobile = art inline per step.

type Step = { n: string; tag: string; t: string; b: string; Art: ComponentType; hue: number }

const STEPS: ReadonlyArray<Step> = [
    { n: '01', tag: 'Import', t: 'Drop in your material', b: 'Paste notes, upload a PDF, share a link or YouTube video, record audio, or just type a topic.', Art: ArtImport, hue: 0 },
    { n: '02', tag: 'Course', t: 'Get a course in seconds', b: 'FlashMind outlines your course right away, then writes short lessons you can read while the rest are generated.', Art: ArtCourse, hue: 25 },
    { n: '03', tag: 'Exam', t: 'Test yourself', b: 'Generate an exam from the same material: multiple choice, true/false and fill-in-the-blank questions.', Art: ArtExam, hue: 50 },
    { n: '04', tag: 'Review', t: 'Review what you missed', b: 'Your results show every question you got wrong, so you go back to the right lesson instead of rereading everything.', Art: ArtReview, hue: 75 },
]

function washFor(hue: number): CSSProperties {
    return {
        transform: `rotate(${-12 + hue / 5}deg)`,
        background: `linear-gradient(95deg, #cfceea 0%, #f3f1ff ${14 + hue / 5}%, #7472b0 ${28 + hue / 6}%, #e6e3ff 40%, #3b82f6 ${52 + hue / 8}%, #f8fafc 62%, #2c2876 ${76 - hue / 8}%, #a4a2cc 88%, #e6e3ff 100%)`,
    }
}

function StepArt({ step, on = true }: { step: Step; on?: boolean }) {
    const { Art } = step
    return (
        <div className={`absolute inset-0 transition-opacity duration-700 ease-out motion-reduce:transition-none ${on ? 'opacity-100' : 'opacity-0'}`}>
            <div aria-hidden className="absolute -inset-[30%] blur-[26px]" style={washFor(step.hue)} />
            <div
                aria-hidden
                className="absolute inset-x-[11%] top-1/2 aspect-video -translate-y-1/2 overflow-hidden rounded-[18px] bg-white"
                style={{ boxShadow: '0 30px 60px -30px rgba(30,27,75,0.55), 0 0 0 1px rgba(255,255,255,0.7)' }}>
                <Art />
            </div>
        </div>
    )
}

export default function HowItWorkSection() {
    const railRef = useRef<HTMLDivElement | null>(null)
    const blockRefs = useRef<Array<HTMLLIElement | null>>([])
    const [active, setActive] = useState(0)

    useEffect(() => {
        const update = () => {
            const mid = window.innerHeight * 0.55
            let a = 0
            blockRefs.current.forEach((el, i) => {
                if (el && el.getBoundingClientRect().top < mid) a = i
            })
            setActive(a)
            const rail = railRef.current
            if (!rail) return
            const r = rail.getBoundingClientRect()
            rail.style.setProperty('--prog', String(Math.min(1, Math.max(0, (mid - r.top) / r.height))))
        }
        update()
        window.addEventListener('scroll', update, { passive: true })
        window.addEventListener('resize', update)
        return () => {
            window.removeEventListener('scroll', update)
            window.removeEventListener('resize', update)
        }
    }, [])

    return (
        <section id="How" className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
                <h2 className="text-center text-4xl font-extrabold tracking-tight text-[#1e1b4b] md:text-5xl">How it works</h2>

                <div className="mt-10 grid grid-cols-1 gap-16 lg:grid-cols-2">
                    {/* Desktop: sticky art card, one illustration per step, cross-faded */}
                    <div className="sticky top-[calc((100vh-min(56vh,340px))/2+28px)] mt-[10vh] hidden self-start justify-center lg:flex">
                        <div
                            className="relative aspect-[4/3] h-[min(56vh,340px)] max-w-full overflow-hidden rounded-[26px]"
                            style={{ boxShadow: '0 24px 60px -24px rgba(30,27,75,0.35)' }}>
                            {STEPS.map((s, i) => <StepArt key={s.n} step={s} on={i === active} />)}
                        </div>
                    </div>

                    {/* Rail with the step text; mobile shows each illustration inline */}
                    <div ref={railRef} className="relative mx-auto w-full max-w-[620px] lg:max-w-none">
                        <span aria-hidden className="absolute inset-y-0 left-0 w-0.5 rounded bg-[#1e1b4b]/10" />
                        <span
                            aria-hidden
                            className="absolute left-0 top-0 h-full w-0.5 origin-top rounded bg-[#3b82f6]"
                            style={{ transform: 'scaleY(var(--prog, 0))', boxShadow: '0 0 12px rgba(59,130,246,0.6)' }}
                        />
                        <ol className="m-0 list-none p-0">
                            {STEPS.map((s, i) => (
                                <li
                                    key={s.n}
                                    ref={(el) => { blockRefs.current[i] = el }}
                                    className={`flex flex-col justify-center py-7 pl-7 transition-opacity duration-500 motion-reduce:transition-none md:py-10 md:pl-8 lg:min-h-[max(52vh,300px)] lg:py-0 lg:pl-14 ${i === active ? 'lg:opacity-100' : 'lg:opacity-30'}`}>
                                    <div className="relative mb-6 aspect-[4/3] max-w-[420px] overflow-hidden rounded-[22px] lg:hidden">
                                        <StepArt step={s} />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-[0.22em] text-[#4f4c94]" style={{ fontFamily: MONO }}>
                                        {s.n} · {s.tag}
                                    </span>
                                    <h3 className="mt-2.5 text-balance text-[clamp(26px,2.6vw,38px)] font-extrabold leading-[1.05] tracking-[-0.035em] text-[#1e1b4b]">
                                        {s.t}
                                    </h3>
                                    <p className="mt-3.5 max-w-[440px] text-[clamp(15px,1.15vw,17px)] font-medium leading-relaxed text-slate-600">{s.b}</p>
                                </li>
                            ))}
                        </ol>
                    </div>
                </div>

                <div className="mt-10 flex flex-wrap items-center justify-center gap-5">
                    <Link
                        href="/login?mode=signup"
                        className="inline-flex items-center gap-4 rounded-2xl bg-[#1e1b4b] py-3 pl-6 pr-3 text-lg font-bold text-white shadow-lg shadow-indigo-950/20 transition-transform hover:-translate-y-0.5">
                        Build your first course
                        <span className="flex size-9 items-center justify-center rounded-full bg-white/15"><ArrowRight className="size-4" /></span>
                    </Link>
                    <Link href="#FAQ" className="inline-flex items-center gap-2 font-bold text-[#2c2876] hover:underline">
                        or read the FAQ <ArrowRight className="size-4" strokeWidth={2.4} />
                    </Link>
                </div>
            </div>
        </section>
    )
}

// =============================================================
// Illustrations (400×225) — same recipe as Smoni's process art:
// radial halo + halftone dots, solid indigo subject with white stroke,
// paper cards tilted 3–5°, ONE blue focal detail with a dotted connector,
// faded step numeral top-left, mono captions.
// =============================================================

const INDIGO = '#2c2876'
const INDIGO_DEEP = '#1e1b4b'
const INDIGO_60 = '#7472b0'
const RULE = '#e6e3f5'
const BLUE = '#3b82f6'
const MONO = 'ui-monospace, SFMono-Regular, Menlo, monospace'

function useIds() {
    const uid = useId().replace(/:/g, '')
    return { bg: `bg${uid}`, dots: `dots${uid}`, diffuse: `df${uid}` }
}

function Frame({ ids, haloX = 30, n, children }: { ids: ReturnType<typeof useIds>; haloX?: number; n: string; children: ReactNode }) {
    return (
        <svg aria-hidden focusable="false" viewBox="0 0 400 225" width="100%" height="100%" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            <defs>
                <radialGradient id={ids.bg} cx={`${haloX}%`} cy="55%" r="72%">
                    <stop offset="0%" stopColor="#e6e3ff" />
                    <stop offset="55%" stopColor="#f3f1ff" />
                    <stop offset="100%" stopColor="#f8fafc" />
                </radialGradient>
                <pattern id={ids.dots} width="6" height="6" patternUnits="userSpaceOnUse">
                    <circle cx="3" cy="3" r="0.55" fill={INDIGO} fillOpacity="0.06" />
                </pattern>
                <filter id={ids.diffuse} x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="10" />
                </filter>
            </defs>
            <rect width="400" height="225" fill={`url(#${ids.bg})`} />
            <rect width="400" height="225" fill={`url(#${ids.dots})`} />
            <text x="18" y="58" fill={INDIGO} opacity="0.1" fontWeight="900" fontSize="76" letterSpacing="-0.04em">{n}</text>
            {children}
        </svg>
    )
}

const Connector = ({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) => (
    <>
        <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={BLUE} strokeWidth="1.5" strokeDasharray="2 3" opacity="0.78" />
        <circle cx={x2} cy={y2} r="2.5" fill={BLUE} />
    </>
)

const Caption = ({ x, y, children, fill = INDIGO_60, size = 7 }: { x: number; y: number; children: ReactNode; fill?: string; size?: number }) => (
    <text x={x} y={y} fill={fill} fontFamily={MONO} fontWeight="700" fontSize={size} letterSpacing="0.22em">{children}</text>
)

const DISPLAY = 'inherit'

/** Bold display line (step art headline text). */
const Big = ({ x, y, size = 14, fill = INDIGO_DEEP, anchor, children }: { x: number; y: number; size?: number; fill?: string; anchor?: 'middle' | 'end'; children: ReactNode }) => (
    <text x={x} y={y} fill={fill} fontFamily={DISPLAY} fontWeight="800" fontSize={size} letterSpacing="-0.01em" textAnchor={anchor}>{children}</text>
)

/** Tilted paper card with an indigo header bar, like Smoni's documents. */
const Sheet = ({ x, y, w, h, tilt, header, ids, children }: { x: number; y: number; w: number; h: number; tilt: number; header: string; ids: ReturnType<typeof useIds>; children: ReactNode }) => (
    <g transform={`rotate(${tilt} ${x + w / 2} ${y + h / 2})`}>
        <rect x={x + 4} y={y + 8} width={w} height={h} rx="3" fill={INDIGO_DEEP} opacity="0.18" filter={`url(#${ids.diffuse})`} />
        <rect x={x} y={y} width={w} height={h} rx="2" fill="#fff" stroke={RULE} />
        <rect x={x} y={y} width={w} height="22" fill={INDIGO} />
        <Caption x={x + 14} y={y + 15} fill="#fff" size={8.5}>{header}</Caption>
        {children}
    </g>
)

/** Solid indigo subject with the white keyline and diffuse brand shadow. */
const Solid = ({ children, ids, shadow }: { children: ReactNode; ids: ReturnType<typeof useIds>; shadow: ReactNode }) => (
    <>
        <g fill={INDIGO} opacity="0.32" filter={`url(#${ids.diffuse})`}>{shadow}</g>
        {children}
    </>
)

// 01 · Import — a phone uploading; the file row on the document is the focal detail.
function ArtImport() {
    const ids = useIds()
    return (
        <Frame ids={ids} n="01" haloX={28}>
            <Sheet x={178} y={36} w={184} h={122} tilt={4} header="PDF · CHAPTER 4" ids={ids}>
                <Caption x={192} y={76}>FILE</Caption>
                <Big x={192} y={93}>biology-ch4.pdf</Big>
                <rect x="186" y="106" width="168" height="40" rx="3" fill={BLUE} fillOpacity="0.1" />
                <Caption x={192} y={120}>READY TO LEARN</Caption>
                <Big x={192} y={137} size={13}>42 pages → 1 course</Big>
            </Sheet>
            <g transform="translate(96 124) rotate(-10)">
                <Solid ids={ids} shadow={<rect x="-44" y="-66" width="88" height="148" rx="14" />}>
                    <rect x="-44" y="-70" width="88" height="148" rx="14" fill={INDIGO} stroke="#fff" strokeWidth="2.5" paintOrder="stroke" />
                    <rect x="-36" y="-54" width="72" height="118" rx="6" fill={INDIGO_DEEP} />
                    <rect x="-10" y="-66" width="20" height="4" rx="2" fill={INDIGO_DEEP} />
                    <Caption x={-27} y={-34} fill="rgba(255,255,255,0.55)" size={6}>UPLOADING</Caption>
                    <Big x={0} y={-14} size={11} fill="#fff" anchor="middle">FlashMind</Big>
                    <rect x="-24" y="-4" width="48" height="4" rx="2" fill="#fff" fillOpacity="0.2" />
                    <rect x="-24" y="-4" width="34" height="4" rx="2" fill="#fff" fillOpacity="0.75" />
                    <circle cx="0" cy="38" r="14" fill={BLUE} stroke="#fff" strokeWidth="1.5" />
                    <path d="M0 45 V31 M-6 37 L0 31 L6 37" stroke="#fff" strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </Solid>
            </g>
            <g fill="none" stroke={INDIGO} strokeWidth="2" strokeLinecap="round" opacity="0.55">
                <path d="M142 46 Q156 38 168 44" />
                <path d="M130 32 Q156 18 178 28" />
            </g>
            <Connector x1={148} y1={72} x2={186} y2={118} />
        </Frame>
    )
}

// 02 · Course — a solid "5 lessons" badge; the lesson being written is the focal row.
function ArtCourse() {
    const ids = useIds()
    return (
        <Frame ids={ids} n="02" haloX={30}>
            <Sheet x={176} y={30} w={190} h={150} tilt={4} header="COURSE · BIOLOGY" ids={ids}>
                <Big x={190} y={72} size={15}>Photosynthesis</Big>
                {['What is photosynthesis', 'Light reactions'].map((t, i) => (
                    <g key={t}>
                        <circle cx="196" cy={92 + i * 20} r="5.5" fill={INDIGO} />
                        <path d={`M193.3 ${92 + i * 20} l2 2 l3.8 -4.2`} stroke="#fff" strokeWidth="1.4" fill="none" />
                        <text x="208" y={96 + i * 20} fill={INDIGO_60} fontWeight="600" fontSize="10">{t}</text>
                    </g>
                ))}
                <rect x="184" y="126" width="174" height="40" rx="3" fill={BLUE} fillOpacity="0.1" />
                <Caption x={192} y={140}>LESSON 3 · WRITING…</Caption>
                <Big x={192} y={157} size={13}>The Calvin cycle</Big>
            </Sheet>
            <Solid ids={ids} shadow={<circle cx="98" cy="122" r="56" />}>
                <circle cx="96" cy="116" r="56" fill={INDIGO} stroke="#fff" strokeWidth="2.5" />
                <circle cx="96" cy="116" r="46" fill="none" stroke="#fff" strokeOpacity="0.15" strokeWidth="1.5" strokeDasharray="3 4" />
                <Big x={96} y={124} size={40} fill="#fff" anchor="middle">5</Big>
                <Caption x={72} y={142} fill="rgba(255,255,255,0.75)" size={7}>LESSONS</Caption>
            </Solid>
            <Connector x1={150} y1={110} x2={183} y2={140} />
        </Frame>
    )
}

// 03 · Exam — a dark exam card; the correct answer is the focal detail.
function ArtExam() {
    const ids = useIds()
    const opts = ['Mitochondria', 'Chloroplasts', 'Nucleus']
    return (
        <Frame ids={ids} n="03" haloX={30}>
            <g transform="rotate(-5 110 132)">
                <rect x="40" y="86" width="140" height="96" rx="2" fill={INDIGO_DEEP} opacity="0.16" filter={`url(#${ids.diffuse})`} />
                <rect x="36" y="80" width="140" height="96" rx="2" fill="#fff" stroke={RULE} />
                <Caption x={48} y={100}>QUESTION TYPES</Caption>
                {['Multiple choice', 'True / False', 'Fill the blank'].map((t, i) => (
                    <g key={t}>
                        <rect x="48" y={110 + i * 20} width="10" height="10" rx={i === 0 ? 5 : 2} fill="none" stroke={INDIGO} strokeWidth="1.6" />
                        <text x="66" y={119 + i * 20} fill={INDIGO_DEEP} fontWeight="700" fontSize="10">{t}</text>
                    </g>
                ))}
            </g>
            <g transform="rotate(3 276 112)">
                <Solid ids={ids} shadow={<rect x="190" y="38" width="176" height="150" rx="12" />}>
                    <rect x="188" y="32" width="176" height="150" rx="12" fill={INDIGO} stroke="#fff" strokeWidth="2.5" paintOrder="stroke" />
                    <Caption x={202} y={52} fill="rgba(255,255,255,0.7)" size={8}>EXAM · Q 3 / 12</Caption>
                    <Big x={202} y={74} size={11} fill="#fff">Where does</Big>
                    <Big x={202} y={89} size={11} fill="#fff">photosynthesis happen?</Big>
                    {opts.map((o, i) => {
                        const y = 100 + i * 25
                        const focal = i === 1
                        return (
                            <g key={o}>
                                <rect x="200" y={y} width="152" height="20" rx="6" fill={focal ? BLUE : '#fff'} fillOpacity={focal ? 1 : 0.1} stroke={focal ? '#fff' : 'none'} strokeWidth="1.2" />
                                <text x="212" y={y + 14} fill="#fff" fillOpacity={focal ? 1 : 0.75} fontWeight={focal ? 800 : 600} fontSize="10">{o}</text>
                                {focal && <path d={`M332 ${y + 10} l3 3 l6 -6.5`} stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />}
                            </g>
                        )
                    })}
                </Solid>
            </g>
            <Connector x1={176} y1={124} x2={198} y2={127} />
        </Frame>
    )
}

// 04 · Review — a score dial; the missed question pointing to its lesson is the focal row.
function ArtReview() {
    const ids = useIds()
    return (
        <Frame ids={ids} n="04" haloX={28}>
            <Sheet x={178} y={30} w={186} h={152} tilt={4} header="RESULTS · BIOLOGY" ids={ids}>
                {['Q1', 'Q2', 'Q4'].map((q, i) => {
                    const y = 64 + (i === 2 ? 2 : i) * 20 + (i === 2 ? 46 : 0)
                    return (
                        <g key={q}>
                            <Caption x={192} y={y}>{q}</Caption>
                            <rect x="216" y={y - 5} width="96" height="4" rx="2" fill={RULE} />
                            <path d={`M334 ${y - 4} l3 3 l6 -6.5`} stroke="#059669" strokeWidth="2" fill="none" strokeLinecap="round" />
                        </g>
                    )
                })}
                <rect x="186" y="96" width="170" height="44" rx="3" fill={BLUE} fillOpacity="0.1" />
                <Caption x={192} y={110}>Q3 · MISSED</Caption>
                <Big x={192} y={128} size={13}>Review: Light reactions</Big>
                <path d="M336 106 l7 7 M343 106 l-7 7" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" />
            </Sheet>
            <Solid ids={ids} shadow={<circle cx="98" cy="122" r="58" />}>
                <circle cx="96" cy="116" r="58" fill={INDIGO} stroke="#fff" strokeWidth="2.5" />
                <circle cx="96" cy="116" r="44" fill="none" stroke="#fff" strokeOpacity="0.15" strokeWidth="7" />
                <circle cx="96" cy="116" r="44" fill="none" stroke={BLUE} strokeWidth="7" strokeDasharray="221 277" strokeLinecap="round" transform="rotate(-90 96 116)" />
                <Big x={96} y={124} size={28} fill="#fff" anchor="middle">8/10</Big>
                <Caption x={78} y={140} fill="rgba(255,255,255,0.75)" size={7}>SCORE</Caption>
            </Solid>
            <Connector x1={154} y1={110} x2={185} y2={112} />
        </Frame>
    )
}
