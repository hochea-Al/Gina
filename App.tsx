
import React from 'react';
import { HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import BottomNav from './components/BottomNav';
import DashboardPage from './pages/DashboardPage';
import StockListPage from './pages/StockListPage';
import StockMovementPage from './pages/StockMovementPage';
import RequisitionListPage from './pages/RequisitionListPage';
import CreateRequisitionPage from './pages/CreateRequisitionPage';
import AttendancePage from './pages/AttendancePage';
import PrintVoucherPage from './pages/PrintVoucherPage';
import MaterialCostReportPage from './pages/MaterialCostReportPage';
import InventoryReportPage from './pages/InventoryReportPage';
import ProjectListPage from './pages/ProjectListPage';
import CreateProjectPage from './pages/CreateProjectPage';
import ProjectDetailPage from './pages/ProjectDetailPage';
import ToolListPage from './pages/ToolListPage';
import AddToolPage from './pages/AddToolPage';
import ToolDetailPage from './pages/ToolDetailPage';
import StockVisualizationPage from './pages/StockVisualizationPage'; // Import the new page

const App: React.FC = () => {
  return (
    <HashRouter>
      <Main />
    </HashRouter>
  );
};

const Main: React.FC = () => {
  const location = useLocation();
  const isPrintPage = location.pathname.startsWith('/print');

  return (
    <div className="flex flex-col h-screen font-sans">
      {!isPrintPage && <Header />}
      <main className={`flex-grow overflow-y-auto ${!isPrintPage ? 'pb-20 pt-16' : ''}`}>
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/stock" element={<StockListPage />} />
          <Route path="/stock-movement/:type" element={<StockMovementPage />} />
          <Route path="/requisitions" element={<RequisitionListPage />} />
          <Route path="/requisitions/new" element={<CreateRequisitionPage />} />
          <Route path="/projects" element={<ProjectListPage />} />
          <Route path="/projects/new" element={<CreateProjectPage />} />
          <Route path="/projects/:id" element={<ProjectDetailPage />} />
          <Route path="/tools" element={<ToolListPage />} />
          <Route path="/tools/new" element={<AddToolPage />} />
          <Route path="/tools/:id" element={<ToolDetailPage />} />
          <Route path="/attendance" element={<AttendancePage />} />
          <Route path="/costs" element={<MaterialCostReportPage />} />
          <Route path="/reports" element={<InventoryReportPage />} />
          <Route path="/stock-visualization" element={<StockVisualizationPage />} /> {/* New Route */}
          <Route path="/print/stock-exit/:id" element={<PrintVoucherPage voucherType="stock-exit"/>} />
          <Route path="/print/requisition/:id" element={<PrintVoucherPage voucherType="requisition"/>} />
        </Routes>
      </main>
      {!isPrintPage && <BottomNav />}
    </div>
  );
};

export default App;