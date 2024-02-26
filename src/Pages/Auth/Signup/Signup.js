import React, { useState, useEffect } from 'react'
import { Axios } from '../../../Config/Axios/Axios'
import { EyeIcon, EyeClosedIcon } from '@primer/octicons-react'
import { Ring } from '@uiball/loaders'
import { useNavigate } from 'react-router-dom'

const Signup = () => {
    const [name, setname] = useState("")
    const [email, setemail] = useState("")
    const [pswd, setpswd] = useState("")
    const [regno, setregno] = useState("")
    const [regnoMessage, setregnoMessage] = useState("")
    const [regnoMessageColor, setregnoMessageColor] = useState(false)
    const [emailMessage, setemailMessage] = useState("")
    const [emailMessageColor, setemailMessageColor] = useState(false)
    const [loading, setloading] = useState(false)
    const [viewPassword, setviewPassword] = useState(false)
    const [err, seterr] = useState("")
    const [success, setsuccess] = useState("")

    const nav = useNavigate()

    const signUp = async () => {
        setloading(true)
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/v1/app/auth/signUp", {
            method: "POST",

            // Adding body or contents to send
            body: JSON.stringify({
                name: name,
                email: email.toLowerCase(),
                password: pswd,
                regno: regno,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }

        })
            .then(async (res) => {
                const data = await res.json();
                console.log(data.message);
                setsuccess(data.message)
                seterr("")
                console.log(data);
            })
            .catch((err) => {
                console.log(err)
                seterr(err.message)
                setloading(false)
            })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            signUp();
        }
    }

    const validateEmail = () => {
        var re1 = /^(?![\S]*\d)[\S*a-z\.]+[@]christuniversity\.in/g;    //faculty
        var re2 = /^(?![\S]*\d)[\S*a-z\.]+[@][a-z\.]+[\.]christuniversity\.in/g;    //students
        if(re1.test(email) || re2.test(email)){
            setemailMessage("Valid Email")
            setemailMessageColor(true)
        }
        else if(email === ""){
            setemailMessage("")
        }
        else{
            setemailMessage("Invalid Email: Enter college email")
            setemailMessageColor(false)
        }
    }

    const validateRegno = () => {
        var re = /^\d+$/g
        if(re.test(regno)){
            if((/^(?![\S]*\d)[\S*a-z\.]+[@]christuniversity\.in/g).test(email) && regno.length === 4){
                setregnoMessage("Valid registration number")
                setregnoMessageColor(true)
            }
            else if((/^(?![\S]*\d)[\S*a-z\.]+[@][a-z]+[\.]christuniversity\.in/g).test(email) && regno.length === 7){
            setregnoMessage("Valid registration number")
            setregnoMessageColor(true)
            }
            else if (email !== ""){
                setregnoMessage("Invalid registration number")
                setregnoMessageColor(false)
            }
        }
        else if(regno === ""){
            setregnoMessage("")
        }
        else {
            setregnoMessage("Invalid registration number")
            setregnoMessageColor(false)
        }
    }

    useEffect(() => {
        validateEmail();
        validateRegno();
    }, [email, regno]);

    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '100vw' }}>
            <div className='rounded-3 mx-3 pb-4 d-flex flex-column align-items-center' style={{ backgroundColor: "#8cd9a1", boxShadow: "rgb(121 121 121 / 28%) 6px 6px 13px 1px" }}>
                <img className="rounded" src="login.jpg"
                    style={{ width: "100%" }} />
                {/* <b className='h1 fw-bold mb-3 py-3'><i>Assign Me</i></b> */}
                <div className="p-3 pt-0 d-flex flex-column align-items-center">
                    <img src="hailride.png" height="50px" className='my-3' />
                    {
                        err !== "" &&
                        <b className='text-danger mb-2'>{err}</b>
                    }
                    {
                        success != "" ?
                            <>
                                <b className='text-success mb-2'>{success}</b>
                                <div onClick={() => nav('/login')} className='btn btn-dark w-100 ms-2 mt-3 py-2'>
                                    <b>Continue to Login</b>
                                </div>
                            </>
                            :
                            <div className="d-flex flex-column align-items-center">
                                <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2 " type="text" placeholder='Name'
                                    value={name} onChange={(e) => setname(e.target.value)} onKeyDown={handleKeyDown}></input>
                                <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2 " type="email" placeholder='College email'
                                    value={email} onChange={(e) => setemail(e.target.value)} onKeyDown={handleKeyDown}></input>
                                <div className={emailMessageColor ? 'text-sm' : 'text-danger text-sm'}>{emailMessage}</div>
                                <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2 " type="text" placeholder='Registration Number'
                                    value={regno} onChange={(e) => setregno(e.target.value)} onKeyDown={handleKeyDown} ></input>
                                <div className={regnoMessageColor ? 'text-sm' : 'text-danger text-sm'}>{regnoMessage}</div>
                                <div style={{ width: "250px", background: "#e8f0fe" }} className="d-flex justify-content-between rounded-3 m-2 p-2 pe-3">
                                    <input style={{ outline: "none", border: "none", background: "#e8f0fe" }} type={viewPassword ? "text" : "password"} placeholder='Password' value={pswd} onChange={(e) => setpswd(e.target.value)} onKeyDown={handleKeyDown}></input>
                                    <div onClick={() => setviewPassword(!viewPassword)} className='d-flex me-0 pe-1' style={{ cursor: "pointer", margin: "auto" }} >
                                        {
                                            viewPassword ?
                                                <EyeClosedIcon size={18} />
                                                :
                                                <EyeIcon size={18} />
                                        }
                                    </div>
                                </div>
                                <div onClick={() => signUp()} className='btn btn-dark w-100 ms-2 mt-3 py-2'>
                                    {loading ?
                                        <Ring
                                            size={20}
                                            speed={2}
                                            color="white"
                                        />
                                        :
                                        <b>Signup</b>
                                    }
                                </div>
                                <div className='mt-3'>
                                    <b>Already have account? <span onClick={() => nav('/login')} className='text-danger'>Login</span></b>
                                </div>
                            </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Signup