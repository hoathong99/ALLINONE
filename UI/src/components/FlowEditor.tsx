import React, { useCallback, useState } from 'react';
import ReactFlow, {
  addEdge,
  Background,
  Controls,
  MiniMap,
  ConnectionLineType,
  MarkerType,
  useNodesState,
  useEdgesState,
  ReactFlowProvider,
} from 'reactflow';
import 'reactflow/dist/style.css';

import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

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
  actorRole?: string;
  status?: string;
  customAuthorized?: [];
  filedBy?: string;
  triggers: Array<{
    eventId: string;
    triggerType: string;
  }>;
  require?: Array<string>;
}

const initialGraphData: GraphDataLazyLoad = {
  graphId: 'default-graph',
  domain: 'default-domain',
  status: 'draft',
  definition: { events: [] },
  history: [],
  currentEvent: '',
};

let id = 0;
const getId = () => `node_${id++}`;

const FlowEditor = ({ initialData }: { initialData?: GraphDataLazyLoad }) => {
  const [graphData, setGraphData] = useState<GraphDataLazyLoad>(initialData || initialGraphData);
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const [selectedNode, setSelectedNode] = useState<any>(null);
  const [showDialog, setShowDialog] = useState(false);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const handleAddNode = () => {
    const newId = getId();
    const newNode: GraphNodeData = {
      eventId: newId,
      type: 'default',
      dataSchema: {},
      triggers: [],
    };
    setGraphData((prev) => ({
      ...prev,
      definition: {
        events: [...prev.definition.events, newNode],
      },
    }));
    setNodes((nds) => [
      ...nds,
      {
        id: newId,
        data: { label: newId },
        position: { x: Math.random() * 300, y: Math.random() * 300 },
      },
    ]);
  };

  const handleExport = () => {

  }

  const handleDeleteNode = (nodeId: string) => {
    setGraphData((prev) => ({
      ...prev,
      definition: {
        events: prev.definition.events.filter((e) => e.eventId !== nodeId),
      },
    }));
    setNodes((nds) => nds.filter((n) => n.id !== nodeId));
    setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
  };

  const handleSaveNode = (updated: GraphNodeData) => {
    setGraphData((prev) => ({
      ...prev,
      definition: {
        events: prev.definition.events.map((e) => (e.eventId === updated.eventId ? updated : e)),
      },
    }));
    setNodes((nds) =>
      nds.map((n) =>
        n.id === updated.eventId ? { ...n, data: { label: updated.eventId } } : n
      )
    );
    setShowDialog(false);
  };

  const onConnect = useCallback((params: any) => {
    const label = prompt('Trigger name (e.g., submit, approve):');
    if (!label) return;

    setEdges((eds) =>
      addEdge(
        {
          ...params,
          label,
          markerEnd: {
            type: MarkerType.ArrowClosed,
          },
          type: 'smoothstep',
        },
        eds
      )
    );

    setGraphData((prev) => ({
      ...prev,
      definition: {
        events: prev.definition.events.map((node) => {
          if (node.eventId === params.source) {
            return {
              ...node,
              triggers: [
                ...(node.triggers || []),
                {
                  eventId: params.target,
                  triggerType: label,
                },
              ],
            };
          }
          return node;
        }),
      },
    }));
  }, [setEdges]);

  return (
    <div style={{ height: '100vh' }}>
      <ReactFlowProvider>
        <Button label="Add Node" onClick={handleAddNode} className="p-mb-2" />
        <Button label="Export" onClick={handleAddNode} className="p-mb-2" />
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          connectionLineType={ConnectionLineType.SmoothStep}
          fitView
          onNodeDoubleClick={(_, node) => {
            const data = graphData.definition.events.find((e) => e.eventId === node.id);
            if (data) {
              setSelectedNode(data);
              setShowDialog(true);
            }
          }}
        >
          <Background />
          <MiniMap />
          <Controls />
        </ReactFlow>

        <Dialog
          header="Edit Node"
          visible={showDialog}
          style={{ width: '30vw' }}
          onHide={() => setShowDialog(false)}
        >
          {selectedNode && (
            <div className="p-fluid">
              <label>Event ID</label>
              <InputText
                value={selectedNode.eventId}
                onChange={(e) =>
                  setSelectedNode((n: any) => ({ ...n, eventId: e.target.value }))
                }
              />
              <label>Type</label>
              <InputText
                value={selectedNode.type}
                onChange={(e) =>
                  setSelectedNode((n: any) => ({ ...n, type: e.target.value }))
                }
              />
              <Button
                label="Save"
                onClick={() => handleSaveNode(selectedNode)}
                className="p-mt-3"
              />
              <Button
                label="Delete Node"
                className="p-button-danger p-ml-2"
                onClick={() => {
                  handleDeleteNode(selectedNode.eventId);
                  setShowDialog(false);
                }}
              />
            </div>
          )}
        </Dialog>
      </ReactFlowProvider>
    </div>
  );
};

export default FlowEditor;