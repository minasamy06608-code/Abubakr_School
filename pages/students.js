// pages/students.js
import { useState, useMemo, useRef } from 'react';
import Layout from '../components/Layout';
import withAuth from '../components/withAuth';
import StudentModal from '../components/StudentModal';
import QRModal from '../components/QRModal';
import { useStore, GRADES } from '../lib/store';
import { motion, AnimatePresence } from 'framer-motion';
import { MdAdd, MdDelete, MdEdit, MdQrCode2, MdUpload, MdDownload, MdSearch } from 'react-icons/md';
import { FiFilter } from 'react-icons/fi';
import { exportToExcel, exportTemplateExcel, importFromExcel } from '../lib/exportUtils';
import toast from 'react-hot-toast';

const CLASSES = ['الكل', '1', '2', '3', '4', '5', '6'];

function Students() {
  const { students, deleteStudent, deleteStudents, importStudents } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [qrStudent, setQrStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('الكل');
  const [selected, setSelected] = useState([]);
  const fileRef = useRef();

  const filtered = useMemo(() => students.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = !q || s.name.includes(q) || (s.seatNumber || '').includes(q) || (s.nationalId || '').includes(q);
    const matchGrade = !filterGrade || s.grade === filterGrade;
    const matchClass = filterClass === 'الكل' || s.class === filterClass;
    return matchSearch && matchGrade && matchClass;
  }), [students, search, filterGrade, filterClass]);

  const toggleSelect = (id) => setSelected((sel) => sel.includes(id) ? sel.filter((s) => s !== id) : [...sel, id]);
  const toggleAll = () => setSelected(selected.length === filtered.length ? [] : filtered.map((s) => s.id));

  const handleDelete = (id) => {
    if (confirm('هل تريد حذف هذا الطالب؟')) {
      deleteStudent(id);
      toast.success('تم حذف الطالب');
    }
  };

  const handleDeleteSelected = () => {
    if (selected.length === 0) return;
    if (confirm(`هل تريد حذف ${selected.length} طالب؟`)) {
      deleteStudents(selected);
      setSelected([]);
      toast.success(`تم حذف ${selected.length} طالب`);
    }
  };

  const handleImport = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await importFromExcel(file);
      importStudents(data);
      toast.success(`تم استيراد ${data.length} طالب`);
    } catch { toast.error('خطأ في قراءة الملف'); }
    e.target.value = '';
  };

  const openEdit = (s) => { setEditStudent(s); setModalOpen(true); };
  const openAdd = () => { setEditStudent(null); setModalOpen(true); };
  const closeModal = () => { setModalOpen(false); setEditStudent(null); };

  return (
    <Layout title="إدارة الطلاب">
      {/* Toolbar */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex flex-wrap gap-3 items-center justify-between">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <MdSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20}/>
            <input className="input-field pr-10" placeholder="بحث بالاسم أو رقم الجلوس..." value={search} onChange={(e)=>setSearch(e.target.value)}/>
          </div>

          {/* Filters */}
          <div className="flex gap-2 flex-wrap">
            <select className="input-field w-auto text-sm" value={filterGrade} onChange={(e)=>setFilterGrade(e.target.value)}>
              <option value="">كل الصفوف</option>
              {GRADES.map((g)=><option key={g.id} value={g.id}>{g.short}</option>)}
            </select>
            <select className="input-field w-auto text-sm" value={filterClass} onChange={(e)=>setFilterClass(e.target.value)}>
              {CLASSES.map((c)=><option key={c} value={c}>{c==='الكل'?'كل الفصول':'فصل '+c}</option>)}
            </select>
          </div>

          {/* Actions */}
          <div className="flex gap-2 flex-wrap">
            <button onClick={openAdd} className="btn-royal flex items-center gap-1.5 text-sm">
              <MdAdd size={18}/> إضافة
            </button>
            <button onClick={()=>fileRef.current?.click()} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all">
              <MdUpload size={18}/> استيراد Excel
            </button>
            <input ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleImport}/>
            <button onClick={()=>exportTemplateExcel()} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gray-100 dark:bg-white/10 text-gray-700 dark:text-white font-semibold text-sm hover:bg-gray-200 dark:hover:bg-white/20 transition-all">
              <MdDownload size={18}/> نموذج
            </button>
            <button onClick={()=>exportToExcel(filtered)} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-amber-500 text-white font-semibold text-sm hover:bg-amber-600 transition-all">
              <MdDownload size={18}/> تصدير
            </button>
            {selected.length > 0 && (
              <button onClick={handleDeleteSelected} className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all">
                <MdDelete size={18}/> حذف ({selected.length})
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <motion.div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-blue-100 dark:border-white/10">
          <p className="font-bold text-royal dark:text-white">
            قائمة الطلاب <span className="text-sm font-normal text-gray-400 dark:text-white/40">({filtered.length} طالب)</span>
          </p>
        </div>

        {filtered.length === 0 ? (
          <div className="py-20 text-center text-gray-400 dark:text-white/30">
            <MdSearch size={48} className="mx-auto mb-3 opacity-30"/>
            <p className="font-semibold">لا يوجد طلاب</p>
            <p className="text-sm">أضف طلاباً أو غيّر فلاتر البحث</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th className="w-10">
                    <input type="checkbox" checked={selected.length===filtered.length && filtered.length>0}
                      onChange={toggleAll} className="rounded"/>
                  </th>
                  <th>رقم الجلوس</th>
                  <th>الاسم</th>
                  <th>الصف</th>
                  <th>الفصل</th>
                  <th>الرقم القومي</th>
                  <th>هاتف ولي الأمر</th>
                  <th>الإجراءات</th>
                </tr>
              </thead>
              <tbody>
                <AnimatePresence>
                  {filtered.map((s, i) => (
                    <motion.tr key={s.id}
                      initial={{opacity:0,x:20}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-20}}
                      transition={{delay:i*0.02}}
                      className={selected.includes(s.id) ? 'bg-blue-50 dark:bg-blue-900/20' : ''}>
                      <td>
                        <input type="checkbox" checked={selected.includes(s.id)} onChange={()=>toggleSelect(s.id)} className="rounded"/>
                      </td>
                      <td>
                        {s.seatNumber
                          ? <span className="seat-number">{s.seatNumber}</span>
                          : <span className="text-gray-300 dark:text-white/20">—</span>
                        }
                      </td>
                      <td className="font-semibold text-royal dark:text-white">{s.name}</td>
                      <td className="text-xs text-gray-600 dark:text-white/60">{GRADES.find(g=>g.id===s.grade)?.short}</td>
                      <td>فصل {s.class}</td>
                      <td className="text-xs text-gray-500 dark:text-white/40 font-mono">{s.nationalId || '—'}</td>
                      <td className="text-sm">{s.parentPhone || '—'}</td>
                      <td>
                        <div className="flex items-center justify-center gap-1">
                          <button onClick={()=>openEdit(s)} title="تعديل"
                            className="p-1.5 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/40 text-blue-500 transition-all">
                            <MdEdit size={16}/>
                          </button>
                          <button onClick={()=>{setQrStudent(s);}} title="QR Code"
                            className="p-1.5 rounded-lg hover:bg-purple-100 dark:hover:bg-purple-900/40 text-purple-500 transition-all">
                            <MdQrCode2 size={16}/>
                          </button>
                          <button onClick={()=>handleDelete(s.id)} title="حذف"
                            className="p-1.5 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/40 text-red-500 transition-all">
                            <MdDelete size={16}/>
                          </button>
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        )}
      </motion.div>

      <StudentModal isOpen={modalOpen} onClose={closeModal} student={editStudent}/>
      <QRModal isOpen={!!qrStudent} onClose={()=>setQrStudent(null)} student={qrStudent}/>
    </Layout>
  );
}

export default withAuth(Students);
