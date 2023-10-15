import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { CircleSlashIcon, NoteIcon, PersonFillIcon } from '@primer/octicons-react';

const AddItem = ({ open, setOpen }) => {

    const [valid, setvalid] = useState(true)

    const [from, setFrom] = useState()

    const [loading, setLoading] = useState(false);
    const showModal = () => {
        setOpen(true);
    };
    const handleOk = () => {
        setLoading(true);
        setTimeout(() => {
            setLoading(false);
            setOpen(false);
        }, 3000);
    };
    const handleCancel = () => {
        setOpen(false);
    };


    return (
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
                        <input value={from} onChange={e => setFrom(e.target.value)} className='p-2 w-75 rounded-3'
                            style={!valid && from == "" ? { borderColor: "red", background: "#ff00001c", outline: "none", border: "0" } : { outline: "none", border: "0" }} />
                    </div>
                </div>
                <hr className='m-0 p-0' />
                <div>
                    <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                        <b>To<span className='text-danger'>*</span></b>
                        <input value={from} onChange={e => setFrom(e.target.value)} className='p-2 w-75 rounded-3'
                            style={!valid && from == "" ? { borderColor: "red", background: "#ff00001c", outline: "none", border: "0" } : { outline: "none", border: "0" }} />
                    </div>
                </div>
                <hr className='m-0 p-0' />
                <div className="  my-2 p-2 rounded d-flex align-items-center justify-content-between">
                    <div>
                        <input type='time' className='rounded p-2' />
                    </div>
                    <div><b>to</b></div>
                    <div>
                        <input type='time' className='rounded p-2' />
                    </div>
                </div>
                <div>
                    <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                        <b>Ride Date<span className='text-danger'>*</span></b>
                        <input value={from} onChange={e => setFrom(e.target.value)} className='p-2 w-75 bg-white rounded-3' type="date"
                            style={!valid && from == "" ? { borderColor: "red", background: "#ff00001c", outline: "none", border: "0" } : { outline: "none", border: "0" }} />
                    </div>
                </div>
                <hr className='m-0 p-0' />
                <div className="  mt-2 pt-2 rounded d-flex align-items-center justify-content-between">
                    <div>
                        <div className='d-flex align-items-center bg-white rounded pe-2'>
                            <input type="number" className='rounded p-2' style={{ width: "100px", outline: "none", border: "0" }} min={1} />
                            <NoteIcon size={22} fill={"black"} />
                        </div>
                        <hr className='m-0 p-0' />
                    </div>
                    <div>
                        <div className='d-flex align-items-center bg-white rounded pe-2'>
                            <input type="number" className='rounded p-2' style={{ width: "100px", outline: "none", border: "0" }} min={1} />
                            <PersonFillIcon size={22} fill={"black"} />
                        </div>
                        <hr className='m-0 p-0' />
                    </div>
                </div>
            </div>
        </Modal>
    )
}

export default AddItem