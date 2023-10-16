import React, { useState } from 'react'
import { useLocation } from 'react-router-dom'
import PublishItem from '../../Components/PublishItem/PublishItem'
import { LocationIcon } from '@primer/octicons-react'

const SearchResult = () => {

    const loc = useLocation()

    const [months, setmonths] = useState(['January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'])

    const [dateComponents, setdateComponents] = useState(loc.state.date.split("-"))

    return (
        <div className="p-2">
            <div className="d-flex rounded-3 p-2" style={{ backgroundColor: "#8cd9a1" }}>
                <div className="w-75 p-1 pe-3">
                    <b><LocationIcon size={18} /> {loc.state.from}</b>
                    <hr></hr>
                    <b><LocationIcon size={18} /> {loc.state.to}</b>
                </div>
                <div className="w-25 text-white d-flex flex-column align-items-center bg-black p-2 rounded-3">
                    <b style={{ fontSize: "16px" }}>{dateComponents[2]}</b>
                    <p className="m-0 p-0" style={{ fontSize: "14px" }}>{months[dateComponents[1]]}</p>
                    <p className="m-0 p-0" style={{ fontSize: "14px" }}>{dateComponents[0]}</p>
                </div>
            </div>
            <hr />
            <div className="text-center w-100">
                {
                    loc.state.rides.length == 0 ?
                        <p className='fs-2 fw-bold'>No rides for this day.</p>
                        :
                        loc.state.rides.map(ride => {
                            return (
                                <PublishItem ride={ride} type="hail"/>
                            )
                        })
                }
            </div>
        </div>
    )
}

export default SearchResult