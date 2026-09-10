import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/authcontext";
import NotFound from "./components/common/notFound";

//Layouts
import AuthLayout from "./components/Layout/AuthLayout";
import PublicLayout from "./components/Layout/PublicLayout";
import MainLayout from "./components/Layout/MainLayout";
import Login from "./auth/Login";
import Dashboard from "./pages/Dashboard";
import HrList from "./pages/HR/HrList";
import HrForm from "./pages/HR/HrForm";

// Dynamic Sheets & Forms Modules
import SystemLogs from "./pages/Logs/SystemLogs";
import DesignationList from "./pages/Designation/DesignationList";
import DesignationFormPage from "./pages/Designation/DesignationFormPage";
import SilgateSubmissions from "./pages/Submissions/SilgateSubmissions";
import SilgateFormPage from "./pages/Submissions/SilgateFormPage";
import TalentCornerSubmissions from "./pages/Submissions/TalentCornerSubmissions";
import TalentCornerFormPage from "./pages/Submissions/TalentCornerFormPage";
import UpdateProfile from "./pages/UpdateProfile";
import TalentCornerDashboard from "./components/Dashboard/TalentCornerDashboard";

import InterviewStatusList from "./pages/InterviewStatus/InterviewStatusList"
import InterviewStatusFormPage from "./pages/InterviewStatus/InterviewStatusFormPage"
import SourceList from "./pages/Source/SourceList";
import SourceForm from "./components/Forms/SourceForm";
import SourceFormPage from "./pages/Source/SourceFormPage";
import DispositionList from "./pages/Disposition/DispositionList";
import DispositionFormPage from "./pages/Disposition/DispositionFormPage";
import UploadsList from "./pages/Uploads/UploadsList";
import CreateListForm from "./pages/Uploads/CreateListForm";
import ImportListForm from "./pages/Uploads/ImportListForm";

const RequireAuth = ({ children }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" />;
};

const AppContent = () => {
  return (
    <Routes>
      {/* ================= AUTH LAYOUT ================= */}
      <Route element={<AuthLayout />}></Route>
      <Route path="/login" element={<Login />}></Route>

      {/* ================= PUBLIC LAYOUT ================= */}
      <Route element={<PublicLayout />}>
        {/* 404 */}
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* ================= MAIN APP LAYOUT ================= */}
      <Route
        element={
          <RequireAuth>
            <MainLayout />
          </RequireAuth>
        }
      >
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/" element={<Dashboard />} />
        {/* HR */}
        <Route path="/hr" element={<HrList />} />
        <Route path="/hr/create" element={<HrForm />} />
        <Route path="/hr/create/:id" element={<HrForm />} />

        {/* Campaign Submissions Routes */}
        <Route path="/submissions/silgate" element={<SilgateSubmissions />} />
        <Route path="/submissions/silgate/create" element={<SilgateFormPage />} />
        <Route path="/submissions/silgate/edit/:id" element={<SilgateFormPage />} />

        <Route
          path="/submissions/talent-corner"
          element={<TalentCornerSubmissions />}
        />
        <Route
          path="/submissions/talent-corner/create"
          element={<TalentCornerFormPage />}
        />
        <Route
          path="/submissions/talent-corner/edit/:id"
          element={<TalentCornerFormPage />}
        />
        <Route path="/designations" element={<DesignationList />} />
        <Route path="/talent-corner" element={<TalentCornerDashboard />} />
        <Route path="/designations/create" element={<DesignationFormPage />} />
        <Route path="/designations/edit/:id" element={<DesignationFormPage />} />
        <Route path="/audit-logs" element={<SystemLogs />} />

        {/* Interview Status */}
        <Route path="/interviewstatus" element={<InterviewStatusList />} />
        <Route path="/interviewstatus/create" element={<InterviewStatusFormPage />} />
        <Route path="/interviewstatus/edit/:id" element={<InterviewStatusFormPage />} />

        {/* Sources */}
        <Route path="/sources" element={<SourceList />} />
        <Route path="/sources/create" element={<SourceFormPage />} />
        <Route path="/sources/edit/:id" element={<SourceFormPage />} />

        {/* Disposition */}
        <Route path="/disposition" element={<DispositionList />} />
        <Route path="/disposition/create" element={<DispositionFormPage />} />
        <Route path="/disposition/edit/:id" element={<DispositionFormPage />} />

        {/* Uploads */}
        <Route path="/uploads" element={<UploadsList />} />
        <Route path="/uploads/create" element={<CreateListForm />} />
        <Route path="/uploads/edit/:id" element={<CreateListForm />} />
        <Route path="/uploads/import" element={<ImportListForm />} />

        <Route path="/updateprofile" element={<UpdateProfile />} />
      </Route>
    </Routes>
  );
};

export default AppContent;
