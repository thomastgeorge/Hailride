import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { EllipsisIcon } from '@primer/octicons-react'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { DotSpinner } from '@uiball/loaders'
import { Rating } from 'react-simple-star-rating'
import PDetails from '../passengerDetails/pDetails'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';


const PublishItem = ({ ride, type, fromCoordinates, toCoordinates, from, to }) => {


    const [deleteSection, setDeleteSection] = useState(false)
    const [userDetails, setuserDetails] = useState(null)

    const [loader, setloader] = useState(false)

    const { user } = useContext(UserContext)

    const [email, setemail] = useState(user.email)
    const [name, setname] = useState(user.name)
    const [gender, setgender] = useState(user.personalDetails?.gender)
    const [mobile, setmobile] = useState(user.personalDetails?.mobile)
    const [passengerDetails, setpassengerDetails] = useState({
        email: email,
        name: name,
        gender: gender,
        mobile: mobile,
        from: from,
        to: to,
        fromCoordinates: fromCoordinates,
        toCoordinates: toCoordinates,
    })

    const [isUserDriver, setisUserDriver] = useState(false)
    useEffect(() => {
        {(ride.addedByEmail === user.email) ? setisUserDriver(true): setisUserDriver(false)}
    }, [])

    const nav = useNavigate()

    const [rating, setRating] = useState(ride.rating) // initial rating value

    // Catch Rating value
    const handleRating = (rate) => {
        setRating(rate)
        Axios.put('/api/v1/app/rides/updateRating', {
            rideId: ride.rideId,
            rating: rate,
            addedByEmail: ride.addedByEmail
        })
            .then(res => {
                console.log(res);
                window.location.reload()
            })
            .catch(err => {
                console.log(err);
            })
    }

    useEffect(() => {
        Axios.get('/api/v1/app/rides/getUserDetails', {
            params: {
                email: ride.addedByEmail
            }
        })
            .then(res => {
                console.log(res.data.user);
                setuserDetails(res.data.user)
            })
    }, [])

    const emergencySOS = () => {
        if (window.confirm("Are you sure, you want to active SOS ?")) {
            setloader(true);
            Axios.post('/api/v1/app/rides/emergencySOS', {
                rider: userDetails,
                userDetails: user,
                emergencyContact: user.emergencyContact.email
            })
                .then(res => {
                    setloader(false)
                    window.alert('Emergency Contact has been notified')
                })
                .catch(err => { console.log(err); setloader(false) })
        }
    }

    const cancelRide = () => {
        Axios.delete('/api/v1/app/rides/deleteRide', {
            params: {
                rideId: ride.rideId
            }
        })
            .then(res => {
                window.location.reload()
            })
            .catch(err => {
                console.log(err);
            })
    }

    const cancelRidePassenger = () => {
        Axios.put('/api/v1/app/rides/cancelRidePassenger', {
            rideId: ride.rideId,
            email: user.email
        })
            .then(res => {
                window.location.reload()
            })
            .catch(err => {
                console.log(err);
            })
        console.log('cancelRidePassenger')
    }

    const updateRideStatus = (val) => {
        Axios.put('/api/v1/app/rides/updateRideStatus', {
            rideId: ride.rideId,
            status: val
        })
            .then(res => {
                console.log(res);
                window.location.reload()
            })
            .catch(err => {
                console.log(err);
            })
    }

    const hailRide = () => {
        Axios.put('/api/v1/app/rides/hailRide', {
            rideId: ride.rideId,
            passengerDetails: passengerDetails
        })
            .then(res => {
                nav('/myRides')
            })
            .catch(err => {
                console.log(err);
            })
    }    

    const handleCopyToClipboard = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => {
                // Optionally, you can provide feedback to the user that the text has been copied.
                console.log('Mobile number copied to clipboard:', text);
            })
            .catch((error) => {
                console.error('Error copying mobile number to clipboard:', error);
            });
    };

    return (
        <div className="rounded my-2" style={{ backgroundColor: '#8cd9a1' }}>
            <div onClick={() => setDeleteSection(!deleteSection)}>
                <div className='pe-2 pt-4 d-flex text-white' style={{ maxWidth: '100%' }}>
                    <div style={{width: "100px"}}>
                        <b style={{ whiteSpace: "nowrap" }}>{ride.starts}</b>
                        <p>{ride.from}</p>
                    </div>
                    <div style={{ flex: "1 1 0%", minWidth: '0', maxWidth: '100%', padding: '0 8px' }}><hr /></div>
                    {/* <div className='w-100 d-flex justify-content-center'> */}
                    <p className="p-0 m-0 mx-2" style={{ flex: "1 1 auto", fontSize: '14px', whiteSpace: "nowrap" }}>{ride.rideDate}</p>
                    {/* </div> */}
                    <div style={{ flex: "1 1 0%", minWidth: '0', maxWidth: '100%', padding: '0 8px' }}><hr /></div>
                    <div style={{ width: "100px" }}>
                        <b style={{ whiteSpace: "nowrap" }}>{ride.ends}</b>
                        <p>{ride.to}</p>
                    </div>
                </div>
                <div className='p-3 d-flex align-items-center justify-content-between'>
                    <div className='d-flex'>
                        <img className='rounded-circle' style={{ height: "40px", width: "40px", objectFit: "cover" }} src="https://img.freepik.com/free-photo/serious-surprised-attractive-man-holds-chin-looks-with-widely-opened-eyes-camera-wears-casual-sweater-listens-with-shocked-expression_273609-24440.jpg?w=900&t=st=1697382980~exp=1697383580~hmac=d5d10c6bf1c11ec8dd0dbf63f6b71321d6b27f5387d00447d3f6722950e517a0" />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '10px' }}>
                            <b className="text-white ms-2">{ride.addedBy}</b>
                            <div className="ms-2" style={{ display: 'inline-block' }}>
                                {(type !== "hail" && !isUserDriver ) ? 
                                <>
                                    <b style={{ display: 'inline-block', marginRight: '5px' }}>{ride.mobile}</b>
                                    <FontAwesomeIcon icon={faCopy} onClick={() => handleCopyToClipboard(ride.mobile)} style={{ cursor: 'pointer', display: 'inline-block' }} />
                                </>
                                : null
                                }
                            </div>
                            <div>
                                {
                                    ride.status === "" && type === "hail" &&
                                    <div>
                                        {
                                            Array.from({ length: ride.addedByUserRating }).map((_, index) => (
                                                <span key={index} style={{ fontSize: '15px' }}>⭐</span>
                                            ))
                                        }
                                        <span className='text-white'>({ride.addedByUserRatingCount})</span>
                                    </div>
                                }
                            </div>
                        </div>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="p-2 bg-white text-black rounded">
                            <b className="">Rs {ride.rate}</b>
                        </div>
                    </div>
                </div>
                {
                    (deleteSection && ride.status === "ended") &&
                        < div className="p-0" style={{ backgroundColor: "#1c104154"}}>
                        <PDetails ride={ride} isUserDriver={isUserDriver} />
                                    </div>
                }
            </div>
            {
                (deleteSection && type === "published" && ride.status === "") &&
                < div  style={{ justifyContent: "right", backgroundColor: "#1c104154" }}>
                    <PDetails ride={ride} isUserDriver={isUserDriver}/>
                    < div className="p-2 pt-2 d-flex rounded gap-2" style={{ justifyContent: "right" }}>
                        <div className="btn btn-success p-2 pt-2 rounded gap-2" onClick={() => updateRideStatus("started")}>Started</div>
                        <div className="btn btn-danger p-2 pt-2 rounded gap-2" onClick={cancelRide}>Cancel Ride</div>
                    </div>
                </div>
            }
            {
                (deleteSection && type === "published" && ride.status === "started") &&
                < div  style={{ justifyContent: "right", backgroundColor: "#1c104154" }}>
                    <PDetails ride={ride} isUserDriver={isUserDriver}/>
                    <div className="p-2 pt-2 d-flex rounded gap-2" style={{ justifyContent: "right" }}>
                        <div className="btn btn-danger p-2 pt-2 rounded gap-2"  onClick={() => updateRideStatus("ended")}>End Ride</div>
                    </div>
                </div>
            }
            {
                (deleteSection && (type === "hail" || type === "hailed")) &&
                <div  style={{ backgroundColor: "#1c104154" }}>
                    <PDetails ride={ride} isUserDriver={isUserDriver}/>
                    <div className="p-2 d-flex rounded gap-2  justify-content-between " >
                        <div className="p-2 rounded text-start flex-column d-flex">
                            <b>Vehicle Details</b>
                            <div className="d-flex gap-2" style={{ textWrap: "nowrap" }}>
                                <EllipsisIcon size={20} />
                                {userDetails?.vehicleDetails?.number}
                            </div>
                            <div className="d-flex gap-2" style={{ textWrap: "nowrap" }}>
                                <EllipsisIcon size={20} />
                                {userDetails?.vehicleDetails?.model}
                            </div>
                        </div>
                        {
                            type === "hail" &&
                            <div className="d-flex align-items-center justify-content-between  " >
                                <div className="btn btn-danger px-5" onClick={hailRide}>Hail</div>
                            </div>
                        }                
                        {
                        type === "hailed" && ride.status === "started" &&
                        <div className="d-flex rounded p-3 align-items-center">
                            {
                                loader ?
                                    <DotSpinner />
                                    :
                                    <div className="btn btn-danger px-2.5 py-2" onClick={emergencySOS}>Emergency SOS</div>
                            }
                        </div>
                        }
                        {
                            (deleteSection && type === "hailed" && ride.status === "") &&
                            <div className="d-flex align-items-center justify-content-between  ">
                                <div className="btn btn-danger px-2 py-2" onClick={cancelRidePassenger}>Cancel Ride</div>
                            </div>
                        }

                        </div>
                    </div>
            }
            {
                (ride.status === 'ended' && type === 'ended') &&
                <div className="d-flex align-items-center">
                    {
                        ride.rating > 0 ?
                            (
                                < div className="bg-success p-2 text-white rounded px-5 w-100 d-flex align-items-center justify-content-between" >
                                    <b>You have rated  {ride.rating}/5</b>
                                </div>
                            )
                            :
                            (
                                <div className="bg-success p-2 text-white rounded px-5 w-100 d-flex align-items-center justify-content-between" >
                                    <b>Rate your ride</b>
                                    <Rating
                                        onClick={handleRating}
                                        ratingValue={rating}
                                        size={24}
                                        label
                                        transition
                                        fillColor='orange'
                                        emptyColor='gray'
                                        className='foo'
                                    />
                                </div>
                            )
                    }
                </div>
            }
        </div >
    )
}

export default PublishItem