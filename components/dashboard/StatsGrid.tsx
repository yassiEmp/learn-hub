import { motion } from 'framer-motion';

interface Stat {
  label: string;
  value: number | string;
  icon: any;
  color: string;
  iconColor: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
      {stats.map((stat, index) => (
        <motion.div 
          key={index} 
          className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-500"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ 
            opacity: 1, 
            y: 0
          }}
          transition={{ 
            duration: 0.8, 
            delay: index * 0.1,
            ease: "easeOut"
          }}
          viewport={{ once: true, margin: "-50px" }}
          whileHover={{ 
            scale: 1.02,
            y: -2,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border border-white/10 flex items-center justify-center`}
              initial={{ scale: 0.8, opacity: 0 }}
              whileInView={{ 
                scale: 1, 
                opacity: 1
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.2 + index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
              whileHover={{ 
                rotate: 360,
                transition: { duration: 0.8, ease: "easeInOut" }
              }}
            >
              <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
            </motion.div>
          </div>
          <div>
            <p className="text-xs font-geist-mono text-white/50 mb-1">{stat.label}</p>
            <motion.p 
              className="text-2xl font-syne font-medium text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ 
                opacity: 1, 
                scale: 1
              }}
              transition={{ 
                duration: 0.6, 
                delay: 0.4 + index * 0.1,
                ease: "easeOut"
              }}
              viewport={{ once: true }}
            >
              {stat.value}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </div>
  );
};