// components/StudentModal.js
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore, GRADES } from '../lib/store';
import { MdClose, MdSave } from 'react-icons/md';
import { FiUser } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CLASSES = ['1', '2', '3', '4', '5', '6'];
const EMPTY = { name: '', grade: 'g3p', class: '1', nationalId: '', birthDate: '', parentPhone: '', seatNumber: '' };

export default function StudentModal({ isOpen, onClose, student = null }) {
  const { addStudent, updateStudent } = useStore();
  const [form, setForm] = useState(EMPTY);

  useEffect(() => {
    if (student) setForm({ ...EMPTY, ...student });
    else setForm(EMPTY);
  }, [student, isOpen]);

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.name.trim()) { toast.error('يرجى إدخال اسم الطالب'); return; }
    if (student) {
      updateStudent(student.id, form);
      toast.success('تم تعديل بيانات الطالب');
    } else {
      addStudent(form);
      toast.success('تم إضافة الطالب بنجاح');
    }
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose}/>
          <motion.div initial={{opacity:0,scale:0.92,y:24}} animate={{opacity:1,scale:1,y:0}} exit={{opacity:0,scale:0.95,y:16}}
            transition={{type:'spring',stiffness:300,damping:25}}
            className="relative glass-card rounded-2xl p-7 w-full max-w-lg z-10 max-h-[90vh] overflow-y-auto dark:bg-royal-dark/90">
            
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:'linear-gradient(135deg,#1a3a6e,#2557b0)'}}>
                  <FiUser size={18} className="text-white"/>
                </div>
                <h2 className="text-lg font-bold text-royal dark:text-white">
                  {student ? 'تعديل بيانات الطالب' : 'إضافة طالب جديد'}
                </h2>
              </div>
              <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-100 dark:hover:bg-red-500/20 text-gray-500 dark:text-white/60 hover:text-red-500 transition-all">
                <MdClose size={20}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Name */}
              <div>
                <label className="label-field">اسم الطالب *</label>
                <input className="input-field" placeholder="الاسم رباعي" value={form.name} onChange={(e)=>set('name',e.target.value)} required/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Grade */}
                <div>
                  <label className="label-field">الصف الدراسي *</label>
                  <select className="input-field" value={form.grade} onChange={(e)=>set('grade',e.target.value)}>
                    {GRADES.map((g)=>(
                      <option key={g.id} value={g.id}>{g.short}</option>
                    ))}
                  </select>
                </div>
                {/* Class */}
                <div>
                  <label className="label-field">الفصل *</label>
                  <select className="input-field" value={form.class} onChange={(e)=>set('class',e.target.value)}>
                    {CLASSES.map((c)=>(
                      <option key={c} value={c}>فصل {c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* National ID */}
              <div>
                <label className="label-field">الرقم القومي</label>
                <input className="input-field" placeholder="14 رقم" value={form.nationalId} onChange={(e)=>set('nationalId',e.target.value)} maxLength={14} type="text"/>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Birth Date */}
                <div>
                  <label className="label-field">تاريخ الميلاد</label>
                  <input className="input-field" type="date" value={form.birthDate} onChange={(e)=>set('birthDate',e.target.value)}/>
                </div>
                {/* Parent Phone */}
                <div>
                  <label className="label-field">هاتف ولي الأمر</label>
                  <input className="input-field" placeholder="01xxxxxxxxx" value={form.parentPhone} onChange={(e)=>set('parentPhone',e.target.value)}/>
                </div>
              </div>

              {/* Seat Number */}
              <div>
                <label className="label-field">رقم الجلوس (اختياري - يمكن توليده تلقائياً)</label>
                <input className="input-field" placeholder="يترك فارغاً للتوليد التلقائي" value={form.seatNumber} onChange={(e)=>set('seatNumber',e.target.value)}/>
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <button type="submit" className="flex-1 btn-royal flex items-center justify-center gap-2">
                  <MdSave size={18}/> {student ? 'حفظ التعديلات' : 'إضافة الطالب'}
                </button>
                <button type="button" onClick={onClose}
                  className="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-white/20 text-gray-600 dark:text-white/70 hover:bg-gray-100 dark:hover:bg-white/10 transition-all font-semibold">
                  إلغاء
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
