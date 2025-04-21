import React from 'react';
import Editor from './components/Editor';
import { ThemeProvider } from './context/ThemeContext';

function App() {
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
        <Editor />
      </div>
    </ThemeProvider>
  );
}

export default App;