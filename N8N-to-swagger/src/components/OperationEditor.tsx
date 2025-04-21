import React, { useState, useEffect } from 'react';
import { WebhookNode, OperationDetails } from '../types';
import SchemaEditor from './SchemaEditor';
import { Save } from 'lucide-react';

interface OperationEditorProps {
  webhook: WebhookNode;
  operationDetails: OperationDetails;
  onSave: (details: OperationDetails) => void;
}

const OperationEditor: React.FC<OperationEditorProps> = ({ 
  webhook, 
  operationDetails, 
  onSave 
}) => {
  const [details, setDetails] = useState<OperationDetails>(operationDetails);
  
  // Update local state when selected webhook changes
  useEffect(() => {
    setDetails(operationDetails);
  }, [webhook.id, operationDetails]);

  const handleSave = () => {
    onSave(details);
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTagsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const tagsString = e.target.value;
    const tagsArray = tagsString.split(',').map(tag => tag.trim()).filter(tag => tag !== '');
    setDetails(prev => ({
      ...prev,
      tags: tagsArray
    }));
  };

  return (
    <div className="p-4 overflow-y-auto h-full">
      <div className="mb-6 pb-4 border-b dark:border-gray-700">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Edit Operation
          </h2>
          <button
            type="button"
            onClick={handleSave}
            className="flex items-center px-4 py-2 bg-blue-500 hover:bg-blue-600 
              text-white rounded-md transition-colors"
          >
            <Save size={16} className="mr-2" />
            Save Changes
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Node Name
            </p>
            <p className="text-gray-800 dark:text-gray-200 font-medium">
              {webhook.name}
            </p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
              Endpoint
            </p>
            <div className="flex items-center">
              <span className={`
                inline-block px-2 py-0.5 text-xs rounded-md font-medium mr-2
                ${getMethodColor(webhook.method)}
              `}>
                {webhook.method}
              </span>
              <span className="text-gray-800 dark:text-gray-200">
                {webhook.path}
              </span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Operation ID
            </label>
            <input
              type="text"
              name="operationId"
              value={details.operationId}
              onChange={handleInputChange}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              placeholder="unique-operation-id"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Tags (comma separated)
            </label>
            <input
              type="text"
              value={details.tags.join(', ')}
              onChange={handleTagsChange}
              className="w-full px-3 py-2 border dark:border-gray-600 rounded-md
                bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
              placeholder="api, webhook, v1"
            />
          </div>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Summary
          </label>
          <input
            type="text"
            name="summary"
            value={details.summary}
            onChange={handleInputChange}
            className="w-full px-3 py-2 border dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="Brief summary of what the operation does"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Description
          </label>
          <textarea
            name="description"
            value={details.description}
            onChange={handleInputChange}
            rows={3}
            className="w-full px-3 py-2 border dark:border-gray-600 rounded-md
              bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
            placeholder="Detailed description of the operation"
          />
        </div>
      </div>
      
      <div className="mt-6">
        <h3 className="text-lg font-medium text-gray-800 dark:text-gray-200 mb-4">
          Parameters & Request Body
        </h3>
        
        <SchemaEditor
          title="Query Parameters"
          schema={details.parameters.query}
          onChange={(newSchema) => setDetails(prev => ({
            ...prev,
            parameters: {
              ...prev.parameters,
              query: newSchema
            }
          }))}
        />
        
        <SchemaEditor
          title="Path Parameters"
          schema={details.parameters.path}
          onChange={(newSchema) => setDetails(prev => ({
            ...prev,
            parameters: {
              ...prev.parameters,
              path: newSchema
            }
          }))}
        />
        
        <div className="mb-4">
          <div className="flex items-center mb-2">
            <h3 className="text-base font-medium text-gray-800 dark:text-gray-200">Request Body</h3>
            <div className="ml-2">
              <input
                type="checkbox"
                id="hasRequestBody"
                checked={details.requestBody !== null}
                onChange={(e) => setDetails(prev => ({
                  ...prev,
                  requestBody: e.target.checked ? {
                    type: 'object',
                    properties: {}
                  } : null
                }))}
                className="mr-1"
              />
              <label htmlFor="hasRequestBody" className="text-sm text-gray-600 dark:text-gray-400">
                Has request body
              </label>
            </div>
          </div>
          
          {details.requestBody && (
            <div className="border dark:border-gray-700 rounded-md p-3">
              <div className="mb-3">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Content Type
                </label>
                <select
                  className="w-full px-3 py-2 border dark:border-gray-600 rounded-md
                    bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  defaultValue="object"
                >
                  <option value="object">application/json</option>
                </select>
              </div>
              
              <SchemaEditor
                title="Properties"
                schema={details.requestBody.properties || {}}
                onChange={(newSchema) => setDetails(prev => ({
                  ...prev,
                  requestBody: prev.requestBody ? {
                    ...prev.requestBody,
                    properties: newSchema
                  } : null
                }))}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const getMethodColor = (method: string): string => {
  const methodColors: Record<string, string> = {
    GET: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
    POST: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
    PUT: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
    DELETE: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
    PATCH: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300'
  };
  
  return methodColors[method.toUpperCase()] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
};

export default OperationEditor;