// pages/_app.js
import '../styles/globals.css';
import { useEffect } from 'react';
import { useStore } from '../lib/store';
import { Toaster } from 'react-hot-toast';

export default function App({ Component, pageProps }) {
  const darkMode = useStore((s) => s.darkMode);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <div className={darkMode ? 'dark' : ''}>
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 3000,
          style: {
            fontFamily: 'Cairo, sans-serif',
            direction: 'rtl',
            borderRadius: '12px',
            fontWeight: '600',
          },
        }}
      />
      <Component {...pageProps} />
    </div>
  );
}
