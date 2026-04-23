import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import DashboardLayout from './layouts/DashboardLayout';
import ShohibulDashboard from './pages/shohibul/ShohibulDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import SuperAdminDashboard from './pages/super-admin/SuperAdminDashboard';
import KanbanBoard from './pages/admin/KanbanBoard';
import MustahikManagement from './pages/admin/MustahikManagement';
import ShohibulManagement from './pages/admin/ShohibulManagement';
import AnimalManagement from './pages/admin/AnimalManagement';
import Settings from './pages/admin/Settings';
import FinancialManagement from './pages/admin/FinancialManagement';
import OrganizationStructure from './pages/admin/OrganizationStructure';
import SopManagement from './pages/admin/SopManagement';
import SopDetail from './pages/admin/SopDetail';
import NotificationManagement from './pages/admin/NotificationManagement';
import DistributionManagement from './pages/admin/DistributionManagement';
import LiveMonitoring from './pages/admin/LiveMonitoring';
import LiveTracking from './pages/shohibul/LiveTracking';
import CertificateView from './pages/shohibul/CertificateView';
import PaymentUpload from './pages/shohibul/PaymentUpload';
import PanitiaDashboard from './pages/panitia/PanitiaDashboard';
import PanitiaTaskDetail from './pages/panitia/PanitiaTaskDetail';
import PenerimaStatus from './pages/penerima/PenerimaStatus';
import SupplierDashboard from './pages/supplier/SupplierDashboard';
import JagalDashboard from './pages/jagal/JagalDashboard';
import SlaughterProcess from './pages/jagal/SlaughterProcess';
import DonaturDashboard from './pages/donatur/DonaturDashboard';
import Marketplace from './pages/marketplace/Marketplace';
import Login from './pages/auth/Login';
import { RequireAuth } from './auth/RequireAuth';
import { RequireRole } from './auth/RequireRole';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        
        {/* Super Admin Routes */}
        <Route
          path="/super-admin"
          element={
            <RequireAuth>
              <RequireRole allow={['super_admin']}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<SuperAdminDashboard />} />
        </Route>

        {/* Panitia Routes (Mobile Layout) */}
        <Route
          path="/panitia"
          element={
            <RequireAuth>
              <RequireRole allow={['panitia']}>
                <PanitiaDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/panitia/task/:id"
          element={
            <RequireAuth>
              <RequireRole allow={['panitia']}>
                <PanitiaTaskDetail />
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* Penerima Routes (Public Simple Mobile View) */}
        <Route path="/penerima" element={<PenerimaStatus />} />

        {/* Supplier Routes */}
        <Route
          path="/supplier"
          element={
            <RequireAuth>
              <RequireRole allow={['supplier']}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<SupplierDashboard />} />
        </Route>

        {/* Jagal Routes (Mobile) */}
        <Route
          path="/jagal"
          element={
            <RequireAuth>
              <RequireRole allow={['jagal']}>
                <JagalDashboard />
              </RequireRole>
            </RequireAuth>
          }
        />
        <Route
          path="/jagal/process/:id"
          element={
            <RequireAuth>
              <RequireRole allow={['jagal']}>
                <SlaughterProcess />
              </RequireRole>
            </RequireAuth>
          }
        />

        {/* Donatur Routes */}
        <Route
          path="/donatur"
          element={
            <RequireAuth>
              <RequireRole allow={['shohibul']}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<DonaturDashboard />} />
        </Route>

        {/* Marketplace (Admin Perspective) */}
        <Route
          path="/admin/marketplace"
          element={
            <RequireAuth>
              <RequireRole allow={['admin_masjid']}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<Marketplace />} />
        </Route>

        {/* Shohibul Routes */}
        <Route
          path="/shohibul"
          element={
            <RequireAuth>
              <RequireRole allow={['shohibul']}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<ShohibulDashboard />} />
          <Route path="tracking/:id" element={<LiveTracking />} />
          <Route path="certificate/:id" element={<CertificateView />} />
          <Route path="payments" element={<PaymentUpload />} />
        </Route>

        {/* Admin Routes */}
        <Route
          path="/admin"
          element={
            <RequireAuth>
              <RequireRole allow={['admin_masjid']}>
                <DashboardLayout />
              </RequireRole>
            </RequireAuth>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="kanban" element={<KanbanBoard />} />
          <Route path="monitoring" element={<LiveMonitoring />} />
          <Route path="organization" element={<OrganizationStructure />} />
          <Route path="shohibul" element={<ShohibulManagement />} />
          <Route path="mustahik" element={<MustahikManagement />} />
          <Route path="hewan" element={<AnimalManagement />} />
          <Route path="finance" element={<FinancialManagement />} />
          <Route path="distribution" element={<DistributionManagement />} />
          <Route path="notifications" element={<NotificationManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="sop" element={<SopManagement />} />
          <Route path="sop/:id" element={<SopDetail />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
