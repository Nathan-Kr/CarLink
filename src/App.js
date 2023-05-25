import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Rentals from "./pages/Rentals/Rentals";

import Details from "./pages/Details/Details";
import Trip from "./pages/Trip";
import {ProtectedRoute} from "./components/ProtectedRoute";
import SignInSide from "./pages/SignIn";
import SignUp from "./pages/SignUp";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />}
      />
      <Route path="/rentals" element={<Rentals/>}/>
      <Route path="/details" element={<Details />} />
      <Route path={"sign-in"} element={<SignInSide />} />
      <Route path={"sign-up"} element={<SignUp />} />
      <Route path="/account" element={<ProtectedRoute />}>
          <Route path="trip" element={<Trip />} />
      </Route>
    </Routes>
  );
};

export default App;
