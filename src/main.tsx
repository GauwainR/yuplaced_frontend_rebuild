import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { App } from './app/App';
import './styles/base.css';
import './styles/folder-board.css';
import './styles/daily-report.css';
import './styles/pomodoro.css';
import './styles/settings.css';
import './styles/modal.css';
import './styles/folder-board-fix.css';
import './styles/folder-board-ux.css';

import { AppProvider } from './app/providers';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AppProvider>
        <App />
      </AppProvider>
    </BrowserRouter>
  </React.StrictMode>,
);