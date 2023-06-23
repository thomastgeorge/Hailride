import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min";
import React, { useState } from "react";
import "./App.css";
import Routes from "./Routes/Routes";

export const UserContext = React.createContext();

function App() {
  const [user, setUser] = useState(null);

  return (
    <div className="d-flex App">
      <UserContext.Provider value={{ user, setUser }}>
        <Routes />
      </UserContext.Provider>
    </div>
  );
}

export default App;
