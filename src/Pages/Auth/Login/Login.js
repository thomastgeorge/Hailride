import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../../Config/Axios/Axios'
import { UserContext } from '../../../App'
import { EyeIcon, EyeClosedIcon } from '@primer/octicons-react'
import { Ring } from '@uiball/loaders'
import { useNavigate } from 'react-router-dom'


const Login = ({ setauthenticated }) => {

    const [email, setemail] = useState("")
    const [pswd, setpswd] = useState("")
    const [loading, setloading] = useState(false)
    const [viewPassword, setviewPassword] = useState(false)
    const [err, seterr] = useState("")
    const [forgotPswd, setforgotPswd] = useState(false)
    const [emailMessage, setemailMessage] = useState("")
    const [emailMessageColor, setemailMessageColor] = useState(false)
    const [otpUser, setotpUser] = useState("")
    const [otpEmail, setotpEmail] = useState("")
    const [btnClick, setbtnClick] = useState(false)
    const [otpVerified, setotpVerified] = useState(false)
    const [newPswd, setnewPswd] = useState("")
    const [pswdMessage, setpswdMessage] = useState("")

    const { setUser } = useContext(UserContext)

    const nav = useNavigate()

    useEffect(() => {
        if (sessionStorage.getItem("token") != null) {
            Axios.post("/api/v1/app/users/getMyProfile", {}, {
                headers: {
                    'authorization': `beare ${sessionStorage.getItem("token")}`
                }
            })
                .then((res) => {
                    if (res?.data?.user?.email != null)
                        setUser(res.data.user)
                })
                .catch((err) => {
                    console.log(err);
                    seterr("Session Expired! login again...")
                    sessionStorage.removeItem("token")
                })
        }
    }, [])


    const login = async () => {
        setloading(true)
        const response = await fetch(process.env.REACT_APP_BACKEND_URL + "/api/v1/app/auth/logIn", {
            method: "POST",
            body: JSON.stringify({
                email: email.toLowerCase(),
                password: pswd,
            }),
            headers: {
                "Content-type": "application/json; charset=UTF-8"
            }
        })
            .then(async (res) => {
                const data = await res.json();
                console.log(data);

                Axios.post("/api/v1/app/users/getMyProfile", {}, {
                    headers: {
                        'authorization': `beare ${data.token}`
                    }
                })
                    .then((res) => {
                        console.log(res?.data.user)
                        if (res?.data?.user?.email != null)
                            setUser(res.data.user)
                        sessionStorage.setItem("token", data.token)
                        setloading(false)
                    }).catch((err) => {
                        console.log(err)
                        seterr("Invalid Credentials")
                        setloading(false)
                    })
            })
            .catch((err) => {
                console.log(err)
                seterr(err.message)
                seterr("Something went wrong! try again")
                setloading(false)

            })
    }

    const changepassword = async () => {
        setloading(true)
        Axios.post('/api/v1/app/auth/changePassword', {
            email: email,
            password: newPswd
        })
            .then(res => {
                console.log(res);
                console.log(res.data);
                setloading(false)
                setforgotPswd(false)
                setotpVerified(false)
                seterr("")
                setpswdMessage("Password changed successfully")
            })
            .catch(err => {
                console.log(err);
                console.log(err.response.data);
                console.log(err.message)
                setloading(false)
                seterr("Something went wrong! try again")
        })
    }

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            login();
        }
    }

    const validateEmail = () => {
        var re1 = /^(?![\S]*\d)[\S*a-z\.]+[@]christuniversity\.in/g;    //faculty
        var re2 = /^(?![\S]*\d)[\S*a-z\.]+[@][a-z\.]+[\.]christuniversity\.in/g;    //students
        if(re1.test(email) || re2.test(email)){
            setemailMessage("Valid Email ID")
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

    const sendOTPPasswordReset = () => {
        setbtnClick(true)
        Axios.post('/api/v1/app/auth/sendOTPPasswordReset', {
            email: email
        })
            .then(res => {
                console.log(res);
                console.log(res.data);
                setotpEmail(res.data.otp);
            })
            .catch(err => {
                console.log(err);
                console.log(err.response.data);
                console.log(err.message)})
    }

    const checkOTP = () => {
        console.log(otpUser);
        console.log(otpEmail);
        if(otpUser == otpEmail && otpUser != "" && otpEmail != ""){
            console.log("OTP verified");
            setotpVerified(true)
        }
        else{
            seterr("Invalid OTP");
        }
    }

    const checkPswd = () => {
        if(pswd === newPswd && pswd != "" && newPswd != ""){
            console.log("Password verified");
            changepassword();
        }
        else{
            seterr("Password mismatch");
        }
    }

    useEffect(() => {
        validateEmail();
    }, [email]);

    const forgotpassword = () => {
    console.log("forgot password clicked")
    setforgotPswd(true)
    }

    useEffect(() => {
        let timeoutId;
    
        if (pswdMessage !== "") {
          timeoutId = setTimeout(() => {
            setpswdMessage('');
          }, 5000);
        }
    
        return () => {
          clearTimeout(timeoutId);
        };
      }, [pswdMessage]);


    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '100vw' }}>
            <div className='rounded-3 mx-3 pb-4 d-flex flex-column align-items-center' style={{ backgroundColor: "#8cd9a1", boxShadow: "rgb(121 121 121 / 28%) 6px 6px 13px 1px" }}>
                <img className="rounded" src="login.jpg"
                    style={{ width: "100%" }} />
                <div className="p-3 pt-0 d-flex flex-column align-items-center">
                    <img src="hailride.png" height="50px" className='my-3' />
                    {
                        err !== "" &&
                        <b className='text-danger mb-2'>{err}</b>
                    }
                    {
                        forgotPswd ?
                        (!otpVerified ?
                        <>
                        <b>Forgot Password</b>
                        <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2 " type="text" placeholder='Email'
                            value={email} onChange={(e) => setemail(e.target.value)} onKeyDown={handleKeyDown}></input>
                            <div className={emailMessageColor ? 'text-sm' : 'text-danger text-sm'}>{emailMessage}</div>
                            <div className="mt-2 align-items-start mx-3 d-flex">
                                    {(emailMessageColor) && (
                                    <>
                                        <b className='btn btn-dark p-2' style={{height: '40px'}} onClick={() => sendOTPPasswordReset()}>Send OTP</b>
                                        {btnClick && (
                                            <input style={{ width: "140px", outline: "none", border: "none", background: "#e8f0fe", marginLeft: '10px'}} className="rounded-3 p-2 pe-3" type="text" placeholder='OTP'
                                            value={otpUser} onChange={(e) => setotpUser(e.target.value)} onKeyDown={handleKeyDown}></input>
                                        )}
                                    </>
                                    )}
                                </div>
                                <div onClick={() => checkOTP()} style={{width: "250px", height: '40px'}} className='btn btn-dark ms-2 mt-3 py-2'>
                                        <b>Continue</b>                                     
                                </div>
                            </>
                        :
                        <div>
                            <b className="p-3" >Forgot Password</b>
                                <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2" type="text" placeholder='New Password' value={pswd} onChange={(e) => setpswd(e.target.value)} onKeyDown={handleKeyDown}></input>
                                <div style={{ width: "250px", background: "#e8f0fe" }} className="d-flex justify-content-between rounded-3 m-2 p-2 pe-3">
                                <input style={{ outline: "none", border: "none", background: "#e8f0fe" }} type={viewPassword ? "text" : "password"} placeholder='Confirm Password' value={newPswd} onChange={(e) => setnewPswd(e.target.value)} onKeyDown={handleKeyDown}></input>
                                    <div onClick={() => setviewPassword(!viewPassword)} className='d-flex me-0 pe-1' style={{ cursor: "pointer", margin: "auto" }} >
                                    {
                                            viewPassword ?
                                                <EyeClosedIcon size={18} />
                                                :
                                                <EyeIcon size={18} />
                                        }
                                    </div>
                                </div>
                                <div onClick={() => checkPswd()} style={{width: "250px", height: '40px'}} className='btn btn-dark ms-2 mt-3 py-2'>
                                    {loading ?
                                        <Ring
                                            size={20}
                                            speed={2}
                                            color="white"
                                        />
                                        :
                                        <b>Set Password</b>                                     
                                    }                                    
                                </div>
                        </div>
                        )
                        :
                    <div className="d-flex flex-column align-items-center">
                        {pswdMessage !== "" && <div>{pswdMessage}</div>}
                        <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2 " type="text" placeholder='Email'
                            value={email} onChange={(e) => setemail(e.target.value)} onKeyDown={handleKeyDown}></input>
                        <div style={{ width: "250px", background: "#e8f0fe" }} className="d-flex justify-content-between rounded-3 m-2 p-2 pe-4">
                            <input style={{ outline: "none", border: "none", background: "#e8f0fe" }} type={viewPassword ? "text" : "password"} placeholder='Password' value={pswd} onChange={(e) => setpswd(e.target.value)} onKeyDown={handleKeyDown}></input>
                            <div onClick={() => setviewPassword(!viewPassword)} className='d-flex me-0' style={{ cursor: "pointer", margin: "auto" }} >
                                {
                                    viewPassword ?
                                        <EyeClosedIcon size={18} />
                                        :
                                        <EyeIcon size={18} />
                                }
                            </div>
                        </div>
                        <div onClick={() => login()} className='btn btn-dark w-100 ms-2 mt-3 py-2'>
                            {loading ?
                                <Ring
                                    size={20}
                                    speed={2}
                                    color="white"
                                />
                                :
                                <b>Login</b>
                            }
                        </div>
                        <div className='mt-3'>
                            <b onClick={() => forgotpassword()}>Forgot Password</b>
                        </div>
                        <div className='mt-3'>
                            <b>Don't have account? <span onClick={() => nav('/signup')} className='text-danger'>Signup</span></b>
                        </div>
                    </div>
                    }
                </div>
            </div>
        </div>
    )
}

export default Login