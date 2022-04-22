import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultView from "./pages/DefaultView";
import Login from "./pages/Login";
import Register from "./pages/Register";
import SetAvatar from "./pages/SetAvatar";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/setavatar" element={<SetAvatar />} />
        <Route path="/" element={<DefaultView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
