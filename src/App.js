import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Search from "./pages/Search/Search";

import Details from "./pages/Details/Details";
import Reservations from "./pages/Reservations";
import {ProtectedRoute} from "./components/ProtectedRoute";
import SignInSide from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import Itinerary from "./pages/Itinerary/Itinerary";
import Profile from "./pages/Profile";


const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}
      />
      <Route path="/search" element={<Search/>}/>
      <Route path="/details" element={<Details />} />
      <Route path={"sign-in"} element={<SignInSide />} />
      <Route path={"sign-up"} element={<SignUp />} />
      <Route path="/account" element={<ProtectedRoute />}>
          <Route path="reservations" element={<Reservations />} />
          <Route path="itinerary" element={<Itinerary />} />
          <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default App;
