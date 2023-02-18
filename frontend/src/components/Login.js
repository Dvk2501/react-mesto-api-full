import React, { useState } from "react";
import { Redirect } from "react-router-dom";

export const Login = ({ isLoggedIn, onLogin }) => {
  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserData({
      ...userData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!userData.email || !userData.password) {
      return;
    }
    onLogin(userData.email, userData.password);
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <>
      <main>
        <div className="login content">
          <h2 className="login__title">Вход</h2>
          <form className="login__form" onSubmit={handleSubmit} noValidate>
            <input
              type="email"
              className="login__input"
              placeholder="Email"
              name="email"
              value={userData.email}
              onChange={handleChange}
              required
            />
            <input
              type="password"
              className="login__input"
              placeholder="Пароль"
              name="password"
              value={userData.password}
              onChange={handleChange}
              required
            />
            <button type="submit" className="login__submit-button">
              Войти
            </button>
          </form>
        </div>
      </main>
    </>
  );
};
