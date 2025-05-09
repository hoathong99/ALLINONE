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
import { ActivateGraph, DeactivateGraph, fetchManualTriggers, FetchSubmissionByLoader, HandleCreateFlowGraph, InstanceGraph, LazyLoadGraph, LazyLoadNodeSchema, LoadResource, SubmitForm, TriggerFormAction } from '../api';
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

const DynamicGraph: React.FC<ApprovalGraphProps> = (props: ApprovalGraphProps) => {
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
        LazyLoadGraph(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
          setGraphData(data);
          RenderFlowGraph(data);
          setGraphStatus(data.status);
        });
      }
    }
    // console.log("attachment", props.attachmentData);
    if(props.attachmentData&&props.TableButtonSetting){
      GetGraphDataFromAttachment(props.attachmentData);
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
          FetchSubmissionByLoader(item).then((data: any) => {
            if (data[0]) {
              setHistoryLst(prev => [...prev, data[0]]);
            }
          });
        }
      });
    }
  };

  const GetGraphDataFromAttachment = (data: any) => {
    LoadResource(props.TableButtonSetting.rqId, props.TableButtonSetting.loader, data)
    .then((dataNodeSubmission) =>
      setHistoryLst([dataNodeSubmission])
    );
  }

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
      LazyLoadNodeSchema(selectedNode.data.event.dataSchema, "GetSchemaByID").then((data: any) => {
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

  function DynamicForm({ data }: { data: Record<string, any> }) {
    return (
      <form style={{ display: 'flex', flexDirection: 'column', gap: '1rem', height: "100%", overflowY: "auto" }}>
        {Object.entries(data).map(([key, value]) => (
          <div key={key} style={{ display: 'flex', flexDirection: 'column' }}>
            <label style={{
              marginBottom: '0.5rem',
              fontWeight: '600',
              textTransform: 'capitalize',
            }}>{key}</label>
            <input
              type="text"
              value={value}
              disabled
              style={{
                border: '1px solid #ccc',
                padding: '0.5rem',
                borderRadius: '5px',
                backgroundColor: '#f5f5f5',
                color: '#333',
              }}
            />
          </div>
        ))}
      </form>
    );
  }

  const OnClickNode = (event: any, node: any) => {
    const uniqueHistory = [
      ...new Map(historyLst.map(item => [item._id, item])).values()
    ];
    uniqueHistory.sort((a, b) => {
      const timeA = new Date(a.timestamp).getTime();
      const timeB = new Date(b.timestamp).getTime();
      return timeB - timeA; // descending order
    });
    setHistoryLst(uniqueHistory); // messed up history submission fetch -> double the array
    setSelectedNode(node);
    setSelectedEvent(node.data.event);
    setShowCustomDialog(true);
  }

  const PreviewTabs = () => {
    return (
      <TabView>
        {previewData.map((tab, index) => (
          <TabPanel key={tab.id + Date.now()} header={tab.header}>
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

  const switchView = () =>{
    setActiveIndex(0);
    setGraphviewMode(!graphviewMode);
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
                    {/* <Button className='pi pi-play-circle' onClick={() => RunNode()}>
                      RUN
                    </Button> */}
                  </div>
                </div>
              </TabPanel>
              <TabPanel header="History">
                <div style={{ width: "250%" }}>
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
                <div style={{ width: "250%" }}>
                  {
                    PreviewTabs()
                  }
                </div>
              </TabPanel>
            </TabView>
          </TabPanel>
        ))}
      </TabView>
    )
  }

  const CloseFormDialog = () => {
    console.log("history", formData)
    setShowCustomDialog(false);
    // setSchema(null);
    setFormSchema({});
    setUiSchema({});
    // setSelectedHistory(undefined);
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
      SubmitForm(submitData, graphData.graphId);
    }
    showToast("sending...");
    // if (selectedNode.toN8nLoader) {
      // TriggerFormAction(submitData, selectedNode.toN8nLoader).then((data) => console.log("action response", data));
    // }
  }

  const RunNode = () =>{
    showToast("running...");
    let latestHistory = FindHistoryByEventId(selectedNode.id)?.formData;
    if(latestHistory){
      let submitData = {
        parentId: selectedNode.id,
        parentGraph: graphData?._id,
        id: `${props.requestId}-${Date.now()}`,
        type: selectedNode?.type,
        data: latestHistory,
        timestamp: new Date().toISOString(),
      };
      if (selectedNode.toN8nLoader) {
        TriggerFormAction(submitData, selectedNode.toN8nLoader).then((data) => console.log("action response", data));
      }
    }
  }

  const startProcess = () => {
    if (graphData && graphStatus == "active") {
      InstanceGraph(graphData.graphId, props.attachmentData).then((data) => {
        if (!data.error) {
          setGraphData(data);
        }
      });
    }
  }

  const runWorkFlow = async () => {
    ActivateGraph("asdasd").then((data) => {
      if (!data.error) {
        showToast("WorkFlow Activated");
      } else {
        showToast(data.error);
      }
    })
  }

  const stopWorkFlow = () => {
    DeactivateGraph("asd").then((data) => {
      if (!data.error) {
        showToast("WorkFlow Deactivated");
      } else {
        showToast(data.error);
      }
    })
  }

  if (!graphData) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div style={{ height: "100vh" }}>
      <div className="card flex justify-content-center">
        <Toast ref={toast} />
      </div>
      <ReactFlow
        hidden={!graphviewMode}
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
        <Panel position="top-left" style={{
          backgroundColor: 'white',
          padding: '1rem',
          borderRadius: '0.5rem',
          boxShadow: '0 10px 15px rgba(0,0,0,0.1)'
        }}>
          <div style={{ height: "100%", overflowY: "auto" }}>
            <div style={{ display: "block", gap: "1rem" }}>
              {graphData._id ?? (<div>{graphData._id}</div>)}
              {graphStatus && (<div>STATUS:{graphStatus}</div>)}
              {graphStatus == "active" && <Button label='Start' onClick={() => { startProcess() }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>}
              {/* {graphStatus == "start" && <Button label='Cancel' onClick={() => { console.log("click!") }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>}
              {graphStatus == "start" && <Button label='Run' onClick={() => { }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>} */}
              <Button label='Switch View' onClick={() => { switchView() }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>
            </div>
            <div>
              {props.attachmentData && (
                <DynamicForm data={props.attachmentData} />
              )}
            </div>
          </div>
        </Panel>
      </ReactFlow>
      <Dialog header={selectedNode?.data.label || "Header"} visible={showCustomDialog} style={{ width: '60vw' }} onHide={() => CloseFormDialog()}>
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
                  disabled={!isFormStarted}
                />
                <div className=" bottom-0 left-0 flex justify-end gap-2 p-4 flex justify-end gap-2">
                  <Button className='pi pi-play-circle' onClick={()=> RunNode()}>
                    RUN
                  </Button>
                </div>
              </div>
            </TabPanel>
            <TabPanel header="History">
              <div style={{ width: "250%" }}>
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
              <div style={{ width: "250%" }}>
                {
                  PreviewTabs()
                }
              </div>
            </TabPanel>
          </TabView>
        </div>
      </Dialog>
      <div hidden={graphviewMode}>
      <Button label='Switch View' onClick={() => { switchView() }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>
      <ViewInTabs></ViewInTabs>
      </div>
    </div>
  );
};

export default DynamicGraph;