import React from 'react';
import Editor from '@monaco-editor/react';
import { AlertCircle, Check } from 'lucide-react';

interface JsonEditorProps {
  value: string;
  onChange: (value: string) => void;
  isValid: boolean;
  height?: string;
  label: string;
  theme?: 'light' | 'dark';
}

const JsonEditor: React.FC<JsonEditorProps> = ({ 
  value, 
  onChange, 
  isValid, 
  height = '100%', 
  label,
  theme = 'light'
}) => {
  const handleEditorChange = (value: string | undefined) => {
    onChange(value || '');
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center px-4 py-2 border-b dark:border-gray-700">
        <div className="flex items-center">
          <span className="font-medium text-gray-700 dark:text-gray-300">{label}</span>
          {isValid ? (
            <span className="ml-2 text-green-500 flex items-center">
              <Check size={16} />
              <span className="text-xs ml-1">Valid</span>
            </span>
          ) : (
            <span className="ml-2 text-red-500 flex items-center">
              <AlertCircle size={16} />
              <span className="text-xs ml-1">Invalid Format</span>
            </span>
          )}
        </div>
      </div>
      <div className="flex-1">
        <Editor
          height={height}
          defaultLanguage="json"
          value={value}
          onChange={handleEditorChange}
          theme={theme === 'dark' ? 'vs-dark' : 'light'}
          options={{
            minimap: { enabled: false },
            scrollBeyondLastLine: false,
            fontSize: 14,
            tabSize: 2,
            automaticLayout: true,
            formatOnPaste: true,
            formatOnType: true,
          }}
        />
      </div>
    </div>
  );
};

export default JsonEditor;