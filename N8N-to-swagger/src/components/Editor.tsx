import React, { useState, useEffect, useContext } from 'react';
import SplitPane from './SplitPane';
import { Webhook, Download, Upload, Moon, Sun, RefreshCw, Info, Code, Play } from 'lucide-react';
import JsonEditor from './JsonEditor';
import WebhookList from './WebhookList';
import OperationEditor from './OperationEditor';
import SwaggerPreview from './SwaggerPreview';
import { parseN8nJson, isValidN8nJson } from '../utils/n8nParser';
import { generateSwaggerJson, isValidSwaggerJson } from '../utils/swaggerGenerator';
import { WebhookNode, OperationDetails } from '../types';
import { ThemeContext } from '../context/ThemeContext';

function Editor() {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  
  // Sample n8n workflow JSON for testing
  const sampleN8nJson = JSON.stringify({
    "nodes": [
      {
        "id": "webhook-1",
        "name": "Webhook",
        "type": "n8n-nodes-base.webhook",
        "parameters": {
          "path": "/trigger",
          "httpMethod": "POST"
        },
        "position": [100, 100]
      },
      {
        "id": "function-1",
        "name": "Function",
        "type": "n8n-nodes-base.function",
        "position": [300, 100]
      }
    ],
    "connections": {}
  }, null, 2);

  const [n8nJson, setN8nJson] = useState<string>(sampleN8nJson);
  const [isN8nValid, setIsN8nValid] = useState<boolean>(true);
  const [swaggerJson, setSwaggerJson] = useState<string>('');
  const [isSwaggerValid, setIsSwaggerValid] = useState<boolean>(false);
  const [webhookNodes, setWebhookNodes] = useState<WebhookNode[]>([]);
  const [selectedWebhookId, setSelectedWebhookId] = useState<string | null>(null);
  const [operationDetailsMap, setOperationDetailsMap] = useState<Record<string, OperationDetails>>({});
  const [showInfo, setShowInfo] = useState<boolean>(true);

  // Parse n8n JSON and extract webhook nodes
  useEffect(() => {
    try {
      const valid = isValidN8nJson(n8nJson);
      setIsN8nValid(valid);
      
      if (valid) {
        const nodes = parseN8nJson(n8nJson);
        setWebhookNodes(nodes);
        
        // Initialize operation details for new nodes
        const newOperationDetails = { ...operationDetailsMap };
        nodes.forEach(node => {
          if (!newOperationDetails[node.id]) {
            newOperationDetails[node.id] = {
              operationId: `${node.method.toLowerCase()}${node.path.replace(/\//g, '')}`,
              summary: `${node.method} ${node.path}`,
              description: `Operation for ${node.name} webhook`,
              tags: ['webhook'],
              parameters: {
                query: {},
                path: {}
              },
              requestBody: node.method !== 'GET' ? {
                type: 'object',
                properties: {}
              } : null,
              responses: {
                '200': {
                  description: 'Successful operation',
                  content: {
                    'application/json': {
                      schema: {
                        type: 'object'
                      }
                    }
                  }
                }
              }
            };
          }
        });
        setOperationDetailsMap(newOperationDetails);
        
        // Select first webhook if none selected
        if (nodes.length > 0 && !selectedWebhookId) {
          setSelectedWebhookId(nodes[0].id);
        }
        
        // Generate Swagger JSON
        regenerateSwaggerJson(nodes, newOperationDetails);
      }
    } catch (error) {
      console.error('Error processing n8n JSON:', error);
      setIsN8nValid(false);
    }
  }, [n8nJson]);

  // Regenerate Swagger JSON when operation details change
  const regenerateSwaggerJson = (
    nodes: WebhookNode[] = webhookNodes, 
    details: Record<string, OperationDetails> = operationDetailsMap
  ) => {
    const swagger = generateSwaggerJson(nodes, details);
    setSwaggerJson(swagger);
    setIsSwaggerValid(isValidSwaggerJson(swagger));
  };

  // Handle webhook selection
  const handleSelectWebhook = (id: string) => {
    setSelectedWebhookId(id);
  };

  // Save operation details
  const handleSaveOperationDetails = (details: OperationDetails) => {
    if (!selectedWebhookId) return;
    
    const newOperationDetailsMap = {
      ...operationDetailsMap,
      [selectedWebhookId]: details
    };
    
    setOperationDetailsMap(newOperationDetailsMap);
    regenerateSwaggerJson(webhookNodes, newOperationDetailsMap);
  };

  // Download Swagger JSON
  const handleDownloadSwagger = () => {
    if (!isSwaggerValid) return;
    
    const blob = new Blob([swaggerJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'swagger.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Handle file upload
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result as string;
      setN8nJson(content);
    };
    reader.readAsText(file);
  };

  // Get selected webhook
  const selectedWebhook = webhookNodes.find(node => node.id === selectedWebhookId);
  const selectedOperationDetails = selectedWebhookId 
    ? operationDetailsMap[selectedWebhookId] 
    : null;

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm z-10 border-b dark:border-gray-700">
        <div className="mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center">
              <Webhook className="h-8 w-8 text-blue-500" />
              <h1 className="ml-2 text-xl font-bold text-gray-900 dark:text-white">
                n8n to Swagger Converter
              </h1>
              <button 
                type="button"
                onClick={() => setShowInfo(!showInfo)}
                className="ml-4 p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <Info size={18} />
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="relative">
                <input
                  type="file"
                  id="fileUpload"
                  accept=".json"
                  onChange={handleFileUpload}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <button 
                  className="flex items-center px-3 py-2 text-sm 
                    bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 
                    text-gray-700 dark:text-gray-300 rounded-md"
                >
                  <Upload size={16} className="mr-1" />
                  Import
                </button>
              </div>
              
              <button 
                className={`
                  flex items-center px-3 py-2 text-sm rounded-md
                  ${isSwaggerValid 
                    ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                    : 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'}
                `}
                onClick={handleDownloadSwagger}
                disabled={!isSwaggerValid}
              >
                <Download size={16} className="mr-1" />
                Export
              </button>
              
              <button
                onClick={toggleTheme}
                className="p-2 rounded-md text-gray-500 hover:text-gray-700
                  dark:text-gray-400 dark:hover:text-gray-200
                  hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>
          </div>
        </div>
      </header>
      
      {/* Info Panel */}
      
      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <SplitPane
          split="vertical"
          minSize={300}
          defaultSize="50%"
          style={{ position: 'relative' }}
          paneStyle={{ overflow: 'hidden' }}
        >
          {/* Left Panel - Input JSON and Webhook List */}
          <div className="h-full flex flex-col">
            <SplitPane
              split="horizontal"
              minSize={200}
              defaultSize="50%"
              style={{ position: 'relative' }}
              paneStyle={{ overflow: 'hidden' }}
            >
              {/* n8n JSON Editor */}
              <JsonEditor
                label="n8n Workflow JSON"
                value={n8nJson}
                onChange={setN8nJson}
                isValid={isN8nValid}
                theme={theme}
              />
              
              {/* Webhook List */}
              <div className="h-full flex flex-col">
                <div className="p-3 border-b dark:border-gray-700 flex justify-between items-center">
                  <h3 className="font-medium text-gray-700 dark:text-gray-300">
                    Detected Webhooks
                  </h3>
                  <button
                    onClick={() => regenerateSwaggerJson()}
                    className="p-1 text-blue-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded"
                    title="Regenerate Swagger JSON"
                  >
                    <RefreshCw size={16} />
                  </button>
                </div>
                <div className="flex-1 overflow-hidden">
                  <WebhookList
                    webhooks={webhookNodes}
                    selectedWebhook={selectedWebhookId}
                    onSelect={handleSelectWebhook}
                  />
                </div>
              </div>
            </SplitPane>
          </div>
          
          {/* Right Panel - Operation Editor and Output JSON/Preview */}
          <div className="h-full flex flex-col">
            <div className="flex items-center px-4 py-2 border-b dark:border-gray-700">
              <select
                value={selectedWebhookId || ''}
                onChange={(e) => handleSelectWebhook(e.target.value)}
                className="flex-1 mr-4 px-3 py-1.5 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-md text-sm text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="" disabled>Select a webhook...</option>
                {webhookNodes.map(node => (
                  <option key={node.id} value={node.id}>
                    {node.name} - {node.method} {node.path}
                  </option>
                ))}
              </select>
              
              <div className="flex items-center">
                <button
                  onClick={() => setActiveTab('editor')}
                  className={`flex items-center px-3 py-1.5 text-sm rounded-md mr-2 ${
                    activeTab === 'editor'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Code size={16} className="mr-1.5" />
                  Editor
                </button>
                <button
                  onClick={() => setActiveTab('preview')}
                  className={`flex items-center px-3 py-1.5 text-sm rounded-md ${
                    activeTab === 'preview'
                      ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <Play size={16} className="mr-1.5" />
                  Preview
                </button>
              </div>
            </div>
            
            <div className="flex-1 overflow-hidden">
              {activeTab === 'editor' ? (
                <SplitPane
                  split="horizontal"
                  minSize={200}
                  defaultSize="60%"
                  style={{ position: 'relative' }}
                  paneStyle={{ overflow: 'hidden' }}
                >
                  {/* Operation Editor */}
                  <div className="h-full overflow-hidden">
                    {selectedWebhook && selectedOperationDetails ? (
                      <OperationEditor
                        webhook={selectedWebhook}
                        operationDetails={selectedOperationDetails}
                        onSave={handleSaveOperationDetails}
                      />
                    ) : (
                      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
                        <div className="text-center">
                          <Webhook className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Select a webhook node to edit its operation details</p>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  {/* Swagger JSON Editor */}
                  <JsonEditor
                    label="Generated Swagger/OpenAPI JSON"
                    value={swaggerJson}
                    onChange={setSwaggerJson}
                    isValid={isSwaggerValid}
                    theme={theme}
                  />
                </SplitPane>
              ) : (
                <SwaggerPreview spec={swaggerJson} />
              )}
            </div>
          </div>
        </SplitPane>
      </div>
    </div>
  );
}

export default Editor;
