import React from 'react'
import { useNavigate } from 'react-router-dom'

const Categories = () => {

    const nav = useNavigate()

    return (
        <div className='p-3' style={{ width: "100vw", maxWidth: "500px" }}>

            <div className='mb-4'>
                <b className='my-3 fs-5'>Busy with other Works? Don't worry, we will do it for you.. 😉</b>
            </div>
            <div className='compShadow btn my-4 mt-5 p-4 w-100 rounded-3 d-flex justify-content-center'
                style={{ background: "#dede28cf" }} onClick={() => { nav('/projects') }}>
                <b className='fs-2'>Projects</b>
            </div>
            <div className='compShadow btn my-4 p-4 w-100 rounded-3 d-flex justify-content-center'
                style={{ background: "#dede28cf" }} onClick={() => { nav('/assignments') }}>
                <b className='fs-2'>Assignments</b>
            </div>
            <div className='compShadow btn my-4 p-4 w-100 rounded-3 d-flex justify-content-center'
                style={{ background: "#dede28cf" }} onClick={() => { nav('/records') }}>
                <b className='fs-2'>Records</b>
            </div>
        </div>
    )
}

export default Categories