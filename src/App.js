import { Routes, Route } from "react-router-dom";
import AuthProvider from "./hooks/AuthProvider";
// import PrivateRoute from "./components/PrivateRoute";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Instruments from "./components/Instruments";
import Checkouts from "./components/Checkout";
import NavigationBar from "./components/NavBar";

function App() {
  return (
    <div >
      <AuthProvider>
        <NavigationBar />
      <Routes>
        <Route path="/login" element={ <Login/> } />  
        <Route path="/" element={ <Home/> } />
        <Route path="/instruments" element={ <Instruments/> } />
        <Route path="/checkouts" element={ <Checkouts/> } />
        <Route path="about" element={ <About/> } />
        <Route path="contact" element={ <Contact/> } />
      </Routes>
      </AuthProvider>
    </div>
  )
}

export default App;
