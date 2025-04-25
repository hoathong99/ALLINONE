import React, { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { LazyLoadGraphTemplate, LoadInitalTable } from '../api';
import { ScreenSetting } from '../types';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { ConfirmDialog } from 'primereact/confirmdialog';
import "./Employment.css";
import { TabPanel, TabView } from 'primereact/tabview';
import DynamicGraph from './DynamicGraph';

interface props {
  setting: ScreenSetting
}

// const TemplateCompent: React.FC<ScreenSetting> = (props: ScreenSetting) => {
//   const [dialogVisible, setDialogVisible] = useState(false);
//   const [deleteDialogVisible, setDeleteDialogVisible] = useState(false);
//   const [formData, setFormData] = useState<any>();
//   const [submissionTable, setSubmissionTable] = useState<any[]>([]);
//   const [employeeTable, setEmployeeTable] = useState<any>([]);
//   const [initalSetting, setInitalSetting] = useState<any>(props);
//   const [formSchema, setFormSchema] = useState<any>();
//   const [flowGraphMode, setflowGraphMode] = useState<string>("CREATE");
//   const [uiSchema, setUiSchema] = useState<any>();
//   const [graphNode, setGraphNode] = useState<GraphNodeData>();
//   const [deleteObject, setDeleteObject] = useState<EmployeeTableItem>();
//   const toast = useRef<Toast>(null);
//   const [graphData, setgraphData] = useState<any>(null);
//   const [graphTable, setgraphTable] = useState<any>([]);
//   const [tableGraphDialogSetting, setTableGraphDialog] = useState<any>();

//   const statusGroup = (rowData: EmployeeTableItem) => (
//     <span className={`px-2 py-1 text-white text-sm rounded font-bold ${rowData.status === 'Active' ? 'bg-green-600' : 'bg-gray-500'}`}>
//       {rowData.status}
//     </span>
//   );

//   const actionGroup = (rowData: EmployeeTableItem) => {
//     // let submission = submissionTable.find((i) => i.data.id == rowData.submissionId);
//     return (
//       <div className="flex gap-2" style={{ justifyContent: "left", justifyItems: "left" }}>
//         <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" style={{ backgroundColor: "#ffc107", borderRadius: "5px", justifyContent: "left", justifyItems: "left" }} onClick={() => {
//           // setFormData(submission.data.data);
//           setflowGraphMode("EDIT");
//           // setgrapphData(null);
//           setDialogVisible(true);
//         }} />
//         <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" style={{ backgroundColor: "#dc3545", borderRadius: "5px", justifyContent: "left", justifyItems: "left", color: "white" }} onClick={() => OpenDeleteDialog(rowData)} />
//       </div>
//     );
//   }

//   const actionGroupTable2 = (rowData: any) => {
//     // let submission = submissionTable.find((i) => i.data.id == rowData.submissionId);
//     return (
//       <div className="flex gap-2" style={{ justifyContent: "left", justifyItems: "left" }}>
//         <Button label="Edit" icon="pi pi-pencil" className="p-button-sm p-button-warning" style={{ backgroundColor: "#ffc107", borderRadius: "5px", justifyContent: "left", justifyItems: "left" }} onClick={() => {
//           // setFormData(submission.data.data);
//           setflowGraphMode("EDIT");
//           setgraphData(rowData);
//           setDialogVisible(true);
//         }} />
//         <Button label="Delete" icon="pi pi-trash" className="p-button-sm p-button-danger" style={{ backgroundColor: "#dc3545", borderRadius: "5px", justifyContent: "left", justifyItems: "left", color: "white" }} onClick={() => OpenDeleteDialog(rowData)} />
//       </div>
//     );
//   }

//   const OpenCreateFlowGraphDialog = () => {
//     setgraphData(null);
//     setDialogVisible(true);
//   }

//   const OpenEditFlowGraphDialog = () => {
//     setflowGraphMode("EDIT");
//     setDialogVisible(true);
//   }

//   const handleFormSubmit = () => {
//     console.log(formData);
//     let submitData = {
//       id: `${props.requestId}-${Date.now()}`,
//       type: graphNode?.type,
//       data: formData,
//       timestamp: new Date().toISOString(),
//     };
//     SubmitForm(submitData, props.nodeId);
//     ShowToast("submitting....");
//     setDialogVisible(false);
//     FetchEmployeeTable();
//   }

//   useEffect(() => {
//     LazyLoadNodeSchema(props.loader, props.requestId).then((data: GraphNodeData) => {
//       setFormSchema(data?.dataSchema?.formSchema);
//       setUiSchema(data?.dataSchema?.uiSchema);
//       setGraphNode(data);
//     });
//     FetchSubmission(props.nodeId).then((data) => {
//       setSubmissionTable(data);
//     });
//     FetchEmployeeTable();
//     FetchGraphs();
//   }, [initalSetting])

//   useEffect(() => {

//   }, [submissionTable])

//   const FetchEmployeeTable = () => {
//     FetchEmployee("loader...").then((data) => {
//       setSubmissionTable(data);
//       let employees: EmployeeTableItem[] = data.map((item: any) => {
//         return {
//           id: item.id,
//           employeeCode: item.basicInfo.employeeCode,
//           fullName: item.basicInfo.fullName,
//           birthDate: item.basicInfo.birthDate,
//           gender : item.basicInfo.gender,
//           hometown: item.basicInfo.hometown,
//           workStartDate: item.basicInfo.workStartDate,
//           department: item.basicInfo.department,
//           manager: item.basicInfo.manager,
//           laborType: item.basicInfo.laborType,
//           status:item.status
//         }
//       })
//       setEmployeeTable(employees);
//     })
//   }

//   const FetchGraphs = () => {
//     FetchGraphTable("loader...").then((data) => {
//       setgraphTable(data);
//       // let employees: EmployeeTableItem[] = data.map((item: any) => {
//       //   const basic = item.basicInfo.basicInfo;
//       //   console.log(basic);
//       //   return{
//       //     id : item._id ? item._id:"undefined",
//       //     employeeCode: basic?.employeeCode ? basic?.employeeCode:"undefined",
//       //     fullName: basic?.fullName ? basic?.fullName:"undefined",
//       //     department: basic?.department ? basic?.department:"undefined",
//       //     role: basic?.role ? basic?.role:"undefined",
//       //     status: item.status ? item.status:"unavaible",
//       //     submissionId: basic?.submissionId ? basic?.submissionId:"undefined",
//       //   }
//       // })
//       // console.log(employees);
//       // setEmployeeTable(employees);
//     })
//   }

//   const RefreshPage = () => {
//     FetchEmployeeTable();
//     FetchGraphs();
//     setgraphData(null);
//     console.log("refresh");
//   }

//   const ShowToast = (message: string) => {
//     toast.current?.show({
//       severity: 'info',
//       summary: 'Notice',
//       detail: message,
//       life: 500
//     });
//   };

//   const accept = (rowData?: EmployeeTableItem) => {
//     if (rowData) {
//       toast.current?.show({ severity: 'info', summary: 'Confirmed', detail: 'deleting...', life: 500 });
//       console.log(rowData);
//       DeleteSubmission(rowData.id);
//       FetchEmployeeTable();
//     }
//   }

//   const OpenDeleteDialog = (rowData: EmployeeTableItem) => {
//     setDeleteObject(rowData);
//     setDeleteDialogVisible(true);
//   }

//   const DialogWindowHeader = (
//     <div
//       style={{
//         display: 'flex',
//         justifyContent: 'left',
//         alignItems: 'center',
//         gap: "2rem"
//       }}
//     >
//       <span>PROCESS FLOW PREVIEW</span>
//     </div>
//   );



//   return (
//     <div className="d-flex">
//       <div className="card flex justify-content-center">
//         <Toast ref={toast} />
//       </div>
//       {/* Main Content */}
//       <div style={{width:"100%", padding:"2rem"}}>
//         <h2 style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500" }}>Employee Management</h2>
//         <div className="d-flex justify-content-between align-items-center my-3">
//           <div className="d-flex gap-2">
//             <input type="text" className="form-control" placeholder="Search employees..." />
//             <select className="form-select">
//               <option value="">All Departments</option>
//               <option>IT</option>
//               <option>Finance</option>
//             </select>
//             <select className="form-select">
//               <option value="">All Roles</option>
//               <option>Engineer</option>
//               <option>Analyst</option>
//             </select>
//           </div>
//           <div style={{display:"flex", gap:"5px"}}>
//           <button className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }} onClick={() => OpenCreateFlowGraphDialog()}>+ ADD EMPLOYEE</button>
//           </div>
//         </div>
//         <div className="card shadow-sm">
//           <TabView >
//             <TabPanel header="Employee">
//               <div className="card-body">
//                 {/* <DataTable value={employeeTable} paginator rows={10} className="p-datatable-sm">
//                   <Column field="employeeCode" header="#" style={{ width: '5%' }} />
//                   <Column field="fullName" header="Full Name" />
//                   <Column field="department" header="Department" />
//                   <Column field="role" header="Role" />
//                   <Column header="Status" body={statusGroup} />
//                   <Column header="Actions" body={actionGroup} style={{ width: '20%' }} />
//                 </DataTable> */}
//                 <DataTable value={employeeTable} paginator rows={10} className="p-datatable-sm">
//                   <Column field="employeeCode" header="Mã nhân sự" headerStyle={{ width: '7em' }}/>
//                   <Column field="fullName" header="Họ tên" />
//                   <Column field="birthDate" header="Ngày sinh" />
//                   <Column field="gender" header="Giới tính" />
//                   <Column field="hometown" header="Nguyên quán" />
//                   <Column field="workStartDate" header="Ngày vào" />
//                   <Column field="department" header="Phòng ban" />
//                   <Column field="manager" header="Người QL trực tiếp" />
//                   <Column field="laborType" header="Loại lao động" />
//                   <Column field="status" header="trạng thái" body={statusGroup}/>
//                   <Column
//                     header="Hành động"
//                     body={actionGroup}
//                     style={{ textAlign: 'center', width: '20%' }}
//                   />
//                 </DataTable>
//               </div>
//             </TabPanel>
//             {/* <TabPanel header="Process">
//               <DataTable value={graphTable} paginator rows={10} className="p-datatable-sm">
//                 <Column field="_id" header="#" style={{ width: '5%' }} />
//                 <Column field="graphId" header="Role" />
//                 <Column field="domain" header="Domain" />
//                 <Column header="Status" body={statusGroup} />
//                 <Column header="Actions" body={actionGroupTable2} style={{ width: '20%' }} />
//               </DataTable>
//             </TabPanel> */}
//           </TabView>
//         </div>
//       </div>
//       <Dialog header={DialogWindowHeader} visible={dialogVisible} style={{ width: '90vw', height:"90vh" }} onHide={() => { if (!dialogVisible) return; setDialogVisible(false); }}>
//           <TemplateGraph
//           graphId={props.graphTemplateId}
//           requestId={props.requestId}
//           mode={flowGraphMode}
//           graphData={graphData}
//         />
//       </Dialog>
//       <ConfirmDialog />
//       <Dialog
//         visible={deleteDialogVisible}
//         onHide={() => setDeleteDialogVisible(false)}
//         header={null}
//         closable={false}
//         modal
//         style={{ width: '25rem', borderRadius: '6px', overflow: 'hidden', margin: "0", padding: "0" }}
//         contentStyle={{ padding: "0", margin: "0" }}
//         className="no-header-dialog" // remove padding via class
//       >
//         <div
//           style={{
//             backgroundColor: '#dc3545',
//             color: 'white',
//             padding: '1rem',
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             fontWeight: 'bold',
//             fontSize: '1.1rem',
//           }}
//         >
//           <span>Confirm Deletion</span>
//           <button
//             onClick={() => setDeleteDialogVisible(false)}
//             style={{
//               background: 'none',
//               border: 'none',
//               color: 'white',
//               fontSize: '1.2rem',
//               cursor: 'pointer',
//             }}
//           >
//             &times;
//           </button>
//         </div>
//         <div style={{ padding: '1rem' }}>
//           <p>Are you sure you want to delete this employee?</p>
//         </div>

//         <div style={{ borderTop: '1px solid #eee' }}></div>

//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'flex-end',
//             gap: '0.5rem',
//             padding: '1rem',
//           }}
//         >
//           <Button
//             label="Cancel"
//             style={{ backgroundColor: "#6c757d", color: "white", borderRadius: "5px", height: "2rem" }}
//             onClick={() => setDeleteDialogVisible(false)} />
//           <Button
//             label="Delete"
//             style={{ backgroundColor: "#dc3545", color: "white", borderRadius: "5px", height: "2rem" }}
//             onClick={() => {
//               accept(deleteObject);
//               setDeleteDialogVisible(false);
//             }}
//           />
//         </div>
//       </Dialog>
//     </div>
//   );
// };

function TemplateComponent (props: props) {
  const [loading, setLoading] = useState(true); 
  const [setting] = useState<ScreenSetting>(props.setting); 
  const [dialogVisible, setDialogVisible] = useState(false);
  const [graphData, setGraphData] = useState<any>();
  const [tableData, setTableData] = useState<any>();
  const [selectedRowData, setSelectedRowData] = useState<any>();
  const toast = useRef<Toast>(null);
  
  useEffect(() => {
    LoadInitalTable(setting.requestId,setting.n8nLoader).then((data)=>{
      setTableData(data);
      setLoading(false);
      console.log(data);
    })
  },[])

  const ShowToast = (message: string) => {
    toast.current?.show({
      severity: 'info',
      summary: 'Notice',
      detail: message,
      life: 500
    });
  };

  const OpenDialog = () => {
    setDialogVisible(true);
  }

  const CloseDialog = () =>{
    setGraphData(null);
    setDialogVisible(false);
  }

  const OnClickProcessbutton = async (n8nLoader?:string, requestId?: string) =>{
    if(n8nLoader&&requestId){
      LazyLoadGraphTemplate(n8nLoader,requestId).then((data) => setGraphData(data));
      OpenDialog();
    }
  }

  const OnClickTableAction = async (data?: any, n8nLoader?:string, requestId?: string) =>{
    if(data&&n8nLoader&&requestId){
      LazyLoadGraphTemplate(n8nLoader,requestId).then((data) => setGraphData(data));
      setSelectedRowData(data);
      OpenDialog();
    }
  }

  const Table = (data: any, headers: Array<string>, displayAttribute: Array<string>) => {
    return (
      <div className="card">
        <DataTable value={data} paginator rows={10} responsiveLayout="scroll">
          {displayAttribute.map((attr, index) => (
            <Column
              key={index}
              field={attr}
              header={headers[index]}
              sortable
            />
          ))}
          <Column
            header="Actions"
            body={actionGroup}
            style={{ textAlign: 'center', width: '20%' }}
          />
        </DataTable>
      </div>
    );
  }

  const actionGroup = (rowData: any) => {
    return (
      <div className="flex gap-2" style={{ justifyContent: "left", justifyItems: "left" }}>
        {
          setting.tableActions.map((attr, index) => (
            <Button label={attr.name}
              style={{
                backgroundColor: "#1b3e96",
                borderRadius: "5px",
                justifyContent: "left",
                justifyItems: "left",
                color:"white"
              }}
              onClick={() => {
                OnClickTableAction(rowData, attr.toN8nLoader, attr.requestId);
              }} />
          ))
        }
      </div>
    );
  }

  const HeaderActions = () => {
    return(
      <div>
        {setting.headerActions.map((attr, index) => (
          <button className="btn btn-theme" data-bs-toggle="modal" style={{ backgroundColor: "#1f2c64", color: "white" }} onClick={() => OnClickProcessbutton(attr.toN8nLoader, attr.requestId)}>{attr.name}</button>
        ))
        }
      </div>
    )
  }


  return (
    <div className="d-flex">
      <div className="card flex justify-content-center">
        <Toast ref={toast} />
      </div>
      {/* Main Content */}
      <div style={{width:"100%", padding:"2rem"}}>
        <h2 style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500" }}>{setting.screenHeader}</h2>
        <div className="d-flex justify-content-between align-items-center my-3">
          <div style={{display:"flex", gap:"5px"}}>
          {/* <button className="btn btn-theme" data-bs-toggle="modal" data-bs-target="#employeeModal" style={{ backgroundColor: "#1f2c64", color: "white" }} onClick={() => {}}>+ ADD EMPLOYEE</button> */}
          {setting.tableActions&&(HeaderActions())}
          </div>
        </div>
        <div className="card shadow-sm">
          <TabView >
            <TabPanel header="Employee">
              <div className="card-body">
                {loading ? (
                  <p>Loading table data...</p> // or show spinner
                ) : (
                  Table(tableData, setting.tableSchema.row, setting.tableSchema.rowAttribute)
                )}
              </div>
            </TabPanel>
          </TabView>
        </div>
      </div>
      <Dialog header={setting.screenHeader} visible={dialogVisible} style={{ width: '90vw', height:"90vh" }} onHide={() => {CloseDialog()}}>
          <DynamicGraph graphData={graphData}/>
      </Dialog>
    </div>
  );
}

export default TemplateComponent;
