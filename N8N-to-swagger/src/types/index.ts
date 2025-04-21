export interface WebhookNode {
  id: string;
  name: string;
  path: string;
  method: string;
  position: [number, number];
}

export interface ParameterSchema {
  type: string;
  properties?: Record<string, PropertySchema>;
  required?: string[];
  items?: PropertySchema;
}

export interface PropertySchema {
  type: string;
  description?: string;
  format?: string;
  example?: any;
  items?: PropertySchema;
  properties?: Record<string, PropertySchema>;
  required?: string[];
}

export interface OperationDetails {
  operationId: string;
  summary: string;
  description: string;
  tags: string[];
  parameters: {
    query: Record<string, PropertySchema>;
    path: Record<string, PropertySchema>;
  };
  requestBody: ParameterSchema | null;
  responses: Record<string, any>;
}

export interface SwaggerPath {
  path: string;
  method: string;
  operation: OperationDetails;
}

export interface ThemeContextType {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}