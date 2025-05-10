import React, { useState, useEffect, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  Panel
} from 'reactflow';
import validator from '@rjsf/validator-ajv8';
import { ActivateGraph, DeactivateGraph, fetchManualTriggers, FetchSubmissionByLoader, FetchSubmissionByLoaderFreeAccess, HandleCreateFlowGraph, InstanceGraph, InstanceGraphFreeAccess, LazyLoadGraph, LazyLoadGraphFreeAccess, LazyLoadNodeSchema, LazyLoadNodeSchemaFreeAccess, LoadResource, SubmitForm, SubmitFormFreeAccess, TriggerFormAction } from '../api';
import { GraphDataLazyLoad, NodeSubmission, Trigger } from '../types';
import 'reactflow/dist/style.css';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
// import Form from '@rjsf/core';
import Form from "@rjsf/bootstrap-4";
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import 'primeicons/primeicons.css';


interface ApprovalGraphProps {
  graphId?: string;
  requestId?: string;
  graphData?: any;
  attachmentData?: any;
  TableButtonSetting?: any;
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
  header: string;
  formSchema: any;
  uiSchema: any;
  formData: any;
}

const Anonymous: React.FC<ApprovalGraphProps> = (props: ApprovalGraphProps) => {
  const [graphStatus, setGraphStatus] = useState<any>();
  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [manualTriggers, setManualTriggers] = useState<Trigger[]>([]);
  const toast = useRef<Toast>(null);
  const [graphData, setGraphData] = useState<GraphDataLazyLoad | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<NodeSubmission | null>();
  const [formSchema, setFormSchema] = useState<any>({});
  const [uiSchema, setUiSchema] = useState<any>({});
  const [previewData, setPreviewData] = useState<PreviewTab[]>([]);
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [formData, setFormData] = useState<any>();
  const [historyLst, setHistoryLst] = useState<NodeSubmission[]>([]);                                     // store whole graph submission list
  const [isFormStarted, setisFormStarted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [graphviewMode, setGraphviewMode] = useState<boolean>(true);
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (props.graphData) {
      setGraphData(props.graphData);
      RenderFlowGraph(props.graphData);
      setGraphStatus(props.graphData.status);
    } else {
      if (props.graphId && props.requestId) {
        LazyLoadGraphFreeAccess(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
          setGraphData(data);
          RenderFlowGraph(data);
          setGraphStatus(data.status);
        });
      }
    }
  }, [props]);

  const RenderFlowGraph = (graphData: GraphDataLazyLoad) => {
    if (!graphData || !graphData.definition?.events) return;

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
    // const newNodes = graphData.definition.events.map((event) => {
    //   const isCurrent = graphData.currentEvent === event.eventId;
    //   const isFiled = event.status === "filed";
    //   return{
    //     id: event.eventId,
    //     type: 'default',
    //     previews: event.previews,
    //     toN8nLoader: event.toN8nLoader,
    //     status: event.status,
    //     filedBy: event.filedBy,
    //     data: {
    //       label: event.type,
    //       event,
    //     },
    //     position: positionMap[event.eventId] || { x: 0, y: 0 },
    //     style: {
    //       background: isCurrent ? '#ffcc00' : isFiled ? '#b3e5fc' : '#fff', // blue highlight for filed
    //       border: isFiled ? '2px solid #0288d1' : '1px solid #ccc',
    //       padding: '10px',
    //       borderRadius: '5px',
    //     }
    //   }
    // });

    const requirementMap: Record<string, string[]> = {};
    graphData.definition.events.forEach(event => {
      (event.triggers || []).forEach(trigger => {
        if (!requirementMap[trigger.eventId]) {
          requirementMap[trigger.eventId] = [];
        }
        requirementMap[trigger.eventId].push(event.eventId);
      });
    });

    const newNodes = graphData.definition.events.map((event) => {
      const isCurrent = graphData.currentEvent === event.eventId;
      const isFiled = event.status === "filed";
    
      const requiredNodes = requirementMap[event.eventId] ?? [];
      const allRequirementsMet = requiredNodes.length === 0 || requiredNodes.every(reqId => {
        const reqEvent = graphData.definition.events.find(e => e.eventId === reqId);
        return reqEvent?.status === "done";
      });
    
      let background = '#fff';
      let border = '1px solid #ccc';
      
      switch (event.status) {
        case 'fail':
          background = '#ef5350'; // Red
          border = '2px solid #c62828';
          break;
        case 'done':
          background = '#4caf50'; // Green
          border = '2px solid #388e3c';
          break;
        case 'running':
          background = '#ff9800'; // Orange
          border = '2px solid #f57c00';
          break;
        case 'ready':
          background = '#fff176'; // Yellow (Ready)
          border = '2px solid #fdd835';
          break;
        default:
          if (allRequirementsMet) {
            background = '#42a5f5'; // Blue (Writable)
            border = '2px solid #1e88e5';
          } else {
            background = '#cfd8dc'; // Gray (Requirements Not Met)
            border = '2px dashed #b0bec5';
          }
          break;
      }
      
      if (isCurrent) {
        background = '#ffcc00'; // Highlight current node
        border = '2px solid #ffb300';
      }
    
      const writable = allRequirementsMet && !isFiled;
    
      return {
        id: event.eventId,
        type: 'default',
        previews: event.previews,
        toN8nLoader: event.toN8nLoader,
        status: event.status,
        filedBy: event.filedBy,
        writable,
        data: {
          label: event.type,
          event,
        },
        position: positionMap[event.eventId] || { x: 0, y: 0 },
        style: {
          background,
          border,
          padding: '10px',
          borderRadius: '5px',
        }
      };
    });

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
          FetchSubmissionByLoaderFreeAccess(item).then((data: any) => {
            if (data[0]) {
              setHistoryLst(prev => [...prev, data[0]]);
            }
          });
        }
      });
    }
  };

  useEffect(()=>{
    setSelectedNode(nodes[activeIndex]);
  },[activeIndex])

  useEffect(() => {
    if (graphData) {
      console.log(graphData);
      RenderFlowGraph(graphData);
      setGraphStatus(graphData.status);
    }
  }, [graphData])

  useEffect(() => {
    if (graphStatus == "start") {
      setisFormStarted(true);
    } else {
      setisFormStarted(false);
    }
  }, [graphStatus])

  useEffect(() => {
    console.log("select node", selectedNode);
    if (selectedNode) {
      setPreviewData([]);
      LazyLoadNodeSchemaFreeAccess(selectedNode.data.event.dataSchema, "GetSchemaByID").then((data: any) => {
        if (data[0]) {
          // setSchema(data[0]);
          setUiSchema(data[0].uiSchema);
          setFormSchema(data[0].formSchema);
          let history = FindHistoryByEventId(selectedNode.id);
          if (history) {
            setSelectedHistory(history.formData);
            setFormData(history.formData);
          } else {
            setSelectedHistory(null);
            setFormData(null);
          }
          if (selectedNode.previews) {
            selectedNode.previews.forEach((element: string) => {
              let node = graphData?.definition.events.find((item) => item.eventId == element);
              LazyLoadNodeSchema(node?.dataSchema, "GetSchemaByID").then((data?: any) => {
                if (selectedNode) {
                  setPreviewData(pre => [...pre,
                  {
                    id: data[0].schemaId,
                    header: element,
                    formSchema: data[0].formSchema,
                    uiSchema: data[0].uiSchema,
                    formData: FindHistoryByEventId(element)?.formData
                  }
                  ]);
                }
              });
            });
          }
        }
      });
    }
  }, [selectedNode, selectedEvent])

  const FindHistoryByEventId = (eventId: string) => {
    let result = historyLst.find((i) => i.parentId == eventId);
    return result;
  }

  const ViewInTabs = () => {
    return (
      <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} >
        {nodes.map((n, index) => (
          <TabPanel key={n.id + Date.now()} header={n.data.label}>
            <TabView >
              <TabPanel header="Form">
                <div style={{ marginBottom: "3rem"}}>
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
                    disabled={!isFormStarted}
                  />
                  <div className=" bottom-0 left-0 flex justify-end gap-2 p-4 flex justify-end gap-2">
                  </div>
                </div>
              </TabPanel>
            </TabView>
          </TabPanel>
        ))}
      </TabView>
    )
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
    // console.log("schema", Schema);
    let submitData = {
      parentId: selectedNode.id,
      parentGraph: graphData?._id,
      actionType : selectedNode.toN8nLoader,
      target: graphData?.target,
      // id: `${props.requestId}-${Date.now()}`,
      type: selectedNode?.type,
      data: { formData },
      timestamp: new Date().toISOString(),
    };
    console.log("submitData", submitData);
    if (graphData) {
      SubmitFormFreeAccess(submitData, graphData.graphId);
    }
    showToast("sending...");
    // if (selectedNode.toN8nLoader) {
      // TriggerFormAction(submitData, selectedNode.toN8nLoader).then((data) => console.log("action response", data));
    // }
  }

  const startProcess = () => {
    if (graphData && graphStatus == "active") {
      InstanceGraphFreeAccess(graphData.graphId).then((data) => {
        if (!data.error) {
          setGraphData(data);
        }
      });
    }
  }

  if (!graphData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div style={{ height: "100vh", overflowY:"auto" , width:"100%"}}>
      <Toast ref={toast} />
      {graphStatus == "active" && <Button label='Start' onClick={() => { startProcess() }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>}
      <ViewInTabs></ViewInTabs>
    </div>
  );
};

export default Anonymous;