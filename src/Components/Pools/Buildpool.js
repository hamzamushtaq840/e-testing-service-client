import styles from './Buildpool.module.css';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import React, { useRef, useState,useEffect } from 'react';
import Mcq from './Mcq';
import True from './True';
import Plain from './Plain';
import { useDispatch } from 'react-redux';
import { poolsActions } from './../../Redux/pools-slice';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import createMathjaxPlugin from 'draft-js-mathjax-plugin';
import axios from 'axios';
import { useSelector } from 'react-redux';

const category = [
  {
    id: 1,
    name: "MCQ's",
  },
  {
    id: 2,
    name: 'True/False',
  },
  {
    id: 3,
    name: 'Subjective',
  },
];

function Buildpool() {
  const user=useSelector(state=> state.user);

  const [mcq, setmcq] = useState(false);
  const [trues, settrues] = useState(false);
  const [plain, setplain] = useState(false);
  const [courseId, setCourseId] = useState('');
  const rtQuestionRef = useRef('');
  const inputQuestionRef = useRef('');
  const [courseName, setCourseName] = useState('');
  const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const [publishCourses,setPublishedCourses]=useState([]);
  const [showRichText,setShowRichText]=useState(false);
  

  useEffect(()=>{
    let link='http://localhost:5000/api/getCourseName/' + user.userInfo.user.id;
    axios.get(link).then((res)=>{
      console.log(res.data.data);
      setPublishedCourses(res.data.data);
    }).catch((err)=>{
      console.log(err);
    })
  },[])

  const dispatch = useDispatch();

  function handleCategory(e) {
    const ids = e.target.value;

    if (ids === '1') {
      setmcq(true);
      settrues(false);
      setplain(false);
    }
    if (e.target.value === '2') {
      setmcq(false);
      settrues(true);
      setplain(false);
    }
    if (e.target.value === '3') {
      setmcq(false);
      settrues(false);
      setplain(true);
    }
  }

  function handlePublishCourses(e) {
    setCourseId(e.target.value);
    publishCourses.forEach((element) => {
      if (parseInt(e.target.value) === element.id) {
        setCourseName(element.courseName);
      }
    });
  }

  const getMcqs = (mcqData) => {
    mcqData.courseId = courseId;

    if (mcqData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (inputQuestionRef.current.value.trim().length === 0) {
      toast.error('You cant leave QUESTION/OPTIONS empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      mcqData.question = inputQuestionRef.current.value;
      mcqData.courseName = courseName;
      console.log(mcqData);

      dispatch(poolsActions.allQuestions(mcqData));
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }

    // if (mcqData.courseId === '') {
    //   toast.error('Select Course Please', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else if (rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    // || inputQuestionRef.current.value.trim().length === 0) {
    //   toast.error('You cant leave QUESTION/OPTIONS empty', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // } else {
    //   mcqData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));

    //   setEditorState(EditorState.createEmpty());

    //   mcqData.courseName = courseName;

    //   dispatch(poolsActions.allQuestions(mcqData));
    //   toast.success('Added', {
    //     position: toast.POSITION.TOP_CENTER,
    //   });
    // }
  };

  const getTrues = (truesData) => {
    truesData.courseId = courseId;

    if (truesData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    ) {
      toast.error('You cant leave question empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (truesData.correctAnswer === '') {
      toast.error('You have to select True/False', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      truesData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));
      
      setEditorState(EditorState.createEmpty());
      truesData.courseName = courseName;
      dispatch(poolsActions.allQuestions(truesData));
      
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const getPlain = (plainData) => {
    plainData.courseId = courseId;
    
    if (plainData.courseId === '') {
      toast.error('Select Course Please', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (
      rtQuestionRef.current.state.editorState.getCurrentContent().getPlainText() ===''
    ) {
      toast.error('You cant leave question empty', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else if (plainData.correctAnswer === '') {
      toast.error('You have to write answer', {
        position: toast.POSITION.TOP_CENTER,
      });
    } else {
      plainData.question = draftToHtml(convertToRaw(editorState.getCurrentContent()));

      setEditorState(EditorState.createEmpty());
      plainData.courseName = courseName;
      
      dispatch(poolsActions.allQuestions(plainData));
      toast.success('Added', {
        position: toast.POSITION.TOP_CENTER,
      });
    }
  };

  const changeInputHandler = (e) => {
    console.log(e.target.value);
    if (e.target.value === "Input"){
      setShowRichText(false);
    } else if (e.target.value === "Rich box"){
      setShowRichText(true);
    }
  }

  return (
    <div>
      <div className={styles.labelCourse}>
        <label>
          Select Course
        </label>
        <select onChange={handlePublishCourses}>
          <option value="" selected disabled hidden>
            Choose here
          </option>
          {publishCourses.map((value) => {
            return <option value={value.id}>{value.courseName}</option>;
          })}
        </select>
      </div>
      <div className={styles.labelCategory}>
        <label>Question Type :&nbsp; </label>
        <select onChange={handleCategory}>
          <option value="" selected disabled hidden>
            Choose here
          </option>
          {category.map((value) => {
            return <option value={value.id}>{value.name}</option>;
          })}
        </select>
      </div>
        {(mcq || trues || plain) && <div>
          <div className={styles.editor2}>
            <h4>Question Text</h4>
            <div className={styles.radioDiv}>
              <input onChange={changeInputHandler} defaultChecked type="radio" id="input" name="questionInput" value="Input"/>
              <label for="input">Input</label>
              <input onChange={changeInputHandler} type="radio" id="input" name="questionInput" value="Rich box"/>
              <label for="input">Rich Text</label>
            </div>
            {showRichText === false && 
            <textarea rows={11} style={{width: "47.5%",resize:"none",minWidth:'315px',borderColor:'rgba(0, 0, 0, 0.456)'}} type='text' placeholder='Enter your Question'></textarea>
            } 
            {showRichText === true && <Editor
              toolbarClassName="toolbarClassName"
              wrapperClassName="wrapperClassName"
              editorClassName="editorClassName"
              ref={rtQuestionRef}
              editorState={editorState}
              onEditorStateChange={(newState) => {
                setEditorState(newState);
              }}
              wrapperStyle={{
                width: '70%',
                marginBottom:'10px',
                border:'1px solid #DAEAF1',
                minHeight:"300px",
                minWidth:"315px",
                maxHeight: '300px',
                overflowX:"hidden",
                // overflowY:"auto"
              }}
            />}
            {mcq && <Mcq getMcqs={getMcqs} />}
            {trues && <True getTrues={getTrues} />}
            {plain && <Plain getPlain={getPlain} />}
            <ToastContainer />
          </div>
        </div>}
      <hr></hr>
    </div>
  );
}

export default Buildpool;
