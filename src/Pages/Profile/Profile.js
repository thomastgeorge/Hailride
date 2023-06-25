import React, { useContext } from 'react'
import { UserContext } from '../../App'
import { VerifiedIcon } from '@primer/octicons-react'

const Profile = () => {

    const { setUser, user } = useContext(UserContext)

    const signOut = () => {
        if (window.confirm("Are you sure you want to signout?") === true) {
            sessionStorage.removeItem("token")
            setUser(null)
        }
        else {
            return
        }
    }

    return (
        <div className='p-2'>
            <div className='d-flex p-2 py-5 bg-light rounded-3' style={{ flexDirection: "column", alignItems: "center" }}>
                <div><img src="profile.png" height="150px" width="150px" style={{ borderRadius: "50%" }} /></div>
                <div className='d-flex mt-2 align-items-center gap-2'>
                    <b className='fs-3'>{user.name}</b>
                    {
                        user.isAdmin &&
                        <VerifiedIcon fill={"blue"} size={20} />
                    }
                </div>
                <b className='mb-3'><i>{user.email}</i></b>
                <div onClick={signOut} className='bg-danger p-2 px-3 rounded-3 text-white'><b>Signout</b></div>
            </div>
        </div>
    )
}

export default Profile