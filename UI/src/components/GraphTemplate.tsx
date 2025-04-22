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
import { fetchGraph, fetchManualTriggers, FetchSubmission, FetchSubmissionByLoader, HandleCreateFlowGraph, LazyLoadGraph, LazyLoadNodeHistory, LazyLoadNodeSchema, submitEvent, SubmitForm } from '../api';
import { GraphData, GraphDataLazyLoad, NodeHistory, NodeSubmission, Trigger } from '../types';
import 'reactflow/dist/style.css';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
// import { JsonForms } from '@jsonforms/react';
// import {
//   materialRenderers,
//   materialCells
// } from '@jsonforms/material-renderers'; // or choose a different renderer
import { Button } from 'primereact/button';
// import { data } from 'react-router';
// import { isEnabled } from '@jsonforms/core';
import Form from '@rjsf/core';

interface ApprovalGraphProps {
  graphId: string;
  requestId: string;
  graphData?: any;
  mode: string;
}

const nodeDefaults = {
  sourcePosition: 'right',
  targetPosition: 'left',
  style: {
    padding: 16,
    borderRadius: 8,
    border: '1px solid #ccc',
    width: 180,
  },
};

const DummyTriLegsGraph : GraphDataLazyLoad = {
  "graphId": "graph-002",
  "domain": "hr",
  "status": "active",
  "currentEvent": "basic-info",
  "history": [],
  "definition": {
    "events": [
      {
        "eventId": "basic-info",
        "type": "Fill Basic Info",
        "dataSchema": {
          "n8nLoader": "basic-info"
        },
        "triggers": [
          {
            "eventId": "approach",
            "triggerType": "Submit"
          }
        ]
      },
      {
        "eventId": "contract-info",
        "type": "Fill Contract Info",
        "dataSchema": {
          "n8nLoader": "contract-info"
        },
        "triggers": [
          {
            "eventId": "approach",
            "triggerType": "Submit"
          }
        ]
      },
      {
        "eventId": "approach",
        "type": "HR Approaches Candidate",
        "dataSchema": {
          "n8nLoader": "approach"
        },
        "triggers": []
      }
    ]
  }
};

const DummyComplicatedGraph : GraphDataLazyLoad = {
  "graphId": "graph-complicated",
  "domain": "hr",
  "status": "active",
  "currentEvent": "ER-01",
  "history": [],
  "definition": {
    "events": [
      {
        "eventId": "ER-01",
        "type": "Candidate Profile Submission",
        "dataSchema": { "n8nLoader": "ER-01" },
        "triggers": [
          { "eventId": "ER-02", "triggerType": "Submit" },
          { "eventId": "ER-03", "triggerType": "Attach Resume" }
        ]
      },
      {
        "eventId": "ER-02",
        "type": "HR Review",
        "dataSchema": { "n8nLoader": "ER-02" },
        "triggers": [
          { "eventId": "ER-04", "triggerType": "Approve" },
          { "eventId": "ER-05", "triggerType": "Request Changes" }
        ]
      },
      {
        "eventId": "ER-03",
        "type": "Document Upload",
        "dataSchema": { "n8nLoader": "ER-03" },
        "triggers": [
          { "eventId": "ER-04", "triggerType": "Completed" }
        ]
      },
      {
        "eventId": "ER-04",
        "type": "Manager Approval",
        "dataSchema": { "n8nLoader": "ER-04" },
        "triggers": [
          { "eventId": "ER-06", "triggerType": "Proceed to Offer" }
        ]
      },
      {
        "eventId": "ER-05",
        "type": "Candidate Correction",
        "dataSchema": { "n8nLoader": "ER-05" },
        "triggers": [
          { "eventId": "ER-01", "triggerType": "Resubmit" }
        ]
      },
      {
        "eventId": "ER-06",
        "type": "HR Prepares Offer",
        "dataSchema": { "n8nLoader": "ER-06" },
        "triggers": [
          { "eventId": "ER-07", "triggerType": "Send" }
        ]
      },
      {
        "eventId": "ER-07",
        "type": "Candidate Receives Offer",
        "dataSchema": { "n8nLoader": "ER-07" },
        "triggers": [
          { "eventId": "ER-08", "triggerType": "Accept" },
          { "eventId": "ER-09", "triggerType": "Decline" }
        ]
      },
      {
        "eventId": "ER-08",
        "type": "Onboarding Starts",
        "dataSchema": { "n8nLoader": "ER-08" },
        "triggers": []
      },
      {
        "eventId": "ER-09",
        "type": "Rejection Feedback",
        "dataSchema": { "n8nLoader": "ER-09" },
        "triggers": []
      }
    ]
  }
};

