// lib/exportUtils.js
import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { GRADES } from './store';

export function exportToExcel(students, filename = 'أرقام_الجلوس') {
  const data = students.map((s) => ({
    'رقم الجلوس': s.seatNumber || '',
    'اسم الطالب': s.name,
    'الصف': GRADES.find((g) => g.id === s.grade)?.short || s.grade,
    'الفصل': s.class,
    'رقم قومي': s.nationalId || '',
    'تاريخ الميلاد': s.birthDate || '',
    'هاتف ولي الأمر': s.parentPhone || '',
  }));

  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();

  // Set column widths
  ws['!cols'] = [
    { wch: 12 }, { wch: 30 }, { wch: 20 }, { wch: 8 },
    { wch: 16 }, { wch: 14 }, { wch: 16 },
  ];

  XLSX.utils.book_append_sheet(wb, ws, 'أرقام الجلوس');
  XLSX.writeFile(wb, `${filename}.xlsx`);
}

export function exportTemplateExcel() {
  const data = [
    {
      'اسم الطالب': 'أحمد محمد علي',
      'الصف': 'g3p',
      'الفصل': '1',
      'رقم قومي': '30001011234567',
      'تاريخ الميلاد': '2010-01-01',
      'هاتف ولي الأمر': '01012345678',
    },
  ];
  const ws = XLSX.utils.json_to_sheet(data);
  ws['!cols'] = [{ wch: 30 }, { wch: 12 }, { wch: 8 }, { wch: 18 }, { wch: 14 }, { wch: 16 }];
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, 'نموذج الاستيراد');
  XLSX.writeFile(wb, 'نموذج_استيراد_الطلاب.xlsx');
}

export function importFromExcel(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const rows = XLSX.utils.sheet_to_json(ws);
        const students = rows.map((row) => ({
          name: row['اسم الطالب'] || '',
          grade: row['الصف'] || 'g3p',
          class: String(row['الفصل'] || '1'),
          nationalId: String(row['رقم قومي'] || ''),
          birthDate: row['تاريخ الميلاد'] || '',
          parentPhone: String(row['هاتف ولي الأمر'] || ''),
          seatNumber: String(row['رقم الجلوس'] || ''),
        })).filter((s) => s.name);
        resolve(students);
      } catch (err) {
        reject(err);
      }
    };
    reader.readAsArrayBuffer(file);
  });
}

export function exportToPDF(students, schoolInfo, title = 'كشف أرقام الجلوس') {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

  // Header
  doc.setFillColor(26, 58, 110);
  doc.rect(0, 0, 210, 35, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text(schoolInfo.name, 105, 14, { align: 'center' });
  doc.setFontSize(12);
  doc.text(title, 105, 23, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`العام الدراسي: ${schoolInfo.year}`, 105, 31, { align: 'center' });

  // Table
  const tableData = students.map((s) => [
    s.parentPhone || '-',
    s.birthDate || '-',
    s.class,
    GRADES.find((g) => g.id === s.grade)?.short || s.grade,
    s.name,
    s.seatNumber || '-',
    students.indexOf(s) + 1,
  ]);

  doc.autoTable({
    startY: 42,
    head: [['هاتف ولي الأمر', 'تاريخ الميلاد', 'الفصل', 'الصف', 'اسم الطالب', 'رقم الجلوس', 'م']],
    body: tableData,
    styles: { font: 'helvetica', fontSize: 9, halign: 'center', cellPadding: 3 },
    headStyles: { fillColor: [26, 58, 110], textColor: 255, fontSize: 10, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    theme: 'grid',
    margin: { top: 42, right: 10, bottom: 20, left: 10 },
  });

  // Footer
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(100);
    doc.text(`صفحة ${i} من ${pageCount}`, 105, 290, { align: 'center' });
    doc.text(`تاريخ الطباعة: ${new Date().toLocaleDateString('ar-EG')}`, 10, 290);
  }

  doc.save(`${title}.pdf`);
}
