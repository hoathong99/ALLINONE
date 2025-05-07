import { useEffect, useRef, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { LazyLoadGraphTemplate, LoadResource } from '../api';
import { CustomButton, ScreenSettingV2, TableSetting } from '../types';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import "./Employment.css";
import { TabPanel, TabView } from 'primereact/tabview';
import DynamicGraph from './DynamicGraph';
import 'primeicons/primeicons.css';
import { InputText } from 'primereact/inputtext';
import { FloatLabel } from 'primereact/floatlabel';

const ScreenSetting: ScreenSettingV2 = {
    screenHeader: 'PAGE HEADER',
    headerActions: [],
    tables: [
        {
            header: '',
            requestId: '',
            n8nLoader: '',
            tableActions: [],
            tableSchema: {
                row: [],
                rowAttribute: []
            }
        }
    ]
};

function TemplateComponentGenerator() {
    const [editingHeader, setEditingHeader] = useState(false);
    const [tempHeader, setTempHeader] = useState(ScreenSetting.screenHeader);
    const [settingState, setSettingState] = useState<ScreenSettingV2>(ScreenSetting); // for modifying setting
    const [loading, setLoading] = useState(true);
    const [setting, setSetting] = useState<ScreenSettingV2>(ScreenSetting);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [setupDialoVisible, setSetupDialoVisible] = useState(false);
    const [setupTableDialoVisible, setSetupTableDialoVisible] = useState(false);
    const [graphData, setGraphData] = useState<any>();
    const [tableData, setTableData] = useState<any>();
    const [tempoTableSetting, setTempoTableSetting] = useState<any>();
    const [selectedRowData, setSelectedRowData] = useState<any>(null);
    const toast = useRef<Toast>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const [loader, setLoader] = useState("");
    const [requestId, setRequestId] = useState("");
    const [buttonName, setButtonName] = useState("");
    const [buttonType, setButtonType] = useState("");

    useEffect(() => {
        if (setting.tables)
            LoadResources(setting.tables[activeIndex].requestId, setting.tables[activeIndex].n8nLoader);
    }, [activeIndex])

    useEffect(() => {
        setSetting(settingState);
    }, [settingState])

    const LoadResources = async (requestId: string, n8nLoader: string) => {
        setLoading(true);
        // LoadResource(requestId, n8nLoader).then((data: any) => {
        //     if (!data.error) {
        //         setTableData(data);
        //         setLoading(false);
        //         console.log(data);
        //     } else {
        //         ShowToast(data.error);
        //     }
        // })
    }

    const ShowToast = (message: string) => {
        toast.current?.show({
            severity: 'info',
            summary: 'Notice',
            detail: message,
            life: 500
        });
    }

    const OpenDialog = () => {
        setDialogVisible(true);
    }

    const CloseDialog = () => {
        setSelectedRowData(null);
        setGraphData(null);
        setDialogVisible(false);
    }

    const OnClickProcessbutton = async (n8nLoader?: string, requestId?: string) => {
        if (n8nLoader && requestId) {
            LazyLoadGraphTemplate(n8nLoader, requestId).then((data) => setGraphData(data));
            OpenDialog();
        }
    }

    const OnClickTableAction = async (data?: any, n8nLoader?: string, requestId?: string) => {
        if (data && n8nLoader && requestId) {
            console.log("row data", data);
            LazyLoadGraphTemplate(n8nLoader, requestId).then((graph) => setGraphData(graph));
            setSelectedRowData(data);
            OpenDialog();
        }
    }

    const OnClickOpenProcess = (data: any) => {
        console.log("open", data);
        setGraphData(data);
        OpenDialog();
    }

    const Tabs = (tables: TableSetting[]) => {
        const handleTabChange = (e: any) => {
            if (e.index === tables.length) {
                setSetupTableDialoVisible(true);
                return;
            }
            setActiveIndex(e.index);
        };

        if (tables) {
            return (
                <TabView activeIndex={activeIndex} onTabChange={handleTabChange}>
                    {tables.map((item, index) => (
                        <TabPanel header={item.header} key={index}>
                            <div className="card-body">
                                {loading ? (
                                    <p>Loading table data...</p>
                                ) : (
                                    Table(tableData, item)
                                )}
                            </div>
                        </TabPanel>
                    ))}
                    {/* Extra tab for "+" */}
                    <TabPanel header={<span style={{ fontWeight: "bold" }}>＋</span>} key="add-tab" />
                </TabView>
            );
        }
    };

    const Table = (data: any, tableSetting: TableSetting) => {
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
                                            OnClickTableAction(rowData, attr.toN8nLoader, attr.requestId);
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
        return (
            <div>
                {setting.headerActions.map((attr, index) => (
                    <button className="btn btn-theme" data-bs-toggle="modal" style={{ backgroundColor: "#1f2c64", color: "white" }} onClick={() => OnClickProcessbutton(attr.toN8nLoader, attr.requestId)}>{attr.name}</button>
                ))
                }
            </div>
        )
    }

    const StartEditHeader = () => {
        setTempHeader(settingState.screenHeader);
        setEditingHeader(true);
    };

    const CancelEditHeader = () => {
        setEditingHeader(false);
    };

    const ApplyEditHeader = () => {
        if (tempHeader != "") {
            setSettingState(prev => ({
                ...prev,
                screenHeader: tempHeader
            }));
        }
        setEditingHeader(false);
    };

    const OpenAddPrimaryButtonDialog = () => {
        setSetupDialoVisible(true);
    }

    const SaveFunctionButton = () => {
        let button : CustomButton = {
            name: buttonName,
            type: buttonType,
            requestId: requestId,
            toN8nLoader: loader,
        }

        setSettingState(prev => ({
            ...prev,
            headerActions: [...prev.headerActions, button]
        }));

        setSetting(settingState);
        CloseButtonSetUp();
    }

    const CloseButtonSetUp = () => {
        setLoader("");
        setRequestId("");
        setButtonName("");
        setButtonType("");
        setSetupDialoVisible(false);
    }

    return (
        <div className="d-flex">
            <div className="card flex justify-content-center">
                <Toast ref={toast} />
            </div>
            <div style={{ width: "100%", padding: "2rem" }}>
                <div className="d-flex align-items-center justify-content-between mb-3">
                    {editingHeader ? (
                        <input
                            required
                            type="text"
                            value={tempHeader}
                            onChange={(e) => setTempHeader(e.target.value)}
                            style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500", width: '100%', marginRight: '1rem' }}
                        />
                    ) : (
                        <h2 style={{ fontSize: "calc(1.325rem + .9vw)", fontWeight: "500" }}>
                            {settingState.screenHeader}
                        </h2>
                    )}

                    <div style={{ display: 'flex', gap: '5px' }}>
                        {editingHeader ? (
                            <>
                                <Button
                                    className="pi pi-check"
                                    onClick={ApplyEditHeader}
                                />
                                <Button
                                    className="pi pi-times"
                                    onClick={CancelEditHeader}
                                />
                            </>
                        ) : (
                            <Button
                                className="pi pi-pencil"
                                onClick={StartEditHeader}
                            />
                        )}
                    </div>
                </div>

                <div className="d-flex justify-content-between align-items-center my-3">
                    <div style={{ display: "flex", gap: "5px" }}>
                        {setting.headerActions && (HeaderActions())}
                        <Button
                            className="pi pi-plus-circle"
                            onClick={() => OpenAddPrimaryButtonDialog()}
                        />
                    </div>
                </div>
                <div className="card shadow-sm">
                    {setting.tables && (
                        Tabs(setting.tables)
                    )}
                </div>
            </div>
            <Dialog header={setting.screenHeader} visible={dialogVisible} style={{ width: '90vw', height: "90vh" }} onHide={() => { CloseDialog() }}>
                <DynamicGraph graphData={graphData} attachmentData={selectedRowData} />
            </Dialog>
            <Dialog header="Setup Main Button" visible={setupDialoVisible} style={{ width: '90vw', height: "90vh" }} onHide={() => { setSetupDialoVisible(false) }}>
                <div style={{ margin: "1rem" }}>
                    <FloatLabel>
                        <InputText id="requestId" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
                        <label htmlFor="requestId">Request ID</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="loader" value={loader} onChange={(e) => setLoader(e.target.value)} />
                        <label htmlFor="loader">Loader</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="buttonName" value={buttonName} onChange={(e) => setButtonName(e.target.value)} />
                        <label htmlFor="buttonName">Name</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="buttonType" value={buttonType} onChange={(e) => setButtonType(e.target.value)} />
                        <label htmlFor="buttonType">Type</label>
                    </FloatLabel>
                    <Button
                        label="Test"
                        icon="pi pi-play"
                        onClick={() => { OnClickProcessbutton(loader,requestId) }}
                        className="p-button-success"
                        style={{ marginTop: "1rem" }}
                    />
                    <Button
                        label="Save Button"
                        icon="pi pi-save"
                        onClick={() => { SaveFunctionButton() }}
                        className="p-button-success"
                        style={{ marginTop: "1rem" }}
                    />
                </div>
            </Dialog>
            <Dialog header="Setup Table" visible={setupTableDialoVisible} style={{ width: '90vw', height: "90vh" }} onHide={() => { setSetupTableDialoVisible(false) }}>
                <div style={{ margin: "1rem" }}>
                    <FloatLabel>
                        <InputText id="requestId" value={requestId} onChange={(e) => setRequestId(e.target.value)} />
                        <label htmlFor="requestId">Request ID</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="loader" value={loader} onChange={(e) => setLoader(e.target.value)} />
                        <label htmlFor="loader">Loader</label>
                    </FloatLabel>
                    <FloatLabel>
                        <InputText id="buttonName" value={buttonName} onChange={(e) => setButtonName(e.target.value)} />
                        <label htmlFor="buttonName">Name</label>
                    </FloatLabel>
                    <Button
                        label="Test"
                        icon="pi pi-play"
                        onClick={() => { OnClickProcessbutton(loader,requestId) }}
                        className="p-button-success"
                        style={{ marginTop: "1rem" }}
                    />
                    <Button
                        label="Save Table"
                        icon="pi pi-save"
                        onClick={() => { SaveFunctionButton() }}
                        className="p-button-success"
                        style={{ marginTop: "1rem" }}
                    />
                </div>
                <div className="card">
                    {/* <DataTable value={tableData} paginator rows={10} responsiveLayout="scroll">
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
                    </DataTable> */}
                </div>
            </Dialog>
        </div>
    );
}

export default TemplateComponentGenerator;
