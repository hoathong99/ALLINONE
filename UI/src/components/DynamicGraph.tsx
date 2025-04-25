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
// import { Button } from 'primereact/button';
// import Form from '@rjsf/core';
import Form from "@rjsf/bootstrap-4";
import { Dialog } from 'primereact/dialog';
// import { layoutGrid } from "react-jsonschema-form-layout";


interface ApprovalGraphProps {
  graphId?: string;
  requestId?: string;
  graphData?: any;
}

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

const DynamicGraph: React.FC<ApprovalGraphProps> = (props : ApprovalGraphProps) => {
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
  const [historyLst, setHistoryLst] = useState<NodeSubmission[]>([]);                                     // store whole graph submission list

  useEffect(() => {
    if (props.graphData) {
      setGraphData(props.graphData);
      RenderFlowGraph(props.graphData);
    } else if (props.graphId && props.requestId) {
      LazyLoadGraph(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
        setGraphData(data);
        RenderFlowGraph(data);
      });
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
  };

  useEffect(() => {
    if (selectedNode) {
      console.log(selectedNode);
      console.log("historyLst", historyLst);
      setPreviewData([]);
      LazyLoadNodeSchema(selectedNode.data.event.dataSchema, "GetSchemaByID").then((data: any) => {
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
    // SubmitForm(submitData, props.graphId);
    showToast("sending...");
    if (Schema) {
      if (Schema.toN8nLoader) {
        TriggerFormAction(submitData, Schema.toN8nLoader).then((data) => console.log("action response", data));
      }
    }
  }

  if (!graphData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
      <div style={{height:"100%"}}>
      <div className="card flex justify-content-center">
        <Toast ref={toast} />
      </div>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={OnClickNode}
        fitView={true}
        minZoom={0.5}
        maxZoom={1.5}
        defaultViewport={{ x: 0, y: 0, zoom: 0.5 }}
      >
        <Background color="#aaa" gap={16} />
        <Controls />
        <MiniMap />
        {/* <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-2">Approval Workflow</h2>
          <p className="text-sm text-gray-600">Current Event: {graphData.currentEvent}</p>
          <div>MODE:{componentState}</div>
          <Button label='Create' onClick={() => { OnClickNode({}, nodes[0]) }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>
        </Panel> */}
      </ReactFlow>
      <Dialog header={selectedNode?.data.label||"Header"} visible={showCustomDialog} style={{ width: '60vw' }} onHide={() => CloseFormDialog()}>
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
      </Dialog>
    </div>
  );
};

export default DynamicGraph;