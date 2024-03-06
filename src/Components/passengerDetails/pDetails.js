import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy } from '@fortawesome/free-regular-svg-icons';

const PDetails = ({ride, isUserHailed}) => {
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

    return(
        <div className="p-2 text-start d-flex justify-content-between rounded">
        {passengers.length > 0 ? (
            <div style={{ margin: '10px' }}>
                <h6>Passenger Name - Gender - Mobile:</h6>
                <ol style={{ margin: 4, padding: 0 }}>
                    {passengers.map((passenger, index) => (
                        <li key={index} style={{ margin: '1px 0', padding: 0 }}>
                            {(!isUserHailed) ? (<p style={{ margin: '0', padding: 0 }}>{passenger.name} - {passenger.gender}</p>)
                            : (<>
                            <p style={{ margin: '0', padding: 0, display: 'inline-block', marginRight: '5px' }}>{passenger.name} - {passenger.gender} - {passenger.mobile}</p>
                            <FontAwesomeIcon icon={faCopy} onClick={() => handleCopyToClipboard(passenger.mobile)} style={{ cursor: 'pointer', display: 'inline-block' }} />
                            </>)
                            }
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