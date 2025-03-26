// import {
//   BrowserRouter,
//   Routes,
//   Route,
//   Navigate,
//   useLocation,
// } from "react-router-dom";
// import HomePage from "../pages/Social/HomePage";
// import Signup from "../pages/authentication/Signup";
// import ForgotPassword from "../pages/authentication/ForgetPassword";
// import NewPassword from "../pages/authentication/NewPassword";
// import Signin from "../pages/authentication/Signin";
// import ProfileUpdate from "../pages/user/profileUpdate/ProfileUpdate";
// import PageNotFound from "../pages/PageNotFount";
// import useScrollToTop from "../features/hooks/useScrollToTop";
// import UserProfile from "./../pages/user/UserProfile";
// import Header from "../components/globalComponents/Header";
// import Market from "../pages/Market/Market";
// import Connections from "../pages/Social/connections/Connections";
// import Footer from "../components/globalComponents/footer/footer";
// import MarketCourses from "../pages/Courses/marketCourses/MarketCourses.jsx";
// import { useSelector } from "react-redux";
// import usePermission from "../features/hooks/usePermession";

// import OtherUser from "../pages/user/otherUser/OtherUser";
// import SingleCourse from "../pages/Courses/marketCourses/SingleCourse.jsx";
// import MyCourses from "../pages/Courses/myCourses/MyCourses.jsx";
// import AdminDashboard from "../pages/Dashboard/AdminDashboard/DashBoardMain";
// import Pricing from "../pages/Payment/Pricing";
// import AboutUs from "../pages/Organization/AboutUs";
// import TermsAndConditions from "../pages/Organization/TermsAndConditions";
// import UserDashboard from "../pages/Dashboard/UserDashboard/UserDashboard";
// import QuranCourses from "../pages/Courses/marketCourses/QuranCourses";
// import Chat from "../pages/Chat/Chat";
// import MySingleCourse from "../pages/Dashboard/UserDashboard/MySingleCourse";
// import SingleRefundTicket from "../pages/Dashboard/AdminDashboard/RefundTickets/SingleRefundTicket";
// import ClientRefundTicket from "../pages/Dashboard/UserDashboard/ClientRefundTicket/ClientRefundTicket";
// import GlobalSearch from "../pages/Search/GlobalSearch";
// import EmailVerification from "../pages/authentication/EmailVerification";
// import ComingSoon from "../comingSoon/comingSoon.jsx";
// import SingleProduct from "../pages/Market/SingleProduct.jsx";
// import ProfileSettings from "./../pages/user/ProfileSettings/ProfileSettings";
// import SinglePostPage from "../pages/Social/SinglePostPage.jsx";
// import LandingPage from "../pages/Organization/LandingPage.jsx";
// import Blogs from "../pages/Blogs/Blogs.jsx";
// import Singleblog from "../pages/Blogs/Singleblog.jsx";
// import Services from "../pages/Services/Services.jsx";
// import SingleService from "../pages/Services/SingleService.jsx";
// const AllRoutes = () => {
//   useScrollToTop();
//   // will add ProtectedRoute and ProtectedAuthRoute
//   const base = useSelector((state) => state.user);
//   const ProtectedRoute = ({ children, permission }) => {
//     let location = useLocation();
//     const { hasPermission } = usePermission();

//     if (!base.token) {
//       return <Navigate to="/signin" state={{ from: location }} replace />;
//     }
//     if (base.token && permission && !hasPermission(permission)) {
//       return <Navigate to="/feed" state={{ from: location }} replace />;
//     }
//     return children;
//   };

//   const ProtectedAuthRoute = ({ children }) => {
//     const base = useSelector((state) => state.user);
//     let location = useLocation();

//     if (base.token) {
//       return (
//         <Navigate
//           to={location.state?.url ? location.state.url : "/feed"}
//           state={{ from: location }}
//           replace
//         />
//       );
//     }
//     return children;
//   };

//   return (
//     <Routes>
//       {/* Authenticate */}
//       <Route path="/password" element={<ForgotPassword />} />
//       <Route path="/new-password" element={<NewPassword />} />
//       <Route
//         path="/signin"
//         element={<ProtectedAuthRoute children={<Signin />} />}
//       />
//       <Route
//         path="/signup"
//         element={<ProtectedAuthRoute children={<Signup />} />}
//       />
//       <Route path="/verify-email" element={<EmailVerification />} />
//       {/* User */}
//       {/* diplay homepage when user loggedIn */}

