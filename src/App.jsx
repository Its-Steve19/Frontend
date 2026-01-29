import "./App.css";
import { Route, Routes } from "react-router-dom";

import Login from "./pages/main/login/Login";
import { useAuthContext } from "./providers/AuthProvider";
import Register from "./pages/main/register/Register";
import PasswordReset from "./pages/main/reset-password/PasswordReset";
import SetPassword from "./components/main/modal/set-password/SetPassword";
import BadToken from "./pages/main/bad-token/BadToken";
import ExpiredToken from "./pages/main/expired-token/ExpiredToken";

import Main from "./components/main/main/Main";

function App() {
  const { userToken, loadedUserProfile } = useAuthContext();

  return (
    <>
      <Routes>
        <Route path="login" element={<Login />} />
        <Route path="reset-password" element={<PasswordReset />} />
        <Route path="/used-token/:uidb64/:token/" element={<ExpiredToken />} />
        <Route path="/bad-token/:uidb64/:token/" element={<BadToken />} />
        <Route
          path="/set-new-password/:uidb64/:token/"
          element={<SetPassword />}
        />
        <Route path="register" element={<Register />} />
        <Route path="/*" element={userToken ? <Main /> : <Login />} />
      </Routes>
    </>
  );
}

export default App;
