import { useState } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import "./App.css";

function App() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="container">
      {isLogin ? <Login /> : <Register />}

      <button className="switch-btn" onClick={() => setIsLogin(!isLogin)}>
        {isLogin ? "Немає акаунту? Реєстрація" : "Вже є акаунт? Увійти"}
      </button>
    </div>
  );
}

export default App;