import { Routes, Route } from 'react-router-dom';
import React from "react";
import { Suspense } from 'react';
import { ColorRing } from 'react-loader-spinner'
import Auth from './Layout/Auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const Login = React.lazy(() => import('./Components/Auth/Login'))
const Signup = React.lazy(() => import('./Components/Auth/Signup'))
const VerifyEmail = React.lazy(() => import('./Components/Auth/VerifyEmail'))
const Dashboard = React.lazy(() => import('./Components/Dashboard/Dashboard'))
const Navbar = React.lazy(() => import('./Components/Navbar/Navbar'))
const Courses = React.lazy(() => import('./Components/Courses/Courses'))
const Notification = React.lazy(() => import('./Components/Notifications/Notifications'))
const EmailForgotPassword = React.lazy(() => import('./Components/Auth/EmailForgotPassword'))
const ForgotPassword = React.lazy(() => import('./Components/Auth/ForgotPassword'))
const Profile = React.lazy(() => import('./Components/Profile/Profile (1)'))
const Content = React.lazy(() => import('./Components/Content/Content'))
const Quiz = React.lazy(() => import('./Components/Quiz/Quiz'))
const Assignment = React.lazy(() => import('./Components/Assignment/Assignment'))
const EditQuiz = React.lazy(() => import('./Components/Quiz/EditQuiz'))
const PoolMain = React.lazy(() => import('./Components/Pool/PoolMain'))
const PoolQuestions = React.lazy(() => import('./Components/Pool/PoolQuestions'))
const Setting = React.lazy(() => import('./Components/Settings/Setting'))
const ManageStudents = React.lazy(() => import('./Components/Settings/ManageStudents'))
const CreateCourse = React.lazy(() => import('./Components/Dashboard/CreateCourse'))
const Result = React.lazy(() => import('./Components/Quiz/Result'))
const Preview = React.lazy(() => import('./Components/Quiz/Preview'))
const DisplayQuiz = React.lazy(() => import('./Components/Quiz/DisplayQuiz'))
const Layout = React.lazy(() => import('./Layout/Layout'))
const Unauthorized = React.lazy(() => import('./Layout/Unauthorized'))
const Missing = React.lazy(() => import('./Layout/Missing'))
const Auth2 = React.lazy(() => import('./Components/Auth/Auth'))
const QuizResult = React.lazy(() => import('./Components/Quiz/QuizResult'))
const QuizAnswers = React.lazy(() => import('./Components/Quiz/QuizAnswers'))
const QuizLog = React.lazy(() => import('./Components/Quiz/QuizLog'))

function App() {

  const Loader =
    <div style={{position:"absolute",left:"50%",top:"50%", transform:"translate(-50%,-50%)"}} className=''>
      <ColorRing
        visible={true}
        height="80"
        width="80"
        ariaLabel="blocks-loading"
        wrapperStyle={{}}
        wrapperClass="blocks-wrapper"
        colors={['#494949','#494949', '#494949', '#494949', '#494949']}
      />
    </div>

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Suspense fallback={Loader}><Layout /></Suspense>} >

          {/* Public routes */}
          <Route path="/" element={<Suspense fallback={Loader}><Auth2 /></Suspense>} />
          <Route path="/signup" element={<Suspense fallback={Loader}><Signup /></Suspense>} />
          <Route path="/emailVerification/:id" element={<Suspense fallback={Loader}><VerifyEmail /></Suspense>} />
          <Route path="/forgotPassword" element={<Suspense fallback={Loader}><EmailForgotPassword /></Suspense>} />
          <Route path="/forgotPasswordChange/:id" element={<Suspense fallback={Loader}><ForgotPassword /></Suspense>} />

          {/* Protected routes */}
          <Route path='/' element={<Suspense fallback={Loader}><Auth /></Suspense>} >
            <Route path="/dashboard" element={<Navbar><Suspense fallback={Loader}><Dashboard /></Suspense></Navbar>} />
            <Route path="/dashboard/createCourse" element={<Navbar><Suspense fallback={Loader}><CreateCourse /></Suspense></Navbar>} />
            <Route path="/courses" element={<Navbar><Suspense fallback={Loader}><Courses /></Suspense></Navbar>} />
            <Route path="/courses/pools" element={<Navbar><Suspense fallback={Loader}><PoolMain /></Suspense></Navbar>} />
            <Route path="/courses/poolQuestions" element={<Navbar><Suspense fallback={Loader}><PoolQuestions /></Suspense></Navbar>} />
            <Route path="/courses/content" element={<Navbar><Suspense fallback={Loader}><Content /></Suspense></Navbar>} />
            <Route path="/courses/quiz" element={<Navbar><Suspense fallback={Loader}><Quiz /></Suspense></Navbar>} />
            <Route path="/courses/quiz/result" element={<Navbar><Suspense fallback={Loader}><QuizResult /></Suspense></Navbar>} />
            <Route path="/courses/quiz/result/log" element={<Navbar><Suspense fallback={Loader}><QuizLog /></Suspense></Navbar>} />
            <Route path="/courses/quiz/result/answers" element={<Navbar><Suspense fallback={Loader}><QuizAnswers /></Suspense></Navbar>} />
            <Route path="/courses/displayQuiz" element={<Navbar><Suspense fallback={Loader}><DisplayQuiz /></Suspense></Navbar>} />
            <Route path="/courses/preview" element={<Navbar><Suspense fallback={Loader}><Preview /></Suspense></Navbar>} />
            <Route path="/courses/manangeStudents" element={<Navbar><Suspense fallback={Loader}><ManageStudents /></Suspense></Navbar>} />
            <Route path="/courses/setting" element={<Navbar><Suspense fallback={Loader}><Setting /></Suspense></Navbar>} />
            <Route path="/notification" element={<Navbar><Suspense fallback={Loader}><Notification /></Suspense></Navbar>} />
            <Route path="/profile" element={<Navbar><Suspense fallback={Loader}><Profile /></Suspense></Navbar>} />
            <Route path="/courses/assignment" element={<Navbar><Suspense fallback={Loader}><Assignment /></Suspense></Navbar>} />
            <Route path="/courses/assignment/submitResult" element={<Navbar><Suspense fallback={Loader}><Assignment /></Suspense></Navbar>} />
            <Route path="/courses/result" element={<Navbar><Suspense fallback={Loader}><Result /></Suspense></Navbar>} />
            <Route path="/courses/editQuiz" element={<Navbar><Suspense fallback={Loader}><EditQuiz /></Suspense></Navbar>} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Missing />} />
          <Route path="Unauthorized" element={<Unauthorized />} />
        </Route>
      </Routes>
      <ToastContainer position="top-right"
        autoClose={2000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
      />
    </div>
  );
}

export default App;
