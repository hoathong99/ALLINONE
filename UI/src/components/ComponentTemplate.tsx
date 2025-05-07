import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { LazyLoadGraphTemplate,  LoadResource } from '../api';
import {CustomButton, ScreenSettingV2, TableSetting } from '../types';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "./Employment.css";
import { TabPanel, TabView } from 'primereact/tabview';
import DynamicGraph from './DynamicGraph';
interface props {
  setting: ScreenSettingV2
}

function TemplateComponent (props: props) {
  const [loading, setLoading] = useState(true); 
  const [setting, setSetting] = useState<ScreenSettingV2>(props.setting); 
  const [dialogVisible, setDialogVisible] = useState(false);
  const [graphData, setGraphData] = useState<any>();
  const [tableData, setTableData] = useState<any>();
  const [currentTableButtonSetting, setCurrentTableButtonSetting] = useState<any>();
  const [selectedRowData, setSelectedRowData] = useState<any>(null);
  const toast = useRef<Toast>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(()=>{
    setTableData(null);
    setGraphData(null);
    setSetting(props.setting);
  },[props.setting])

  useEffect(() => {
    if(props.setting.tables)
    LoadResources(props.setting.tables[activeIndex].requestId, props.setting.tables[activeIndex].n8nLoader);
  },[activeIndex])

  const LoadResources = async (requestId: string, n8nLoader: string) =>{
    setLoading(true);
    LoadResource(requestId,n8nLoader).then((data : any)=>{
      if(!data.error){
        setTableData(data);
        setLoading(false);
        console.log(data);
      }else{
        ShowToast(data.error);
      }
    })
  }

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
    setSelectedRowData(null);
    setGraphData(null);
    setDialogVisible(false);
  }

  const OnClickProcessbutton = async (n8nLoader?:string, requestId?: string) =>{
    if(n8nLoader&&requestId){
      LazyLoadGraphTemplate(n8nLoader,requestId).then((data) => setGraphData(data));
      OpenDialog();
    }
  }

  const OnClickTableAction = async (buttonSetting: CustomButton, data?: any, ) =>{
    if(data&&buttonSetting.toN8nLoader&&buttonSetting.requestId){
      console.log("row data", data);
      LazyLoadGraphTemplate(buttonSetting.toN8nLoader, buttonSetting.requestId).then((graph) => setGraphData(graph));
      // LoadResource(requestId,n8nLoader,data).then((graph) => setGraphData(graph));
      setSelectedRowData(data);
      setCurrentTableButtonSetting({rqId: buttonSetting.resourceRequestId, loader:buttonSetting.toN8nLoader});
      OpenDialog();
    }
  }

  const OnClickOpenProcess = (data: any) =>{
    console.log("open", data);
    setGraphData(data);
    OpenDialog();
  }

  const Tabs = (tables: TableSetting[]) => {
    if (tables) {
      return (
        <TabView activeIndex={activeIndex} onTabChange={(e) => setActiveIndex(e.index)} >
          {tables.map((item, index) => (
            <TabPanel header={item.header} key={index}>
              <div className="card-body">
                {loading ? (
                  <p>Loading table data...</p> // or show spinner
                ) : (
                  Table(tableData, item)
                )}
              </div>
            </TabPanel>
          ))}
        </TabView>
      )
    }
  }

  const Table = (data: any, tableSetting: TableSetting ) => {
    const actionGroup = (rowData: any) => {
      return (
        <div className="flex gap-2" style={{ justifyContent: "left", justifyItems: "left" }}>
          {tableSetting.tableActions.map((attr, index) => {
            switch (attr.type) {
              case 'new_process':
                return (
                  <Button
                    key={index}
                    label={attr.name}
                    style={{
                      backgroundColor: "#1b3e96",
                      borderRadius: "5px",
                      color: "white",
                    }}
                    onClick={() => {
                      OnClickTableAction(attr,rowData);
                    }}
                  />
                );

              case 'open_process':
                return (
                  <Button
                    key={index}
                    label={attr.name}
                    style={{
                      backgroundColor: "#1b3e96", // red color
                      borderRadius: "5px",
                      color: "white",
                    }}
                    onClick={() => {
                      OnClickOpenProcess(rowData);
                    }}
                  />
                );

              case 'link':
                return (
                  <a
                    key={index}
                    href={attr.link}
                    style={{
                      color: "#1b3e96",
                      textDecoration: "underline",
                      borderRadius: "5px",
                    }}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {attr.name}
                  </a>
                );

              default:
                return (
                  <span>some think wong</span>
                );
            }
          })}
        </div>
      );
    }
    return (
      <div className="card">
        <DataTable value={data} paginator rows={10} responsiveLayout="scroll">
          {tableSetting.tableSchema.rowAttribute.map((attr, index) => (
            <Column
              key={index}
              field={attr}
              header={tableSetting.tableSchema.row[index]}
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
      <div style={{width:"100%", padding:"2rem"}}>
        <h2 style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500" }}>{setting.screenHeader}</h2>
        <div className="d-flex justify-content-between align-items-center my-3">
          <div style={{display:"flex", gap:"5px"}}>
          {setting.headerActions&&(HeaderActions())}
          </div>
        </div>
        <div className="card shadow-sm">
          {props.setting.tables&&(
            Tabs(props.setting.tables)
          )}
        </div>
      </div>
      <Dialog header={setting.screenHeader} visible={dialogVisible} style={{ width: '90vw', height: "90vh" }} onHide={() => { CloseDialog() }}>
        <DynamicGraph
          graphData={graphData}
          attachmentData={selectedRowData}
          TableButtonSetting={currentTableButtonSetting}
        />
      </Dialog>
    </div>
  );
}

export default TemplateComponent;
