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
import { JsonForms } from '@jsonforms/react';
import {
  materialRenderers,
  materialCells
} from '@jsonforms/material-renderers'; // or choose a different renderer
import { Button } from 'primereact/button';
import { data } from 'react-router';
import { isEnabled } from '@jsonforms/core';

interface ApprovalGraphProps {
  graphId: string;
  requestId: string;
  graphData?: any;
  mode: string;
  RefreshPage : () => void;
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

const ApprovalGraph: React.FC<ApprovalGraphProps> = (props : ApprovalGraphProps) => {
  // const [graphData, setGraphData] = useState<GraphData | null>(null);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [manualTriggers, setManualTriggers] = useState<Trigger[]>([]);
  const [showDialog, setShowDialog] = useState(false);

  //---->test
  const toast = useRef<Toast>(null);
  const [graphData, setGraphData] = useState<GraphDataLazyLoad | null>(null);
  const [selectedHistory, setSelectedHistory] = useState<NodeSubmission>();
  const [selectedForm, setSelectedForm] = useState<any>({});
  const [formSchema, setFormSchema] = useState<any>({});
  const [uiSchema, setUiSchema] = useState<any>({});
  const [showCustomDialog, setShowCustomDialog] = useState(false);
  const [selectedHistoryTable, setSelectedHistoryTable] = useState<NodeSubmission[]>([]);
  const [formData, setFormData] = useState<any>();
  const [dialogVisible, setDialogVisible] = useState(false);
  const [componentState, setComponentState] = useState<string>(props.mode);
  const [historyLst, setHistoryLst] = useState<NodeSubmission[]>([]);
  //<----test

  useEffect(() => {
    if(props.graphData){
      setGraphData(props.graphData);
      RenderFlowGraph(props.graphData);
    }else{
      LazyLoadGraph(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
        // const mappedGraphData: GraphDataLazyLoad = {
        //   graphId: data.graphId,
        //   domain: data.domain,
        //   status: data.status,
        //   definition: {
        //     events: data.definition.events.map(event => ({
        //       eventId: event.eventId,
        //       type: event.type,
        //       dataSchema: event.dataSchema,
        //       triggers: event.triggers
        //     }))
        //   },
        //   // history: [],
        //   //------------>test
        //   history: data.history,
        //   //<------------test
        //   currentEvent: data.currentEvent
        // };
        // setGraphData(mappedGraphData);
        // //<-----------------------------test
        
        // // Create nodes with proper layout
        // const newNodes = data.definition.events.map((event, index) => ({
        //   id: event.eventId,
        //   type: 'default',
        //   data: {
        //     label: event.type,
        //     event: event // Store the full event data
        //   },
        //   position: { x: index * 250, y: 100 },
        //   ...nodeDefaults,
        //   style: {
        //     ...nodeDefaults.style,
        //     // background: event.type === data.currentEvent ? '#ffcc00' : '#fff',
        //   },
        // }));
  
        // // // Create edges
        // const newEdges = data.definition.events.flatMap(event =>
        //   event.triggers.map(trigger => ({
        //     id: `${event.eventId}-${trigger.eventId}`,
        //     source: event.eventId,
        //     target: trigger.eventId,
        //     label: trigger.triggerType,
        //     type: 'smoothstep',
        //     animated: true,
        //     style: { stroke: '#666' },
        //     labelStyle: { fill: '#666', fontSize: 12 },
        //   }))
        // );
  
        // setNodes(newNodes);
        // setEdges(newEdges);
        setGraphData(data);
        RenderFlowGraph(data);
      });
    }
  }, [props]);

