import { Routes, Route } from "react-router-dom";
import AuthProvider from "./hooks/AuthProvider";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import Login from "./components/Login";
import Instruments from "./components/Instruments";
import Checkouts from "./components/Checkout";
import UsersComponent from "./components/UsersComponent";
import NavigationBar from "./components/NavBar";
import NewCheckout from "./components/NewCheckout";
import History from "./components/History";

const baseUrl = 'http://localhost:4001';

function App() {
  return (
    <div>
      <AuthProvider baseUrl={baseUrl}>
        <NavigationBar baseUrl={baseUrl} />
        <Routes>
        <Route path="/login" element={<Login />} />
          <Route path="/" element={<Home />} />
          <Route path="/instruments" element={<Instruments baseUrl={`${baseUrl}/instruments`} />} />
          <Route path="/checkouts" element={<Checkouts baseUrl={baseUrl} />} />
          <Route path="about" element={<About />} />
          <Route path="contact" element={<Contact />} />
          <Route path="users" element={<UsersComponent baseUrl={`${baseUrl}/users`}/>} />
          <Route path="/newcheckout" element={<NewCheckout baseUrl={baseUrl} />} />
          <Route path="/history" element={<History baseUrl={baseUrl} />} />
        </Routes>
      </AuthProvider>
    </div>
  );
}

export default App;
