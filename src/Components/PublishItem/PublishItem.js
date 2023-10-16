import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { EllipsisIcon } from '@primer/octicons-react'
import { UserContext } from '../../App'

const PublishItem = ({ ride, type }) => {

    const [deleteSection, setDeleteSection] = useState(false)
    const [userDetails, setuserDetails] = useState(null)

    const { user } = useContext(UserContext)

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

    const hailRide = () => {
        Axios.put('/api/v1/app/rides/hailRide', {
            rideId: ride.rideId,
            email: user.email
        })
            .then(res => {
                window.location.reload()
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
                    <div>
                        <img className='rounded-circle' style={{ height: "40px", width: "40px", objectFit: "cover" }} src="https://img.freepik.com/free-photo/serious-surprised-attractive-man-holds-chin-looks-with-widely-opened-eyes-camera-wears-casual-sweater-listens-with-shocked-expression_273609-24440.jpg?w=900&t=st=1697382980~exp=1697383580~hmac=d5d10c6bf1c11ec8dd0dbf63f6b71321d6b27f5387d00447d3f6722950e517a0" />
                        <b className="text-white ms-2">{ride.addedBy}</b>
                    </div>
                    <div className="d-flex gap-3">
                        <div className="p-2 bg-white text-black rounded">
                            <b className="">Rs {ride.rate}</b>
                        </div>
                    </div>

                </div>
            </div>
            {
                (deleteSection && type === "published") &&
                < div className="p-2 pt-2 d-flex rounded" style={{ justifyContent: "right", backgroundColor: "#1c104154" }}>
                    <div className="btn btn-danger" onClick={cancelRide}>Cancel Ride</div>
                </div>
            }
            {
                (deleteSection && (type === "hail" || type === "hailed")) &&
                <div className="p-2 pt-2 d-flex justify-content-between rounded" style={{ backgroundColor: "#1c104154" }}>
                    <div className="p-2 rounded text-start">
                        <b>Vehicle Details</b>
                        <div className="d-flex gap-2">
                            <EllipsisIcon size={20} />
                            {userDetails?.vehicleDetails?.number}
                        </div>
                        <div className="d-flex gap-2">
                            <EllipsisIcon size={20} />
                            {userDetails?.vehicleDetails?.model}
                        </div>
                    </div>
                    {
                        type === "hailed" &&
                        <div className="d-flex align-items-center">
                            <div className="btn btn-danger px-5" onClick={hailRide}>Hail</div>
                        </div>
                    }

                </div>
            }
        </div >
    )
}

export default PublishItem