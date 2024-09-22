import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { SidebarProvider } from './context/SidebarContext';
import { PaginationProvider } from './context/PaginationContext';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <BrowserRouter>
      <ThemeProvider>
        <SidebarProvider>
            <PaginationProvider>
              <App />
            </PaginationProvider>
        </SidebarProvider>
      </ThemeProvider>

    </BrowserRouter>
);
