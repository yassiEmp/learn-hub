import { motion } from "framer-motion";
import { stats } from './data';

export const StatsSection = () => {
  return (
    <div className="relative z-10 py-24 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <span className="px-4 py-2 text-sm font-geist-mono text-white bg-white/15 backdrop-blur-md rounded-full border border-white/30 inline-block mb-8 shadow-lg">
            Trusted by Thousands
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-medium text-white mb-6 leading-tight">
            Join our learning community
          </h2>
        </motion.div>

        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="text-center"
              variants={{
                hidden: { opacity: 0, y: 20 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
            >
              <motion.div
                className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.2 }}
              >
                <stat.icon className="w-8 h-8 text-white/60" />
              </motion.div>
              <div className="font-syne font-medium text-white text-3xl md:text-4xl mb-2">
                {stat.value}
              </div>
              <div className="font-geist-mono text-white/70 text-base">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}; 