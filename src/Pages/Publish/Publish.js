import React, { useState } from 'react'
import PublishItem from '../../Components/PublishItem/PublishItem'
import { PlusIcon } from '@primer/octicons-react'
import AddItem from '../../Components/AddItem/AddItem';

const Publish = () => {

    const [open, setOpen] = useState(false);
    const [deleteSection, setDeleteSection] = useState(false)

    return (
        <>
            <div className='p-2'>
                <div onClick={() => setOpen(true)} className='btn d-flex justify-content-center btn-danger align-items-center w-100 mb-4 py-2'>
                    <PlusIcon size={30} />
                    <b className='ms-2'>Publish new ride</b>
                </div>
                <PublishItem deleteSection={deleteSection} setDeleteSection={setDeleteSection} />
                <PublishItem deleteSection={deleteSection} setDeleteSection={setDeleteSection} />
                <PublishItem deleteSection={deleteSection} setDeleteSection={setDeleteSection} />
                <PublishItem deleteSection={deleteSection} setDeleteSection={setDeleteSection} />
                <PublishItem deleteSection={deleteSection} setDeleteSection={setDeleteSection} />
                
            </div>
            <AddItem open={open} setOpen={setOpen} />
        </>
    )
}

export default Publish