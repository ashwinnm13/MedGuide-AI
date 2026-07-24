/**
 * MedGuide AI — CitationCard Component
 * Inline citation reference badge that links to evidence sources.
 */

import { motion } from 'framer-motion';
import { FileText } from 'lucide-react';

export default function CitationCard({ number, title, onClick }) {
  return (
    <motion.button
      onClick={onClick}
      className="
        inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg
        bg-primary-50/60 text-primary-700 border border-primary-100/50
        hover:bg-primary-100/60 hover:border-primary-200
        transition-all duration-200 text-[12px] font-medium
      "
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      title={title}
    >
      <FileText size={12} />
      <span>[{number}]</span>
    </motion.button>
  );
}
