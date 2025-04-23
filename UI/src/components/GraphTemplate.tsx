import React, { useState, useEffect, useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import validator from '@rjsf/validator-ajv8';
import { fetchManualTriggers,  FetchSubmissionByLoader, HandleCreateFlowGraph, LazyLoadGraph,  LazyLoadNodeSchema,  SubmitForm, TriggerFormAction } from '../api';
import { GraphDataLazyLoad, NodeSubmission, Trigger } from '../types';
import 'reactflow/dist/style.css';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
// import Form from '@rjsf/core';
import Form from "@rjsf/bootstrap-4";


interface ApprovalGraphProps {
  graphId: string;
  requestId: string;
  graphData?: any;
  mode: string;
}

// const nodeDefaults = {
//   sourcePosition: 'right',
//   targetPosition: 'left',
//   style: {
//     padding: 16,
//     borderRadius: 8,
//     border: '1px solid #ccc',
//     width: 180,
//   },
// };

// const DummyComplicatedGraph : GraphDataLazyLoad = {
//   "graphId": "graph-complicated",
//   "domain": "hr",
//   "status": "active",
//   "currentEvent": "ER-01",
//   "history": [],
//   "definition": {
//     "events": [
//       {
//         "eventId": "ER-01",
//         "type": "Candidate Profile Submission",
//         "dataSchema": { "n8nLoader": "ER-01" },
//         "triggers": [
//           { "eventId": "ER-02", "triggerType": "Submit" },
//           { "eventId": "ER-03", "triggerType": "Attach Resume" }
//         ]
//       },
//       {
//         "eventId": "ER-02",
//         "type": "HR Review",
//         "dataSchema": { "n8nLoader": "ER-02" },
//         "triggers": [
//           { "eventId": "ER-04", "triggerType": "Approve" },
//           { "eventId": "ER-05", "triggerType": "Request Changes" }
//         ]
//       },
//       {
//         "eventId": "ER-03",
//         "type": "Document Upload",
//         "dataSchema": { "n8nLoader": "ER-03" },
//         "triggers": [
//           { "eventId": "ER-04", "triggerType": "Completed" }
//         ]
//       },
//       {
//         "eventId": "ER-04",
//         "type": "Manager Approval",
//         "dataSchema": { "n8nLoader": "ER-04" },
//         "triggers": [
//           { "eventId": "ER-06", "triggerType": "Proceed to Offer" }
//         ]
//       },
//       {
//         "eventId": "ER-05",
//         "type": "Candidate Correction",
//         "dataSchema": { "n8nLoader": "ER-05" },
//         "triggers": [
//           { "eventId": "ER-01", "triggerType": "Resubmit" }
//         ]
//       },
//       {
//         "eventId": "ER-06",
//         "type": "HR Prepares Offer",
//         "dataSchema": { "n8nLoader": "ER-06" },
//         "triggers": [
//           { "eventId": "ER-07", "triggerType": "Send" }
//         ]
//       },
//       {
//         "eventId": "ER-07",
//         "type": "Candidate Receives Offer",
//         "dataSchema": { "n8nLoader": "ER-07" },
//         "triggers": [
//           { "eventId": "ER-08", "triggerType": "Accept" },
//           { "eventId": "ER-09", "triggerType": "Decline" }
//         ]
//       },
//       {
//         "eventId": "ER-08",
//         "type": "Onboarding Starts",
//         "dataSchema": { "n8nLoader": "ER-08" },
//         "triggers": []
//       },
//       {
//         "eventId": "ER-09",
//         "type": "Rejection Feedback",
//         "dataSchema": { "n8nLoader": "ER-09" },
//         "triggers": []
//       }
//     ]
//   }
// };

// const DummySchemaList : N8nNodeSchema[] = [
//   {
//     schemaId: "ER-01",
//     preview: ["ER-06", "ER-05", "ER-07"],
//     formSchema: {
//       title: "ER-01 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-01 Field 1" },
//         field2: { type: "number", title: "ER-01 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-01" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-02",
//     preview: ["ER-06", "ER-07"],
//     formSchema: {
//       title: "ER-02 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-02 Field 1" },
//         field2: { type: "number", title: "ER-02 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-02" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-03",
//     preview: [], // Empty preview
//     formSchema: {
//       title: "ER-03 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-03 Field 1" },
//         field2: { type: "number", title: "ER-03 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-03" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-04",
//     preview: ["ER-07", "ER-06", "ER-08"],
//     formSchema: {
//       title: "ER-04 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-04 Field 1" },
//         field2: { type: "number", title: "ER-04 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-04" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-05",
//     preview: [], // Empty preview
//     formSchema: {
//       title: "ER-05 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-05 Field 1" },
//         field2: { type: "number", title: "ER-05 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-05" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-06",
//     preview: ["ER-02"],
//     formSchema: {
//       title: "ER-06 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-06 Field 1" },
//         field2: { type: "number", title: "ER-06 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-06" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-07",
//     preview: ["ER-04"],
//     formSchema: {
//       title: "ER-07 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-07 Field 1" },
//         field2: { type: "number", title: "ER-07 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-07" },
//       field2: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-08",
//     preview: [], // Empty preview
//     formSchema: {
//       title: "ER-08 Schema",
//       type: "object",
//       properties: {
//         field1: { type: "string", title: "ER-08 Field 1" },
//         field2: { type: "number", title: "ER-08 Field 2" }
//       },
//       required: ["field1"]
//     },
//     uiSchema: {
//       field1: { "ui:placeholder": "Enter field1 for ER-08" },
//       field2: { "ui:widget": "updown" }
//     }
//   }
// ];

// const DummyHistory: NodeSubmission[] = [
//   {
//     parentId: "ER-01",
//     data: {
//       id: "subm-er01-1",
//       type: "submission",
//       data: {
//         field1: "ER01 Value 1A",
//         field2: 100
//       },
//       timestamp: "2025-04-22T08:00:00Z"
//     },
//     timestamp: "2025-04-22T08:00:00Z"
//   },
//   {
//     parentId: "ER-01",
//     data: {
//       id: "subm-er01-2",
//       type: "submission",
//       data: {
//         field1: "ER01 Value 1B",
//         field2: 150
//       },
//       timestamp: "2025-04-22T09:00:00Z"
//     },
//     timestamp: "2025-04-22T09:00:00Z"
//   },
//   {
//     parentId: "ER-02",
//     data: {
//       id: "subm-er02-1",
//       type: "submission",
//       data: {
//         field1: "ER02 Single Entry",
//         field2: 200
//       },
//       timestamp: "2025-04-22T07:30:00Z"
//     },
//     timestamp: "2025-04-22T07:30:00Z"
//   },
//   {
//     parentId: "ER-04",
//     data: {
//       id: "subm-er04-1",
//       type: "submission",
//       data: {
//         field1: "ER04 Data",
//         field2: 300
//       },
//       timestamp: "2025-04-21T11:00:00Z"
//     },
//     timestamp: "2025-04-21T11:00:00Z"
//   },
//   {
//     parentId: "ER-06",
//     data: {
//       id: "subm-er06-1",
//       type: "submission",
//       data: {
//         field1: "ER06 Initial",
//         field2: 400
//       },
//       timestamp: "2025-04-22T05:00:00Z"
//     },
//     timestamp: "2025-04-22T05:00:00Z"
//   },
//   {
//     parentId: "ER-07",
//     data: {
//       id: "subm-er07-1",
//       type: "submission",
//       data: {
//         field1: "ER07 Preview",
//         field2: 500
//       },
//       timestamp: "2025-04-22T06:00:00Z"
//     },
//     timestamp: "2025-04-22T06:00:00Z"
//   },
//   {
//     parentId: "ER-08",
//     data: {
//       id: "subm-er08-1",
//       type: "submission",
//       data: {
//         field1: "ER08 Initial",
//         field2: 600
//       },
//       timestamp: "2025-04-21T10:00:00Z"
//     },
//     timestamp: "2025-04-21T10:00:00Z"
//   },
//   {
//     parentId: "ER-08",
//     data: {
//       id: "subm-er08-2",
//       type: "submission",
//       data: {
//         field1: "ER08 Follow-up",
//         field2: 650
//       },
//       timestamp: "2025-04-22T10:30:00Z"
//     },
//     timestamp: "2025-04-22T10:30:00Z"
//   }
// ];

// const TempoGraphData: GraphDataLazyLoad = {
//   graphId: "graph-final-review",
//   domain: "workflow",
//   status: "active",
//   currentEvent: "ER-01",
//   history: ["sub-ER-01-001","sub-ER-02-001","sub-ER-03-001","sub-ER-04-001","sub-ER-04-001","sub-ER-06-001"],
//   definition: {
//     events: [
//       {
//         eventId: "ER-01",
//         type: "Personal Info Input",
//         dataSchema: { n8nLoader: "ER-01" },
//         triggers: [{ eventId: "ER-05", triggerType: "Submit" }]
//       },
//       {
//         eventId: "ER-02",
//         type: "Work Experience Input",
//         dataSchema: { n8nLoader: "ER-02" },
//         triggers: [{ eventId: "ER-05", triggerType: "Submit" }]
//       },
//       {
//         eventId: "ER-03",
//         type: "Document Upload",
//         dataSchema: { n8nLoader: "ER-03" },
//         triggers: [{ eventId: "ER-05", triggerType: "Submit" }]
//       },
//       {
//         eventId: "ER-04",
//         type: "Background Check",
//         dataSchema: { n8nLoader: "ER-04" },
//         triggers: [{ eventId: "ER-05", triggerType: "Submit" }]
//       },
//       {
//         eventId: "ER-05",
//         type: "Review Inputs",
//         dataSchema: { n8nLoader: "ER-05" },
//         triggers: [{ eventId: "ER-06", triggerType: "Approve" }]
//       },
//       {
//         eventId: "ER-06",
//         type: "Final Review",
//         dataSchema: { n8nLoader: "ER-06" },
//         triggers: []
//       }
//     ]
//   }
// };

// const TempoSchemaList: N8nNodeSchema[] = [
//   {
//     schemaId: "ER-01",
//     preview: [],
//     formSchema: {
//       title: "Basic Info",
//       type: "object",
//       properties: {
//         fullName: { type: "string", title: "Full Name" },
//         dateOfBirth: { type: "string", format: "date", title: "Date of Birth" }
//       },
//       required: ["fullName"]
//     },
//     uiSchema: {
//       fullName: { "ui:placeholder": "Enter full name" },
//       dateOfBirth: { "ui:widget": "alt-date" }
//     }
//   },
//   {
//     schemaId: "ER-02",
//     preview: [],
//     formSchema: {
//       title: "Contract Info",
//       type: "object",
//       properties: {
//         startDate: { type: "string", format: "date", title: "Start Date" },
//         salary: { type: "number", title: "Salary" }
//       },
//       required: ["startDate"]
//     },
//     uiSchema: {
//       startDate: { "ui:widget": "alt-date" },
//       salary: { "ui:widget": "updown" }
//     }
//   },
//   {
//     schemaId: "ER-03",
//     preview: [],
//     formSchema: {
//       title: "Insurance Info",
//       type: "object",
//       properties: {
//         provider: { type: "string", title: "Insurance Provider" },
//         policyNumber: { type: "string", title: "Policy Number" }
//       },
//       required: ["provider"]
//     },
//     uiSchema: {
//       provider: { "ui:placeholder": "Enter provider" },
//       policyNumber: { "ui:placeholder": "Enter policy number" }
//     }
//   },
//   {
//     schemaId: "ER-04",
//     preview: [],
//     formSchema: {
//       title: "Health Info",
//       type: "object",
//       properties: {
//         reportFile: { type: "string", title: "Health Report (.pdf)" }
//       },
//       required: ["reportFile"]
//     },
//     uiSchema: {
//       reportFile: { "ui:widget": "file" }
//     }
//   },
//   {
//     schemaId: "ER-05",
//     preview: ["ER-01", "ER-02", "ER-03"],
//     formSchema: {
//       title: "Review Info",
//       type: "object",
//       properties: {
//         reviewerNote: { type: "string", title: "Reviewer Note" }
//       },
//       required: []
//     },
//     uiSchema: {
//       reviewerNote: { "ui:widget": "textarea", "ui:placeholder": "Write your notes here" }
//     }
//   },
//   {
//     schemaId: "ER-06",
//     preview: ["ER-01", "ER-02", "ER-03", "ER-04", "ER-05"],
//     formSchema: {
//       title: "Final Decision",
//       type: "object",
//       properties: {
//         decision: {
//           type: "string",
//           enum: ["Approved", "Rejected"],
//           title: "Final Decision"
//         }
//       },
//       required: ["decision"]
//     },
//     uiSchema: {
//       decision: { "ui:widget": "radio" }
//     }
//   }
// ];

// const TempoHistoryLst: NodeSubmission[] = [
//   {
//     parentId: "ER-01",
//     data: {
//       id: "sub-ER-01-001",
//       type: "basic-info",
//       parentId: "ER-01",
//       data: {
//         fullName: "John Doe",
//         dateOfBirth: "1990-01-01"
//       },
//       timestamp: "2025-04-22T08:00:00Z"
//     }
//   },
//   {
//     parentId: "ER-02",
//     data: {
//       id: "sub-ER-02-001",
//       type: "contract-info",
//       parentId: "ER-02",
//       data: {
//         startDate: "2025-05-01",
//         salary: 75000
//       },
//       timestamp: "2025-04-22T09:00:00Z"
//     }
//   },
//   {
//     parentId: "ER-03",
//     data: {
//       id: "sub-ER-03-001",
//       type: "insurance-info",
//       parentId: "ER-03",
//       data: {
//         provider: "Aetna",
//         policyNumber: "AXY123456"
//       },
//       timestamp: "2025-04-22T10:00:00Z"
//     }
//   },
//   {
//     parentId: "ER-04",
//     data: {
//       id: "sub-ER-04-001",
//       type: "health-info",
//       parentId: "ER-04",
//       data: {
//         reportFile: "health-report-john.pdf"
//       },
//       timestamp: "2025-04-22T11:00:00Z"
//     }
//   },
//   {
//     parentId: "ER-05",
//     data: {
//       id: "sub-ER-05-001",
//       type: "review",
//       parentId: "ER-05",
//       data: {
//         reviewerNote: "All good. Ready to finalize."
//       },
//       timestamp: "2025-04-22T12:00:00Z"
//     }
//   },
//   {
//     parentId: "ER-06",
//     data: {
//       id: "sub-ER-06-001",
//       type: "final-review",
//       parentId: "ER-06",
//       data: {
//         decision: "Approved"
//       },
//       timestamp: "2025-04-22T13:00:00Z"
//     }
//   }
// ];

const dummyFormSchemaV2 = {
  "title": "Thông tin cá nhân",
  "type": "object",
  "properties": {
    "employeeCode": { "type": "string", "title": "Mã nhân sự", "readOnly": true },
    "fullName": { "type": "string", "title": "Họ tên" },
    "gender": {
      "type": "string",
      "title": "Giới tính",
      "enum": ["Nam", "Nữ"]
    },
    "placeOfBirth": { "type": "string", "title": "Nơi sinh" },
    "nationality": { "type": "string", "title": "Quốc tịch" },
    "ethnicity": { "type": "string", "title": "Dân tộc" },
    "taxId": { "type": "string", "title": "MST cá nhân" },
    "contractSignDate": { "type": "string", "format": "date", "title": "Ngày ký HĐLĐ chính thức" },
    "employmentType": {
      "type": "string",
      "title": "Loại lao động",
      "enum": ["In-house", "CTV", "Vendor"]
    },
    "attendanceCode": { "type": "string", "title": "Mã chấm công" },
    "dateOfBirth": { "type": "string", "format": "date", "title": "Ngày sinh" },
    "militaryService": {
      "type": "string",
      "title": "Nghĩa vụ quân sự",
      "enum": ["Đã đi", "Không phải đi", "Chưa đi"]
    },
    "hometown": { "type": "string", "title": "Nguyên quán" },
    "maritalStatus": {
      "type": "string",
      "title": "Tình trạng hôn nhân",
      "enum": ["Độc thân", "Kết hôn", "Ly hôn"]
    },
    "religion": {
      "type": "string",
      "title": "Tôn giáo",
      "enum": ["Không", "Thiên Chúa", "Phật Giáo"]
    },
    "onboardDate": { "type": "string", "format": "date", "title": "Ngày vào" },
    "directManager": { "type": "string", "title": "Người QL trực tiếp" }
  },
  "required": ["fullName", "gender", "dateOfBirth", "employmentType"]
};

const dummyuiSchemaV2 = {
  "ui:field": "layout",
  "ui:layout": [
    [
      { employeeId: { classNames: "col-md-6" } },
      { timekeepingCode: { classNames: "col-md-6" } }
    ],
    [
      { fullName: { classNames: "col-md-6" } },
      { dateOfBirth: { "ui:widget": "alt-date", classNames: "col-md-6" } }
    ],
    [
      { gender: { "ui:widget": "radio", classNames: "col-md-6" } },
      { militaryService: { "ui:widget": "radio", classNames: "col-md-6" } }
    ],
    [
      { placeOfBirth: { "ui:placeholder": "Gợi ý khi nhập", classNames: "col-md-6" } },
      { originalAddress: { "ui:placeholder": "Gợi ý khi nhập", classNames: "col-md-6" } }
    ],
    [
      { nationality: { "ui:placeholder": "Gợi ý khi nhập", classNames: "col-md-6" } },
      { religion: { "ui:widget": "select", classNames: "col-md-6" } }
    ],
    [
      { ethnicity: { "ui:widget": "select", classNames: "col-md-6" } },
      { maritalStatus: { "ui:widget": "radio", classNames: "col-md-6" } }
    ],
    [
      { personalTaxCode: { classNames: "col-md-6" } },
      { manager: { "ui:placeholder": "Gợi ý khi nhập", classNames: "col-md-6" } }
    ],
    [
      { officialContractDate: { "ui:widget": "alt-date", classNames: "col-md-6" } },
      { startDate: { "ui:widget": "alt-date", classNames: "col-md-6" } }
    ],
    [
      { employmentType: { "ui:widget": "radio", classNames: "col-md-6" } }
    ]
  ]
};


interface N8nNodeSchema {
  schemaId: string;
  preview: any;
  formSchema: any;
  uiSchema: any;
  toN8nLoader?: string;
}

interface Node {
  id: string;          // Unique identifier for the node
  type: string;        // Type of the node, e.g., 'default', 'input', 'output'
  data: {
    label: string;     // Label for the node
    event?: any;       // Optional, could store event data or other metadata
  };
  position: {
    x: number;         // X position of the node
    y: number;         // Y position of the node
  };
  style?: React.CSSProperties;  // Optional styling for the node (e.g., background color)
}

interface Edge {
  id: string;          // Unique identifier for the edge
  source: string;      // ID of the source node
  target: string;      // ID of the target node
  label: string;       // Label for the edge (e.g., the trigger type)
  type: string;        // Type of edge (e.g., 'smoothstep', 'bezier')
  animated?: boolean;  // Whether the edge is animated (optional)
  style?: React.CSSProperties;  // Optional custom style (e.g., stroke color)
  labelStyle?: React.CSSProperties;  // Optional styling for the label
}

interface PreviewTab {
  id: string;
  formSchema: any;
  uiSchema: any;
  formData: any;
}

const TemplateGraph: React.FC<ApprovalGraphProps> = (props : ApprovalGraphProps) => {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [manualTriggers, setManualTriggers] = useState<Trigger[]>([]);
  const toast = useRef<Toast>(null);
  const [graphData, setGraphData] = useState<GraphDataLazyLoad | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<NodeSubmission>();
  const [formSchema, setFormSchema] = useState<any>({});
  const [uiSchema, setUiSchema] = useState<any>({});
  const [Schema, setSchema] = useState<N8nNodeSchema | null>(null);
  const [previewData, setPreviewData] = useState<PreviewTab[]>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [componentState, setComponentState] = useState<string>(props.mode);                               // determine if graph is in CREATE mode or 
  const [historyLst, setHistoryLst] = useState<NodeSubmission[]>([]);                                     // store whole graph submission list

  useEffect(() => {
    if(props.graphData){
      setGraphData(props.graphData);
      RenderFlowGraph(props.graphData);
    }else{
      LazyLoadGraph(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
        setGraphData(data);
        RenderFlowGraph(data);
      });
      // setGraphData(TempoGraphData);
      // RenderFlowGraph(TempoGraphData);
    }
  }, [props]);

  const RenderFlowGraph = (graphData: GraphDataLazyLoad) => {
    if (!graphData || !graphData.definition?.events) return;
  
    // Group events based on their type or custom logic (here using parentId)
    const levelMap: Record<string, number> = {};
    const inputs = graphData.definition.events.filter(e => !e.triggers?.some(t => t.triggerType === "Approve")); // Top-level inputs
    const review = graphData.definition.events.find(e => e.triggers?.some(t => t.triggerType === "Approve"));
    const final = graphData.definition.events.find(e => e.eventId !== review?.eventId && review?.triggers?.some(t => t.eventId === e.eventId));
  
    const ySpacing = 150;
    const xSpacing = 220;
  
    const positionMap: Record<string, { x: number; y: number }> = {};
  
    // Place input nodes
    inputs.forEach((event, index) => {
      positionMap[event.eventId] = {
        x: index * xSpacing,
        y: 0,
      };
    });
  
    // Place review node
    if (review) {
      positionMap[review.eventId] = {
        x: (inputs.length / 2) * xSpacing,
        y: ySpacing,
      };
    }
  
    // Place final node
    if (final) {
      positionMap[final.eventId] = {
        x: (inputs.length / 2) * xSpacing,
        y: ySpacing * 2,
      };
    }
  
    // Map events to nodes
    const newNodes = graphData.definition.events.map((event) => ({
      id: event.eventId,
      type: 'default',
      data: {
        label: event.type,
        event,
      },
      position: positionMap[event.eventId] || { x: 0, y: 0 },
      style: {
        background: graphData.currentEvent === event.eventId ? '#ffcc00' : '#fff',
        padding: '10px',
      },
    }));
  
    // Map triggers to directional edges
    const newEdges = graphData.definition.events.flatMap(event =>
      (event.triggers || []).map((trigger) => ({
        id: `${event.eventId}-${trigger.eventId}`,
        source: event.eventId,
        target: trigger.eventId,
        label: trigger.triggerType || '',
        type: 'smoothstep',
        animated: true,
        arrowHeadType: 'arrowclosed',
        style: {
          stroke: '#666',
          strokeWidth: 2,
        },
        labelStyle: {
          fill: '#666',
          fontSize: 12,
        },
        markerEnd: 'url(#arrowhead)',
      }))
    );
  
    setNodes(newNodes);
    setEdges(newEdges);

    // Load submission history only once
    if (historyLst.length === 0 && graphData.history?.length > 0) {
      setHistoryLst([]); // clear before loading
      graphData.history.forEach(item => {                                         // messed up somewhere, history list is doubled. hot fixed on node click
        if (item) {
          FetchSubmissionByLoader(item).then((data: any) => {
            if(data[0]){
              setHistoryLst(prev => [...prev, data[0]]);
            }
          });
        }
      });
    }
    // Use dummy list for now
    // setHistoryLst(TempoHistoryLst);
  };

  useEffect(() => {
    if (selectedNode) {
      console.log(selectedNode);
      console.log("historyLst", historyLst);
      setPreviewData([]);
      LazyLoadNodeSchema(selectedNode.data.event.dataSchema.n8nLoader, "GetSchemaByID").then((data: any) => {
        if (data[0]) {
          setSchema(data[0]);
          setUiSchema(data[0].uiSchema);
          setFormSchema(data[0].formSchema);
          let history = FindHistoryByEventId(data[0].schemaId);
          if (history) {
            setSelectedHistory(history.data.data);
            setFormData(history.data.data);
          }
          if (data[0].preview) {
            data[0].preview.forEach((element: string) => {
              LazyLoadNodeSchema(element, "GetSchemaByID").then((data?: any) => {
                if (data[0]) {
                  setPreviewData(pre => [...pre,
                  {
                    id: data[0].schemaId,
                    formSchema: data[0].formSchema,
                    uiSchema: data[0].uiSchema,
                    formData: FindHistoryByEventId(data[0].schemaId)?.data.data
                  }
                  ]);
                }
              });
            });
          }
        }
      });

      // setFormSchema(dummyFormSchemaV2);
      // setUiSchema(dummyuiSchemaV2);
    }
  }, [selectedNode, selectedEvent])

  // async function HandleLoadNodeSchema (n8nLoader : string) {                  /// tempo fixed data
  //   return TempoSchemaList.find((i) => i.schemaId == n8nLoader);
  // }

  const FindHistoryByEventId = (eventId: string) => {
    let result = historyLst.find((i) => i.parentId == eventId);
    return result;
  }
    
  // const handleNodeClick = useCallback(async (event: any, node: any) => {
  //   setSelectedNode(node);
  //   setSelectedEvent(node.data.event);
  //   if (node.data.label === graphData?.currentEvent) {
  //     const triggers = await fetchManualTriggers(props.graphId, props.requestId);
  //     setManualTriggers(triggers);
  //   } else {
  //     setManualTriggers([]);
  //   }
  //   setShowCustomDialog(true);
  // }, [graphData, props.graphId, props.requestId]);

  const OnClickNode = (event: any, node: any) => {
    const uniqueHistory = [
      ...new Map(historyLst.map(item => [item._id, item])).values()
    ];
    setHistoryLst(uniqueHistory); // messed up history submission fetch -> double the array
    setSelectedNode(node);
    setSelectedEvent(node.data.event);
    setShowCustomDialog(true);
  }

  const PreviewTabs = () => {
    return (
      <TabView>
        {previewData.map((tab, index) => (
          <TabPanel key={tab.id+Date.now()} header={tab.id}>
            <Form
              schema={tab.formSchema}
              uiSchema={tab.uiSchema}
              formData={tab.formData}
              disabled // make it read-only
              validator={validator}
            />
          </TabPanel>
        ))}
      </TabView>
    );
  };

  const CloseFormDialog = () => {
    setShowCustomDialog(false);
    setSchema(null);
    setFormSchema({});
    setUiSchema({});
    setSelectedHistory(undefined);
  }

  const showToast = (message: string) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Notice',
      detail: message,
      life: 500
    });
  };

  const handleFormSubmit = () => {
    console.log("schema", Schema);
    let submitData = {
      parentId: selectedNode.id,
      id: `${props.requestId}-${Date.now()}`,
      type: selectedNode?.type,
      data: {formData},
      timestamp: new Date().toISOString(),
    };
    console.log("submitData",submitData);
    switch(componentState){
      case"CREATE":{
        if(graphData){
          showToast("creating flow graph....");
          HandleCreateFlowGraph(graphData.graphId, submitData).then((data)=> {
            console.log(data);
            setComponentState("EDIT");
            setGraphData(data);
            RenderFlowGraph(data);
          });
          CloseFormDialog();
        }
        break;
      }
      case"EDIT":{
        SubmitForm(submitData, props.graphId);
        showToast("sending...");
        if(Schema){
          if(Schema.toN8nLoader){
            TriggerFormAction(submitData, Schema.toN8nLoader).then((data) => console.log("action response",data));
          }
        }
        break;
      }
      default:{
        showToast("Dialog mode not found!")
        break;
      }
    }
  }

  if (!graphData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="h-screen relative">
      <div className="card flex justify-content-center">
        <Toast ref={toast} />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={OnClickNode}
        fitView
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
        <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Approval Workflow</h2>
          <p className="text-sm text-gray-600">Current Event: {graphData.currentEvent}</p>
          <div>MODE:{componentState}</div>
          <Button label='Create' onClick={() => { OnClickNode({}, nodes[0]) }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>
        </Panel>
      </ReactFlow>

      {showCustomDialog &&
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 min-h-[400px]">
          <div className="bg-white rounded-lg shadow-xl w-1/2 max-h-[80vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold">{selectedNode.data.label}</h3>
                <button
                  onClick={() => CloseFormDialog()}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div style={{ display: "flex" }}>
                <TabView >
                  <TabPanel header="Form">
                    <div style={{ marginBottom: "3rem", width: "250%" }}>
                      <Form
                        schema={formSchema}
                        uiSchema={uiSchema}
                        validator={validator}
                        formData={formData}
                        onSubmit={handleFormSubmit}
                        onChange={(e) => {
                          const updatedFormData = e.formData;
                          setFormData(updatedFormData); // assuming you have a useState for formData
                        }}
                      />
                      <div className=" bottom-0 right-0 flex justify-end gap-2 p-4 flex justify-end gap-2">
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel header="History">
                    <div style={{width: "250%"}}>
                    <Form
                        schema={formSchema}
                        uiSchema={uiSchema}
                        validator={validator}
                        formData={selectedHistory}
                        disabled
                      />
                    </div>
                  </TabPanel>
                  <TabPanel header="Review(s)">
                    <div style={{width: "250%"}}>
                      {
                        PreviewTabs()
                      }
                    </div>
                  </TabPanel>
                </TabView>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  );
};

export default TemplateGraph;