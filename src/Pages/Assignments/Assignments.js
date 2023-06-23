import React, { useContext, useRef, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { CheckCircleFillIcon } from '@primer/octicons-react'
import { useNavigate } from 'react-router-dom'
import { Ring } from '@uiball/loaders'
import { UserContext } from '../../App'

const Assignments = () => {
  const nav = useNavigate()
  const scrollRef = useRef()

  const { user } = useContext(UserContext)

  const [loading, setloading] = useState(false)
  const [success, setsuccess] = useState(false)
  const [error, seterror] = useState(false)
  const [valid, setvalid] = useState(true)

  const [subject, setsubject] = useState("")
  const [question, setquestion] = useState("")
  const [comments, setcomments] = useState("")
  const [offer, setoffer] = useState("")
  const [uploadFileName, setuploadFileName] = useState("")
  const [selectedFile, setSelectedFile] = useState(null)

  const sentData = async (filename) => {


    Axios.post('/api/v1/service/postAssignmentRequest', {
      addedBy: user.email,
      requestType: "assignment",
      subject: subject,
      comments: comments,
      question: question,
      offer: offer,
      uploadFileName: filename
    })
      .then((res) => {
        console.log(res);
        setloading(false)
        setsuccess(true)
      })
      .catch(err => {
        setloading(false)
        seterror(true)
        console.log(err);
      })
  }

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  }
  const handleFileUpload = (e) => {
    // e.preventDefault();
    const formData = new FormData();
    formData.append('file', selectedFile);

    const file = Axios.post('/uploadFile', formData, {
      headers: {
        'content-type': 'multipart/form-data'
      }
    })
      .then(response => {
        // Handle successful upload
        setuploadFileName(response.data)
        sentData(response.data)
      })
      .catch(error => {
        // Handle upload error
        console.error('Error uploading file:', error);
      });
  }

  const handleScrollToTop = () => {
    scrollRef.current.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const validate = () => {
    setloading(true)
    if (subject === "" || comments === "" || question === "" || offer === "") {
      setvalid(false)
      setloading(false)
      handleScrollToTop()
    }
    else {
      setvalid(true)
      if (selectedFile !== null) {
        handleFileUpload()
      }
      else {
        sentData("")
      }
    }
  }

  return (
    <div ref={scrollRef} className='p-3' style={{ width: "100vw", overflowY: "scroll" }}>
      {
        success ?
          <div className='d-flex flex-column justify-content-center'>
            <div className='bg-success align-items-center d-flex rounded-3 p-4 m-4'>
              <CheckCircleFillIcon fill="#fff" size={60} />
              <b className="ms-3" style={{ fontSize: "20px", color: "#fff" }}>Submitted Successfully</b>
            </div>
            <div onClick={() => nav("/dashboard")} className="btn btn-primary px-5 me-2" style={{ alignSelf: "center" }}>See dashboard</div>
          </div>
          :
          <>
            <b className='fs-1'>Assignments</b><br />
            {
              !valid &&
              <b className='text-danger'><i>Fill up required feilds*</i></b>
            }
            <div className='my-3 w-100'>
              <div className='compShadow my-2 d-flex justify-content-between align-items-center rounded-3 p-3 w-100'
                style={{ background: "#ffff62a8" }}>
                <b>Subject<span className='text-danger'>*</span></b>
                <input value={subject} onChange={e => setsubject(e.target.value)} className='p-1 rounded-3'
                  style={!valid && subject == "" ? { borderColor: "red", background: "#ff00001c" } : {}} />
              </div>
              <div className='compShadow my-2 rounded-3 p-3 w-100'
                style={{ background: "#ffff62a8" }}>
                <div className='mb-3'>
                  <b>Question<span className='text-danger'>*</span></b>
                </div>
                <textarea value={question} onChange={e => setquestion(e.target.value)} className='p-1 rounded-3 w-100'
                  style={!valid && question == "" ? { borderColor: "red", background: "#ff00001c", minHeight: "200px" } : { minHeight: "200px" }} />
              </div>
              <div className='compShadow my-2 d-flex justify-content-between align-items-center rounded-3 p-3 w-100'
                style={{ background: "#ffff62a8" }}>
                <b>Comments<span className='text-danger'>*</span></b>
                <input value={comments} onChange={e => setcomments(e.target.value)} className='p-1 rounded-3'
                  style={!valid && comments == "" ? { borderColor: "red", background: "#ff00001c" } : {}} />
              </div>

              <div className='compShadow my-2 rounded-3 p-3 w-100'
                style={{ background: "#ffff62a8" }}>
                <div className='mb-3'>
                  <b>Upload Required Documents</b><br />
                  <i className='text-danger'>upload a single file</i>
                </div>
                <input type="file" onChange={handleFileChange} className='py-3 px-1 rounded-3' style={{ background: "#c7c747a8" }} />
              </div>
              <div>
                <i className='text-danger' style={{ fontSize: "14px" }}>Note : If you have multiple documents, make it as a single doc or pdf to upload</i>
              </div>
              <div className='compShadow my-2 d-flex justify-content-between align-items-center rounded-3 p-3 w-100'
                style={{ background: "#ffff62a8" }}>
                <b className='me-4 text-nowrap'>How much will you offer?<span className='text-danger'>*</span></b>
                <div className='d-flex align-items-center bg-white px-1 rounded-3 w-50'
                  style={!valid && offer == "" ? { borderColor: "red", background: "#ff00001c", border: "2px solid red" } : { border: "2px solid black" }} >
                  <b className='px-1'>Rs.</b>
                  <input value={offer} onChange={e => setoffer(e.target.value)} type="number" className='p-1 rounded-3 w-50'
                    style={{ border: "none", outline: "none" }} />
                </div>
              </div>
              <div className='w-100 d-flex justify-content-center my-4'>
                <div onClick={validate} className='btn btn-dark p-2 px-5 fw-bold '>
                  {
                    loading ?
                      <Ring
                        size={20}
                        speed={2}
                        color="white"
                      />
                      :
                      <b>Submit</b>
                  }
                </div>
              </div>
            </div>
          </>
      }

    </div>
  )
}

export default Assignments