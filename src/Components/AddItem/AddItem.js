import React, { useContext, useEffect, useState } from 'react';
import { Button, Modal } from 'antd';
import { CircleSlashIcon, NoteIcon, PersonFillIcon } from '@primer/octicons-react';
import { Axios } from '../../Config/Axios/Axios';
import { UserContext } from '../../App';
import SearchLocation from '../SearchLocation/SearchLocation';

const AddItem = ({ open, setOpen }) => {

    const { user } = useContext(UserContext)
    console.log(user);

    const [valid, setvalid] = useState(true)

    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [starts, setStarts] = useState("")
    const [ends, setEnds] = useState("")
    const [rideDate, setRideDate] = useState("")
    const [rate, setRate] = useState("")
    const [passengers, setPassengers] = useState("")

    const [loading, setLoading] = useState(false);

    const showModal = () => {
        setOpen(true);
    };

    const [openSearch, setOpenSearch] = useState(false)

    const setLocation = (loc) => {
        openSearch === 'from' ?
            setFrom(loc)
            :
            setTo(loc)
    }

    const resetForm = () => {
        setFrom("");
        setTo("");
        setStarts("");
        setEnds("");
        setRideDate("");
        setRate("");
        setPassengers("");
    }

    const handleOk = () => {
        setLoading(true);
        if (!from || !to || !starts || !ends || !rideDate || !rate || !passengers) {
            setvalid(false)
            setLoading(false)
            return
        }
        Axios.post('/api/v1/app/rides/postRide', {
            addedByEmail: user.email,
            addedBy: user.name,
            from: from,
            to: to,
            starts: starts,
            ends: ends,
            rideDate: rideDate,
            rate: rate,
            passengers: passengers
        })
            .then(res => {
                setOpen(false);
                setLoading(false)
                resetForm()
            })
            .catch(err => {
                console.error();
                setLoading(false)
            })
    };
    const handleCancel = () => {
        setOpen(false);
    };


    return (
        <>
            <Modal
                open={open}
                title="Add Ride"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleCancel}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        Submit
                    </Button>,
                ]}
            >
                <div className="py-2 pb-4">
                    <div>
                        <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>From<span className='text-danger'>*</span></b>
                            <input value={from} onClick={() => setOpenSearch('from')} className='p-2 w-75 rounded-3'
                                style={!valid && from == "" ? { borderColor: "red", background: "#ff00001c", outline: "none", border: "0" } : { outline: "none", border: "0" }} />
                        </div>
                    </div>
                    <hr className='m-0 p-0' />
                    <div>
                        <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>To<span className='text-danger'>*</span></b>
                            <input value={to} onClick={() => setOpenSearch('to')} className='p-2 w-75 rounded-3'
                                style={!valid && to == "" ? { borderColor: "red", background: "#ff00001c", outline: "none", border: "0" } : { outline: "none", border: "0" }} />
                        </div>
                    </div>
                    <hr className='m-0 p-0' />
                    <div className="  my-2 p-2 rounded d-flex align-items-center justify-content-between">
                        <div>
                            <input type='time' value={starts} onChange={(e) => setStarts(e.target.value)} className='rounded p-2' style={!valid && starts == "" ? { borderColor: "red", background: "#ff00001c" } : {}} />
                        </div>
                        <div><b>to</b></div>
                        <div>
                            <input type='time' value={ends} onChange={(e) => setEnds(e.target.value)} className='rounded p-2' style={!valid && starts == "" ? { borderColor: "red", background: "#ff00001c" } : {}} />
                        </div>
                    </div>
                    <div>
                        <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>Ride Date<span className='text-danger'>*</span></b>
                            <input value={rideDate} onChange={e => setRideDate(e.target.value)} className='p-2 w-75 bg-white rounded-3' type="date"
                                style={!valid && rideDate ? { borderColor: "red", background: "#ff00001c", outline: "none", border: "0" } : { outline: "none", border: "0" }} />
                        </div>
                    </div>
                    <hr className='m-0 p-0' />
                    <div className="  mt-2 pt-2 rounded d-flex align-items-center justify-content-between">
                        <div>
                            <div className='d-flex align-items-center bg-white rounded pe-2' >
                                <input type="number" value={rate} onChange={(e) => setRate(e.target.value)} className='rounded p-2' style={{ width: "100px", outline: "none", border: "0" }} min={1} />
                                <NoteIcon size={22} fill={"black"} />
                            </div>
                            <hr className='m-0 p-0' />
                        </div>
                        <div>
                            <div className='d-flex align-items-center bg-white rounded pe-2'>
                                <input type="number" value={passengers} onChange={(e) => setPassengers(e.target.value)} className='rounded p-2' style={{ width: "100px", outline: "none", border: "0" }} min={1} />
                                <PersonFillIcon size={22} fill={"black"} />
                            </div>
                            <hr className='m-0 p-0' />
                        </div>
                    </div>
                </div>
            </Modal>
            <SearchLocation open={openSearch} setOpen={setOpenSearch} setLocation={setLocation} />
        </>
    )
}

export default AddItem