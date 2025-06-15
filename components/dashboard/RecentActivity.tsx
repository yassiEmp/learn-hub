import { motion } from 'framer-motion';
import { recentActivities } from './data';

interface RecentActivityProps {
  variants: any;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({ variants }) => {
  return (
    <motion.div 
      className="bg-black/40 backdrop-blur-md rounded-2xl border border-white/10 p-6 lg:p-8"
      variants={variants}
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-syne font-medium text-white">Recent Activity</h3>
        <span className="text-xs font-geist-mono text-white/50">Last 7 days</span>
      </div>
      
      <motion.div 
        className="space-y-4"
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
      >
        {recentActivities.map((activity, index) => (
          <motion.div 
            key={index}
            className="flex items-center space-x-4 p-4 rounded-xl bg-white/5 border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-300"
            variants={{
              hidden: { opacity: 0, x: -20 },
              visible: { 
                opacity: 1, 
                x: 0,
                transition: { duration: 0.4 }
              }
            }}
            whileHover={{ x: 5 }}
          >
            <motion.div 
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${activity.color} border border-white/10 flex items-center justify-center`}
              whileHover={{ scale: 1.1 }}
              transition={{ duration: 0.2 }}
            >
              <activity.icon className={`w-5 h-5 ${activity.iconColor}`} />
            </motion.div>
            <div className="flex-1">
              <p className="font-geist-mono font-medium text-white text-sm">{activity.title}</p>
              <p className="text-xs text-white/50 font-geist-mono">{activity.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}; 