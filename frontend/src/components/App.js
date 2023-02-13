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
  const [userData, setUserData] = React.useState({});

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

  React.useEffect(() => {
    if (jwt) {
      api
        .getUserInfo()
        .then(setCurrentUser)
        .catch((err) => console.log(err));
      api
        .getCardList()
        .then((data) => {
          setCards(data);
        })
        .catch((err) => console.log(err));
    }
  }, [loggedIn]);

  function handleUpdateUser(userInfo) {
    api
      .setUserInfo(userInfo)
      .then((newUserInfo) => {
        setCurrentUser(newUserInfo);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleUpdateAvatar(avatar) {
    api
      .setUserAvatar(avatar)
      .then((avatar) => {
        setCurrentUser(avatar);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleAddPlaceSubmit(newPlaceData) {
    api
      .addCard(newPlaceData)
      .then((newCard) => {
        setCards((state) => [newCard, ...state]);
        closeAllPopups();
      })
      .catch((err) => console.log(err));
  }

  function handleLikeClick(card) {
    const isLiked = card.likes.some((i) => i._id === currentUser._id);

    api.changeLikeCardStatus(card._id, !isLiked).then((newCard) => {
      setCards((state) => state.map((c) => (c._id === card._id ? newCard : c)));
    });
  }

  function handleDeleteClick(card) {
    const cardId = card._id;
    api
      .removeCard(cardId)
      .then(() => {
        setCards((state) => state.filter((card) => card._id !== cardId));
      })
      .catch((err) => console.log(err));
  }

  const cbAuthenticate = React.useCallback((data) => {
    data.token && localStorage.setItem("jwt", data.token);
    setLoggedIn(true);
  }, []);

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
        setUserData(user.data);
      }
    } catch (err) {
      console.log(err);
    }
  }, [loggedIn]);

  const cbLogin = React.useCallback(
    async (email, password) => {
      try {
        const data = await Auth.authorize(email, password);
        if (!data) {
          throw new Error("Неверные email или пароль пользователя");
        }

        cbAuthenticate(data);
        const userData = { email, password };
        console.log(userData);
        return data;
      } catch {
        openInfoTooltip();
      }
    },
    [cbAuthenticate]
  );

  const cbRegister = React.useCallback(async (email, password) => {
    try {
      console.log(password, email);

      const data = await Auth.register(email, password);
      setUserData(data.data);
      setIsRegistrationSuccessful(true);
      openInfoTooltip();
      return data;
    } catch {
      setIsRegistrationSuccessful(false);
      openInfoTooltip();
    }
  }, []);

  const cbLogout = React.useCallback(() => {
    setLoggedIn(false);
    localStorage.removeItem("jwt");
    setUserData({});
  }, []);

  React.useEffect(() => {
    tokenCheck();
  }, [tokenCheck]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <div className="page">
        <Header email={userData.email} onLogout={cbLogout} />
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
