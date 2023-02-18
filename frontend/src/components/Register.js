import React, { useState } from "react";
import { Redirect, Link } from "react-router-dom";

export const Register = ({ isLoggedIn, onRegister }) => {
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

    let { email, password } = userData;
    onRegister(email, password);
  };

  if (isLoggedIn) {
    return <Redirect to="/" />;
  }

  return (
    <div className="login content">
      <h2 className="login__title">Регистрация</h2>
      <form className="login__form" onSubmit={handleSubmit} noValidate>
        <input
          id="email"
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
          Зарегистрироваться
        </button>
      </form>

      <Link to="login" className="register__signin">
        Уже зарегистрированы? Войти
      </Link>
    </div>
  );
};
