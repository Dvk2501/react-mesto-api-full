import React from "react";
import CurrentUserContext from "../contexts/CurrentUserContext";

function Card({ card, onCardClick, onCardLike, onCardDelete }) {
  const currentUser = React.useContext(CurrentUserContext);
  const isOwn = card.owner._id === currentUser._id;
  const isLiked = card.likes.some((i) => i._id === currentUser._id);
  const activeLikeButtonClassName = "element__like_active";

  function handleClick() {
    onCardClick(card);
  }

  function handleLikeClick() {
    onCardLike(card);
  }

  function handleDeleteClick() {
    onCardDelete(card);
  }

  return (
    <li className="element">
      <img
        onClick={handleClick}
        className="element__image"
        alt={card.name}
        src={card.link}
      />
      <div className="element__bottom">
        <h2 className="element__title">{card.name}</h2>
        <div className="element__likes">
          <button
            aria-label="Лайк"
            type="button"
            className={
              "element__like " + (isLiked && activeLikeButtonClassName)
            }
            onClick={handleLikeClick}
          ></button>
          <span className="element__like-number">{card.likes.length}</span>
        </div>
      </div>
      {isOwn && (
        <button
          aria-label="Удаление карточки"
          type="button"
          className="element__delete"
          onClick={handleDeleteClick}
        ></button>
      )}
    </li>
  );
}

export default Card;
