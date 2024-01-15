import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { EllipsisIcon } from '@primer/octicons-react'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'
import { DotSpinner } from '@uiball/loaders'
import { Rating } from 'react-simple-star-rating'


const PublishItem = ({ ride, type }) => {


    const [deleteSection, setDeleteSection] = useState(false)
    const [userDetails, setuserDetails] = useState(null)

    const [loader, setloader] = useState(false)

    const { user } = useContext(UserContext)

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
            email: user.email
        })
            .then(res => {
                nav('/myRides')
            })
            .catch(err => {
                console.log(err);
            })
    }

    return (
        <div className="rounded my-2" style={{ backgroundColor: '#8cd9a1' }}>
            <div className="p-3" onClick={() => setDeleteSection(!deleteSection)}>
                <div className='d-flex text-white'>
                    <div className='pe-2'>
                        <b style={{ whiteSpace: "nowrap" }}>{ride.starts}</b>
                        <p style={{ whiteSpace: "nowrap" }}>{ride.from}</p>
                    </div>
                    <div style={{ width: '100%' }}><hr /></div>
                    {/* <div className='w-100 d-flex justify-content-center'> */}
                    <p className="p-0 m-0 mx-2" style={{ width: 'minContent', fontSize: '14px', whiteSpace: "nowrap" }}>{ride.rideDate}</p>
                    {/* </div> */}
                    <div style={{ width: '100%' }}><hr /></div>
                    <div className='ps-2'>
                        <b style={{ whiteSpace: "nowrap" }}>{ride.ends}</b>
                        <p style={{ whiteSpace: "nowrap" }}>{ride.to}</p>
                    </div>
                </div>
                <div className='d-flex align-items-center justify-content-between'>
                    <div className='d-flex'>
                        <img className='rounded-circle' style={{ height: "40px", width: "40px", objectFit: "cover" }} src="https://img.freepik.com/free-photo/serious-surprised-attractive-man-holds-chin-looks-with-widely-opened-eyes-camera-wears-casual-sweater-listens-with-shocked-expression_273609-24440.jpg?w=900&t=st=1697382980~exp=1697383580~hmac=d5d10c6bf1c11ec8dd0dbf63f6b71321d6b27f5387d00447d3f6722950e517a0" />
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', marginLeft: '10px' }}>
                            <b className="text-white ms-2">{ride.addedBy}</b>
                            <div>
                                {
                                    ride.status === "" && type === "hail" &&
                                    <div>
                                        {
                                            Array.from({ length: ride.addedByUserRating }).map((_, index) => (
                                                <span key={index} style={{ fontSize: '15px' }}>⭐</span>
                                            ))
                                        }
                                        <b>({ride.addedByUserRatingCount})</b>
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
            </div>
            {
                (deleteSection && type === "published" && ride.status === "") &&
                < div className="p-2 pt-2 d-flex rounded gap-2" style={{ justifyContent: "right", backgroundColor: "#1c104154" }}>
                    <div className="btn btn-success" onClick={() => updateRideStatus("started")}>Started</div>
                    <div className="btn btn-danger" onClick={cancelRide}>Cancel Ride</div>
                </div>
            }
            {
                (deleteSection && type === "published" && ride.status === "started") &&
                < div className="p-2 pt-2 d-flex rounded gap-2" style={{ justifyContent: "right", backgroundColor: "#1c104154" }}>
                    <div className="btn btn-danger" onClick={() => updateRideStatus("ended")}>End Ride</div>
                </div>
            }
            {
                (deleteSection && (type === "hail" || type === "hailed")) &&
                <div className="p-2 pt-2 d-flex justify-content-between rounded" style={{ backgroundColor: "#1c104154" }}>
                    <div className="p-2 rounded text-start">
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
                        <div className="d-flex align-items-center">
                            <div className="btn btn-danger px-5" onClick={hailRide}>Hail</div>
                        </div>
                    }
                    {
                        type === "hailed" && ride.status === "started" &&
                        <div className="d-flex align-items-center">
                            {
                                loader ?
                                    <DotSpinner />
                                    :
                                    <div className="btn btn-danger px-5" onClick={emergencySOS}>Emergency SOS</div>
                            }
                        </div>
                    }
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