import React from "react";
import headerlogo from "../images/Vector.svg";
import { Switch, Route, Link } from "react-router-dom";

function Header({email, onLogout}) {
  return (
    <header className="header page__header">
      <img className="header__logo" alt="логотип" src={headerlogo} />
      <div className="header__links">
        <Switch>
          <Route exact path="/sign-in">
            <Link to="/sign-up" className="header__link">
              Регистрация
            </Link>
          </Route>
          <Route exact path="/sign-up">
            <Link to="/sign-in" className="header__link">
              Войти
            </Link>
          </Route>
          <Route exact path="/">
            <div>
              <Link to="/email" className="header__link">
                {email}
              </Link>
              <button className="header__button" onClick={onLogout}>
                Выйти
              </button>
            </div>
          </Route>
        </Switch>
      </div>
    </header>
  );
}

export default Header;
