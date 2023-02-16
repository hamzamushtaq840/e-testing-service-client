import './Navbar.css';
import image from '../../Assets/logo.png';
import React, { useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { useDispatch } from 'react-redux';
import { userActions } from './../../Redux/user-slice';
import { getCourseIdOnClickactions } from './../../Redux/course-slice';
import useBreadcrumbs from 'use-react-router-breadcrumbs';
import MenuIcon from '@mui/icons-material/Menu';
import LogoutIcon from '@mui/icons-material/Logout';
import { io } from 'socket.io-client'
import axios from 'axios';
import { toast } from 'react-toastify';
import { useScroll } from 'framer-motion';


const Navbar2 = (props) => {

  const breadcrumbs = useBreadcrumbs();
  const user = useSelector(state => state.user);
  const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const courseClickUserId = useSelector(state => state.courseClickUserId.courseClickUserId)
  const navigate = useNavigate();
  const [cookies, setCookie, removeCookies] = useCookies();
  const dispatch = useDispatch();
  const location = useLocation();
  const locationName = location.pathname;
  let newLocationName = ""
  let counter = 0;
  const [notification, setNotifications] = useState([]);
  const [length, setLength] = useState(0);
  const [socket, setSocket] = useState(null);
  const [trigger, setTrigger] = useState(false);

  const { scrollY } = useScroll();

  const [scrollCounter, setScrollCounter] = useState(0);
  useEffect(() => {
    return scrollY.onChange((latest) => {
      setScrollCounter(latest)
    })
  }, [])

  const fetchNotifications = () => {
    axios.get("http://localhost:5000/api/getNotification/" + user.userInfo.user.id, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookies.token}` } }
    ).then((res) => {
      setLength(res.data.data.filter(value => value.open === 0).length);
    }).catch((err) => {
      console.log(err);
    })
  }
  useEffect(() => {
    let abc = io("http://localhost:5001")
    setSocket(abc)
  }, [])

  useEffect(() => {
    socket?.emit("newUser", user.userInfo.user.id)
  }, [socket])

  //FOR BLOCK ON MANAGE USER TO ROUTE THEN HERE
  useEffect(() => {
    socket?.on('getNotification', data => {
      console.log('i ran');
      toast.success('You have a new notification', { autoClose: 500, toastId: 2, position: toast.POSITION.TOP_RIGHT, });
      setNotifications(notification => [...notification, data])
      setTrigger(state => !state)
    })
  }, [socket])

  //FOR UNBLOCK ON MANAGE USER TO ROUTE THEN HERE
  useEffect(() => {
    socket?.on('getNotification2', data => {
      toast.success('You have a new notification', { position: toast.POSITION.TOP_RIGHT, });
      setNotifications(notification => [...notification, data])
      setTrigger(state => !state)
    })
  }, [socket])

  //FOR QUIZ TIME
  useEffect(() => {
    socket?.on('getQuizTime', data => {
      toast.success('You have a new notification', { position: toast.POSITION.TOP_RIGHT, });
      setNotifications(notification => [...notification, data])
      setTrigger(state => !state)
    })
  }, [socket])

  useEffect(() => {
    fetchNotifications()
  }, [trigger])


  for (let i = 0; i < locationName.length; i++) {
    if (locationName[i] === "/") {
      counter++;
    }
    if (counter > 1) {
      // return
    } else {
      newLocationName += locationName[i]
    }
  }

  const [sidebar, setSidebar] = useState(true);

  function showSidebar() {
    setSidebar(!sidebar);
  }

  function closeSidebar() {
    // setSidebar(state => state = false);
  }

  if ((typeof (courseIdredux) === "number") && newLocationName !== "/courses") {
    dispatch(getCourseIdOnClickactions.getCourseIdOnClick({}))
  }

  const logout = (e) => {
    e.preventDefault();
    dispatch(userActions.userInfo({}));
    removeCookies('token');
    navigate("/")
  }
  const [top, setTop] = useState(false)

  const make = (window) => {

    if (window.pageYOffset > 30)
      setTop(true)
    else
      setTop(false)
  }

  React.useEffect(() => {
    window.onscroll = () =>
      window.pageYOffset && make(window)
    return () => (window.onscroll = null);
  });

  const handleNotification = () => {
    setTop(false)
    axios.post("http://localhost:5000/api/notificationRead", { withCredentials: true }, { headers: { Authorization: `Bearer ${cookies.token}` } }
    ).then((res) => {
      console.log(res);
      fetchNotifications()
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="Main">
      <div className='relative z-[100]'>
        <nav className={sidebar ? 'nav-menu-active1' : 'nav-menu'}>
          <ul className="nav-menu-items">
            <div className="top">
              <img src={image} width='50px' alt="logo"></img>
            </div>
            <hr className="hr"></hr>
            <li className="nav-text" title='Dashboard'>
              <Link onClick={() => setTop(false)} className={
                location.pathname === "/dashboard" || location.pathname === '/dashboard/createCourse'
                  && sidebar === false ? "flexcenterborder" : sidebar === true
                    && location.pathname === "/dashboard" || location.pathname === '/dashboard/createCourse' ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/dashboard'}>
                <i className="bi bi-menu-button-wide-fill"></i>
                {<span>Dashboard</span>}
              </Link>
            </li>

            <li className="nav-text" title='Courses'>
              <Link onClick={() => setTop(false)} className={newLocationName === "/courses" && sidebar === false ? "flexstartborder" : sidebar === true && newLocationName === "/courses" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/courses'}>
                <i className="bi bi-book"></i>
                {<span>Course</span>}
              </Link>
            </li>

            {typeof (courseIdredux) === "number" && (location.pathname === "/courses" || location.pathname === "/courses/pools" || location.pathname === "/courses/setting" || location.pathname === "/courses/content" || location.pathname === "/courses/quiz" || location.pathname === "/courses/assignment" || location.pathname === "/courses/editQuiz" || location.pathname === '/courses/poolQuestions' || location.pathname === '/courses/manangeStudents' || location.pathname === '/courses/poolQuestions' || location.pathname === '/courses/quiz/result' || location.pathname === '/courses/quiz/result/log' || location.pathname === '/courses/quiz/result/answers') &&
              <div style={sidebar === true ? { padding: "0 10px" } : { padding: "0 10px" }} className={"subMenu"}>


                <li className="nav-text" title='Content'>
                  <NavLink onClick={() => setTop(false)} className={location.pathname === "/content" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/content" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/courses/content'}>
                    <i className="bi bi-card-heading"></i>
                    {<span>Content</span>}
                  </NavLink>
                </li>

                <li className="nav-text" title='Quizzes'>
                  <NavLink onClick={() => setTop(false)} className={(location.pathname === "/courses/editQuiz" || location.pathname === '/courses/preview' || location.state === "/courses/displayQuiz" || location.state === "/courses/result" || location.pathname === '/courses/quiz/result' || location.pathname === '/courses/quiz/result/log' || location.pathname === '/courses/quiz/result/answers') && sidebar === false ? "flexstartborder" : sidebar === true && (location.pathname === "/courses/quiz" || location.pathname === '/courses/editQuiz' || location.pathname === '/courses/quiz/result' || location.pathname === '/courses/quiz/result/log' || location.pathname === '/courses/quiz/result/answers') ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/courses/quiz'}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-video3" viewBox="0 0 16 16">
                      <path d="M14 9.5a2 2 0 1 1-4 0 2 2 0 0 1 4 0Zm-6 5.7c0 .8.8.8.8.8h6.4s.8 0 .8-.8-.8-3.2-4-3.2-4 2.4-4 3.2Z" />
                      <path d="M2 2a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h5.243c.122-.326.295-.668.526-1H2a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v7.81c.353.23.656.496.91.783.059-.187.09-.386.09-.593V4a2 2 0 0 0-2-2H2Z" />
                    </svg>
                    {<span>Quizzes</span>}
                  </NavLink>
                </li>

                {user.userInfo.user.id == courseClickUserId &&
                  <li className="nav-text" title='Pools'>
                    <NavLink onClick={() => setTop(false)} className={(location.pathname === "/pools" || location.pathname === '/courses/poolQuestions') && sidebar === false ? "flexstartborder" : sidebar === true && (location.pathname === "/courses/pools" || location.pathname === '/courses/poolQuestions') ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/courses/pools'}>
                      <i className="bi bi-journal-text"></i>
                      {<span>Pools</span>}
                    </NavLink>
                  </li>}

                <li className="nav-text" title='Assignment'>
                  <NavLink onClick={() => setTop(false)} className={location.pathname === "/pools" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/assignment" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/courses/assignment'}>
                    <i className="bi bi-pencil-square"></i>
                    {<span >Assignment</span>}
                  </NavLink>
                </li>

                {user.userInfo.user.id === courseClickUserId &&
                  <li className="nav-text" title='Setting'>
                    <NavLink onClick={() => setTop(false)} className={(location.pathname === "/pools" || location.pathname === "/courses/manangeStudents") && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/courses/setting" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/courses/setting'}>
                      <i className="bi bi-gear"></i>
                      {<span>Settings</span>}
                    </NavLink>
                  </li>}
              </div>}

            <li className="nav-text" title='Notification'>
              <Link onClick={handleNotification} className={location.pathname === "/notification" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/notification" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/notification'}>
                <i className="bi bi-exclamation-circle"></i>
                {<span>Notifications</span>}
                {length > 0 && <div className='number'>{length}</div>}
              </Link>
            </li>
            <li className="nav-text" title='Profile'>
              <Link onClick={() => setTop(false)} className={location.pathname === "/profile" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/profile" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/profile'}>
                <i className="bi bi-person"></i>
                {<span>Profile</span>}
              </Link>
            </li>
            <li className="nav-text" title='Logout'>
              <Link onClick={logout} className={location.pathname === "/" && sidebar === false ? "flexstartborder" : sidebar === true && location.pathname === "/" ? "flexcenterborder" : sidebar === true ? "flexstart" : "flexcenter"} to={'/'}>
                <i className="bi bi-box-arrow-left"></i>
                {<span>Logout</span>}
              </Link>
            </li>
          </ul>
        </nav>
      </div>
      <main className='main' onClick={closeSidebar}>
        <div className='navbarMain'>
          <div className={scrollCounter > 0 ? 'navbar' : 'navbar2'}>
            <div className="helll">
              {breadcrumbs.map(({ breadcrumb },index) => {
                console.log(breadcrumbs)
                if(index === 0){
                  return
                }
                return (
                  <div key={index} >
                    {breadcrumb === 'Home' && <p>ok</p>}
                    <Link className='hover:text-blue-400' to={breadcrumb.key}>
                      <span>{breadcrumb}  &nbsp;</span>
                    </Link>
                    {breadcrumbs.length !== index + 1 && <span>/ &nbsp;</span>}
                  </div>)
              })}
            </div>
            <div style={{ display: "flex", gap: '5px', alignItems: 'center', justifyContent: 'center' }}>
              <div className="circularportrait">
                <img style={!user?.userInfo?.user?.userImg ? { padding: "10px" } : { padding: 0 }} src={user?.userInfo?.user?.userImg || "/user-solid.svg"} />
              </div>
              <div className='cursor-pointer' title='Logout'>
                <LogoutIcon className="anc4" onClick={logout} />
              </div>
              <MenuIcon className='anc1 cursor-pointer' onClick={showSidebar} />
            </div>
          </div>
        </div>
        <div className="hamza">
          {props.children}
        </div>
      </main>

    </div>
  );
}

export default Navbar2;
