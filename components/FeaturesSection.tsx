'use client'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { 
  Zap, 
  FileText, 
  HelpCircle, 
  BarChart3, 
  TrendingUp,
  Brain,
  Upload,
  BookOpen,
  Target,
  Activity
} from 'lucide-react'

const features = [
  {
    icon: Zap,
    title: "Automatic Exam Generation",
    description: "Stop wasting hours creating practice questions. Our proprietary system instantly transforms any text, PDF, or YouTube video into quizzes, flashcards, and exams tailored to your material.",
    color: "from-blue-500 to-purple-600"
  },
  {
    icon: Upload,
    title: "Supports Multiple Formats",
    description: "Whether it's lecture notes, textbooks, or videos, our platform handles them all. No conversions, no manual input — just upload and learn.",
    color: "from-green-500 to-teal-600"
  },
  {
    icon: HelpCircle,
    title: "Multiple Question Types",
    description: "MCQs, fill-in-the-blank, yes/no questions, and flashcards — all automatically generated to test your knowledge from every angle.",
    color: "from-orange-500 to-red-600"
  },
  {
    icon: Brain,
    title: "Detailed Feedback & Knowledge Insights",
    description: "After each exam, get a breakdown of your strengths and weaknesses, along with actionable recommendations to focus your study time effectively.",
    color: "from-purple-500 to-pink-600"
  },
  {
    icon: TrendingUp,
    title: "Progress Tracking & Analytics",
    description: "Track your learning journey over time. See your improvements, identify persistent gaps, and measure your mastery across topics.",
    color: "from-indigo-500 to-blue-600"
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1]
    }
  }
}

export default function FeaturesSection() {
  return (
    <section className="py-24 bg-background">
      <div className="mx-auto max-w-7xl px-6">
        <motion.div
          className="text-center mb-16"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.h2 
            className="text-4xl md:text-5xl font-bold text-foreground mb-6"
            variants={itemVariants}
          >
            Powerful Features for
            <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent"> Smart Learning</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-muted-foreground max-w-3xl mx-auto"
            variants={itemVariants}
          >
            Transform any content into comprehensive learning experiences with our AI-powered platform
          </motion.p>
        </motion.div>

        <motion.div
          className="grid gap-8 md:grid-cols-2 lg:grid-cols-3"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="group relative"
              variants={itemVariants}
            >
              <div className="relative h-full p-8 rounded-2xl border border-border/20 bg-background/50 backdrop-blur-sm transition-all duration-300 hover:border-border/40 hover:-translate-y-1 hover:shadow-lg hover:shadow-black/5 dark:hover:shadow-black/20">
                {/* Gradient background on hover */}
                <div className={cn(
                  "absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-5 transition-opacity duration-300 bg-gradient-to-br",
                  feature.color
                )} />
                
                {/* Icon */}
                <div className="relative mb-6">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center bg-gradient-to-br transition-all duration-300 group-hover:scale-110",
                    feature.color
                  )}>
                    <feature.icon className="w-7 h-7 text-white" />
                  </div>
                </div>

                {/* Content */}
                <div className="relative">
                  <h3 className="text-xl font-semibold text-foreground mb-4 group-hover:text-foreground/90 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                {/* Decorative element */}
                <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-muted/30 group-hover:bg-primary/30 transition-colors duration-300" />
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          variants={itemVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
        >
          <motion.div
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-muted/50 border border-border/20 text-muted-foreground hover:text-foreground hover:bg-muted/70 transition-all duration-300 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Activity className="w-4 h-4" />
            <span className="text-sm font-medium">Ready to transform your learning?</span>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
