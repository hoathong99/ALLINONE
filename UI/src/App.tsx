import React from 'react';
// import ApprovalGraph from './components/ApprovalGraph';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import EmployeeManagement from './components/EmployeeManagement';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/SideBar';
import FormFactory from './components/FormFactory';
import TemplateGraph from './components/GraphTemplate';
import 'bootstrap/dist/css/bootstrap.min.css';
import TemplateComponent from './components/ComponentTemplate';
import { dummyAttendanceScrenceSetting, dummyScreenSetting, dummyScreenSettingV2 } from './types';
import TemplateComponentGenerator from './components/ComponentTemplateGenerator';
import FlowEditor from './components/FlowEditor';
import DumpsterTestingGround from './components/DumpsterTestingGround';
import TestingGround from './components/DumpsterTestingGround';


function App() {
  return (
    <PrimeReactProvider>
      <Router>
        <div className="d-flex">
          <Sidebar />
          <div style={{width:"100%"}}>
          <Routes>
            <Route path="/employee" element={
              <EmployeeManagement nodeId="ER-01" requestId='get-template' loader='ER-01' graphTemplateId='graph-02'>
              </EmployeeManagement>
            } />
            <Route path="/form-factory" element={<FormFactory />} />
            <Route path="/graph-template" element={
              <TemplateGraph
                requestId='get-template'
                graphId='graph-02' 
             >
              </TemplateGraph>
            } />
            <Route path="/component-template" element={<TemplateComponent setting={dummyScreenSettingV2} />} />
            <Route path="/component-template-2" element={<TemplateComponent setting={dummyAttendanceScrenceSetting} />} />
            <Route path="/component-template-generator" element={<TemplateComponentGenerator/>} />
            <Route path="/flow-editor" element={<FlowEditor></FlowEditor>} />
            <Route path="/testing" element={<TestingGround></TestingGround>} />
          </Routes>
          </div>
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;