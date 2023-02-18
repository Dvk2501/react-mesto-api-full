import Header from "./Header";
import Footer from "./Footer";
import Main from "./Main";
import React from "react";
import ImagePopup from "./ImagePopup";
import api from "../utils/Api";
import CurrentUserContext from "../contexts/CurrentUserContext";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";
import { Route, Switch, Redirect } from "react-router-dom";
import { Login } from "./Login";
import { Register } from "./Register";
import InfoTooltip from "./InfoTooltip";
import ProtectedRoute from "./ProtectedRoute";
import * as Auth from "../utils/Auth.js";

function App() {
  const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] =
    React.useState(false);

  const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] =
    React.useState(false);

  const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = React.useState(false);

  const [selectedCard, setSelectedCard] = React.useState(null);

  const [currentUser, setCurrentUser] = React.useState({});

  const [cards, setCards] = React.useState([]);

  const [isInfoTooltipOpen, setIsInfoTooltipOpen] = React.useState(false);

  const [isRegistrationSuccessful, setIsRegistrationSuccessful] =
    React.useState(false);

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [userData, setUserData] = React.useState('');

  const jwt = localStorage.getItem("jwt");

  function handleEditProfileClick() {
    setIsEditProfilePopupOpen(true);
  }

  function handleEditAvatarClick() {
    setIsEditAvatarPopupOpen(true);
  }

  function handleAddPlaceClick() {
    setIsAddPlacePopupOpen(true);
  }

  function handleCardClick(card) {
    setSelectedCard(card);
  }

  function openInfoTooltip() {
    setIsInfoTooltipOpen(true);
  }

  function closeAllPopups() {
    setIsEditAvatarPopupOpen(false);
    setIsEditProfilePopupOpen(false);
    setIsAddPlacePopupOpen(false);
    setSelectedCard(null);
    setIsInfoTooltipOpen(false);
  }

  function handleUpdateUser(userInfo) {
    const jwt = localStorage.getItem('jwt');
    api
      .setUserInfo(userInfo, jwt)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar) {
    const jwt = localStorage.getItem('jwt');
    api
      .setUserAvatar(avatar, jwt)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newPlaceData) {
    const jwt = localStorage.getItem('jwt');
    api
      .addCard(newPlaceData,jwt)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleLikeClick(card) {
    const jwt = localStorage.getItem('jwt');
    const isLiked = card.likes.some((i) => i === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked, jwt).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }


  function handleDeleteClick(cardId) {
    const jwt = localStorage.getItem('jwt');

    api
      .removeCard(cardId, jwt)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== cardId));
      })
      .catch((err) => console.log(err));
  }


  const tokenCheck = React.useCallback(async () => {
    try {
      const jwt = localStorage.getItem("jwt");
      if (!jwt) {
        throw new Error("no token");
      }
      const user = await Auth.checkToken(jwt);
      if (!user) {
        throw new Error("invalid user");
      }

      if (user) {
        setLoggedIn(true);
        setUserData(user.email);
      }
    } catch (err) {
      console.log(err);
    }
  }, []);

  React.useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  const cbAuthenticate = React.useCallback((data) => {
    data.token && localStorage.setItem("jwt", data.token);
    setLoggedIn(true);
  }, []);



  const cbLogin = React.useCallback(
    async (email, password) => {
      try {
        const data = await Auth.authorize(email, password);
        if (!data) {
          throw new Error("Неверные email или пароль пользователя");
        }

        cbAuthenticate(data);
        tokenCheck();
        return data;
      } catch {
        openInfoTooltip();
      }
    },
    [cbAuthenticate, tokenCheck]
  );

  const cbRegister = React.useCallback(async (email, password) => {
    try {
      console.log(password, email);

      const data = await Auth.register(email, password);
      setUserData(data.email);
      setIsRegistrationSuccessful(true);
      openInfoTooltip();
      return data;
    } catch {
      setIsRegistrationSuccessful(false);
      openInfoTooltip();
    }
  }, []);

  React.useEffect(() => {
    const jwt = localStorage.getItem("jwt");
    if (jwt) {
      Auth
        .checkToken(jwt)
        .then(setCurrentUser)
        .catch((err) => console.log(err));
      api
        .getCardList(jwt)
        .then((data) => {
          setCards(data);
        })
        .catch((err) => console.log(err));
    }
  }, [jwt]);

  const cbLogout = React.useCallback(() => {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    setUserData('');
  }, []);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={userData} onLogout={cbLogout} />
        <Switch>
          <Route path="/sign-up">
            <Register isLoggedIn={loggedIn} onRegister={cbRegister} />
          </Route>
          <Route path="/sign-in">
            <Login isLoggedIn={loggedIn} onLogin={cbLogin} />
          </Route>
          <ProtectedRoute
            exact
            path="/"
            loggedIn={loggedIn}
            component={Main}
            onEditProfile={handleEditProfileClick}
            onEditAvatar={handleEditAvatarClick}
            onAddPlace={handleAddPlaceClick}
            onCardClick={handleCardClick}
            cards={cards}
            onCardLike={handleLikeClick}
            onCardDelete={handleDeleteClick}
          />
        </Switch>
        <Route>
          {loggedIn ? <Redirect to="/" /> : <Redirect to="/sign-in" />}
        </Route>

        <Footer />

        <EditProfilePopup
          onClose={closeAllPopups}
          isOpen={isEditProfilePopupOpen}
          onUpdateUser={handleUpdateUser}
        ></EditProfilePopup>

        <EditAvatarPopup
          onClose={closeAllPopups}
          isOpen={isEditAvatarPopupOpen}
          onUpdateAvatar={handleUpdateAvatar}
        ></EditAvatarPopup>
        <AddPlacePopup
          onClose={closeAllPopups}
          isOpen={isAddPlacePopupOpen}
          onAddPlace={handleAddPlaceSubmit}
        ></AddPlacePopup>

        <ImagePopup card={selectedCard} onClose={closeAllPopups} />
        <InfoTooltip
          onClose={closeAllPopups}
          isOpen={isInfoTooltipOpen}
          isSuccess={isRegistrationSuccessful}
        />
      </div>
    </CurrentUserContext.Provider>
  );
}

export default App;
