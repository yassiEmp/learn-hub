import { motion } from "framer-motion";
import { features } from './data';

export const FeaturesSection = () => {
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
            Powerful Features
          </span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-syne font-medium text-white mb-6 leading-tight">
            Everything you need to create
          </h2>
          <p className="text-xl md:text-2xl text-white/80 font-geist-mono max-w-3xl mx-auto leading-relaxed">
            Our AI-powered platform provides all the tools you need to create engaging, effective courses.
          </p>
        </motion.div>

        <motion.div
          className="grid md:grid-cols-3 gap-8"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
              }
            }
          }}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-8 text-center hover:border-white/20 transition-all duration-300 group"
              variants={{
                hidden: { opacity: 0, y: 30 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 }
                }
              }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <motion.div
                className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} border border-white/10 flex items-center justify-center mx-auto mb-6`}
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.6 }}
              >
                <feature.icon className={`w-8 h-8 ${feature.iconColor}`} />
              </motion.div>
              <h3 className="font-syne font-medium text-white text-2xl mb-4">{feature.title}</h3>
              <p className="text-white/80 font-geist-mono text-base leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}; 