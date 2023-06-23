import { DesktopDownloadIcon, HistoryIcon } from '@primer/octicons-react'
import React, { useContext, useEffect, useState } from 'react'
import { Axios } from '../../Config/Axios/Axios'
import { UserContext } from '../../App'
import { Button, Modal } from 'antd'
import { Ring } from '@uiball/loaders'

const Dashboard = () => {

    const { user } = useContext(UserContext)
    const [isModalOpen, setIsModalOpen] = useState(false);

    const [downloadLoader, setdownloadLoader] = useState(false)
    const [loading, setLoading] = useState(false)
    const [contentloader, setcontentloader] = useState(false)

    const [requests, setRequests] = useState([])
    const [arrived, setarrived] = useState(false)
    const [isError, setisError] = useState(false)
    const [requestId, setRequestId] = useState("")
    const [data, setdata] = useState({})

    useEffect(() => {
        setcontentloader(true)
        Axios.post("/api/v1/service/getMyRequests", {
            userEmail: user.email,
            // requirementId: searchVal
        })
            .then((res) => {
                console.log(res);
                setRequests(res.data.requests.reverse())
                setarrived(true)
                setcontentloader(false)
            })
            .catch((err) => {
                setisError(true)
                setcontentloader(false)
            })
        return () => {
            setRequests([])
        }
    }, [])

    const showModal = (requestId) => {
        setRequestId(requestId)
        Axios.post('/api/v1/service/getRequestById', {
            requestId: requestId,
        })
            .then(function (res) {
                console.log(res.data.request);
                setdata(res.data.request)
                setIsModalOpen(true)
            })
            .catch(function (error) {
                console.log(error);
            })
    };

    const handleOk = () => {
        setIsModalOpen(false)
    };

    const handleCancel = () => {
        setIsModalOpen(false)
    }

    const handleDelete = () => {
        if (window.confirm("Are you sure you want to delete?") === true) {
            Axios.delete('/api/v1/service/deleteRequestById', {
                params: {
                    requestId: requestId
                }
            }).then(function (res) {
                window.location.reload();
            })
                .catch(err =>
                    console.log(err)
                )
        }
        else {
            return
        }
    }

    const downloadFile = (fileName) => {
        console.log("heheheh", fileName)
        setdownloadLoader(true)
        Axios.get(`/downloadFile?fileName=${fileName}`, {
            responseType: 'blob',
        })
            .then(function (res) {
                setdownloadLoader(false)
                console.log(res)
                var ee = document.createElement("a")
                ee.href = URL.createObjectURL(new Blob([res.data]))
                ee.setAttribute("download", data.uploadedFileName)
                document.body.append(ee)
                ee.click()
            })
            .catch(err => {
                console.log(err)
                setdownloadLoader(false)
            })
    }

    return (
        <div className='p-2'>
            {
                requests.length === 0 ?
                    <div className='d-flex justify-content-center my-3 bg-light p-3 rounded-3 fw-bold'>
                        {
                            contentloader ?
                                <Ring
                                    size={25}
                                    speed={2}
                                    color="black"
                                />
                                :
                                <>No Requests yet!</>

                        }
                    </div>
                    :
                    requests.map((req) => {
                        return (
                            <div onClick={() => showModal(req.requestId)} className='compShadow p-3 my-2 rounded-3' style={{ background: "#dede28cf" }}>
                                <div className='d-flex align-items-center justify-content-between'>
                                    <b className='fs-5'>#{req.requestId}</b>
                                    <div className='d-flex align-items-center mx-1 px-2 py-1 bg-dark rounded-3 text-white'><HistoryIcon size={14} /><p className='m-0 mx-2'>{req.accepted.status}</p></div>
                                </div>
                                <div className='d-flex'>
                                    <h2 className='mt-2'><b>{req.requestType.charAt(0).toUpperCase() + req?.requestType.slice(1)}</b></h2>
                                    {/* <div className='d-flex align-items-center mx-1 px-2 py-1 bg-dark rounded-3 text-white'><p className='m-0 mx-2'>Project</p></div> */}
                                </div>
                            </div>
                        )
                    })
            }
            <Modal title={<b># {requestId}</b>} open={isModalOpen} onOk={handleOk} onCancel={handleCancel}
                footer={[
                    <Button key="back" onClick={handleDelete}>
                        Delete
                    </Button>,
                    <Button key="submit" type="primary" loading={loading} onClick={handleOk}>
                        Ok
                    </Button>,
                ]}
            >
                <div className='my-3'>
                    {
                        typeof data.appName != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Application Name</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>{data?.appName}</b>
                            </div>
                        </div>
                    }
                    {
                        typeof data?.subject != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Subject</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>{data?.subject}</b>
                            </div>
                        </div>
                    }
                    {
                        typeof data?.question != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Question</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>{data?.question}</b>
                            </div>
                        </div>
                    }
                    {
                        typeof data?.comments != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Comments</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>{data?.comments}</b>
                            </div>
                        </div>
                    }
                    {
                        typeof data.keyFunction != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Key Functionality</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>{data?.keyFunction}</b>
                            </div>
                        </div>
                    }
                    {
                        typeof data.requirements != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Requirements</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>{data?.requirements}</b>
                            </div>
                        </div>
                    }
                    {
                        typeof data.offer != "undefined" &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Offering</b>
                            <div className='p-2 mt-2 rounded-3' style={{ background: "#ffff9cb8" }}>
                                <b>Rs. {data?.offer}</b>
                            </div>
                        </div>
                    }
                    {
                        (data?.uploadedFileName !== "") &&
                        <div className='p-2 my-1 rounded-3' style={{ background: "#dede28cf" }}>
                            <b className='my-2'>Resources</b>
                            <div onClick={() => downloadFile(data?.uploadedFileName)} className='d-flex btn text-white justify-content-between p-2 px-3 mt-2 rounded-3' style={{ background: "green" }}>
                                <b>Download</b>
                                {
                                    downloadLoader ?
                                        <Ring
                                            size={20}
                                            speed={2}
                                            color="white"
                                        />
                                        :
                                        <DesktopDownloadIcon size={24} />
                                }
                            </div>
                        </div>
                    }

                </div>
            </Modal>
        </div>
    )
}

export default Dashboard