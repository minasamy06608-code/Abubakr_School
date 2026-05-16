// pages/print.js
import { useState, useRef, useMemo } from 'react';
import Layout from '../components/Layout';
import withAuth from '../components/withAuth';
import { useStore, GRADES } from '../lib/store';
import { motion } from 'framer-motion';
import { MdPrint, MdDownload, MdPictureAsPdf } from 'react-icons/md';
import { useReactToPrint } from 'react-to-print';
import { exportToPDF, exportToExcel } from '../lib/exportUtils';
import QRCode from 'react-qr-code';
import toast from 'react-hot-toast';

const CLASSES = ['1', '2', '3', '4', '5', '6'];

function PrintCenter() {
  const { students, schoolInfo } = useStore();
  const [filterGrade, setFilterGrade] = useState('');
  const [filterClass, setFilterClass] = useState('');
  const [printType, setPrintType] = useState('list'); // list | cards
  const printRef = useRef();

  const filtered = useMemo(() => students.filter((s) => {
    const matchGrade = !filterGrade || s.grade === filterGrade;
    const matchClass = !filterClass || s.class === filterClass;
    return matchGrade && matchClass && s.seatNumber;
  }).sort((a, b) => a.seatNumber > b.seatNumber ? 1 : -1), [students, filterGrade, filterClass]);

  const handlePrint = useReactToPrint({
    content: () => printRef.current,
    documentTitle: `كشف_أرقام_الجلوس_${GRADES.find(g=>g.id===filterGrade)?.short || 'الكل'}`,
    onBeforePrint: () => { if(filtered.length===0){toast.error('لا يوجد طلاب لطباعتهم');return;} },
  });

  const handlePDF = () => {
    if (filtered.length === 0) { toast.error('لا يوجد طلاب للتصدير'); return; }
    const grade = GRADES.find(g=>g.id===filterGrade)?.short || 'الكل';
    exportToPDF(filtered, schoolInfo, `كشف أرقام الجلوس - ${grade}`);
    toast.success('تم تصدير PDF بنجاح');
  };

  const handleExcel = () => {
    if (filtered.length === 0) { toast.error('لا يوجد طلاب للتصدير'); return; }
    exportToExcel(filtered, 'كشف_أرقام_الجلوس');
    toast.success('تم تصدير Excel بنجاح');
  };

  const gradeLabel = GRADES.find(g=>g.id===filterGrade)?.short || 'جميع الصفوف';

  return (
    <Layout title="مركز الطباعة">
      {/* Controls */}
      <div className="glass-card rounded-2xl p-5 mb-5">
        <div className="flex flex-wrap gap-4 items-end justify-between">
          <div className="flex gap-3 flex-wrap">
            <div>
              <label className="text-xs text-gray-500 dark:text-white/50 block mb-1">الصف</label>
              <select className="input-field w-auto text-sm" value={filterGrade} onChange={(e)=>setFilterGrade(e.target.value)}>
                <option value="">كل الصفوف</option>
                {GRADES.map((g)=><option key={g.id} value={g.id}>{g.short}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-white/50 block mb-1">الفصل</label>
              <select className="input-field w-auto text-sm" value={filterClass} onChange={(e)=>setFilterClass(e.target.value)}>
                <option value="">كل الفصول</option>
                {CLASSES.map((c)=><option key={c} value={c}>فصل {c}</option>)}
              </select>
            </div>
            <div>
              <label className="text-xs text-gray-500 dark:text-white/50 block mb-1">نوع الطباعة</label>
              <select className="input-field w-auto text-sm" value={printType} onChange={(e)=>setPrintType(e.target.value)}>
                <option value="list">كشف قائمة</option>
                <option value="cards">بطاقات QR</option>
              </select>
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <button onClick={handlePrint}
              className="btn-royal flex items-center gap-1.5 text-sm">
              <MdPrint size={18}/> طباعة ({filtered.length})
            </button>
            <button onClick={handlePDF}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-red-500 text-white font-semibold text-sm hover:bg-red-600 transition-all">
              <MdPictureAsPdf size={18}/> PDF
            </button>
            <button onClick={handleExcel}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold text-sm hover:bg-green-700 transition-all">
              <MdDownload size={18}/> Excel
            </button>
          </div>
        </div>
      </div>

      {/* Preview */}
      <div className="glass-card rounded-2xl p-1 overflow-hidden">
        <div className="bg-gray-100 dark:bg-white/5 rounded-xl p-4">
          <p className="text-xs text-center text-gray-400 dark:text-white/30 mb-3">معاينة قبل الطباعة</p>
          <div ref={printRef} className="bg-white rounded-lg shadow-sm" style={{minHeight:400,fontFamily:'Cairo,sans-serif',direction:'rtl'}}>
            {filtered.length === 0 ? (
              <div className="py-24 text-center text-gray-300">
                <MdPrint size={60} className="mx-auto mb-3"/>
                <p>لا يوجد طلاب لديهم أرقام جلوس</p>
                <p className="text-sm mt-1">قم بتوليد أرقام الجلوس أولاً</p>
              </div>
            ) : printType === 'list' ? (
              <PrintListView students={filtered} schoolInfo={schoolInfo} gradeLabel={gradeLabel} filterClass={filterClass}/>
            ) : (
              <PrintCardsView students={filtered} schoolInfo={schoolInfo}/>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
}

function PrintListView({ students, schoolInfo, gradeLabel, filterClass }) {
  return (
    <div>
      {/* Official Header */}
      <div style={{background:'#1a3a6e',color:'white',padding:'20px 30px',textAlign:'center'}}>
        <h1 style={{fontSize:20,fontWeight:900,margin:0}}>{schoolInfo.name}</h1>
        <p style={{fontSize:13,margin:'4px 0 0',opacity:0.85}}>كشف أرقام الجلوس &mdash; {gradeLabel}{filterClass ? ` — فصل ${filterClass}` : ''}</p>
        <p style={{fontSize:11,margin:'4px 0 0',opacity:0.7}}>العام الدراسي: {schoolInfo.year} &mdash; تاريخ الطباعة: {new Date().toLocaleDateString('ar-EG')}</p>
      </div>

      {/* Table */}
      <div style={{padding:'16px 24px'}}>
        <table style={{width:'100%',borderCollapse:'collapse',fontSize:12}}>
          <thead>
            <tr style={{background:'#e8f0fe'}}>
              <th style={th}>م</th>
              <th style={th}>رقم الجلوس</th>
              <th style={th}>اسم الطالب</th>
              <th style={th}>الصف</th>
              <th style={th}>الفصل</th>
              <th style={th}>الرقم القومي</th>
              <th style={th}>تاريخ الميلاد</th>
              <th style={th}>التوقيع</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s, i) => (
              <tr key={s.id} style={{background: i%2===0 ? '#fff':'#f8faff'}}>
                <td style={td}>{i+1}</td>
                <td style={{...td,fontWeight:800,color:'#1a3a6e',fontSize:14}}>{s.seatNumber}</td>
                <td style={{...td,textAlign:'right',fontWeight:600}}>{s.name}</td>
                <td style={td}>{GRADES.find(g=>g.id===s.grade)?.short}</td>
                <td style={td}>فصل {s.class}</td>
                <td style={{...td,fontFamily:'monospace',fontSize:11}}>{s.nationalId || '—'}</td>
                <td style={td}>{s.birthDate || '—'}</td>
                <td style={td}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Footer */}
        <div style={{marginTop:24,display:'flex',justifyContent:'space-between',fontSize:11,color:'#666',borderTop:'1px solid #e0e0e0',paddingTop:12}}>
          <span>إجمالي عدد الطلاب: {students.length}</span>
          <span>توقيع ناظر/ة المدرسة: ___________________</span>
          <span>الختم الرسمي</span>
        </div>
      </div>
    </div>
  );
}

const th = {padding:'8px 10px',borderBottom:'2px solid #1a3a6e',textAlign:'center',fontWeight:700,color:'#1a3a6e'};
const td = {padding:'7px 10px',borderBottom:'1px solid #eee',textAlign:'center'};

function PrintCardsView({ students, schoolInfo }) {
  return (
    <div style={{padding:20}}>
      <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:12}}>
        {students.map((s) => (
          <div key={s.id} style={{border:'2px solid #1a3a6e',borderRadius:10,padding:12,textAlign:'center',pageBreakInside:'avoid'}}>
            <div style={{background:'#1a3a6e',color:'white',borderRadius:6,padding:'4px 8px',fontSize:10,marginBottom:8}}>
              {schoolInfo.name}
            </div>
            <div style={{display:'flex',justifyContent:'center',marginBottom:6}}>
              <QRCode value={JSON.stringify({name:s.name,seat:s.seatNumber,grade:s.grade,class:s.class})} size={80} fgColor="#1a3a6e"/>
            </div>
            <p style={{fontWeight:800,fontSize:12,margin:'4px 0'}}>{s.name}</p>
            <p style={{fontSize:10,color:'#666',margin:'2px 0'}}>{GRADES.find(g=>g.id===s.grade)?.short} — فصل {s.class}</p>
            <div style={{background:'#1a3a6e',color:'white',borderRadius:6,padding:'3px 10px',display:'inline-block',fontWeight:900,fontSize:16,marginTop:4}}>
              {s.seatNumber}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default withAuth(PrintCenter);
