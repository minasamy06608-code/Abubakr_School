// pages/seats.js
import { useState, useMemo } from 'react';
import Layout from '../components/Layout';
import withAuth from '../components/withAuth';
import { useStore, GRADES } from '../lib/store';
import { motion } from 'framer-motion';
import { MdAutoFixHigh, MdEventSeat, MdSearch, MdRefresh } from 'react-icons/md';
import { FiCheckCircle, FiXCircle } from 'react-icons/fi';
import toast from 'react-hot-toast';

const CLASSES = ['1', '2', '3', '4', '5', '6'];

function Seats() {
  const { students, generateSeatNumbers, generateAllSeatNumbers, updateStudent } = useStore();
  const [filterGrade, setFilterGrade] = useState('g3p');
  const [filterClass, setFilterClass] = useState('1');
  const [search, setSearch] = useState('');
  const [editId, setEditId] = useState(null);
  const [editVal, setEditVal] = useState('');

  const filtered = useMemo(() => {
    return students
      .filter((s) => {
        const matchGrade = !filterGrade || s.grade === filterGrade;
        const matchClass = !filterClass || s.class === filterClass;
        const q = search.toLowerCase();
        const matchSearch = !q || s.name.includes(q) || (s.seatNumber||'').includes(q);
        return matchGrade && matchClass && matchSearch;
      })
      .sort((a, b) => (a.seatNumber || '999') > (b.seatNumber || '999') ? 1 : -1);
  }, [students, filterGrade, filterClass, search]);

  const handleGenerate = () => {
    if (!filterGrade || !filterClass) { toast.error('يرجى تحديد الصف والفصل'); return; }
    generateSeatNumbers(filterGrade, filterClass);
    toast.success('تم توليد أرقام الجلوس بنجاح');
  };

  const handleGenerateAll = () => {
    if (!confirm('هل تريد توليد أرقام الجلوس لجميع الطلاب؟')) return;
    generateAllSeatNumbers();
    toast.success('تم توليد أرقام الجلوس لجميع الطلاب');
  };

  const startEdit = (s) => { setEditId(s.id); setEditVal(s.seatNumber || ''); };
  const saveEdit = (id) => {
    updateStudent(id, { seatNumber: editVal });
    setEditId(null);
    toast.success('تم حفظ رقم الجلوس');
  };

  const gradeLabel = GRADES.find((g) => g.id === filterGrade)?.short || '';
  const stats = {
    total: filtered.length,
    with: filtered.filter((s) => s.seatNumber).length,
    without: filtered.filter((s) => !s.seatNumber).length,
  };

  return (
    <Layout title="أرقام الجلوس">
      {/* Controls */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex flex-wrap gap-3 items-end justify-between">
          <div className="flex gap-3 flex-wrap">
            <div>
              <label className="label-field text-xs text-gray-500 dark:text-white/50 block mb-1">الصف</label>
              <select className="input-field w-auto text-sm" value={filterGrade} onChange={(e)=>setFilterGrade(e.target.value)}>
                {GRADES.map((g)=><option key={g.id} value={g.id}>{g.short}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field text-xs text-gray-500 dark:text-white/50 block mb-1">الفصل</label>
              <select className="input-field w-auto text-sm" value={filterClass} onChange={(e)=>setFilterClass(e.target.value)}>
                {CLASSES.map((c)=><option key={c} value={c}>فصل {c}</option>)}
              </select>
            </div>
            <div className="relative">
              <label className="label-field text-xs text-gray-500 dark:text-white/50 block mb-1">بحث</label>
              <div className="relative">
                <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18}/>
                <input className="input-field pr-10 text-sm" placeholder="اسم أو رقم جلوس..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
              </div>
            </div>
          </div>
          <div className="flex gap-2 flex-wrap">
            <button onClick={handleGenerate} className="btn-royal flex items-center gap-1.5 text-sm">
              <MdAutoFixHigh size={18}/> توليد للفصل
            </button>
            <button onClick={handleGenerateAll}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all">
              <MdRefresh size={18}/> توليد للكل
            </button>
          </div>
        </div>
      </div>

      {/* Stats mini */}
      <div className="grid grid-cols-3 gap-4 mb-5">
        {[
          { label: 'إجمالي الطلاب', value: stats.total, color: '#1a3a6e' },
          { label: 'لديهم رقم جلوس', value: stats.with, color: '#16a34a' },
          { label: 'بدون رقم جلوس', value: stats.without, color: '#dc2626' },
        ].map((s, i) => (
          <motion.div key={i} initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{delay:i*0.1}}
            className="glass-card rounded-xl p-4 text-center">
            <p className="text-2xl font-black" style={{color:s.color}}>{s.value}</p>
            <p className="text-xs text-gray-500 dark:text-white/50 mt-0.5">{s.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Table */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-blue-100 dark:border-white/10 flex items-center justify-between">
          <h3 className="font-bold text-royal dark:text-white">
            {gradeLabel && `${gradeLabel} — فصل ${filterClass}`}
            <span className="text-sm font-normal text-gray-400 dark:text-white/40 mr-2">({filtered.length} طالب)</span>
          </h3>
          <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-white/40">
            <span className="flex items-center gap-1"><FiCheckCircle className="text-green-500"/> مكتمل: {stats.with}</span>
            <span className="flex items-center gap-1"><FiXCircle className="text-red-400"/> ناقص: {stats.without}</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-white/30">
            <MdEventSeat size={48} className="mx-auto mb-3 opacity-30"/>
            <p className="font-semibold">لا يوجد طلاب في هذا الفصل</p>
            <p className="text-sm">أضف طلاباً من صفحة الطلاب أولاً</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>م</th>
                  <th>رقم الجلوس</th>
                  <th>اسم الطالب</th>
                  <th>الرقم القومي</th>
                  <th>تاريخ الميلاد</th>
                  <th>الحالة</th>
                  <th>تعديل</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s, i) => (
                  <motion.tr key={s.id} initial={{opacity:0}} animate={{opacity:1}} transition={{delay:i*0.02}}>
                    <td className="text-gray-400 text-xs">{i+1}</td>
                    <td>
                      {editId === s.id ? (
                        <div className="flex items-center justify-center gap-1">
                          <input value={editVal} onChange={(e)=>setEditVal(e.target.value)}
                            className="w-20 text-center border border-blue-300 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                            onKeyDown={(e)=>{if(e.key==='Enter')saveEdit(s.id);if(e.key==='Escape')setEditId(null);}}
                            autoFocus/>
                          <button onClick={()=>saveEdit(s.id)} className="text-green-600 hover:text-green-800 font-bold text-xs">✓</button>
                          <button onClick={()=>setEditId(null)} className="text-red-400 hover:text-red-600 font-bold text-xs">✗</button>
                        </div>
                      ) : (
                        s.seatNumber
                          ? <span className="seat-number">{s.seatNumber}</span>
                          : <span className="text-gray-300 dark:text-white/20">—</span>
                      )}
                    </td>
                    <td className="font-semibold text-royal dark:text-white">{s.name}</td>
                    <td className="text-xs font-mono text-gray-500 dark:text-white/40">{s.nationalId || '—'}</td>
                    <td className="text-xs text-gray-500 dark:text-white/40">{s.birthDate || '—'}</td>
                    <td>
                      {s.seatNumber
                        ? <span className="badge bg-green-100 text-green-700 text-xs">✓ مكتمل</span>
                        : <span className="badge bg-red-100 text-red-600 text-xs">✗ ناقص</span>}
                    </td>
                    <td>
                      <button onClick={()=>startEdit(s)} className="text-blue-500 hover:text-blue-700 text-xs font-semibold hover:underline">
                        {editId===s.id ? '...' : 'تعديل'}
                      </button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
}

export default withAuth(Seats);
