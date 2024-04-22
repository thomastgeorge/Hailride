import React, { useContext, useEffect, useState } from 'react'
import PublishItem from '../../Components/PublishItem/PublishItem'
import { PlusIcon } from '@primer/octicons-react'
import AddItem from '../../Components/AddItem/AddItem';
import { Axios } from '../../Config/Axios/Axios';
import { UserContext } from '../../App';
import { LeapFrog } from '@uiball/loaders';
import { Button, Modal } from 'antd';
import { CircleSlashIcon, NoteIcon, PersonFillIcon } from '@primer/octicons-react';
import MapPublish from '../../Components/Map/MapPublish';

const Publish = () => {

    const [rides, setRides] = useState([])
    const [loader, setloader] = useState(false)
    const [newPublish, setNewPublish] = useState(false)

    const { user } = useContext(UserContext)

    useEffect(() => {
        setloader(true)
        Axios.get('/api/v1/app/rides/getMyRides', {
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
    }, [newPublish])


    const newPublishClicked = () => {
        setNewPublish(true)
    }

    return (
        <>
            {!newPublish  ?
            <div className='p-3' style={{width: "100vw"}}>
                <div onClick={() => newPublishClicked()} className='btn d-flex justify-content-center btn-danger align-items-center w-100 mb-4 py-2'>
                    <PlusIcon size={30} />
                    <b className='ms-2'>Publish new ride</b>
                </div>
                <div className="text-center w-100">
                    {
                        loader ?
                            <div className='d-flex flex-column align-items-center'>
                                <LeapFrog />
                            </div>
                            :
                            (
                                rides.length === 0 ?
                                    <p className='fs-2 fw-bold'>No rides yet. Share a ride?</p>
                                    :
                                    rides.slice().reverse().filter(ride => ride.status != "ended").map(ride => {
                                        return (
                                            <PublishItem ride={ride} type="published" />
                                        )
                                    })
                            )
                    }
                </div>
                <div className='d-flex'>
                    <div className='w-25'><hr /></div>
                    <b className='text-black text-nowrap mx-3'>Past Rides</b>
                    <div className='w-100'><hr /></div>
                </div>
                <div className="text-center w-100">
                {
                    rides.slice().reverse().filter(ride => ride.status === "ended").map(ride => {
                        return (
                            <PublishItem ride={ride} type="published" />
                        )
                    })
                }
                </div>
            </div>
            
        
        :
            <>
                <div className="py-2 pt-4 pb-4  align-items-center " style={{width: "100vw"}}>
                    <div className='rounded m-3 pb-4' style={{ backgroundColor: "#8cd9a1" }}>
                        <MapPublish newPublish={newPublish} setNewPublish={setNewPublish}/>
                    </div>
                </div>
            </>
        }
        </>
    )
}

export default Publish