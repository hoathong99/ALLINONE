import { mockData, transformedDataForLazyLoad, transformedHistoryData, transformedSchemaData } from './dto/data';
import { GraphData, GraphDataLazyLoad, GraphNode, GraphNodeData, NodeHistory, NodeSubmission, ToGateWayPayload, Trigger } from './types';

// Mock API functions
export const fetchGraph = async (graphId: string, requestId: string): Promise<GraphData> => {
  // Simulated API response
  return {
    graphId: "approval-test-001-1234567890",
    domain: "approval",
    status: "ACTIVE",
    definition: {
      events: [
        {
          eventId: "req-001",
          type: "RequestSubmitted",
          dataSchema: {
            type: "object",
            properties: {
              title: {
                type: "string",
                title: "Request Title"
              },
              description: {
                type: "string",
                title: "Description",
                format: "textarea"
              },
              priority: {
                type: "string",
                title: "Priority",
                enum: ["Low", "Medium", "High"]
              }
            },
            required: ["title", "description"]
          },
          triggers: [{ eventId: "req-001-review", triggerType: "Review" }]
        },
        {
          eventId: "req-001-review",
          type: "RequestReviewed",
          dataSchema: {
            type: "object",
            properties: {
              status: {
                type: "string",
                title: "Review Status",
                enum: ["Approved", "Rejected", "Need More Info"]
              },
              comments: {
                type: "string",
                title: "Review Comments",
                format: "textarea"
              }
            },
            required: ["status", "comments"]
          },
          triggers: [{ eventId: "req-001-evt-003", triggerType: "Approve" }]
        },
        {
          eventId: "req-001-evt-003",
          type: "RequestApproved",
          dataSchema: {
            type: "object",
            properties: {
              finalNotes: {
                type: "string",
                title: "Final Notes",
                format: "textarea"
              }
            }
          },
          triggers: []
        }
      ]
    },
    history: [
      {
        eventId: "req-001",
        type: "RequestSubmitted",
        input: { requestId: "req-001", title: "Vacation Request", description: "2 weeks in July", priority: "Medium" },
        output: { message: "Request received" },
        timestamp: new Date().toISOString()
      },
      {
        eventId: "req-001-review",
        type: "RequestReviewed",
        input: { requestId: "req-001", status: "Approved", comments: "Dates look good" },
        output: { message: "Review completed: approved" },
        timestamp: new Date().toISOString()
      },
      {
        eventId: "req-001-evt-003",
        type: "RequestApproved",
        input: { requestId: "req-001", finalNotes: "Approved as requested" },
        output: { message: "Approved" },
        timestamp: new Date().toISOString()
      }
    ],
    currentEvent: "RequestApproved"
  };
};

export const fetchManualTriggers = async (graphId: string, requestId: string): Promise<Trigger[]> => {
  return [
    {
      type: "Approve",
      description: "Approve the request",
      dataSchema: {
        type: "object",
        properties: {
          comments: {
            type: "string",
            title: "Comments"
          }
        }
      }
    }
  ];
};

export const submitEvent = async (graphId: string, event: Record<string, unknown>): Promise<void> => {
  console.log('Submitting event:', event);
};

//--------->Test