//       <Route
//         path="/feed"
//         element={<ProtectedRoute children={<HomePage />} />}
//       />

//       {/* User Dashboard */}
//       {/* <Route
//         path="user"
//         element={
//           <ProtectedRoute
//           children={<UserDashboard />}
//           permission="user.dashboard"
//           />
//         }
//         >
//       </Route> */}
//       <Route
//         path="profile-user"
//         element={<ProtectedRoute children={<UserProfile />} />}
//       />
//       {/* chat is in progress.... */}
//       <Route
//         path="messaging"
//         element={<ProtectedRoute children={<Chat />} />}
//       />

//       {/* this is for Coming soon Page */}

//       <Route
//         path="comingSoon"
//         element={<ProtectedRoute children={<ComingSoon />} />}
//       />

//       <Route
//         path="user/dashboard/:email"
//         element={<ProtectedRoute children={<UserDashboard />} />}
//       />
//       <Route
//         path="user/dashboard/:email/:courseId"
//         element={<ProtectedRoute children={<MySingleCourse />} />}
//       />

//       <Route
//         path="admin/dashboard"
//         element={
//           <ProtectedRoute
//             children={<AdminDashboard />}
//             permission={"admin.dashboard"}
//           />
//         }
//       />
//       <Route
//         path="user/:email"
//         element={<ProtectedRoute children={<OtherUser />} />}
//       />
//       <Route
//         path="post/:postId"
//         element={<ProtectedRoute children={<SinglePostPage />} />}
//       />
//       <Route
//         path="update"
//         element={<ProtectedRoute children={<ProfileUpdate />} />}
//       />
//       <Route
//         path="settings"
//         element={<ProtectedRoute children={<ProfileSettings />} />}
//       />
//       <Route
//         path="search"
//         element={<ProtectedRoute children={<GlobalSearch />} />}
//       />

//       <Route path="market" element={<ProtectedRoute children={<Market />} />} />
//       <Route
//         path="connections"
//         element={<ProtectedRoute children={<Connections />} />}
//       />
//       <Route
//         path="courses"
//         element={<ProtectedRoute children={<MarketCourses />} />}
//       />
//       <Route
//         path="courses/quranic"
//         element={<ProtectedRoute children={<QuranCourses />} />}
//       />
//       <Route
//         path="course/:courseId"
//         element={<ProtectedRoute children={<SingleCourse />} />}
//       />
//       <Route
//         path="market/:productId"
//         element={<ProtectedRoute children={<SingleProduct />} />}
//       />
//       <Route
//         path="service/:serviceId"
//         element={<ProtectedRoute children={<SingleService />} />}
//       />
//       <Route
//         path="refund/ticket/:ticketId"
//         element={<ProtectedRoute children={<SingleRefundTicket />} />}
//       />
//       <Route
//         path="ticket/:ticketId"
//         element={<ProtectedRoute children={<ClientRefundTicket />} />}
//       />
//       <Route
//         path="/my-courses"
//         element={<ProtectedRoute children={<MyCourses />} />}
//       />
//       <Route
//         path="/services"
//         element={<ProtectedRoute children={<Services />} />}
//       />
//       <Route
//         path="/pricing"
//         element={<ProtectedRoute children={<Pricing />} />}
//       />
//       <Route path="/about-us" element={<AboutUs />} />
//       <Route path="/blogs" element={<Blogs />} />
//       <Route path="/blogs/:id" element={<Singleblog />} />
//       <Route path="/terms" element={<TermsAndConditions />} />
//       <Route path="/" element={<LandingPage />} />
//       <Route path="/*" element={<PageNotFound />} />
//     </Routes>
//   );
// };

// export default function Router() {
//   const { user } = useSelector((state) => state.user);
//   return (
//     <BrowserRouter>
//       {!user ? null : <Header />}
//       <div style={{ minHeight: "90vh" }}>
//         <AllRoutes />
//       </div>
//       {!user ? null : <Footer />}
//     </BrowserRouter>
//   );
// }
