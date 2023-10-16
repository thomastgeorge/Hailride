import React, { useContext, useEffect, useState } from 'react'
import { UserContext } from '../../App'
import { CheckCircleIcon, CreditCardIcon, PencilIcon, VerifiedIcon } from '@primer/octicons-react'
import { Axios } from '../../Config/Axios/Axios'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const nav = useNavigate()

    const { setUser, user } = useContext(UserContext)

    const [license, setLicense] = useState("##########")
    const [updateLic, setUpdateLic] = useState(false)
    const [updatePersonal, setUpdatePersonal] = useState(false)
    const [updateVehicle, setUpdateVehicle] = useState(false)
    const [updateEmergency, setUpdateEmergency] = useState(false)

    const [personalDetails, setPersonalDetails] = useState({
        dob: "",
        gender: "",
        address: ""
    })
    const [vehicleDetails, setVehicleDetails] = useState({
        number: "",
        model: ""
    })
    const [emergency, setEmergency] = useState({
        name: "",
        email: ""
    })


    useEffect(() => {
        setLicense(user.license)
        setPersonalDetails(user.personalDetails)
        setVehicleDetails(user.vehicleDetails)
        setEmergency(user.emergencyContact)
    }, [])


    const updateLicense = () => {
        Axios.put('/api/v1/app/users/updateLicense', {
            userEmail: user.email,
            licenseNumber: license
        }, {
            headers: {
                'authorization': `beare ${sessionStorage.getItem("token")}`
            }
        })
            .then(res => setUpdateLic(false))
            .catch(err => console.log(err))
    }

    const updatePersonalDetails = () => {
        Axios.put('/api/v1/app/users/updatePersonal', {
            userEmail: user.email,
            personalDetails: personalDetails
        }, {
            headers: {
                'authorization': `beare ${sessionStorage.getItem("token")}`
            }
        })
            .then(res => setUpdatePersonal(false))
            .catch(err => console.log(err))
    }

    const updateVehicleDetails = () => {
        Axios.put('/api/v1/app/users/updateVehicle', {
            userEmail: user.email,
            vehicleDetails: vehicleDetails
        }, {
            headers: {
                'authorization': `beare ${sessionStorage.getItem("token")}`
            }
        })
            .then(res => setUpdateVehicle(false))
            .catch(err => console.log(err))
    }

    const updateEmergencyContact = () => {
        Axios.put('/api/v1/app/users/updateEmergency', {
            userEmail: user.email,
            emergencyContact: emergency
        }, {
            headers: {
                'authorization': `beare ${sessionStorage.getItem("token")}`
            }
        })
            .then(res => setUpdateEmergency(false))
            .catch(err => console.log(err))
    }

    const signOut = () => {
        if (window.confirm("Are you sure you want to signout?") === true) {
            sessionStorage.removeItem("token")
            setUser(null)
        }
        else {
            return
        }
    }

    return (
        <div className='p-4 pb-5 mb-3 h-100 text-white' style={{ background: "#d5f8e5" }}>
            <div className='d-flex p-2 rounded-3 align-items-center' style={{ background: "#000" }}>
                <div><img src="profile.png" height="100px" width="100px" style={{ borderRadius: "50%" }} /></div>
                <div className='d-flex flex-column ms-3 text-white justify-content-center'>
                    <b className='fs-2 m-0 p-0'>{user?.name}</b>
                    <p className='m-0 p-0'><i>{user?.email}</i></p>
                    <p className='m-0 p-0'><i>8527419638</i></p>
                </div>
            </div>
            <div onClick={() => nav('/myRides')} className="btn btn-danger w-100 py-2 my-2">
                <b>My Rides</b>
            </div>
            <div className='p-2 px-3 rounded mb-2 d-flex align-items-center justify-content-between' style={{ background: "#000" }}>
                <div className='d-flex align-items-center gap-3'>
                    <CreditCardIcon size={32} />
                    <div className='w-75'>
                        <input className='bg-black w-100 text-white m-0 fs-5 p-0 fw-bold' value={license?.toUpperCase()} onChange={e => { setLicense(e.target.value); setUpdateLic(true) }} style={{ outline: "none", border: "0" }} />
                        <hr className='m-0 p-0' />
                    </div>
                </div>
                {
                    updateLic &&
                    <div onClick={() => updateLicense()}>
                        <CheckCircleIcon size={28} fill={"green"} />
                    </div>
                }
            </div>
            <div className="mt-3">
                <b className='text-black'>Personal Details</b>
                <div className='p-3 rounded my-2' style={{ background: "#000" }}>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>DOB</b>
                        <div className='w-75'>
                            <input type='date' className='bg-black text-white' value={personalDetails?.dob}
                                onChange={e => {
                                    setPersonalDetails({
                                        ...personalDetails,
                                        dob: e.target.value
                                    });
                                    setUpdatePersonal(true)
                                }}
                                style={{ outline: "none", border: "0", color: "white" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>Gender</b>
                        <div className='w-75'>
                            <input className='bg-black text-white' value={personalDetails?.gender}
                                onChange={e => {
                                    setPersonalDetails({
                                        ...personalDetails,
                                        gender: e.target.value
                                    });
                                    setUpdatePersonal(true)
                                }}
                                style={{ outline: "none", border: "0" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>Address</b>
                        <div className='w-75'>
                            <textarea className='bg-black text-white' value={personalDetails?.address}
                                onChange={e => {
                                    setPersonalDetails({
                                        ...personalDetails,
                                        address: e.target.value
                                    });
                                    setUpdatePersonal(true)
                                }}
                                style={{ outline: "none", border: "0" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='text-end w-100'>
                        {
                            updatePersonal &&
                            <div onClick={updatePersonalDetails}><CheckCircleIcon size={28} fill={"green"} /></div>
                        }
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <b className='text-black'>Vehicle Details</b>
                <div className='p-3 rounded my-2' style={{ background: "#000" }}>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>Number</b>
                        <div className='w-75'>
                            <input className='bg-black text-white' value={vehicleDetails?.number}
                                onChange={e => {
                                    setVehicleDetails({
                                        ...vehicleDetails,
                                        number: e.target.value
                                    });
                                    setUpdateVehicle(true)
                                }}
                                style={{ outline: "none", border: "0" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>Model</b>
                        <div className='w-75'>
                            <input className='bg-black text-white' value={vehicleDetails?.model}
                                onChange={e => {
                                    setVehicleDetails({
                                        ...vehicleDetails,
                                        model: e.target.value
                                    });
                                    setUpdateVehicle(true)
                                }}
                                style={{ outline: "none", border: "0" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='text-end w-100'>
                        {
                            updateVehicle &&
                            <div onClick={updateVehicleDetails}><CheckCircleIcon size={28} fill={"green"} /></div>
                        }
                    </div>
                </div>
            </div>
            <div className="mt-3">
                <b className='text-black'>Emergency Contact</b>
                <div className='p-3 rounded my-2' style={{ background: "#000" }}>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>Name</b>
                        <div className='w-75'>
                            <input className='bg-black text-white' value={emergency?.name}
                                onChange={e => {
                                    setEmergency({
                                        ...emergency,
                                        name: e.target.value
                                    });
                                    setUpdateEmergency(true)
                                }}
                                style={{ outline: "none", border: "0" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='d-flex rounded align-items-center gap-3 my-2'>
                        <b className='w-25'>Email</b>
                        <div className='w-75'>
                            <input className='bg-black text-white' value={emergency?.email}
                                onChange={e => {
                                    setEmergency({
                                        ...emergency,
                                        email: e.target.value
                                    });
                                    setUpdateEmergency(true)
                                }}
                                style={{ outline: "none", border: "0" }} />
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                    <div className='text-end w-100'>
                        {
                            updateEmergency &&
                            <div onClick={updateEmergencyContact}><CheckCircleIcon size={28} fill={"green"} /></div>
                        }
                    </div>
                </div>
            </div>

            <div onClick={signOut} className='mt-3 btn btn-danger w-100 rounded-3 text-white'><b>Signout</b></div>

        </div>
    )
}

export default Profile