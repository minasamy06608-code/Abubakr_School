// lib/store.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const GRADES = [
  { id: 'g3p', label: 'الصف الثالث الابتدائي', short: 'ثالث ابتدائي' },
  { id: 'g4p', label: 'الصف الرابع الابتدائي', short: 'رابع ابتدائي' },
  { id: 'g5p', label: 'الصف الخامس الابتدائي', short: 'خامس ابتدائي' },
  { id: 'g6p', label: 'الصف السادس الابتدائي', short: 'سادس ابتدائي' },
  { id: 'g1m', label: 'الصف الأول الإعدادي', short: 'أول إعدادي' },
  { id: 'g2m', label: 'الصف الثاني الإعدادي', short: 'ثاني إعدادي' },
];

export { GRADES };

export const useStore = create(
  persist(
    (set, get) => ({
      // Auth
      isAuthenticated: false,
      adminCredentials: { username: 'admin', password: 'school2024' },
      login: (username, password) => {
        const { adminCredentials } = get();
        if (username === adminCredentials.username && password === adminCredentials.password) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },
      logout: () => set({ isAuthenticated: false }),
      updateCredentials: (username, password) =>
        set({ adminCredentials: { username, password } }),

      // Dark mode
      darkMode: false,
      toggleDarkMode: () => set((s) => ({ darkMode: !s.darkMode })),

      // School info
      schoolInfo: {
        name: 'مدرسة النور الابتدائية',
        year: '2024 / 2025',
        city: 'القاهرة',
        logo: null,
      },
      updateSchoolInfo: (info) => set((s) => ({ schoolInfo: { ...s.schoolInfo, ...info } })),

      // Students
      students: [],
      addStudent: (student) => {
        const students = get().students;
        const newStudent = {
          ...student,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        };
        set({ students: [...students, newStudent] });
        return newStudent;
      },
      updateStudent: (id, updates) =>
        set((s) => ({
          students: s.students.map((st) => (st.id === id ? { ...st, ...updates } : st)),
        })),
      deleteStudent: (id) =>
        set((s) => ({ students: s.students.filter((st) => st.id !== id) })),
      deleteStudents: (ids) =>
        set((s) => ({ students: s.students.filter((st) => !ids.includes(st.id)) })),
      importStudents: (newStudents) => {
        const existing = get().students;
        const merged = [...existing];
        newStudents.forEach((ns) => {
          const exists = merged.find((e) => e.name === ns.name && e.grade === ns.grade && e.class === ns.class);
          if (!exists) {
            merged.push({ ...ns, id: Date.now().toString() + Math.random(), createdAt: new Date().toISOString() });
          }
        });
        set({ students: merged });
      },

      // Auto generate seat numbers for a grade+class
      generateSeatNumbers: (grade, classNum) => {
        const students = get().students;
        const filtered = students
          .filter((s) => s.grade === grade && s.class === classNum)
          .sort((a, b) => a.name.localeCompare(b.name, 'ar'));
        const updated = students.map((s) => {
          const idx = filtered.findIndex((f) => f.id === s.id);
          if (idx !== -1) {
            return { ...s, seatNumber: String(idx + 1).padStart(3, '0') };
          }
          return s;
        });
        set({ students: updated });
      },
      generateAllSeatNumbers: () => {
        const students = get().students;
        const groups = {};
        students.forEach((s) => {
          const key = `${s.grade}_${s.class}`;
          if (!groups[key]) groups[key] = [];
          groups[key].push(s);
        });
        const updated = [...students];
        Object.keys(groups).forEach((key) => {
          const group = groups[key].sort((a, b) => a.name.localeCompare(b.name, 'ar'));
          group.forEach((s, i) => {
            const idx = updated.findIndex((u) => u.id === s.id);
            if (idx !== -1) updated[idx] = { ...updated[idx], seatNumber: String(i + 1).padStart(3, '0') };
          });
        });
        set({ students: updated });
      },
    }),
    {
      name: 'school-seat-storage',
      partialize: (state) => ({
        students: state.students,
        darkMode: state.darkMode,
        schoolInfo: state.schoolInfo,
        adminCredentials: state.adminCredentials,
      }),
    }
  )
);
