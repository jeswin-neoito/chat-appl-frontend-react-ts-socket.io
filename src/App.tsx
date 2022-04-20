import { BrowserRouter, Route, Routes } from "react-router-dom";
import DefaultView from "./components/DefaultView";
import Login from "./pages/Login";
import Register from "./pages/Register";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<DefaultView />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
