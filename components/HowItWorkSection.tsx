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
const INDIGO_60 = '#7472b0'
const INDIGO_20 = '#cfceea'
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

/** Paper card with a soft brand shadow. */
const Paper = ({ x, y, w, h, ids, children }: { x: number; y: number; w: number; h: number; ids: ReturnType<typeof useIds>; children?: ReactNode }) => (
    <>
        <rect x={x + 4} y={y + 10} width={w} height={h} rx="4" fill={INDIGO} opacity="0.18" filter={`url(#${ids.diffuse})`} />
        <rect x={x} y={y} width={w} height={h} rx="4" fill="#fff" stroke={RULE} />
        {children}
    </>
)

// 01 · Import — a PDF and a YouTube card fly into a solid indigo upload tile.
function ArtImport() {
    const ids = useIds()
    return (
        <Frame ids={ids} n="01" haloX={70}>
            <g transform="rotate(-4 120 120)">
                <Paper x={58} y={70} w={118} h={104} ids={ids}>
                    <rect x="58" y="70" width="118" height="20" rx="4" fill={INDIGO} />
                    <Caption x={66} y={83} fill="#fff">PDF · CH. 4</Caption>
                    {[100, 110, 120, 130, 140].map((y, i) => <rect key={y} x="68" y={y} width={i === 4 ? 56 : 96} height="3" rx="1.5" fill={RULE} />)}
                    <text x="68" y="162" fill={INDIGO} fontWeight="700" fontSize="9">biology-ch4.pdf</text>
                </Paper>
            </g>
            <g transform="rotate(3 300 92)">
                <Paper x={236} y={48} w={124} h={72} ids={ids}>
                    <rect x="244" y="56" width="108" height="40" rx="3" fill={INDIGO_20} />
                    <path d="M293 68 L305 76 L293 84 Z" fill={INDIGO} />
                    <Caption x={244} y={110}>YOUTUBE · 42 MIN</Caption>
                </Paper>
            </g>
            <rect x="248" y="134" width="64" height="64" rx="16" fill={INDIGO} stroke="#fff" strokeWidth="2.5" />
            <path d="M280 150 L280 178 M268 162 L280 150 L292 162" stroke="#fff" strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
            <rect x="66" y="152" width="92" height="14" rx="3" fill={BLUE} opacity="0.12" />
            <Connector x1={248} y1={166} x2={158} y2={159} />
        </Frame>
    )
}

// 02 · Course — an outline card; lesson 3 is being written (blue focal row).
function ArtCourse() {
    const ids = useIds()
    const rows = ['What is photosynthesis', 'Light reactions', 'The Calvin cycle', 'Limiting factors']
    return (
        <Frame ids={ids} n="02" haloX={60}>
            <g transform="rotate(-3 230 112)">
                <Paper x={130} y={36} w={210} h={156} ids={ids}>
                    <Caption x={144} y={56}>COURSE · 4 LESSONS</Caption>
                    <text x="144" y="74" fill={INDIGO} fontWeight="800" fontSize="13">Photosynthesis basics</text>
                    {rows.map((t, i) => {
                        const y = 88 + i * 24
                        const focal = i === 2
                        return (
                            <g key={t}>
                                <rect x="142" y={y} width="186" height="19" rx="4" fill={focal ? BLUE : '#fff'} fillOpacity={focal ? 0.1 : 1} stroke={focal ? BLUE : RULE} />
                                <circle cx="153" cy={y + 9.5} r="5" fill={i < 2 ? INDIGO : '#fff'} stroke={i < 2 ? INDIGO : INDIGO_20} />
                                {i < 2 && <path d={`M150.5 ${y + 9.5} l2 2 l3.5 -4`} stroke="#fff" strokeWidth="1.4" fill="none" />}
                                <text x="164" y={y + 13} fill={i > 2 ? INDIGO_60 : INDIGO} fontWeight={focal ? 700 : 500} fontSize="9">{t}</text>
                            </g>
                        )
                    })}
                </Paper>
            </g>
            <circle cx="78" cy="150" r="34" fill={INDIGO} stroke="#fff" strokeWidth="2.5" />
            <text x="78" y="150" textAnchor="middle" fill="#fff" fontWeight="900" fontSize="20">~5s</text>
            <Caption x={56} y={164} fill="#fff" size={6}>OUTLINE</Caption>
            <Connector x1={110} y1={140} x2={146} y2={146} />
        </Frame>
    )
}

