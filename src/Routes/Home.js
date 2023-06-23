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

const Home = () => {

    const { user } = useContext(UserContext)

    return (
        <div style={{ height: "100vh" }}>
            <NavBar />
            <Switch>
                <Route path="/profile" element={<Profile />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/categories" element={<Categories />} />
                <Route path="/projects" element={<Projects />} />
                <Route path="/assignments" element={<Assignments />} />
                <Route path="/records" element={<Records />} />
                <Route path="/*" element={<Dashboard />} />
            </Switch>
        </div>
    )
}

export default Home