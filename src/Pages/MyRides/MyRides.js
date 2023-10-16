import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import PublishItem from '../../Components/PublishItem/PublishItem'
import { UserContext } from '../../App'
import { LeapFrog } from '@uiball/loaders'

const MyRides = () => {

    const [rides, setRides] = useState([])
    const [loader, setloader] = useState(false)

    const { user } = useContext(UserContext)

    useEffect(() => {
        setloader(true)
        Axios.get('/api/v1/app/rides/getHailedRides', {
            params: {
                userEmail: user.email
            }
        })
            .then(res => {
                setRides(res.data.rides)
                console.log(res);
                setloader(false)
            })
            .catch(err => {
                console.log(err);
            })
    }, [])

    return (
        <div className="p-3">
            <div className='d-flex flex-column align-items-center'>
                <img src="mainCar.gif" style={{ width: 'calc( 100vw - 35px )' }} />
            </div>
            <h2 className="my-3"><b>My Rides</b></h2>
            <div className="text-center w-100">
                {
                    loader ?
                        <div className='d-flex flex-column align-items-center'>
                            <LeapFrog />
                        </div>
                        :
                        rides.length === 0 ?
                            <p className='fs-2 fw-bold'>No rides yet. Hail a ride?</p>
                            :
                            rides.slice().reverse().map(ride => {
                                return (
                                    <PublishItem ride={ride} type="hailed" />
                                )
                            })
                }
            </div>
        </div>
    )
}

export default MyRides