import React, { useState } from 'react';
import { PropertySchema } from '../types';
import { Plus, Trash2, ChevronDown, ChevronUp } from 'lucide-react';

interface SchemaEditorProps {
  schema: Record<string, PropertySchema>;
  onChange: (schema: Record<string, PropertySchema>) => void;
  title: string;
}

const SchemaEditor: React.FC<SchemaEditorProps> = ({ schema, onChange, title }) => {
  const [expanded, setExpanded] = useState(true);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  const addProperty = () => {
    const newSchema = { ...schema };
    newSchema[`newParam${Object.keys(schema).length + 1}`] = {
      type: 'string',
      description: ''
    };
    onChange(newSchema);
  };

  const updateProperty = (name: string, updatedSchema: PropertySchema) => {
    const newSchema = { ...schema };
    newSchema[name] = updatedSchema;
    onChange(newSchema);
  };

  const removeProperty = (name: string) => {
    const newSchema = { ...schema };
    delete newSchema[name];
    onChange(newSchema);
  };

  const renameProperty = (oldName: string, newName: string) => {
    if (oldName === newName) return;
    if (newName.trim() === '') return;
    if (schema[newName]) return; // Name already exists

    const newSchema = { ...schema };
    newSchema[newName] = newSchema[oldName];
    delete newSchema[oldName];
    onChange(newSchema);
  };

  return (
    <div className="border dark:border-gray-700 rounded-md mb-4 overflow-hidden">
      <div 
        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 cursor-pointer"
        onClick={toggleExpanded}
      >
        <h3 className="font-medium text-gray-700 dark:text-gray-300">{title}</h3>
        <button type="button" className="text-gray-500 dark:text-gray-400">
          {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
      </div>
      
      {expanded && (
        <div className="p-3">
          {Object.keys(schema).length === 0 ? (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400 text-sm">
              No parameters defined
            </div>
          ) : (
            <ul className="space-y-4">
              {Object.entries(schema).map(([name, propSchema]) => (
                <li key={name} className="border dark:border-gray-700 rounded-md p-3">
                  <div className="flex flex-col space-y-3">
                    <div className="flex items-center">
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => renameProperty(name, e.target.value)}
                        className="flex-1 mr-2 px-2 py-1 border dark:border-gray-600 rounded-md 
                          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      />
                      <button
                        type="button"
                        onClick={() => removeProperty(name)}
                        className="p-1 text-red-500 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Type
                        </label>
                        <select
                          value={propSchema.type}
                          onChange={(e) => updateProperty(name, { ...propSchema, type: e.target.value })}
                          className="w-full px-2 py-1 border dark:border-gray-600 rounded-md
                            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        >
                          <option value="string">String</option>
                          <option value="number">Number</option>
                          <option value="integer">Integer</option>
                          <option value="boolean">Boolean</option>
                          <option value="array">Array</option>
                          <option value="object">Object</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Format (optional)
                        </label>
                        <input
                          type="text"
                          value={propSchema.format || ''}
                          placeholder="e.g., date-time, uuid"
                          onChange={(e) => updateProperty(name, { 
                            ...propSchema, 
                            format: e.target.value || undefined 
                          })}
                          className="w-full px-2 py-1 border dark:border-gray-600 rounded-md
                            bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Description
                      </label>
                      <input
                        type="text"
                        value={propSchema.description || ''}
                        onChange={(e) => updateProperty(name, { 
                          ...propSchema, 
                          description: e.target.value || undefined 
                        })}
                        className="w-full px-2 py-1 border dark:border-gray-600 rounded-md
                          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        placeholder="Description of the parameter"
                      />
                    </div>
                    
                    <div>
                      <label className="block text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">
                        Example (optional)
                      </label>
                      <input
                        type="text"
                        value={propSchema.example !== undefined ? String(propSchema.example) : ''}
                        onChange={(e) => updateProperty(name, { 
                          ...propSchema, 
                          example: e.target.value || undefined 
                        })}
                        className="w-full px-2 py-1 border dark:border-gray-600 rounded-md
                          bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        placeholder="Example value"
                      />
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
          
          <button
            type="button"
            onClick={addProperty}
            className="mt-4 flex items-center px-3 py-2 text-sm 
              bg-blue-500 hover:bg-blue-600 text-white rounded-md"
          >
            <Plus size={16} className="mr-1" />
            Add Parameter
          </button>
        </div>
      )}
    </div>
  );
};

export default SchemaEditor;