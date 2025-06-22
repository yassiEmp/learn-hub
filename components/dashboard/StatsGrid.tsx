import { motion } from 'framer-motion';
import { LucideProps } from 'lucide-react';

interface Stat {
  label: string;
  value: number | string;
  icon: React.ForwardRefExoticComponent<Omit<LucideProps, "ref"> & React.RefAttributes<SVGSVGElement>>;
  color: string;
  iconColor: string;
}

interface StatsGridProps {
  stats: Stat[];
}

export const StatsGrid: React.FC<StatsGridProps> = ({ stats }) => {
  return (
    <motion.div 
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12"
      variants={{
        hidden: { opacity: 0 },
        visible: {
          opacity: 1,
          transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2,
            ease: "easeOut"
          }
        }
      }}
      initial="hidden"
      animate="visible"
    >
      {stats.map((stat, index) => (
        <motion.div 
          key={index} 
          className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 hover:border-white/20 transition-all duration-500"
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { 
              opacity: 1, 
              y: 0,
              transition: { 
                duration: 0.8, 
                ease: "easeOut"
              }
            }
          }}
          whileHover={{ 
            scale: 1.02,
            y: -2,
            transition: { duration: 0.3, ease: "easeOut" }
          }}
        >
          <div className="flex items-center justify-between mb-4">
            <motion.div 
              className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} border border-white/10 flex items-center justify-center`}
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
              animate={{ 
                opacity: 1, 
                scale: 1,
                transition: { 
                  duration: 0.6, 
                  delay: 0.3 + index * 0.1,
                  ease: "easeOut"
                }
              }}
            >
              {stat.value}
            </motion.p>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
};