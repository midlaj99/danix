import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { validateAllLevels } from './educational/LevelBalanceValidator';
import { CURRICULUM_LEVELS } from './educational/curriculumData';

// Automatic development & runtime level economy validation
validateAllLevels(CURRICULUM_LEVELS);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
