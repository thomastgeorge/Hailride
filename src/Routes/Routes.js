import React, { useContext } from 'react'
import { BrowserRouter, Route, Routes as Switch } from 'react-router-dom'
import Home from './Home'
import Login from '../Pages/Auth/Login/Login'
import { UserContext } from '../App'
import Signup from '../Pages/Auth/Signup/Signup'

const Routes = () => {

    const { user } = useContext(UserContext)
    console.log(user);
    return (
        <BrowserRouter>
            {
                user ?
                    <Switch>
                        <Route path="/*" element={<Home />} />
                    </Switch>
                    :
                    <Switch>
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />
                        <Route path="/*" element={<Login />} />
                    </Switch>
            }
        </BrowserRouter>
    )
}

export default Routes