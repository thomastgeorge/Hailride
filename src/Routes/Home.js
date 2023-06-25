import React, { useContext } from 'react'
import { Route, Routes as Switch } from 'react-router-dom'
import { UserContext } from '../App'
import Categories from '../Pages/Categories/Categories'
import Projects from '../Pages/Projects/Projects'
import Assignments from '../Pages/Assignments/Assignments'
import Records from '../Pages/Records/Records'
import NavBar from '../Components/NavBar/NavBar'
import Dashboard from '../Pages/Dashboard/Dashboard'
import Profile from '../Pages/Profile/Profile'
import AdminDashboard from '../Pages/Admin/AdminDashboard/AdminDashboard'
import Accepted from '../Pages/Admin/Accepted/Accepted'
import AdminRequests from '../Pages/Admin/AdminRequests/AdminRequests'

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
                            <Route path="/dashboard" element={<AdminDashboard />} />
                            <Route path="/accepted" element={<Accepted />} />
                            <Route path="/projects" element={<AdminRequests requestType={"project"} />} />
                            <Route path="/assignments" element={<AdminRequests requestType={"assignment"} />} />
                            <Route path="/records" element={<AdminRequests requestType={"record"} />} />
                            <Route path="/" element={<AdminDashboard />} />
                        </>
                        :
                        <>
                            <Route path="/dashboard" element={<Dashboard />} />
                            <Route path="/categories" element={<Categories />} />
                            <Route path="/projects" element={<Projects />} />
                            <Route path="/assignments" element={<Assignments />} />
                            <Route path="/records" element={<Records />} />
                            <Route path="/*" element={<Dashboard />} />
                        </>

                }

            </Switch>
        </div>
    )
}

export default Home