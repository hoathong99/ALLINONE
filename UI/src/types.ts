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

export interface GraphDataLazyLoad {
  _id?: string;
  id?: string;
  target?: string;
  author?: string;
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
  previews?: Array<string>;
  toN8nLoader?: string;
  dataSchema: any;
  actorRole?:string;
  status?: string;
  customAuthorized?: [];
  filedBy?: string;
  triggers: Array<{
    eventId: string;
    triggerType: string;
  }>;
  require?: Array<string>;
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

export interface CustomButton {
  name: string;
  requestId?: string;
  toN8nLoader?: string;
  type: string;
  link?:string;
  data?: any;
  resourceRequestId?: string;
}

export interface TableSchema {
  row: Array<string>;                             // row header
  rowAttribute: Array<string>                     // row data to display
}

export interface TableSetting {
  header: string;
  requestId: string;                                // n8n webhook to get table resource, should return a list after fetch
  n8nLoader: string;                                // identity for n8n webhook to determine which to return
  tableActions: Array<CustomButton>;                // render list of small action buttons in a table row
  tableSchema: TableSchema;                         // determine how table is rendered
}

export interface ScreenSettingV2 {
  screenHeader: string;                             // page main header
  headerActions : Array<CustomButton>;              // render list of big header buttons
  tables: Array<TableSetting>;
}

export const dummyScreenSettingV2: ScreenSettingV2 = {
  headerActions: [
    {
      name: "Create New",
      type: "new_process",
      requestId: "get-template",
      toN8nLoader: "quy_trinh_mau_nv_04"
    },
    {
      name: "Export",
      type: "link",
      link: "/export-data"
    }
  ],
  screenHeader: "Employee Management",
  tables: [
    {
      header: "Employee",
      requestId: "LoadEmployeeTable",
      n8nLoader: "what_ever_it_it_Not_needed_in_this_case_any_way",
      tableActions: [
        {
          name: "Edit",
          type: "new_process",
          requestId: "get-template",
          toN8nLoader: "Employee-Edit",
          resourceRequestId: "GetEmployeeEditGraphData"
        },
        {
          name: "Delete",
          type: "new_process",
          requestId: "deleteRequest",
          toN8nLoader: "graph-02-delete",
          resourceRequestId: "GetDeleteDisplay"
        }
      ],
      tableSchema: {
        row: ["employeeCode", "Name", "LaborType", "Status"],
        rowAttribute: ["employeeCode", "fullName", "laborType", "status"]
      }
    },
    {
      header: "Employee Create Process",
      requestId: "LoadEmployeeCreateProcess",
      n8nLoader: "what_ever_it_it_Not_needed_in_this_case_any_way",
      tableActions: [
        {
          name: "Open",
          type: "open_process",
          requestId: "getGraphDataById",
          toN8nLoader: "graph-02-Edit-Mode"
        }
      ],
      tableSchema: {
        row: ["ID", "Target", "Issuer", "Status"],
        rowAttribute: ["_id", "target", "author", "status"]
      }
    },
    {
      header: "Employee Edit Process",
      requestId: "loadScreenData",
      n8nLoader: "mainScreenLoader",
      tableActions: [
        {
          name: "Edit",
          type: "new_process",
          requestId: "get-graph-edit-with-data",
          toN8nLoader: "graph-02-Edit-Mode"
        },
        {
          name: "Delete",
          type: "new_process",
          requestId: "deleteRequest",
          toN8nLoader: "graph-02-delete"
        }
      ],
      tableSchema: {
        row: ["employeeCode", "Name", "LaborType", "Status"],
        rowAttribute: ["employeeCode", "fullName", "laborType", "status"]
      }
    },
    {
      header: "Employee Delete Process",
      requestId: "loadScreenData",
      n8nLoader: "mainScreenLoader",
      tableActions: [
        {
          name: "Edit",
          type: "new_process",
          requestId: "get-graph-edit-with-data",
          toN8nLoader: "graph-02-Edit-Mode"
        },
        {
          name: "Delete",
          type: "new_process",
          requestId: "deleteRequest",
          toN8nLoader: "graph-02-delete"
        }
      ],
      tableSchema: {
        row: ["employeeCode", "Name", "LaborType", "Status"],
        rowAttribute: ["employeeCode", "fullName", "laborType", "status"]
      }
    }
  ]
};

export const dummyAttendanceScrenceSetting: ScreenSettingV2 = {
  headerActions: [
    {
      name: "Create New",
      type: "new_process",
      requestId: "get-template",
      toN8nLoader: "quy_trinh_mau_nv_03"
    },
    {
      name: "Create action 3",
      type: "new_process",
      requestId: "get-template",
      toN8nLoader: "quy_trinh_mau_nv_03"
    }
  ],
  screenHeader: "Attendace Management",
  tables: [
    {
      header: "Attendance",
      requestId: "LoadAttendanceTable",
      n8nLoader: "what_ever_it_it_Not_needed_in_this_case_any_way",
      tableActions: [
        // {
        //   name: "Edit",
        //   type: "new_process",
        //   requestId: "get-template",
        //   toN8nLoader: "Employee-Edit",
        //   resourceRequestId: "GetEmployeeEditGraphData"
        // },
        // {
        //   name: "Delete",
        //   type: "new_process",
        //   requestId: "deleteRequest",
        //   toN8nLoader: "graph-02-delete",
        //   resourceRequestId: "GetDeleteDisplay"
        // }
      ],
      tableSchema: {
        row: ["ID", "Name", "CHECKIN", "CHECKOUT"],
        rowAttribute: ["_id", "fullName", "laborType", "status"]
      }
    }
  ]
};

//<----------------------------------Test