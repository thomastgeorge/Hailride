import { BookmarkFillIcon, CalendarIcon, DuplicateIcon, PersonFillIcon, PersonIcon } from '@primer/octicons-react'
import React, { useState } from 'react'
import SearchLocation from '../../Components/SearchLocation/SearchLocation'
import { useNavigate } from 'react-router-dom'
import { Axios } from '../../Config/Axios/Axios'
import { Spin } from 'antd'
import { DotSpinner, LeapFrog } from '@uiball/loaders'

const Search = () => {

    const [valid, setvalid] = useState(true)
    const [open, setOpen] = useState(false)

    const [from, setFrom] = useState("")
    const [to, setTo] = useState("")
    const [date, setDate] = useState(new Date().toISOString().split('T')[0])
    const [passengers, setPassengers] = useState(1)

    const nav = useNavigate()

    const [loader, setloader] = useState(false)

    const setLocation = (loc) => {
        open === 'from' ?
            setFrom(loc)
            :
            setTo(loc)
    }

    const searchRides = () => {
        setloader(true)
        if (!from || !to || !date || !passengers) {
            setvalid(false)
            setloader(false)
            return
        }

        Axios.get('/api/v1/app/rides/getRides', {
            params: {
                from: from,
                to: to,
                date: date,
                passengers: passengers
            }
        })
            .then(res => {
                setloader(false)
                nav('/searchResult', {
                    state: {
                        from: from,
                        to: to,
                        date: date,
                        rides: res.data.rides
                    }
                })
                console.log(res);
            })
            .catch(err => {
                console.log(err);
                setloader(false)
            })
    }

    return (
        <>
            <div className='p-2 pt-4'>
                <div className='d-flex flex-column align-items-center'>
                    <b style={{ fontSize: "32px" }}>Hail your Ride!</b>
                    <img src="mainPage.jpg" style={{ width: 'calc( 100vw - 20px )' }} />
                </div>
                {
                    !valid &&
                    <b className="text-danger ps-3">*Fill out the required feilds</b>
                }
                <div className='rounded m-3' style={{ backgroundColor: "#8cd9a1" }}>
                    <div className='p-3 pb-4'>
                        <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>From<span className='text-danger'>*</span></b>
                            <input value={from} onClick={() => setOpen('from')} className='p-2 w-75 rounded-3' style={{ outline: "none", border: "0", background: "rgb(140, 217, 161)" }} />
                        </div>
                        <hr className='p-0 m-0' />
                        <div className='mt-2 d-flex justify-content-between align-items-center rounded-3 p-2 pb-0 w-100'>
                            <b>To<span className='text-danger'>*</span></b>
                            <input value={to} onClick={() => setOpen('to')} className='p-2 w-75 rounded-3' style={{ outline: "none", border: "0", background: "rgb(140, 217, 161)" }} />
                        </div>
                        <hr className='p-0 m-0' />

                        <div className='d-flex mt-3 align-items-center justify-content-between'>
                            <div className='d-flex flex-column text-dark'>
                                <p className='mb-1 ps-2 fw-bold'>Date<span className='text-danger'>*</span></p>
                                <input 
                                type="date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                className='rounded p-2 pointer-events-none bg-gray-300' 
                                style={{ outline: "none", border: "0", background: "rgb(140, 217, 161)" }} 
                                min={new Date().toISOString().split("T")[0]} // Disable past dates
                                />
                            <hr className='p-0 m-0 text-dark' />
                            </div>

                            <div>
                                <p className='mb-1 text-dark fw-bold'>Passengers<span className='text-danger'>*</span></p>
                                <div className='rounded pe-2'>
                                    <div>
                                        <input type="number" value={passengers} onChange={e => { setPassengers(e.target.value) }} className='rounded p-2' style={{ width: "80px", outline: "none", border: "0", background: "rgb(140, 217, 161)" }} min={1} max={6} />
                                        <PersonFillIcon size={22} fill={"black"} />
                                    </div>
                                    <hr className='p-0 m-0 text-dark' />

                                </div>
                            </div>
                        </div>
                    </div>
                    <div onClick={searchRides} className='p-2 py-3 btn d-flex justify-content-center bg-black' style={{ borderTopLeftRadius: "0px", borderTopRightRadius: "0px" }}>
                        {
                            loader ?
                                <LeapFrog color="white" />
                                :
                                <b className="text-white fs-5">Search</b>
                        }
                    </div>
                </div>
            </div>
            <SearchLocation open={open} setOpen={setOpen} setLocation={setLocation} />
        </>
    )
}

export default Search