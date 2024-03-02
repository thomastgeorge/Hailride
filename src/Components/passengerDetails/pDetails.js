import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'

const PDetails = ({ride}) => {
    const [passengers, setPassengers] = useState("")

    useEffect(() => {
        Axios.get('/api/v1/app/rides/getPassengerDetails', {
            params: {
                rideId: ride.rideId
            }
        })
            .then(res => {
                setPassengers(res.data.hailedBy)
                console.log(res.data.hailedBy);
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return(
        <div className="p-2 text-start d-flex justify-content-between rounded">
        {passengers.length > 0 ? (
            <div style={{ margin: '10px' }}>
                <h6>Passenger Name - Gender:</h6>
                <ol style={{ margin: 4, padding: 0 }}>
                    {passengers.map((passenger, index) => (
                        <li key={index} style={{ margin: '1px 0', padding: 0 }}>
                            <p style={{ margin: '0', padding: 0 }}>{passenger.name} - {passenger.gender}</p>
                        </li>
                    ))}
                </ol>
            </div>
        ) : (
            <p>No passengers</p>
        )}
    </div>
    )

}

export default PDetails