import styles from './EditPool.module.css'
import React, { useState, useEffect } from 'react';
import { Editor } from 'react-draft-wysiwyg';
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { EditorState, convertFromHTML, ContentState } from 'draft-js';
import { Storage } from '../../Utils/firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { useSelector } from 'react-redux';
import { useCookies } from 'react-cookie';
import { toast } from 'react-toastify';

function EditPool({ close, editDetail, editData }) {
  const [cookie] = useCookies();


  // const [editorState, setEditorState] = useState(EditorState.createEmpty());
  const blocksFromHTML = convertFromHTML(editDetail.question)
  const contentState = ContentState.createFromBlockArray(blocksFromHTML)
  const [editorState, setEditorState] = useState(EditorState.createWithContent(contentState));
  const blocksFromHTML2 = convertFromHTML(editDetail?.correctOption)
  const contentState2 = ContentState.createFromBlockArray(blocksFromHTML2)
  const [editorState2, setEditorState2] = useState(EditorState.createWithContent(contentState2));
  const [imageURL, setImageURL] = useState('');
  const [pts, setpts] = useState(editDetail.points);
  const [mcq, setMcq] = useState(false);
  const [trues, setTrues] = useState(false);
  const [subjective, setSubjective] = useState(false);
  const [formula, setFormula] = useState(false);
  const [valuetrue, setvaluetrue] = useState('');
  const [input1, setInput1] = useState(false);
  const [input2, setInput2] = useState(false);
  const [newtime, setNewTime] = useState(editDetail.time);
  const [correct, setCorrect] = useState(editDetail.correctOption)
  const user = useSelector(state => { return state.user; })
  const courseIdredux = useSelector(state => state.getCourseIdOnClick.getCourseIdOnClick);
  const [inputFields, setInputFields] = useState([]);

  useEffect(() => {
    if (editDetail.questionImage !== null) {
      setImageURL(editDetail.questionImage)
    }
    if (editDetail.questionType === 'Mcq') {
      setMcq(true)
      setFormula(false);
      let newArr = []
      for (let i = 0; i < editDetail.options.length; i++) {
        newArr.push({ name: editDetail.options[i].options })
      }
      setInputFields(newArr)
    }
    if (editDetail.questionType === 'Subjective') {
      setSubjective(true)
    }
    if (editDetail.questionType === 'TRUE/FALSE') {
      setTrues(true)
      if (editDetail.correctOption === 'True') {
        setvaluetrue(editDetail.correctOption)
        setInput1(true);
        setInput2(false)
      }
      if (editDetail.correctOption === 'False') {
        setvaluetrue(editDetail.correctOption)
        setInput1(false);
        setInput2(true)
      }
    }
    if (editDetail.questionType === 'Formula') {
      setFormula(true)
      setMcq(true);
      let newArr = []
      for (let i = 0; i < editDetail.options.length; i++) {
        newArr.push({ name: editDetail.options[i].options })
      }
      setInputFields(newArr)
    }

  }, [])

  function questionTypeHandler(e) {
    if (e.target.value === '1') {
      setMcq(true);
      setTrues(false);
      setSubjective(false);
      setFormula(false);
    }
    if (e.target.value === '2') {
      setMcq(false);
      setTrues(true);
      setSubjective(false);
      setFormula(false);
    }
    if (e.target.value === '3') {
      setMcq(false);
      setTrues(false);
      setSubjective(true);
      setFormula(false);
    }
    if (e.target.value === '4') {
      setMcq(true);
      setTrues(false);
      setSubjective(false);
      setFormula(true);
    }

  }

  const uploadCallback = (file, callback) => {
    return new Promise((resolve, reject) => {
      const reader = new window.FileReader();
      reader.onloadend = async () => {
        console.log(file);
        const storageRef = ref(Storage, `/questionPictures/${file.name}`);
        const uploadTask = await uploadBytes(storageRef, file);
        getDownloadURL(ref(Storage, `/questionPictures/${file.name}`)).then(
          (url) => {
            console.log(url);
            setImageURL(url);
          }
        );
        resolve({ data: { link: 'Uploaded' } });
      };
      reader.readAsDataURL(file);
    });
  };

  const config = {
    image: { uploadCallback: uploadCallback },
  };

  //This onChange event takes two parameters, index and event. Index is the index of the array and event is the data we type in the input field. We are passing those to the handleFormChange function.
  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
  };

  const handleCorrect = (index, event) => {
    setCorrect(event.target.value)
  };

  const addFields = () => {
    if (inputFields.length <= 4) {
      let newfield = { name: '' };
      setInputFields([...inputFields, newfield]);
    } else {
      alert('you cant add more than 5 possible answers');
    }
  };

  const removeFields = (index, event) => {
    if (inputFields.length < 3) {
      toast.dismiss();
      toast.error('Minimim 2 possible answers are allowed');
      return
    } else {
      let data = [...inputFields];
      data.splice(index, 1);
      setInputFields(data);
    }
  };

  const handleMcq = (e) => {
    e.preventDefault();

    if (editorState.getCurrentContent().getPlainText() === '') { alert('please write question') }
    else if (newtime === '') { alert('please assign time') }
    else if (pts === '') { alert('please assign pts') }
    else if (correct === '') { alert('please select correct answer') }
    else if (editorState2.getCurrentContent().getPlainText() === '') { alert('please write answer') }
    else {
      let y = inputFields.every(item => item.name);
      if (!y) {
        alert('please fill out possible answers')
      }
      else {
        if (!formula && mcq) {
          let question =
          {
            id: editDetail.id,
            options: [],
            correctOption: correct,
            questionType: "Mcq",
            courseId: courseIdredux,
            question: editorState.getCurrentContent().getPlainText(),
            userId: user.userInfo.user.id,
            time: newtime,
            points: pts,
            isMathJax: false
          }
          inputFields.forEach((value, index) => { question.options.push(value.name) });
          if (imageURL === '') { question.questionImage = null; }
          else { question.questionImage = imageURL; }
          editData(question);
          //   close()

        }

        else {
          let question =
          {
            id: editDetail.id,
            options: [],
            correctOption: correct,
            questionType: "Formula",
            courseId: courseIdredux,
            question: editorState.getCurrentContent().getPlainText(),
            userId: user.userInfo.user.id,
            time: newtime,
            points: pts,
            isMathJax: true
          }
          inputFields.forEach((value, index) => { question.options.push(value.name) });
          if (imageURL === '') { question.questionImage = null; }
          else { question.questionImage = imageURL; }
          editData(question);
          //   close()
        }
      }
    }
  }

  const handleTrues = () => {

    if (editorState.getCurrentContent().getPlainText() === '') { alert('please write question') }
    else if (newtime === '') { alert('please assign time') }
    else if (pts === '') { alert('please assign pts') }
    else if (valuetrue === '') { alert('please select correct answer') }
    else {
      let question =
      {
        id: editDetail.id,
        options: ['True', 'False'],
        correctOption: valuetrue,
        questionType: "TRUE/FALSE",
        courseId: courseIdredux,
        question: editorState.getCurrentContent().getPlainText(),
        userId: user.userInfo.user.id,
        time: newtime,
        points: pts,
        isMathJax: false,
      }
      if (imageURL === '') { question.questionImage = null; }
      else { question.questionImage = imageURL; }
      editData(question)
      // close()
    }
  };


  const handleSubjective = () => {
    if (editorState.getCurrentContent().getPlainText() === '') { alert('please write question') }
    else if (newtime === '') { alert('please assign time') }
    else if (pts === '') { alert('please assign pts') }
    else {
      let question = {
        id: editDetail.id,
        options: [null],
        correctOption: editorState2.getCurrentContent().getPlainText(),
        questionType: 'Subjective',
        courseId: courseIdredux,
        question: editorState.getCurrentContent().getPlainText(),
        userId: user.userInfo.user.id,
        time: newtime,
        points: pts,
        isMathJax: false
      };
      if (imageURL === '') { question.questionImage = null; }
      else { question.questionImage = imageURL; }
      editData(question);
      //   close()
    }
  }


  return (
    <>
      {
        <div className={styles.holder}>
          <div className={styles.header}>
            <div className={styles.select}>
              <select onChange={questionTypeHandler}>
                <option selected={editDetail.questionType === 'Mcq' ? true : false} value="1">Multiple Choice</option>
                <option selected={editDetail.questionType === 'TRUE/FALSE' ? true : false} value="2">True/False</option>;
                <option selected={editDetail.questionType === 'Subjective' ? true : false} value="3">Subjective Question</option>;
                <option selected={editDetail.questionType === 'Formula' ? true : false} value="4">Formula Question</option>;
              </select>
            </div>

            <div className={styles.second}>
              <div className={styles.Options}>
                <p>Time:</p>
                <input
                  type="number"
                  id="quantity"
                  className={`!w-[70px] ${styles.input}`}
                  name="quantity"
                  defaultValue={newtime}
                  onChange={(e) => {
                    setNewTime(e.target.value);
                  }}
                  min="1"
                  max="100"
                ></input>
              </div>
              <div className={styles.Options}>
                <p>Points:</p>
                <input
                  type="number"
                  id="quantity"
                  className={`!w-[70px] ${styles.input}`}
                  name="quantity"
                  defaultValue={pts}
                  onChange={(e) => {
                    setpts(e.target.value);
                  }}
                  min="1"
                ></input>
              </div>
            </div>
          </div>

          <div className={styles.addQuestion}>
            {formula && mcq && (
              <p style={{ fontSize: '12.8px', margin: '5px 0' }}>
                Enter your question, build a formula using{' '}
                <a
                  style={{
                    fontSize: '13px',
                    textDecoration: 'underline',
                  }}
                  href="https://docs.mathjax.org/en/latest/basic/mathematics.html"
                  target="_blank"
                >
                  MathJax
                </a>
                , and generate a set of possible answer combinations
              </p>
            )}
            {mcq && !formula && (
              <p style={{ fontSize: '12.8px', margin: '5px 0' }}>
                Enter your question and multiple answers, then select
                the one correct answer.
              </p>
            )}
            {trues && (
              <p style={{ fontSize: '12.8px', margin: '5px 0' }}>
                Enter your question text, then select if True or False
                is the correct answer.
              </p>
            )}
            {subjective && (
              <p style={{ fontSize: '12.8px', margin: '5px 0' }}>
                Students will be given a text field to compose their
                answer.
              </p>
            )}
            <div>
              <p className={styles.p1}>Question:</p>
            </div>

            <div className={styles.editorContainer}>
              <Editor
                toolbar={config}
                toolbarClassName="toolbarClassName"
                wrapperClassName="wrapperClassName"
                editorClassName="editorClassName"
                // ref={rtQuestionRef}
                editorState={editorState}
                onEditorStateChange={(newState) => {
                  setEditorState(newState);
                }}
                wrapperStyle={{
                  width: '95%',
                  marginBottom: '10px',
                  border: '1px solid #DAEAF1',
                  minHeight: '300px',
                  minWidth: '315px',
                  maxHeight: '300px',
                  overflow: 'clip',
                }}
              />
            </div>

            <div>
              <p className={styles.p1}>Answers:</p>
            </div>

            {mcq && (
              <>
                <div className={styles.answerContainer}>
                  {inputFields.map((input, index) => {
                    return (
                      <div key={index} className={styles.element}>
                        <div className={styles.inputContainer}>
                          <input
                            type="radio"
                            value={inputFields[index].name}
                            defaultChecked={editDetail.correctOption === inputFields[index].name}
                            onChange={(event) =>
                              handleCorrect(index, event)
                            }
                            name="correct"
                          />
                          <input
                            name="name"
                            placeholder="Answer Text"
                            type="text"
                            value={input.name}
                            onChange={(event) =>
                              handleFormChange(index, event)
                            }
                          />
                        </div>
                        <svg
                          onClick={() => removeFields(index)}
                          xmlns="http://www.w3.org/2000/svg"
                          width="18"
                          height="18"
                          fill="red"
                          className="bi bi-trash3"
                          viewBox="0 0 16 16"
                        >
                          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z" />
                        </svg>
                      </div>
                    );
                  })}
                  <div className={`flex justify-end ${styles.paragraphContain}`}>
                    {inputFields.length <= 4 &&
                      <p style={{ background: "#2A84EB", border: "1px solid #2A84EB" }} className={`flex items-center bg-[#] button !text-white !w-[240px] !text-[12px]`} onClick={addFields}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          className="bi bi-plus-lg"
                          viewBox="0 0 16 16"
                        >
                          <path
                            fill-rule="evenodd"
                            d="M8 2a.5.5 0 0 1 .5.5v5h5a.5.5 0 0 1 0 1h-5v5a.5.5 0 0 1-1 0v-5h-5a.5.5 0 0 1 0-1h5v-5A.5.5 0 0 1 8 2Z"
                          />
                        </svg>
                        Add another answer
                      </p>
                    }
                  </div>
                  <div className={styles.footer}></div>
                  <div className='flex' style={{ width: '95%', gap: '5px' }}>
                    <button
                      onClick={() => close()}
                      style={{ background: "white", color: "black", boxShadow: "0px 0px 0px #000",border:"2px solid black" }}
                      className={`bg-white button`}
                    >
                      Cancel
                    </button>
                    <button
                      className={`button`}
                      onClick={handleMcq}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </>
            )}

            {trues && (
              <div>
                <div className={styles.true}>
                  <div className={styles.trueSub}>
                    <label
                      className={
                        input1 ? styles.label2 : styles.label1
                      }
                    >
                      <input
                        type="radio"
                        name="isTrue"
                        value="True"
                        onClick={(e) => {
                          setvaluetrue(e.target.value);
                          setInput1(true);
                          setInput2(false);
                        }}
                        //   defaultChecked={editDetail.correctOption === 'true'}
                        defaultChecked={valuetrue === 'True'}
                      />
                      True
                    </label>

                    <label
                      className={
                        input2 ? styles.label2 : styles.label1
                      }
                    >
                      <input
                        type="radio"
                        name="isTrue"
                        value="False"
                        onClick={(e) => {
                          setvaluetrue(e.target.value);
                          setInput2(true);
                          setInput1(false);
                        }}
                        //   defaultChecked={editDetail.correctOption === 'false'}
                        defaultChecked={valuetrue === 'False'}
                      />
                      False
                    </label>
                  </div>
                </div>
                <div className={styles.footer}>
                  <div
                    style={{
                      width: '95%',
                      gap: '10px',
                      marginTop: '10px',
                    }}
                  >
                    <button
                      className={styles.cancel3}
                      onClick={() => close()}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.save3}
                      onClick={handleTrues}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </div>
            )}

            {subjective && (
              <>
                <p style={{
                  width: '95%',
                  gap: '10px',
                  margin: '-10px 0 10px 0',
                  fontSize: '14px',
                }}>The Answer must be provided if you want to auto grade students answer.</p>
                <div className={styles.editorContainer}>
                  <Editor
                    toolbar={config}
                    toolbarClassName="toolbarClassName"
                    wrapperClassName="wrapperClassName"
                    editorClassName="editorClassName"
                    editorState={editorState2}
                    onEditorStateChange={(newState) => {
                      setEditorState2(newState);
                    }}
                    wrapperStyle={{
                      width: '95%',
                      marginBottom: '10px',
                      border: '1px solid #DAEAF1',
                      maxHeight: '400px',
                      height: '300px',
                      overflow: 'clip',
                    }}
                  />
                </div>
                <div className={styles.footer}>
                  <div
                    style={{
                      width: '95%',
                      gap: '10px',
                      marginTop: '15px',
                    }}
                  >
                    <button
                      className={styles.cancel3}
                      onClick={() => close(false)}
                    >
                      Cancel
                    </button>
                    <button
                      className={styles.save3}
                      onClick={handleSubjective}
                    >
                      Update
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      }
    </>
  )
}

export default EditPool