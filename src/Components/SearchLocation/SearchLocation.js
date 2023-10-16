import React, { useState } from 'react';
import { Button, Modal } from 'antd';
import { CircleSlashIcon, NoteIcon, PersonFillIcon } from '@primer/octicons-react';

const SearchLocation = ({ open, setOpen, setLocation }) => {

    const [searchValue, setSearchValue] = useState("")

    const [locations, setlocations] = useState(['Kengeri', 'Marthahalli', 'Provident Sunworth', 'KR Market', 'Hebbal', 'WhiteField', 'Electronic City', 'MG Road', 'Lal Bhag', 'Kumbalgodu', 'Kormangala', 'Indira Nagar', 'RR Nagar', 'JP Nagar', 'Bannerghatta',
'Kanmanike', 'Yelahanka', 'Christ University', 'Mysore', 'Bidadi', 'Yeshwantpur', 'J Nagar', 'Kengeri Metro', 'Majestic', 'Jigani', 'Mysore Road', 'Kalyan Nagar', 'Rajaji Nagar', 'Nagasandra', 'Silk Institute', 'RR Medical College'])

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
            title="Choose Location"
            onOk={handleOk}
            onCancel={handleCancel}
            footer={[
                <Button key="back" onClick={handleCancel}>
                    Return
                </Button>,
            ]}
        >
            <div className="py-2">
                <input type="search" onChange={e => setSearchValue(e.target.value)} className='p-2 rounded w-100' />
                <div>
                    {
                        locations
                            .filter(loc => loc.toLowerCase().includes(searchValue.toLowerCase()))
                            .slice(0, 6) // Display only the first 6 matching elements
                            .map(loc => (
                                <div onClick={() => { setLocation(loc); setOpen(false) }} className="searchElement d-flex p-2 w-100 bg-light rounded my-2 align-items-center">
                                    <div style={{ fontSize: "16px" }}>{loc}</div>
                                </div>
                            ))
                    }
                </div>
            </div>
        </Modal>
    )
}

export default SearchLocation