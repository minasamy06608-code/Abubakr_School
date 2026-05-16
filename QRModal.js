// components/QRModal.js
import { useRef } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import QRCode from 'react-qr-code';
import { MdClose, MdPrint, MdDownload } from 'react-icons/md';
import { GRADES } from '../lib/store';
import { useReactToPrint } from 'react-to-print';

export default function QRModal({ isOpen, onClose, student }) {
  const printRef = useRef();

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `QR_${student?.name}`,
  });

  if (!student) return null;
  const grade = GRADES.find((g) => g.id === student.grade)?.short || student.grade;
  const qrData = JSON.stringify({ name: student.name, seat: student.seatNumber, grade, class: student.class });

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}/>
          <motion.div initial={{scale:0.8,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}}
            transition={{type:'spring',stiffness:300,damping:25}}
            className="relative glass-card rounded-2xl p-7 w-full max-w-sm z-10 text-center">
            <button onClick={onClose} className="absolute top-4 left-4 p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-400 hover:text-red-500">
              <MdClose size={20}/>
            </button>

            <h3 className="text-lg font-bold text-royal dark:text-white mb-6">بطاقة QR للطالب</h3>

            {/* Print area */}
            <div ref={printRef} className="flex flex-col items-center">
              <div className="p-5 bg-white rounded-2xl shadow-card mb-4 inline-block">
                <QRCode value={qrData} size={180} fgColor="#1a3a6e" />
              </div>
              <p className="font-bold text-xl text-royal dark:text-white">{student.name}</p>
              <p className="text-sm text-gray-500 dark:text-white/60 mt-1">{grade} &mdash; فصل {student.class}</p>
              {student.seatNumber && (
                <div className="mt-3 px-6 py-2 rounded-xl text-white font-bold text-lg"
                  style={{background:'linear-gradient(135deg,#1a3a6e,#2557b0)'}}>
                  رقم الجلوس: {student.seatNumber}
                </div>
              )}
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={handlePrint}
                className="flex-1 btn-royal flex items-center justify-center gap-2 text-sm">
                <MdPrint size={18}/> طباعة
              </button>
              <button onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/70 font-semibold hover:bg-gray-100 dark:hover:bg-white/10 transition-all text-sm">
                إغلاق
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
