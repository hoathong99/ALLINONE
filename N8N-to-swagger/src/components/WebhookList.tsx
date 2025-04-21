import React from 'react';
import { WebhookNode } from '../types';
import { Globe, ArrowRight } from 'lucide-react';

interface WebhookListProps {
  webhooks: WebhookNode[];
  selectedWebhook: string | null;
  onSelect: (id: string) => void;
}

const WebhookList: React.FC<WebhookListProps> = ({ 
  webhooks, 
  selectedWebhook, 
  onSelect 
}) => {
  if (webhooks.length === 0) {
    return (
      <div className="p-4 text-center text-gray-500 dark:text-gray-400">
        <Globe className="mx-auto mb-2" size={24} />
        <p>No webhook nodes found in the n8n workflow.</p>
        <p className="text-sm mt-2">Webhooks will appear here when detected.</p>
      </div>
    );
  }

  return (
    <div className="overflow-y-auto max-h-full">
      <div className="p-3 border-b dark:border-gray-700">
        <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Webhook Nodes ({webhooks.length})
        </h3>
      </div>
      <ul className="divide-y divide-gray-200 dark:divide-gray-700">
        {webhooks.map((webhook) => (
          <li 
            key={webhook.id}
            className={`
              p-3 cursor-pointer transition-colors duration-150 hover:bg-gray-100 dark:hover:bg-gray-700
              ${selectedWebhook === webhook.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
            `}
            onClick={() => onSelect(webhook.id)}
          >
            <div className="flex items-center justify-between">
              <div className="font-medium text-gray-800 dark:text-gray-200 truncate">
                {webhook.name}
              </div>
              {selectedWebhook === webhook.id && (
                <ArrowRight size={16} className="text-blue-500" />
              )}
            </div>
            <div className="mt-1 flex items-center">
              <span 
                className={`
                  px-2 py-0.5 text-xs rounded-full font-medium
                  ${getMethodBadgeColor(webhook.method)}
                `}
              >
                {webhook.method}
              </span>
              <span className="ml-2 text-sm text-gray-500 dark:text-gray-400 truncate">
                {webhook.path}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const getMethodBadgeColor = (method: string): string => {
  switch (method.toUpperCase()) {
    case 'GET':
      return 'bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300';
    case 'POST':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300';
    case 'PUT':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300';
    case 'DELETE':
      return 'bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300';
    case 'PATCH':
      return 'bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

export default WebhookList;