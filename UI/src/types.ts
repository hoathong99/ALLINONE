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
// export interface n8nloader{
//   n8nLoader: string;
// }

export interface GraphDataLazyLoad {
  _id?: string;
  id?: string;
  graphId: string;
  domain: string;
  status: string;
  definition: {
    events: Array<GraphNodeData>;
  };
  history: Array<string>;
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

export interface ToGateWayPayload {
  type:string,
  data:any
}

export interface NodeSubmission {
  _id? : string,
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

interface CustomButton {
  name: string;
  requestId?: string;
  toN8nLoader?: string;
  type: string;
  link?:string;
  data?: any;
}
interface TableSchema {
  row: Array<string>;                             // row header
  rowAttribute: Array<string>                     // row data to display
}
export interface ScreenSetting {
  headerActions : Array<CustomButton>;        // render list of big header buttons
  tableActions: Array<CustomButton>;          // render list of small action buttons in table row
  tableResourceLoader: string;                      // loader to get all table resource, should return a list after fetch
  tableSchema: TableSchema;                         // determine how table is rendered
  requestId: string;                                // determine which n8n loader to trigger for inital resource
  n8nLoader: string;                                // for n8n to determine which to return
  screenHeader: string;
}

export const dummyScreenSetting: ScreenSetting = {
  headerActions: [
    {
      name: "Create New",
      type: "button",
      requestId: "'get-template'",
      toN8nLoader: "graph-02"
    },
    {
      name: "Export",
      type: "link",
      link: "/export-data"
    }
  ],
  tableActions: [
    {
      name: "Edit",
      type: "button",
      requestId: "editRequest"
    },
    {
      name: "Delete",
      type: "button",
      requestId: "deleteRequest"
    }
  ],
  tableResourceLoader: "loadTableData",
  tableSchema: {
    row: ["employeeCode", "Name", "LaborType", "Status"],
    rowAttribute: ["_id", "fullName", "laborType", "status"]
  },
  requestId: "loadScreenData",
  n8nLoader: "mainScreenLoader",
  screenHeader: "User Management"
};

//<----------------------------------Test