// 03 · Exam — a question card; the correct option is the focal detail.
function ArtExam() {
    const ids = useIds()
    const opts = ['Mitochondria', 'Chloroplasts', 'Nucleus']
    return (
        <Frame ids={ids} n="03" haloX={35}>
            <g transform="rotate(3 236 114)">
                <Paper x={150} y={30} w={196} h={162} ids={ids}>
                    <rect x="150" y="30" width="196" height="22" rx="4" fill={INDIGO} />
                    <Caption x={160} y={44} fill="#fff">EXAM · Q 3 / 12</Caption>
                    <text x="160" y="72" fill={INDIGO} fontWeight="700" fontSize="10">Where does photosynthesis</text>
                    <text x="160" y="85" fill={INDIGO} fontWeight="700" fontSize="10">take place?</text>
                    {opts.map((o, i) => {
                        const y = 98 + i * 28
                        const focal = i === 1
                        return (
                            <g key={o}>
                                <rect x="160" y={y} width="174" height="21" rx="5" fill={focal ? BLUE : '#fff'} fillOpacity={focal ? 0.1 : 1} stroke={focal ? BLUE : RULE} />
                                <circle cx="172" cy={y + 10.5} r="5" fill={focal ? BLUE : '#fff'} stroke={focal ? BLUE : INDIGO_20} />
                                {focal && <path d={`M169.5 ${y + 10.5} l2 2 l3.5 -4`} stroke="#fff" strokeWidth="1.4" fill="none" />}
                                <text x="184" y={y + 14} fill={INDIGO} fontWeight={focal ? 700 : 500} fontSize="9">{o}</text>
                            </g>
                        )
                    })}
                </Paper>
            </g>
            <rect x="46" y="112" width="76" height="76" rx="18" fill={INDIGO} stroke="#fff" strokeWidth="2.5" />
            <text x="84" y="152" textAnchor="middle" fill="#fff" fontWeight="900" fontSize="18">A·B·C</text>
            <Caption x={58} y={170} fill="#fff" size={6}>3 TYPES</Caption>
            <Connector x1={122} y1={140} x2={164} y2={135} />
        </Frame>
    )
}

// 04 · Review — a score badge and a results sheet; the missed question points to its lesson.
function ArtReview() {
    const ids = useIds()
    return (
        <Frame ids={ids} n="04" haloX={30}>
            <g transform="rotate(4 270 116)">
                <Paper x={186} y={40} w={170} h={144} ids={ids}>
                    <Caption x={198} y={60}>RESULTS · 8 / 10</Caption>
                    {['Q1', 'Q2', 'Q3', 'Q4'].map((q, i) => {
                        const y = 72 + i * 22
                        const missed = i === 2
                        return (
                            <g key={q}>
                                <text x="198" y={y + 12} fill={INDIGO_60} fontFamily={MONO} fontWeight="700" fontSize="8">{q}</text>
                                <rect x="218" y={y + 6} width={missed ? 70 : 90} height="4" rx="2" fill={RULE} />
                                <text x="336" y={y + 13} textAnchor="end" fill={missed ? '#dc2626' : '#059669'} fontWeight="800" fontSize="10">{missed ? '✕' : '✓'}</text>
                            </g>
                        )
                    })}
                    <rect x="196" y="160" width="150" height="16" rx="3" fill={BLUE} opacity="0.12" />
                    <text x="202" y="171" fill={INDIGO} fontWeight="700" fontSize="8.5">Review: Light reactions →</text>
                </Paper>
            </g>
            <circle cx="104" cy="122" r="48" fill={INDIGO} stroke="#fff" strokeWidth="2.5" />
            <circle cx="104" cy="122" r="38" fill="none" stroke="#fff" strokeOpacity="0.2" strokeWidth="5" />
            <circle cx="104" cy="122" r="38" fill="none" stroke={BLUE} strokeWidth="5" strokeDasharray="191 239" strokeLinecap="round" transform="rotate(-90 104 122)" />
            <text x="104" y="129" textAnchor="middle" fill="#fff" fontWeight="900" fontSize="24">8/10</text>
            <Caption x={80} y={146} fill="#fff" size={6}>SCORE</Caption>
            <Connector x1={150} y1={132} x2={200} y2={161} />
        </Frame>
    )
}