export const FetchData = async (graphId: string, requestId: string): Promise<GraphData> => {     // call n8n directly to get graph data
  const requestBody = {
    type: "GET_GRAPH",
    data: {
      grId: graphId,
      rqId: requestId
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    throw error;
  }
}

export const LazyLoadGraph = async (graphId: string, requestId: string): Promise<GraphDataLazyLoad> => {
  const requestBody: ToGateWayPayload = {
    type: "GET_GRAPH",
    data: {
      grId: graphId,
      rqId: requestId
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    throw error;
  }
  // tempo for lazy load implement
  // return transformedDataForLazyLoad;
}

export const LazyLoadGraphTemplate = async (graphId: string, requestId: string): Promise<GraphDataLazyLoad> => {
  const requestBody: ToGateWayPayload = {
    type: "GET_GRAPH_TEMPLATE",
    data: {
      grId: graphId,
      rqId: requestId
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    throw error;
  }
  // tempo for lazy load implement
  // return transformedDataForLazyLoad;
}

export const LazyLoadNodeSchema = async (loaderId: string, requestId: string): Promise<any> => {
  const requestBody: ToGateWayPayload = {
    type: "GET_NODE",
    data: {
      loaderId: loaderId,
      rqId: requestId
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    // throw error;
    console.error("Error fetching schema:", error);
    let emptyObj: GraphNodeData = {
      eventId: '',
      type: '',
      dataSchema: {
        formSchema: {},
        uiSchema: {}
      },
      triggers: []
    };
    return {
      eventId: '',
      type: '',
      dataSchema: {
        formSchema: {},
        uiSchema: {}
      },
      triggers: []
    };
  }
  // return transformedSchemaData[0];
}

export const LazyLoadNodeHistory = async (eventId: string): Promise<NodeSubmission[]> => {
  const requestBody = {
    type: "GET_LATEST_SUBMISSION",
    data: {
      parentId: eventId
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    // throw error;
    console.error("Error fetching schema:", error);
    return [];
  };
}

export const SubmitForm = async (data: any, eventId: string): Promise<any> => {
  const requestBody: ToGateWayPayload = {
    type: "SUBMIT_FORM",
    data: {
      data: data,
      parentId: eventId,
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond;
    // console.log(requestBody);
  } catch (error) {
    // throw error;
    console.error("Error fetching schema:", error);
    return {
      status: "success?",
    };
  }
}

export const CloneGraph = async (graphId: string): Promise<GraphDataLazyLoad> => {
  const requestBody: ToGateWayPayload = {
    type: "CLONE_GRAPH",
    data: {
      grId: graphId,
      rqId: "cloneGraph"
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    throw error;
  }
  // tempo for lazy load implement
  // return transformedDataForLazyLoad;
}

export const FetchSubmission = async (loaderId: string): Promise<any> => {
  const requestBody: ToGateWayPayload = {
    type: "GET_SUBMISSION",
    data: {
      loader: loaderId,
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    console.error("Error fetching schema:", error);
    return [];
  }
}

export const FetchGraphTable = async (loaderId: string): Promise<any> => {
  const requestBody: ToGateWayPayload = {
    type: "GET_ALL_GRAPH",
    data: {
      loader: loaderId,
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    console.error("Error fetching schema:", error);
    return [];
  }
}

export const FetchEmployee = async (loaderId: string): Promise<any> => {
  const requestBody: ToGateWayPayload = {
    type: "GET_ALL_EMPLOYEE",
    data: {
      loader: loaderId,
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    console.error("Error fetching schema:", error);
    return [];
  }
}

export const DeleteSubmission = async (submissionId: string): Promise<any> => {
  const requestBody: ToGateWayPayload = {
    type: "DELETE_SUBMISSION",
    data: {
      id: submissionId,
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    console.error("Error fetching schema:", error);
    return {};
  }
}

export const ToGateWay = async (content: any): Promise<any> => {                               // Call Gateway server to handle guiding n8n instead
  const url = `http://localhost:3000/process-controller/Gateway`;                         //Gateway API 
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(content),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
    return response;
  } catch (error) {
    throw error; // Propagate error
  }
}

export const HandleCreateFlowGraph = async (templateId: string, content: any): Promise<GraphDataLazyLoad> => {
  const requestBody: ToGateWayPayload = {
    type: "CREATE_GRAPH",
    data: {
      templateId: templateId,
      content: content
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    throw error;
  }
  // tempo for lazy load implement
  // return transformedDataForLazyLoad;
}

export const HandleGenerateFormSchema = async (formData : any): Promise<any> =>{
  const requestBody: ToGateWayPayload = {
    type: "GENERATE_FORMSCHEMA",
    data: {
      html: formData.html,
      desc: formData.description
    }
  }
  try {
    const respond = await ToGateWay(requestBody);
    return respond.json();
  } catch (error) {
    throw error;
  }
  // tempo for lazy load implement
  // return transformedDataForLazyLoad;
}

//<------------Test