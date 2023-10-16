import { ChevronLeftIcon, PersonFillIcon } from '@primer/octicons-react'
import React, { useContext, useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { UserContext } from '../../App'

const NavBar = () => {

    const nav = useNavigate()
    const loc = useLocation()

    const { user } = useContext(UserContext)

    const [dashboardSelected, setdashboardSelected] = useState(true)

    useEffect(() => {
        if (loc.pathname === "/" || loc.pathname === "/search") {
            setdashboardSelected(true)
        }
        else if (loc.pathname === "/publish") {
            setdashboardSelected(false)
        }
    }, [])


    return (
        <div className='d-flex bg-black text-white justify-content-between align-items-center p-2 px-3' style={{ height: "80px", width: "100vw", borderBottomLeftRadius: "18px", borderBottomRightRadius: "18px" }}>
            {/* {
                (loc.pathname !== "/" && loc.pathname !== "/dashboard" && loc.pathname !== "/categories") ?
                    <div onClick={() => nav(-1)}><ChevronLeftIcon size={36} /></div>
                    :
                    <div className='text-black'><ChevronLeftIcon size={36} /></div>
            } */}
            <div className='text-black'><ChevronLeftIcon size={36} /></div>

            <div className='d-flex bg-light rounded-3' style={{ padding: "2px" }}>
                <div onClick={() => { setdashboardSelected(true); nav('/search') }} className={dashboardSelected ? 'px-4 text-white bg-black p-2 w-50 rounded-3' : 'p-2 px-4 text-black w-50 rounded-3'}>
                    <b>Search</b>
                </div>
                {/* {
                    user?.isAdmin ?
                        <div onClick={() => { setdashboardSelected(false); nav('/accepted') }} className={dashboardSelected ? 'p-2 px-4 text-black w-50 rounded-3' : "px-4 text-white bg-black p-2 w-50 rounded-3"}>
                            <b>Accepted</b>
                        </div>
                        :
                        <div onClick={() => { setdashboardSelected(false); nav('/categories') }} className={dashboardSelected ? 'p-2 px-4 text-black w-50 rounded-3' : "px-4 text-white bg-black p-2 w-50 rounded-3"}>
                            <b>Categories</b>
                        </div>
                } */}
                <div onClick={() => { setdashboardSelected(false); nav('/publish') }} className={dashboardSelected ? 'p-2 px-4 text-black w-50 rounded-3' : "px-4 text-white bg-black p-2 w-50 rounded-3"}>
                    <b>Publish</b>
                </div>

            </div>
            <div onClick={() => nav('/profile')}><PersonFillIcon size={32} /></div>
        </div>
    )
}

export default NavBar