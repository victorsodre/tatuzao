import { createRoot } from 'react-dom/client';
import '@fontsource/anton/latin-400.css';
import '@fontsource/archivo/latin-400.css';
import '@fontsource/archivo/latin-500.css';
import '@fontsource/archivo/latin-600.css';
import '@fontsource/archivo-black/latin-400.css';
import '@fontsource/jetbrains-mono/latin-400.css';
import './styles.css';
import { App } from './App.tsx';

createRoot(document.getElementById('root')!).render(<App/>);
