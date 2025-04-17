import React from 'react';
import ApprovalGraph from './components/ApprovalGraph';
import { PrimeReactProvider } from 'primereact/api';
import "primereact/resources/themes/md-light-indigo/theme.css";
import "primereact/resources/primereact.min.css";
import EmployeeManagement from './components/EmployeeManagement';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Sidebar from './components/SideBar';
import FormFactory from './components/FormFactory';


function App() {
  return (
    <PrimeReactProvider>
      {/* <div className="min-h-screen bg-gray-100" style={{display:"none"}}>
      <ApprovalGraph 
        graphId="approval-test-001-1234567890"
        requestId="req-001"
      />
    </div> */}
      {/* <EmployeeManagement nodeId="ER-01" requestId='get-template' loader='ER-01' graphTemplateId='graph-001'>
    </EmployeeManagement> */}
      <Router>
        <div className="d-flex">
          <Sidebar />
          <div style={{width:"100%"}}>
          <Routes>
            <Route path="/employee" element={
              <EmployeeManagement nodeId="ER-01" requestId='get-template' loader='ER-01' graphTemplateId='graph-001'>
              </EmployeeManagement>
            } />
            <Route path="/form-factory" element={<FormFactory />} />
          </Routes>
          </div>
        </div>
      </Router>
    </PrimeReactProvider>
  );
}

export default App;