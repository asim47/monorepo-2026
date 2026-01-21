import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

import ConfigWrapper from '@/common/configWrapper';
import App from './App';

import '@/styles/globals.scss';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <ConfigWrapper>
        <App />
      </ConfigWrapper>
    </BrowserRouter>
  </React.StrictMode>
);