  // const RenderFlowGraph = (graphData: GraphDataLazyLoad) =>{
  //   const newNodes = graphData.definition.events.map((event, index) => ({
  //     id: event.eventId,
  //     type: 'default',
  //     data: {
  //       label: event.type,
  //       event: event
  //     },
  //     position: { x: index * 250, y: 100 },
  //     ...nodeDefaults,
  //     style: {
  //       ...nodeDefaults.style,
  //       // background: event.type === data.currentEvent ? '#ffcc00' : '#fff',
  //     },
  //   }));
  //   const newEdges = graphData.definition.events.flatMap(event =>
  //     event.triggers.map(trigger => ({
  //       id: `${event.eventId}-${trigger.eventId}`,
  //       source: event.eventId,
  //       target: trigger.eventId,
  //       label: trigger.triggerType,
  //       type: 'smoothstep',
  //       animated: true,
  //       style: { stroke: '#666' },
  //       labelStyle: { fill: '#666', fontSize: 12 },
  //     }))
  //   );
  //   setNodes(newNodes);
  //   setEdges(newEdges);
  //   if (historyLst.length == 0 && graphData) {
  //     setHistoryLst([]);
  //     for(let i=0; i<graphData.history.length; i++){
  //       FetchSubmission(graphData.history[i].n8nLoader, "graph").then((data: NodeSubmission) => {
  //         setHistoryLst(prev => [...prev, data]);
  //       });
  //     }
  //     // graphData.history.forEach((e) => {
  //     //   FetchSubmission(e.n8nLoader).then((data: NodeSubmission) => {
  //     //     setHistoryLst(prev => [...prev, data]);
  //     //   });
  //     // });
  //   }
  // }

  const RenderFlowGraph = useCallback((graphData: GraphDataLazyLoad)=>{
    if(graphData){
      const newNodes = graphData.definition.events.map((event, index) => ({
        id: event.eventId,
        type: 'default',
        data: {
          label: event.type,
          event: event
        },
        position: { x: index * 250, y: 100 },
        ...nodeDefaults,
        style: {
          ...nodeDefaults.style,
          // background: event.type === data.currentEvent ? '#ffcc00' : '#fff',
        },
      }));
      const newEdges = graphData.definition.events.flatMap(event =>
        event.triggers.map(trigger => ({
          id: `${event.eventId}-${trigger.eventId}`,
          source: event.eventId,
          target: trigger.eventId,
          label: trigger.triggerType,
          type: 'smoothstep',
          animated: true,
          style: { stroke: '#666' },
          labelStyle: { fill: '#666', fontSize: 12 },
        }))
      );
      setNodes(newNodes);
      setEdges(newEdges);

      if (historyLst.length == 0 && graphData) {
        setHistoryLst([]);
        for(let i=0; i<graphData.history.length; i++){
          FetchSubmissionByLoader(graphData.history[i].n8nLoader).then((data: NodeSubmission) => {
            setHistoryLst(prev => [...prev, data]);
          });
        }
      }
    }
  },[graphData])

  useEffect(()=>{
    if(historyLst.length>0){
      console.log("historyLst",historyLst);
    }
  },[historyLst])

  useEffect(() => {
    if (selectedNode) {
      console.log(selectedNode);
      LazyLoadNodeSchema(selectedNode.data.event.dataSchema.n8nLoader, props.requestId).then((data: any) => {
        setUiSchema(data.dataSchema.uiSchema);
        setFormSchema(data.dataSchema.formSchema);
      });
    }
  }, [selectedNode, selectedEvent])

