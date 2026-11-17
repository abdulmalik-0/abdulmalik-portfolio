import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { LangProvider } from './lang.jsx';
import './styles/global.css';

createRoot(document.getElementById('root')).render(
  <LangProvider>
    <App />
  </LangProvider>
);
