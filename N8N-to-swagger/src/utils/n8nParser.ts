import { WebhookNode } from '../types';

/**
 * Parse n8n JSON to extract webhook nodes
 */
export const parseN8nJson = (json: string): WebhookNode[] => {
  try {
    const data = JSON.parse(json);
    const nodes = data.nodes || [];
    
    // Filter webhook nodes that have both path and method
    return nodes
      .filter((node: any) => {
        // Check if node has path and method in parameters
        return node.parameters?.path && node.parameters?.httpMethod;
      })
      .map((node: any) => {
        return {
          id: node.id || `node-${Math.random().toString(36).substring(7)}`,
          name: node.name || 'Unnamed Webhook',
          path: node.parameters.path,
          method: node.parameters.httpMethod.toUpperCase(),
          position: node.position || [0, 0]
        };
      });
  } catch (error) {
    console.error('Error parsing n8n JSON:', error);
    return [];
  }
};

/**
 * Validate if the input is valid n8n JSON
 */
export const isValidN8nJson = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    // Basic validation for n8n format
    return !!(data.nodes && Array.isArray(data.nodes));
  } catch (error) {
    return false;
  }
};