const DummySchemaList : N8nNodeSchema[] = [
  {
    schemaId: "ER-01",
    preview: ["ER-06", "ER-05", "ER-07"],
    formSchema: {
      title: "ER-01 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-01 Field 1" },
        field2: { type: "number", title: "ER-01 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-01" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-02",
    preview: ["ER-06", "ER-07"],
    formSchema: {
      title: "ER-02 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-02 Field 1" },
        field2: { type: "number", title: "ER-02 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-02" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-03",
    preview: [], // Empty preview
    formSchema: {
      title: "ER-03 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-03 Field 1" },
        field2: { type: "number", title: "ER-03 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-03" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-04",
    preview: ["ER-07", "ER-06", "ER-08"],
    formSchema: {
      title: "ER-04 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-04 Field 1" },
        field2: { type: "number", title: "ER-04 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-04" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-05",
    preview: [], // Empty preview
    formSchema: {
      title: "ER-05 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-05 Field 1" },
        field2: { type: "number", title: "ER-05 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-05" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-06",
    preview: ["ER-02"],
    formSchema: {
      title: "ER-06 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-06 Field 1" },
        field2: { type: "number", title: "ER-06 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-06" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-07",
    preview: ["ER-04"],
    formSchema: {
      title: "ER-07 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-07 Field 1" },
        field2: { type: "number", title: "ER-07 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-07" },
      field2: { "ui:widget": "updown" }
    }
  },
  {
    schemaId: "ER-08",
    preview: [], // Empty preview
    formSchema: {
      title: "ER-08 Schema",
      type: "object",
      properties: {
        field1: { type: "string", title: "ER-08 Field 1" },
        field2: { type: "number", title: "ER-08 Field 2" }
      },
      required: ["field1"]
    },
    uiSchema: {
      field1: { "ui:placeholder": "Enter field1 for ER-08" },
      field2: { "ui:widget": "updown" }
    }
  }
];

interface N8nNodeSchema {
  schemaId: string;
  preview: any;
  formSchema: any;
  uiSchema: any;
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
  // Unique identifier for the preview tab, such as an eventId or custom ID
  id: string;
  // The schema that defines the form structure
  formSchema: any;
  // UI schema for customizing the form layout and controls
  uiSchema: any;
  // Form data to populate the form with existing values
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
  const [previewData, setPreviewData] = useState<PreviewTab[]>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [selectedHistoryTable, setSelectedHistoryTable] = useState<NodeSubmission[]>([]);
  const [formData, setFormData] = useState<any>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [componentState, setComponentState] = useState<string>(props.mode);
  const [historyLst, setHistoryLst] = useState<NodeSubmission[]>([]);

  useEffect(() => {
    if(props.graphData){
      setGraphData(props.graphData);
      RenderFlowGraph(props.graphData);
    }else{
      // LazyLoadGraph(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
      //   setGraphData(data);
      //   RenderFlowGraph(data);
      // });
      setGraphData(DummyComplicatedGraph);
      RenderFlowGraph(DummyComplicatedGraph);
      // setGraphData(DummyTriLegsGraph);
      // RenderFlowGraph(DummyTriLegsGraph);
    }
  }, [props]);

  // const RenderFlowGraph = useCallback((graphData: GraphDataLazyLoad)=>{
  //   if(graphData){
  //     const newNodes = graphData.definition.events.map((event, index) => ({
  //       id: event.eventId,
  //       type: 'default',
  //       data: {
  //         label: event.type,
  //         event: event
  //       },
  //       position: { x: index * 250, y: 100 },
  //       ...nodeDefaults,
  //       style: {
  //         ...nodeDefaults.style,
  //         // background: event.type === data.currentEvent ? '#ffcc00' : '#fff',
  //       },
  //     }));
  //     const newEdges = graphData.definition.events.flatMap(event =>
  //       event.triggers.map(trigger => ({
  //         id: `${event.eventId}-${trigger.eventId}`,
  //         source: event.eventId,
  //         target: trigger.eventId,
  //         label: trigger.triggerType,
  //         type: 'smoothstep',
  //         animated: true,
  //         style: { stroke: '#666' },
  //         labelStyle: { fill: '#666', fontSize: 12 },
  //       }))
  //     );
  //     setNodes(newNodes);
  //     setEdges(newEdges);

  //     if (historyLst.length == 0 && graphData) {
  //       setHistoryLst([]);
  //       for(let i=0; i<graphData.history.length; i++){
  //         FetchSubmissionByLoader(graphData.history[i].n8nLoader).then((data: NodeSubmission) => {
  //           setHistoryLst(prev => [...prev, data]);
  //         });
  //       }
  //     }
  //   }
  // },[graphData])

  const RenderFlowGraph = useCallback((graphData: GraphDataLazyLoad) => {
    if (!graphData || !graphData.definition?.events) return;
  
    // Map events to nodes
    const newNodes = graphData.definition.events.map((event, index) => ({
      id: event.eventId || `event-${index}`,
      type: 'default',
      data: {
        label: event.type || `Event ${index + 1}`,
        event,
      },
      position: {
        x: index * 300, // Spread nodes horizontally
        y: 100 + (event.triggers?.length || 0) * 60,
      },
      style: {
        // Optionally highlight current event
        background: graphData.currentEvent === event.eventId ? '#ffcc00' : '#fff',
        padding: '10px',
      },
    }));
  
    // Map triggers to directional edges with arrowheads
    const newEdges = graphData.definition.events.flatMap(event =>
      (event.triggers || []).map((trigger, tIndex) => ({
        id: `${event.eventId}-${trigger.eventId}`,
        source: event.eventId,
        target: trigger.eventId,
        label: trigger.triggerType || '',
        type: 'smoothstep',  // Smooth transition for the edge
        animated: true,
        arrowHeadType: 'arrowclosed',  // Adding arrow to the edge
        style: {
          stroke: '#666',  // Edge color
          strokeWidth: 2,  // Edge thickness
        },
        labelStyle: {
          fill: '#666',
          fontSize: 12,
        },
        markerEnd: 'url(#arrowhead)', // Reference to the arrowhead style
      }))
    );
  
    setNodes(newNodes);
    setEdges(newEdges);
  
    // Load submission history only once
    if (historyLst.length === 0 && graphData.history?.length > 0) {
      setHistoryLst([]); // clear before loading
  
      graphData.history.forEach(item => {
        if (item?.n8nLoader) {
          FetchSubmissionByLoader(item.n8nLoader).then((data: NodeSubmission) => {
            setHistoryLst(prev => [...prev, data]);
          });
        }
      });
    }
  }, [historyLst]);

  
  useEffect(() => {
    if (selectedNode) {
      console.log(selectedNode);
      // LazyLoadNodeSchema(selectedNode.data.event.dataSchema.n8nLoader, props.requestId).then((data: any) => {
      //   setUiSchema(data.dataSchema.uiSchema);
      //   setFormSchema(data.dataSchema.formSchema);
      // });
      setPreviewData([]);
      HandleLoadNodeSchema(selectedNode.data.event.dataSchema.n8nLoader).then((data?: N8nNodeSchema) => {
        setUiSchema(data?.uiSchema);
        setFormSchema(data?.formSchema);
        if (data?.preview) {
          data?.preview.forEach((element: string) => {
            HandleLoadNodeSchema(element).then((data?: N8nNodeSchema) => {
              if (data) {
                setPreviewData(pre => [...pre,
                {
                  id: data.schemaId,
                  formSchema: data.formSchema,
                  uiSchema: data.uiSchema,
                  formData: FindHistoryByEventId(data?.schemaId)
                }
                ]);
              }
            });
          });
        }
      });
    }
  }, [selectedNode, selectedEvent])

  async function HandleLoadNodeSchema (n8nLoader : string) {
    return DummySchemaList.find((i) => i.schemaId == n8nLoader);
  }
  
  const FindHistoryByEventId = (eventId : string) => {
   return historyLst.find((i) => i.parentId == eventId);
  }
    
  const handleNodeClick = useCallback(async (event: any, node: any) => {
    setSelectedNode(node);
    setSelectedEvent(node.data.event);
    if (node.data.label === graphData?.currentEvent) {
      const triggers = await fetchManualTriggers(props.graphId, props.requestId);
      setManualTriggers(triggers);
    } else {
      setManualTriggers([]);
    }
    setShowCustomDialog(true);
  }, [graphData, props.graphId, props.requestId]);

  const OnClickNode = (event: any, node: any) => {
    setSelectedNode(node);
    setSelectedEvent(node.data.event);
    // let formData : any = historyLst.find((item:any) =>
    //   item[0].data.parentId == selectedNode.data.event.eventId
    // );
    // if(formData){
    //   setSelectedHistory(formData[0].data.data.formData);
    //   setFormData(formData[0].data.data.formData);
    // }
    setShowCustomDialog(true);
    // OpenFormDialog(formData);
  }

  const PreviewTabs = ( preview: PreviewTab[] ) => {
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
    // setSelectedForm({});
    setFormSchema({});
    setUiSchema({});
    setSelectedHistoryTable([]);
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
    console.log(formData);
    let submitData = {
      parentId: selectedNode.id,
      id: `${props.requestId}-${Date.now()}`,
      type: selectedNode?.type,
      data: {formData},
      timestamp: new Date().toISOString(),
    };
    switch(componentState){
      case"CREATE":{
        if(graphData){
          HandleCreateFlowGraph(graphData.graphId, submitData).then((data)=> {
            console.log(data);
            setComponentState("EDIT");
            setGraphData(data);
            RenderFlowGraph(data);
          });
          showToast("creating flow graph....");
          // props.RefreshPage();
          CloseFormDialog();
        }
        break;
      }
      case"EDIT":{
        SubmitForm(submitData, props.graphId);
        showToast("submitting");
        break;
      }
      default:{
        showToast("Dialog mode not found!")
        break;
      }
    }
    
    setDialogVisible(false);
    // FetchEmployeeTable();
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
                        // formData={formData}
                      />
                      <div className=" bottom-0 right-0 flex justify-end gap-2 p-4 flex justify-end gap-2">
                        <Button
                          label="Cancel"
                          className="bg-gray-400 border-none text-white px-4 py-2 rounded"
                          onClick={() => CloseFormDialog()}
                        />
                        <Button
                          label="Save"
                          className="bg-blue-900 border-none text-white px-4 py-2 rounded"
                          onClick={() => handleFormSubmit()}
                        />
                      </div>
                    </div>
                  </TabPanel>
                  <TabPanel header="Submit History">
                    <div style={{width: "250%"}}>
                      {/* {selectedHistory &&
                        <JsonForms
                          schema={formSchema}
                          uischema={uiSchema}
                          data={selectedHistory}
                          renderers={materialRenderers}
                          cells={materialCells}
                          readonly
                        />
                      } */}
                      {/* <pre>
                        {JSON.stringify(previewData)}
                      </pre> */}
                      {
                        PreviewTabs(previewData)
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