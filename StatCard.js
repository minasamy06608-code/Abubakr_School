// components/StatCard.js
import { motion } from 'framer-motion';

export default function StatCard({ icon: Icon, label, value, color, delay = 0, subtitle }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className="stat-card"
    >
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm text-gray-500 dark:text-white/50 font-medium mb-1">{label}</p>
          <p className="text-3xl font-black" style={{ color }}>{value}</p>
          {subtitle && <p className="text-xs text-gray-400 dark:text-white/40 mt-1">{subtitle}</p>}
        </div>
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0 mr-2"
          style={{ background: `${color}18` }}>
          <Icon size={28} style={{ color }} />
        </div>
      </div>
      {/* Bottom bar */}
      <div className="mt-4 h-1 rounded-full bg-gray-100 dark:bg-white/10 overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: '100%' }}
          transition={{ delay: delay + 0.3, duration: 0.8 }}
          className="h-full rounded-full"
          style={{ background: `linear-gradient(90deg, ${color}, ${color}80)` }}
        />
      </div>
    </motion.div>
  );
}
