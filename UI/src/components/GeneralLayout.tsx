import React from 'react';
import Sidebar from './SideBar';

const LayoutWithSidebar: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="d-flex">
      <Sidebar />
      <div style={{ width: "100%" }}>
        {children}
      </div>
    </div>
  );
};

export default LayoutWithSidebar;
