import React from "react";

function ImagePopup({ card, onClose }) {
  return (
    <div
      className={`popup popup_type_image ${card?.link ? "popup_opened" : ""}`}
    >
      <div className="popup__card-container">
        <button
          aria-label="Закрыть"
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
        <figure className="popup__figure">
          <img className="popup__image" src={card?.link} alt={card?.name} />
          <h3 className="popup__caption">{card?.name}</h3>
        </figure>
      </div>
    </div>
  );
}

export default ImagePopup;
