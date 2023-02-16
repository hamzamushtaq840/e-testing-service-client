import styles from './Notifications.module.css';
import React, { useCallback, useState } from 'react';
import Navbar from '../Navbar/Navbar';
import { useEffect } from "react";
import axios from 'axios';
import { useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';


const Notification = () => {

  const navigate = useNavigate();
  const user = useSelector(state => state.user);
  const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [notifications, setNotifications] = useState([])
  const [cookie, setCookie] = useCookies();

  const handleRemove = (item) => {
    let data = {
      id: item.id
    }
    axios.post("http://localhost:5000/api/removeNotification", data, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }).then((res) => {
      fetchNotifications()
    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchNotifications = () => {
    axios.get("http://localhost:5000/api/getNotification/" + user.userInfo.user.id, { withCredentials: true }, { headers: { Authorization: `Bearer ${cookie.token}` } }
    ).then((res) => {
      let newData = res.data.data.reverse()
      console.log(newData);
      setNotifications(newData)
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    fetchNotifications()
  }, [])

  return (
    <div className={styles.Main}>
      <div className={styles.header}>
        <h1>Notification</h1>
      </div>

      <div className={styles.body}>
        {notifications.map((item, index) =>
        (
          <div>
            <div className={(item.type === 'blocked' && styles.notificationContainer) || (item.type === 'unblocked' && styles.notificationContainer3) || (item.type === 'quizTime' && styles.notificationContainer4)}>
              <div className={styles.p}>
                <p>{item.notificationText}</p>
              </div>
              <span className={styles.abc} onClick={() => handleRemove(item)}>x</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Notification;