  // useEffect(()=>{
  //   if(selectedHistory){
  //     console.log("selectedhistory");
  //     console.log(selectedHistory);
  //   }
  // },[selectedHistory])

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
    let formData : any = historyLst.find((item:any) =>
      item[0].data.parentId == selectedNode.data.event.eventId
    );
    if(formData){
      setSelectedHistory(formData[0].data.data.formData);
      setFormData(formData[0].data.data.formData);
    }
    setShowCustomDialog(true);
    // OpenFormDialog(formData);
  }

  // const handleFormSubmit = useCallback(({ formData }: { formData: any }) => {
  //   const event = {
  //     id: `${requestId}-${Date.now()}`,
  //     type: selectedEvent.type,
  //     data: formData,
  //     timestamp: new Date().toISOString(),
  //   };
  //   console.log(selectedEvent);
  //   SubmitForm(event, selectedEvent.eventId).then((data) => {
  //     console.log("Submission response");
  //     console.log(data);
  //     setShowDialog(false);
  //     LazyLoadNodeSchema(selectedNode.data.event.dataSchema.n8nLoader, requestId).then((data: any) => setSelectedForm(data.dataSchema));
  //     LazyLoadNodeHistory(selectedNode.id).then((data) => setSelectedHistory(data[0]));
  //     FetchSubmission(selectedNode.id).then((data: NodeSubmission[]) => setSelectedHistoryTable(data));
  //     showToast("submitting...")
  //   });
  // }, [graphId, requestId, selectedEvent]);

  // const fetchSubmission = (id: string) => {
  //   FetchSubmission(id).then((data) => {
  //     setSelectedHistoryTable(data);
  //   });
  // }

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

  //<----------------------------test



  const handleSubmit = useCallback((triggerType: string, { formData }: { formData: any }) => {
    const event = {
      id: `${props.requestId}-${Date.now()}`,
      type: triggerType,
      data: formData,
      timestamp: new Date().toISOString(),
    };
    submitEvent(props.graphId, event).then(() => {
      fetchGraph(props.graphId, props.requestId).then(setGraphData);
      setShowDialog(false);
    });
  }, [props.graphId, props.requestId]);

  const handleEventSubmit = useCallback(({ formData }: { formData: any }) => {
    const event = {
      id: `${props.requestId}-${Date.now()}`,
      type: selectedEvent.type,
      data: formData,
      timestamp: new Date().toISOString(),
    };
    submitEvent(props.graphId, event).then(() => {
      fetchGraph(props.graphId, props.requestId).then(setGraphData);
      setShowDialog(false);
    });
  }, [props.graphId, props.requestId, selectedEvent]);

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
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
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
                      <JsonForms
                        schema={formSchema}
                        uischema={uiSchema}
                        data={formData}
                        renderers={materialRenderers}
                        cells={materialCells}
                        onChange={({ data, errors }) => {
                          setFormData(data); // save form data into state
                        }}
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
                      {selectedHistory &&
                        <JsonForms
                          schema={formSchema}
                          uischema={uiSchema}
                          data={selectedHistory}
                          renderers={materialRenderers}
                          cells={materialCells}
                          readonly
                        />
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

// function ApprovalGraph(props : ApprovalGraphProps) {
//   const [nodes, setNodes, onNodesChange] = useNodesState([]);
//   const [edges, setEdges, onEdgesChange] = useEdgesState([]);
//   const [selectedNode, setSelectedNode] = useState<any>(null);
//   const [selectedEvent, setSelectedEvent] = useState<any>(null);
//   const [manualTriggers, setManualTriggers] = useState<Trigger[]>([]);
//   const [showDialog, setShowDialog] = useState(false);

//   const toast = useRef<Toast>(null);
//   const [graphData, setGraphData] = useState<GraphDataLazyLoad | null>(null);
//   const [selectedHistory, setSelectedHistory] = useState<NodeSubmission>();
//   const [selectedForm, setSelectedForm] = useState<any>({});
//   const [formSchema, setFormSchema] = useState<any>({});
//   const [uiSchema, setUiSchema] = useState<any>({});
//   const [showCustomDialog, setShowCustomDialog] = useState(false);
//   const [selectedHistoryTable, setSelectedHistoryTable] = useState<NodeSubmission[]>([]);
//   const [formData, setFormData] = useState<any>();
//   const [dialogVisible, setDialogVisible] = useState(false);
//   const [componentState, setComponentState] = useState<string>(props.mode);
//   const [historyLst, setHistoryLst] = useState<NodeSubmission[]>([]);

//     useEffect(() => {
//     if(props.graphData){
//       setGraphData(props.graphData);
//       RenderFlowGraph2(props.graphData);
//     }else{
//       LazyLoadGraph(props.graphId, props.requestId).then((data: GraphDataLazyLoad) => {
//         // const mappedGraphData: GraphDataLazyLoad = {
//         //   graphId: data.graphId,
//         //   domain: data.domain,
//         //   status: data.status,
//         //   definition: {
//         //     events: data.definition.events.map(event => ({
//         //       eventId: event.eventId,
//         //       type: event.type,
//         //       dataSchema: event.dataSchema,
//         //       triggers: event.triggers
//         //     }))
//         //   },
//         //   // history: [],
//         //   //------------>test
//         //   history: data.history,
//         //   //<------------test
//         //   currentEvent: data.currentEvent
//         // };
//         // setGraphData(mappedGraphData);
//         //<-----------------------------test
  
//         setGraphData(data);
  
//         // Create nodes with proper layout
//         // const newNodes = data.definition.events.map((event, index) => ({
//         //   id: event.eventId,
//         //   type: 'default',
//         //   data: {
//         //     label: event.type,
//         //     event: event // Store the full event data
//         //   },
//         //   position: { x: index * 250, y: 100 },
//         //   ...nodeDefaults,
//         //   style: {
//         //     ...nodeDefaults.style,
//         //     // background: event.type === data.currentEvent ? '#ffcc00' : '#fff',
//         //   },
//         // }));
  
//         // // Create edges
//         // const newEdges = data.definition.events.flatMap(event =>
//         //   event.triggers.map(trigger => ({
//         //     id: `${event.eventId}-${trigger.eventId}`,
//         //     source: event.eventId,
//         //     target: trigger.eventId,
//         //     label: trigger.triggerType,
//         //     type: 'smoothstep',
//         //     animated: true,
//         //     style: { stroke: '#666' },
//         //     labelStyle: { fill: '#666', fontSize: 12 },
//         //   }))
//         // );
  
//         // setNodes(newNodes);
//         // setEdges(newEdges);
//         RenderFlowGraph2(data);
//       });
//     }
//   }, [props]);

//     const RenderFlowGraph2 = useCallback((graph: any)=>{
//     if(graph){
//       const newNodes = graph.definition.events.map((event, index) => ({
//         id: event.eventId,
//         type: 'default',
//         data: {
//           label: event.type,
//           event: event
//         },
//         position: { x: index * 250, y: 100 },
//         ...nodeDefaults,
//         style: {
//           ...nodeDefaults.style,
//           // background: event.type === data.currentEvent ? '#ffcc00' : '#fff',
//         },
//       }));
//       const newEdges = graph.definition.events.flatMap(event =>
//         event.triggers.map(trigger => ({
//           id: `${event.eventId}-${trigger.eventId}`,
//           source: event.eventId,
//           target: trigger.eventId,
//           label: trigger.triggerType,
//           type: 'smoothstep',
//           animated: true,
//           style: { stroke: '#666' },
//           labelStyle: { fill: '#666', fontSize: 12 },
//         }))
//       );
//       setNodes(newNodes);
//       setEdges(newEdges);

//       if (historyLst.length == 0 && graphData) {
//         setHistoryLst([]);
//         for(let i=0; i<graphData.history.length; i++){
//           FetchSubmissionByLoader(graphData.history[i].n8nLoader).then((data: NodeSubmission) => {
//             setHistoryLst(prev => [...prev, data]);
//           });
//         }
//       }
//     }
//   },[graphData])

//     const showToast = (message: string) => {
//     toast.current?.show({
//       severity: 'info',
//       summary: 'Notice',
//       detail: message,
//       life: 500
//     });
//   };

//     const OnClickNode = (event: any, node: any) => {
//     setSelectedNode(node);
//     setSelectedEvent(node.data.event);
//     let formData : any = historyLst.find((item:any) =>
//       item[0].data.parentId == selectedNode.data.event.eventId
//     );
//     if(formData){
//       setSelectedHistory(formData[0].data.data.formData);
//       setFormData(formData[0].data.data.formData);
//     }
//     setShowCustomDialog(true);
//     // OpenFormDialog(formData);
//   }
  
//     const CloseFormDialog = () => {
//     setShowCustomDialog(false);
//     // setSelectedForm({});
//     setFormSchema({});
//     setUiSchema({});
//     setSelectedHistoryTable([]);
//     setSelectedHistory(undefined);
//   }

//   //   return (
//   //   <div className="h-screen relative">
//   //     <div className="card flex justify-content-center">
//   //       <Toast ref={toast} />
//   //     </div>
//   //     <ReactFlow
//   //       nodes={nodes}
//   //       edges={edges}
//   //       onNodesChange={onNodesChange}
//   //       onEdgesChange={onEdgesChange}
//   //       onNodeClick={OnClickNode}
//   //       fitView
//   //       minZoom={0.5}
//   //       maxZoom={1.5}
//   //       defaultViewport={{ x: 0, y: 0, zoom: 1 }}
//   //     >
//   //       <Background color="#aaa" gap={16} />
//   //       <Controls />
//   //       <MiniMap />
//   //       <Panel position="top-left" className="bg-white p-4 rounded-lg shadow-lg">
//   //         <h2 className="text-lg font-semibold mb-2">Approval Workflow</h2>
//   //         <p className="text-sm text-gray-600">Current Event: {graphData?.currentEvent}</p>
//   //         <div>MODE:{componentState}</div>
//   //         <Button label='Create' onClick={() => { OnClickNode({}, nodes[0]) }} className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }}></Button>
//   //       </Panel>
//   //     </ReactFlow>

//   //     {showCustomDialog &&
//   //       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//   //         <div className="bg-white rounded-lg shadow-xl w-1/2 max-h-[80vh] overflow-y-auto">
//   //           <div className="p-6">
//   //             <div className="flex justify-between items-center mb-4">
//   //               <h3 className="text-xl font-bold">{selectedNode.data.label}</h3>
//   //               <button
//   //                 onClick={() => CloseFormDialog()}
//   //                 className="text-gray-500 hover:text-gray-700"
//   //               >
//   //                 ✕
//   //               </button>
//   //             </div>
//   //             <div style={{ display: "flex" }}>
//   //               <TabView >
//   //                 <TabPanel header="Form">
//   //                   <div style={{ marginBottom: "3rem", width: "250%" }}>
//   //                     <JsonForms
//   //                       schema={formSchema}
//   //                       uischema={uiSchema}
//   //                       data={formData}
//   //                       renderers={materialRenderers}
//   //                       cells={materialCells}
//   //                       onChange={({ data, errors }) => {
//   //                         setFormData(data); // save form data into state
//   //                       }}
//   //                     />
//   //                     <div className=" bottom-0 right-0 flex justify-end gap-2 p-4 flex justify-end gap-2">
//   //                       <Button
//   //                         label="Cancel"
//   //                         className="bg-gray-400 border-none text-white px-4 py-2 rounded"
//   //                         onClick={() => CloseFormDialog()}
//   //                       />
//   //                       <Button
//   //                         label="Save"
//   //                         className="bg-blue-900 border-none text-white px-4 py-2 rounded"
//   //                         onClick={() => {"handleFormSubmit()"}}
//   //                       />
//   //                     </div>
//   //                   </div>
//   //                 </TabPanel>
//   //                 {/* <TabPanel header="Submit History">
//   //                   <div style={{width: "250%"}}>
//   //                     {selectedHistory &&
//   //                       <JsonForms
//   //                         schema={formSchema}
//   //                         uischema={uiSchema}
//   //                         data={selectedHistory}
//   //                         renderers={materialRenderers}
//   //                         cells={materialCells}
//   //                         readonly
//   //                       />
//   //                     }
//   //                   </div>
//   //                 </TabPanel> */}
//   //               </TabView>
//   //             </div>
//   //           </div>
//   //         </div>
//   //       </div>
//   //     }
//   //   </div>
//   // );
//   return(
//     <div>askdjald</div>
//   )
// }

export default ApprovalGraph;