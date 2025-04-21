import { WebhookNode, OperationDetails, SwaggerPath } from '../types';

/**
 * Generate Swagger/OpenAPI JSON from webhook nodes and operation details
 */
export const generateSwaggerJson = (
  webhookNodes: WebhookNode[],
  operationDetailsMap: Record<string, OperationDetails>
): string => {
  const paths: Record<string, any> = {};
  
  // Create paths from webhook nodes
  webhookNodes.forEach((node) => {
    const details = operationDetailsMap[node.id] || createDefaultOperationDetails(node);
    
    if (!paths[node.path]) {
      paths[node.path] = {};
    }
    
    const method = node.method.toLowerCase();
    paths[node.path][method] = {
      operationId: details.operationId,
      summary: details.summary,
      description: details.description,
      tags: details.tags,
      parameters: createParameters(details),
      ...(details.requestBody && { requestBody: createRequestBody(details.requestBody) }),
      responses: details.responses || createDefaultResponses()
    };
  });
  
  // Create OpenAPI specification
  const swagger = {
    openapi: '3.0.0',
    info: {
      title: 'API Generated from n8n Workflow',
      description: 'This API specification was generated from n8n webhook nodes',
      version: '1.0.0'
    },
    servers: [
      {
        url: '/api',
        description: 'API Server'
      }
    ],
    paths,
    components: {
      schemas: {},
      securitySchemes: {}
    }
  };
  
  return JSON.stringify(swagger, null, 2);
};

/**
 * Create default operation details
 */
const createDefaultOperationDetails = (node: WebhookNode): OperationDetails => {
  return {
    operationId: `${node.method.toLowerCase()}${capitalizeFirstLetter(node.path.replace(/\//g, ''))}`,
    summary: `${node.method} ${node.path}`,
    description: `Operation for ${node.name} webhook`,
    tags: ['webhook'],
    parameters: {
      query: {},
      path: {}
    },
    requestBody: null,
    responses: createDefaultResponses()
  };
};

/**
 * Create parameters array for OpenAPI spec
 */
const createParameters = (details: OperationDetails): any[] => {
  const parameters: any[] = [];
  
  // Add query parameters
  Object.entries(details.parameters.query).forEach(([name, schema]) => {
    parameters.push({
      name,
      in: 'query',
      description: schema.description || `${name} parameter`,
      required: false,
      schema
    });
  });
  
  // Add path parameters
  Object.entries(details.parameters.path).forEach(([name, schema]) => {
    parameters.push({
      name,
      in: 'path',
      description: schema.description || `${name} parameter`,
      required: true,
      schema
    });
  });
  
  return parameters;
};

/**
 * Create request body for OpenAPI spec
 */
const createRequestBody = (schema: any): any => {
  return {
    required: true,
    content: {
      'application/json': {
        schema
      }
    }
  };
};

/**
 * Create default responses
 */
const createDefaultResponses = (): Record<string, any> => {
  return {
    '200': {
      description: 'Successful operation',
      content: {
        'application/json': {
          schema: {
            type: 'object'
          }
        }
      }
    },
    '400': {
      description: 'Bad request'
    },
    '500': {
      description: 'Internal server error'
    }
  };
};

/**
 * Validate if the output is valid Swagger/OpenAPI JSON
 */
export const isValidSwaggerJson = (json: string): boolean => {
  try {
    const data = JSON.parse(json);
    // Basic validation for OpenAPI format
    return !!(data.openapi && data.paths && data.info);
  } catch (error) {
    return false;
  }
};

/**
 * Helper to capitalize first letter
 */
const capitalizeFirstLetter = (string: string): string => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};