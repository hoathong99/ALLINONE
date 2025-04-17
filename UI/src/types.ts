export interface Event {
  eventId: string;
  type: string;
  input: Record<string, unknown>;
  output: Record<string, unknown>;
  timestamp: string;
}

export interface Trigger {
  type: string;
  description: string;
  dataSchema: Record<string, unknown>;
}

export interface GraphData {
  graphId: string;
  domain: string;
  status: string;
  definition: {
    events: Array<{
      eventId: string;
      type: string;
      dataSchema: Record<string, unknown>;
      triggers: Array<{
        eventId: string;
        triggerType: string;
      }>;
    }>;
  };
  history: Event[];
  currentEvent: string;
}

//---------------------------------------------->Test
export interface n8nloader{
  n8nLoader: string;
}


export interface GraphDataLazyLoad {
  _id?: string;
  id?: string;
  graphId: string;
  domain: string;
  status: string;
  definition: {
    events: Array<GraphNodeData>;
  };
  history: n8nloader[];
  currentEvent: string;
}

export interface GraphNodeData {
  eventId: string;
  type: string;
  dataSchema: any
  triggers: Array<{
    eventId: string;
    triggerType: string;
  }>;
}

export interface GraphNode {
  eventId: string;
  type: string;
  dataSchema: Record<string, unknown>;
  triggers: Array<{
    eventId: string;
    triggerType: string;
  }>;
}

export interface NodeHistory {
  eventId: string,
  type: string,
  input: any,
  output: any,
  timestamp: string
}

export interface ToGateWayPayload {
  type:string,
  data:any
}

export interface NodeSubmission {
  parentId : string,
  data: {
    parentId?: string
    id: string,
    type:string,
    data:any,
    timestamp:string
  }
  timestamp?:string
}


//<----------------------------------Test