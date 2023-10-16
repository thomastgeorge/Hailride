import React, { useContext, useEffect, useState } from 'react'
import PublishItem from '../../Components/PublishItem/PublishItem'
import { PlusIcon } from '@primer/octicons-react'
import AddItem from '../../Components/AddItem/AddItem';
import { Axios } from '../../Config/Axios/Axios';
import { UserContext } from '../../App';

const Publish = () => {

    const [open, setOpen] = useState(false);

    const [rides, setRides] = useState([])

    const { user } = useContext(UserContext)

    useEffect(() => {
        Axios.get('/api/v1/app/rides/getMyRides', {
            params: {
                userEmail: user.email
            }
        })
            .then(res => {
                setRides(res.data.rides)
                console.log(res);
            })
            .catch(err => {
                console.log(err);
            })
    }, [open])


    return (
        <>
            <div className='p-2'>
                <div onClick={() => setOpen(true)} className='btn d-flex justify-content-center btn-danger align-items-center w-100 mb-4 py-2'>
                    <PlusIcon size={30} />
                    <b className='ms-2'>Publish new ride</b>
                </div>
                {
                    rides.length === 0 ?
                        <div><b className='fs-5 ms-3'>No Rides yet!</b></div>
                        :
                        rides.slice().reverse().map(ride => {
                            return (
                                <PublishItem ride={ride} />
                            )
                        })
                }

            </div>
            <AddItem open={open} setOpen={setOpen} />
        </>
    )
}

export default Publish