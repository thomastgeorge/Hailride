import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { UserContext } from '../../App'
import { useNavigate } from 'react-router-dom'

const PDetails = ({ride}) => {
    const { user } = useContext(UserContext)

    const [email, setemail] = useState(user.email)
    const [name, setname] = useState(user.name)
    const [gender, setgender] = useState(user.personalDetails?.gender)
    const [passengerDetails, setpassengerDetails] = useState({
        email: email,
        name: name,
        gender: gender
    })
    
    const [passengers, setPassengers] = useState(ride.passengers)

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
                        {passengers.length > 0 && (
                            <div style={{ margin: '10px' }}>
                                <h6>Passenger &nbsp; Name &nbsp;- Gender:</h6>
                                <ol style={{ margin: 4, padding: 0 }}>
                                    {passengers.map((passenger, index) => (
                                        <li key={index} style={{ margin: '1px 0', padding: 0 }}>
                                            <p style={{ margin: '0', padding: 0 }}>{passenger.name} - {passenger.gender}</p>
                                        </li>
                                ))}
                        </ol>
                    </div>
                    )}
                    {passengers.length === 0 && <p>No passengers</p>}
                    </div>
    )

}

export default PDetails