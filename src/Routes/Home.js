import React, { useContext, useEffect } from 'react'
import { Route, Routes as Switch } from 'react-router-dom'
import { UserContext } from '../App'
import NavBar from '../Components/NavBar/NavBar'
import Profile from '../Pages/Profile/Profile'
import AdminDashboard from '../Pages/Admin/AdminDashboard/AdminDashboard'
import { Axios } from '../Config/Axios/Axios'
import Search from '../Pages/Search/Search'
import Publish from '../Pages/Publish/Publish'
import SearchResult from '../Pages/SearchResult/SearchResult'
import MyRides from '../Pages/MyRides/MyRides'

const Home = () => {

    const { user } = useContext(UserContext)

    return (
        <div style={{ height: "100vh" }}>
            <NavBar />
            <Switch>
                <Route path="/profile" element={<Profile />} />
                {
                    user.isAdmin ?
                        <>
                            {/* <Route path="/dashboard" element={<AdminDashboard />} />
                            <Route path="/accepted" element={<Accepted />} />
                            <Route path="/projects" element={<AdminRequests requestType={"project"} />} />
                            <Route path="/assignments" element={<AdminRequests requestType={"assignment"} />} />
                            <Route path="/records" element={<AdminRequests requestType={"record"} />} /> */}
                            <Route path="/" element={<AdminDashboard />} />
                        </>
                        :
                        <>
                            {/* <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/assignments" element={<Assignments />} />
                            <Route path="/records" element={<Records />} /> */}

                            <Route path="/search" element={<Search />} />
                            <Route path="/publish" element={<Publish />} />
                            <Route path="/searchResult" element={<SearchResult />} />
                            <Route path="/myRides" element={<MyRides />} />
                            <Route path="/*" element={<Search />} />
                        </>

                }

            </Switch>
        </div>
    )
}

export default Home