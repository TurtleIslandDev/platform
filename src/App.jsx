import { BrowserRouter, Route, Routes } from "react-router-dom";
import { lazy, Suspense, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { fetchWithAuth } from "./utils/fetchWithAuth";
import { env } from "./config/env";
import AgentSystemsTraining from "./pages/agentPages/AgentSystemsTraining";
import InteractionGuidePage from "./pages/IG/InteractionGuidePage";
import AddUserSupervisor from "./pages/supervisorPages/AddUserSupervisor";
import OB_Telemarketing_ContactInfo from "./components/IG/Fastrack Marketing/Outbound/OB - Telemarketing - Contact Info/OB_Telemarketing_ContactInfo";
import useWindowHeight from "./features/hooks/useWindowHeight";
import OB_Telemarketing_No_Contact from "./components/IG/Fastrack Marketing/Outbound/OB - Telemarketing - No Contact/OB_Telemarketing_No_Contact";
import Outbound from "./components/IG/ItsBuzzmarketing/Outbound/OutBound";
import Inbound from "./components/IG/ItsBuzzmarketing/Inbound/Inbound";
import Service from "./components/IG/ItsBuzzmarketing/Service/Service";
import Client from "./components/IG/ItsBuzzmarketing/Client/Client";
import SupportPage from "./pages/Support/SupportPage";
import SupportItsBuzzMarketing from "./components/IG/ItsBuzzmarketing/Support/SupportItsBuzzMarketing";
import SupportIFasttMarketing from "./components/IG/FasTT Marketing/Support/SupportIFasttMarketing";
import AddUserProgramManager from "./pages/ProgramManagerPages/AddUserProgramManager";
import ContactInfo from "./components/IG/Fastrack Marketing/Inbound/Contact Info/ContactInfo";
import NoContact from "./components/IG/Fastrack Marketing/Inbound/No Contact/NoContact";
import ServiceFastrackMarketing from "./components/IG/Fastrack Marketing/Service/ServiceFastrackMarketing";
import AgentTraineeNavigation from "./pages/navigation/AgentTraineeNavigation";
import TraineeInteractionGuideFasTTrackOutbound from "./components/IG/TraineeInteractionGuideFasTTrackOutbound/TraineeInteractionGuideFasTTrackOutbound";
import TraineeInteractionGuideFasTTrackInbound from "./components/IG/TraineeInteractionGuideFasTTrackInbound/TraineeInteractionGuideFasTTrackInbound";
import DataNavigation from "./pages/adminPages/DataNavigation";
import Form1099 from "./components/googleDriveForms/Form1099";
import TestForm1099 from "./components/googleDriveForms/testForm";
import FormW9 from "./components/googleDriveForms/FormW9";
import HrNavigationPage from "./pages/traineePages/HR/HrNavigationPage";
import TraineeForm1099 from "./pages/traineePages/HR/Documentation/TraineeForm1099";
import TraineeFormW9 from "./pages/traineePages/HR/Documentation/TraineeFormw9";
import Roster from "./pages/adminPages/Roster";
import AvailabilityPage from "./pages/traineePages/HR/AvailabilityPage";
import UploadIdentification from "./pages/traineePages/HR/Documentation/UploadIdentification";
import DocumentationNavigationPage from "./pages/traineePages/HR/Documentation/DocumentationNavigationPage";
import OtherRolesAccessNavigation from "./pages/adminPages/OtherRolesAccessNavigation";
import PerformanceManagerNavigation from "./pages/navigation/PerformanceManagerNavigation";
import AgentLearningNavigation from "./pages/agentPages/Learning/AgentLearningNavigation";
import TraineeLearningNavigation from "./pages/traineePages/Learning/TraineeLearningNavigation";
import AgentCompensationNavigation from "./pages/agentPages/Compensation/AgentCompensationNavigation";
import AgentCertificationNavigation from "./pages/agentPages/Certification/AgentCertificationNavigation";

import UploadLeadFile from "./pages/supervisorPages/uploadLeadFile";
import JobProgressPage from "./pages/supervisorPages/page";

const BuzzWordTrainee = lazy(() =>
  import("./pages/traineePages/BuzzWordTrainee")
);
const CoachingReportAccept = lazy(() =>
  import("./pages/agentPages/CoachingReportAccept")
);
const CoachingReportSubmit = lazy(() =>
  import("./pages/supervisorPages/CoachingReportSubmit")
);
const PerformanceNavigation = lazy(() =>
  import("./pages/navigation/PerformanceNavigation")
);
const AgentNavigation = lazy(() =>
  import("./pages/navigation/AgentNavigation")
);
const AddUserNavigation = lazy(() =>
  import("./pages/navigation/AddUserNavigation")
);
const QcAndSupervisorNavigation = lazy(() =>
  import("./pages/navigation/QcAndSupervisorNavigation")
);
const ProgramManagerNavigation = lazy(() =>
  import("./pages/navigation/ProgramManagerNavigation")
);
const TeamLeadNavigation = lazy(() =>
  import("./pages/navigation/TeamLeadNavigation")
);
const ProgramOwnerNavigation = lazy(() =>
  import("./pages/navigation/ProgramOwnerNavigation")
);
const DataVendorNavigation = lazy(() =>
  import("./pages/navigation/DataVendorNavigation")
);
const BpoNavigation = lazy(() => import("./pages/navigation/BpoNavigation"));
const AdminNavigation = lazy(() =>
  import("./pages/navigation/AdminNavigation")
);
const ContactsDashboard = lazy(() =>
  import("./pages/adminPages/contactsDashboard/contacts-dashboard")
);
const ThreeCircleLayout = lazy(() =>
  import("./pages/navigation/ThreeCircleLayout")
);
const BuzzWord = lazy(() => import("./pages/supervisorPages/BuzzWord"));
const UploadDataPage = lazy(() =>
  import("./pages/supervisorPages/UploadDataPage")
);
const ChannelManagerNavigation = lazy(() =>
  import("./pages/navigation/ChannelManagerNavigation")
);
const DataManagerNavigation = lazy(() =>
  import("./pages/navigation/DataManagerNavigation")
);
const SalesManagerNavigation = lazy(() =>
  import("./pages/navigation/SalesManagerNavigation")
);
const BroadcastCustomerNavigation = lazy(() =>
  import("./pages/navigation/BroadcastCustomerNavigation")
);
const ExportDataPage = lazy(() =>
  import("./pages/navigation/ExportDataNavigation")
);
const CreateTemplatePage = lazy(() =>
  import("./pages/supervisorPages/CreateTemplatePage")
);
const LeadFormPage = lazy(() =>
  import("./pages/dataVendorPages/LeadFormPage")
);
const ShowUploads = lazy(() =>
  import("./pages/supervisorPages/showUploads")
);
const ShowJobs = lazy(() =>
  import("./pages/supervisorPages/showJobs")
);
const LeadUploads = lazy(() =>
  import("./pages/dataVendorPages/LeadUploads")
);
const ExternalVendorForm = lazy(() =>
  import("./pages/dataVendorPages/externalVendor")
);
const DNCForm = lazy(() =>
  import("./pages/agentPages/dnc-form")
);
const UploadLeadFileQueue = lazy(() =>
  import("./pages/supervisorPages/uploadLeadFileQueue.tsx")
);  
const Login = lazy(() => import("./pages/auth/Login"));
const AddUser = lazy(() => import("./pages/auth/AddUser"));
import AgentPerformanceNavigation from "./pages/agentPages/Performance/AgentPerformanceNavigation";

import { useDispatch, useSelector } from "react-redux";
import { setIpAddress } from "./features/slice/userSlice";

function App() {
  const height = useWindowHeight();
  const dispatch = useDispatch();
  const { ipAddress, username, token } = useSelector((state) => state.user);

  const AUTH_URL = env.AUTH_URL;
  
  useEffect(() => {

    const updateIPAddress = async () => {


      const response = await fetch(env.IP_CHECK_API);
      const resData = await response.json();
      if (resData.ip) {

        const ip = resData.ip;

        if (ip !== ipAddress) {
                  
          const res = await fetchWithAuth(`${AUTH_URL}/guide_auth/whitelist_ip`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
              ip: ip,
              username: username,
            }),
          });

          if (res.status === 200) {
            dispatch(setIpAddress(ip));
          }

        }
      }
    }

    if (ipAddress !== null && username !== null) {
      updateIPAddress();
    }
  }, [ipAddress, username]);

  return (
    <>
      {/* there is new react-router-version comming so if any issues faced for routing look at the new documentations */}
      <BrowserRouter>
        <Suspense
          fallback={
            <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-50">
              <div className="flex justify-center items-center mt-[50vh]">
                <div className="fas fa-circle-notch fa-spin fa-5x text-violet-600"></div>
              </div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/support" element={<SupportPage />} />
            <Route path="/admin-navigation/add-user" element={<AddUser />} />
            <Route path="/admin-navigation/roster" element={<Roster />} />
            <Route
              path="/admin-navigation/export-data"
              element={<ExportDataPage />}
            />
            <Route
              path="/admin-navigation/create-template"
              element={<CreateTemplatePage />}
            />
            <Route path="/admin-navigation/data" element={<DataNavigation />} />
            <Route
              path="/admin-navigation/buzzword-admin"
              element={<BuzzWord />}
            />
            <Route
              path="/admin-navigation/upload-lead-file"
              element={<UploadLeadFile />}
            />
            <Route
              path="/admin-navigation/upload-lead-file-queue"
              element={<UploadLeadFileQueue />}
            />
            <Route
              path="/job/:jobId"
              element={<JobProgressPage />}
            />
            <Route
              path="/admin-navigation/dnc-form"
              element={<DNCForm />}
            />
            <Route
              path="/qc-and-supervisor-navigation/buzzword-supervisor"
              element={<BuzzWord />}
            />
            <Route
              path="agent-navigation/buzzword-trainee/:id"
              element={<BuzzWordTrainee />}
            />
            <Route path="/three-circles" element={<ThreeCircleLayout />} />
            <Route path="/admin-navigation" element={<AdminNavigation />} />
            <Route
              path="/performance-manager-navigation"
              element={<PerformanceManagerNavigation />}
            />

            <Route
              path="/admin-navigation/other-roles-access"
              element={<OtherRolesAccessNavigation />}
            />
            <Route
              path="/admin-navigation/upload-data"
              element={<UploadDataPage />}
            />
            <Route 
              path="/admin-navigation/data/contacts-dashboard"
              element={<ContactsDashboard />}
            />
            <Route path="bpo-navigation" element={<BpoNavigation />} />
            <Route
              path="/data-vendor-navigation"
              element={<DataVendorNavigation />}
            />
            <Route      
              path="/data-vendor-navigation/lead-form"
              element={<LeadFormPage />}
            />
            <Route
              path="/data-vendor-navigation/lead-uploads"
              element={<LeadUploads />}
            />
            <Route
              path="/data-vendor-navigation/external-vendor"
              element={<ExternalVendorForm />}
            />
            <Route
              path="/program-owner-navigation"
              element={<ProgramOwnerNavigation />}
            />
            <Route
              path="/program-owner-navigation/add-user"
              element={<AddUser />}
            />
            <Route
              path="/team-lead-navigation"
              element={<TeamLeadNavigation />}
            />
            <Route
              path="/program-manager-navigation"
              element={<ProgramManagerNavigation />}
            />
            <Route
              path="/program-manager-navigation/add-user"
              element={<AddUserProgramManager />}
            />
            <Route
              path="/qc-and-supervisor-navigation"
              element={<QcAndSupervisorNavigation />}
            />
            <Route
              path="/qc-and-supervisor-navigation/create-template"
              element={<CreateTemplatePage />}
            />
            <Route
              path="/qc-and-supervisor-navigation/upload-data"
              element={<UploadDataPage />}
            />
            <Route
              path="/qc-and-supervisor-navigation/upload-lead-file"
              element={<UploadLeadFile />}
            />
            <Route
              path="/qc-and-supervisor-navigation/add-user"
              element={<AddUserSupervisor />}
            />
            <Route
              path="/qc-and-supervisor-navigation/show-uploads"
              element={<ShowUploads />}
            />
            <Route
              path="/qc-and-supervisor-navigation/show-jobs"
              element={<ShowJobs />}
            />
            <Route
              path="/add-user-navigation"
              element={<AddUserNavigation />}
            />
            <Route path="/agent-navigation" element={<AgentNavigation />} />
            <Route
              path="/agent-navigation/compensation"
              element={<AgentCompensationNavigation />}
            />
            <Route
              path="/agent-navigation/performance"
              element={<AgentPerformanceNavigation />}
            />
            <Route
              path="/agent-navigation/certification"
              element={<AgentCertificationNavigation />}
            />
            <Route
              path="/agent-navigation/learning"
              element={<AgentLearningNavigation />}
            />
            <Route
              path="/agent-navigation/learning/coaching-report-accept"
              element={<CoachingReportAccept />}
            />
            <Route
              path="/agent-navigation/dnc-form"
              element={<DNCForm />}
            />
            <Route
              path="/agent-trainee-navigation"
              element={<AgentTraineeNavigation />}
            />
            <Route
              path="/agent-trainee-navigation/learning"
              element={<TraineeLearningNavigation />}
            />
            <Route
              path="/agent-trainee-navigation/hr"
              element={<HrNavigationPage />}
            />
            <Route
              path="/agent-trainee-navigation/hr/availability"
              element={<AvailabilityPage />}
            />
            <Route
              path="/agent-trainee-navigation/hr/documentation"
              element={<DocumentationNavigationPage />}
            />
            <Route
              path="/agent-trainee-navigation/hr/documentation/form-1099"
              element={<TraineeForm1099 />}
            />
            <Route
              path="/agent-trainee-navigation/hr/documentation/form-w9"
              element={<TraineeFormW9 />}
            />
            <Route
              path="/agent-trainee-navigation/hr/documentation/upload-identification"
              element={<UploadIdentification />}
            />
            <Route
              path="/agent-trainee-navigation/learning/buzzword-trainee/:id"
              element={<BuzzWordTrainee />}
            />
            <Route
              path="/agent-trainee-navigation/trainee-interaction-guide-fasttrack"
              element={
                <div style={{ height: `${height}px` }}>
                  <TraineeInteractionGuideFasTTrackOutbound />
                </div>
              }
            />
            <Route
              path="/agent-trainee-navigation/trainee-interaction-guide-fasttrack/inbound"
              element={
                <div style={{ height: `${height}px` }}>
                  <TraineeInteractionGuideFasTTrackInbound />
                </div>
              }
            />
            <Route
              path="/broadcast-customer-navigation"
              element={<BroadcastCustomerNavigation />}
            />
            <Route
              path="/performance-navigation"
              element={<PerformanceNavigation />}
            />
            <Route
              path="/sales-manager-navigation"
              element={<SalesManagerNavigation />}
            />
            <Route
              path="/data-manager-navigation"
              element={<DataManagerNavigation />}
            />
            <Route
              path="/data-manager-navigation/upload-lead-file"
              element={<UploadLeadFile />}
            />
            <Route
              path="/channel-manager-navigation"
              element={<ChannelManagerNavigation />}
            />
            <Route
              path="/coaching-report-submit"
              element={<CoachingReportSubmit />}
            />
            <Route
              path="/coaching-report-accept"
              element={<CoachingReportAccept />}
            />
            <Route
              path="/agent-system-interface"
              element={<AgentSystemsTraining />}
            />
            <Route
              path="/interaction-guide"
              element={<InteractionGuidePage />}
            />
            <Route
              path="/interaction-guide/itsbuzzmarketing/outbound"
              element={
                <div style={{ height: `${height}px` }}>
                  <Outbound />
                </div>
              }
            />
            <Route
              path="/interaction-guide/itsbuzzmarketing/inbound"
              element={
                <div style={{ height: `${height}px` }}>
                  <Inbound />
                </div>
              }
            />
            <Route
              path="/interaction-guide/itsbuzzmarketing/service"
              element={
                <div style={{ height: `${height}px` }}>
                  <Service />
                </div>
              }
            />
            <Route
              path="/interaction-guide/itsbuzzmarketing/support"
              element={
                <div style={{ height: `${height}px` }}>
                  <SupportItsBuzzMarketing />
                </div>
              }
            />
            <Route
              path="/interaction-guide/itsbuzzmarketing/client"
              element={
                <div style={{ height: `${height}px` }}>
                  <Client />
                </div>
              }
            />
            <Route
              path="/interaction-guide/fastt-marketing/support"
              element={
                <div style={{ height: `${height}px` }}>
                  <SupportIFasttMarketing />
                </div>
              }
            />
            <Route
              path="/interaction-guide/fastrack-marketing/service"
              element={
                <div style={{ height: `${height}px` }}>
                  <ServiceFastrackMarketing />
                </div>
              }
            />
            <Route
              path="/interaction-guide/fastrack-marketing/inbound/contact-info"
              element={
                <div style={{ height: `${height}px` }}>
                  <ContactInfo />
                </div>
              }
            />
            <Route
              path="/interaction-guide/fastrack-marketing/inbound/no-contact"
              element={
                <div style={{ height: `${height}px` }}>
                  <NoContact />
                </div>
              }
            />
            <Route
              path="/interaction-guide/fastrack-marketing/outbound/ob-telemarketing-no-contact"
              element={
                <div style={{ height: `${height}px` }}>
                  <OB_Telemarketing_No_Contact />
                </div>
              }
            />
            <Route
              path="/interaction-guide/fastrack-marketing/outbound/ob-telemarketing-contact-info"
              element={
                <div style={{ height: `${height}px` }}>
                  <OB_Telemarketing_ContactInfo />
                </div>
              }
            />
            <Route path="/form1099" element={<Form1099 />} />
            <Route path="/testform1099" element={<TestForm1099 />} />
            <Route path="/formW9" element={<FormW9 />} />
            <Route path="/*" element={<div>Page not found</div>} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ToastContainer />
    </>
  );
}

export default App;
