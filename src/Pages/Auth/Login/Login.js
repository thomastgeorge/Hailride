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

    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault(); // Prevent form submission
            login();
        }
    }


    return (
        <div className='d-flex justify-content-center align-items-center' style={{ height: '100vh', width: '100vw' }}>
            <div className='rounded-3 p-4 d-flex flex-column align-items-center' style={{ backgroundColor: "#dede28cf", boxShadow: "rgb(121 121 121 / 28%) 6px 6px 13px 1px" }}>
                {/* <img className="m-4 mb-2" src="/tiei.png" style={{ width: "50%" }} /> */}
                {/* <b className='h1 fw-bold py-3 pb-2'><i>Assign Me</i></b> */}
                <img src="logo-phase2.png" height="50px" className='my-3' />
                {
                    err !== "" &&
                    <b className='text-danger mb-2'>{err}</b>
                }
                <div className="d-flex flex-column align-items-center">
                    <input style={{ width: "250px", outline: "none", border: "none", background: "#e8f0fe" }} className="rounded-3 m-2 p-2 " type="text" placeholder='Email'
                        value={email} onChange={(e) => setemail(e.target.value)} onKeyDown={handleKeyDown}></input>
                    <div style={{ width: "250px", background: "#e8f0fe" }} className="d-flex justify-content-between rounded-3 m-2 p-2 pe-3">
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
                        <b>Don't have account? <span onClick={() => nav('/signup')} className='text-danger'>Signup</span></b>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login