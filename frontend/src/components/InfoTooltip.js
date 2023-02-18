import React from "react";
import Union from "../images/Union.svg"
import NeUnion from "../images/NeUnion.svg"

function InfoTooltip({onClose,isOpen,isSuccess}) {
  return (
    <div className={`popup ${isOpen ? 'popup_opened' : ''}`}>
      <div className="popup__container">
        <button
          aria-label="Закрыть"
          type="button"
          className="popup__close"
          onClick={onClose}
        ></button>
          <img
          src={isSuccess ? Union : NeUnion}
          alt={
            isSuccess ? 'Регистрация прошла успешно' : 'Регистрация не прошла'
          }
          className="popup__signup-icon"
        />
        <h3 className="popup__signup-title">
          {isSuccess
            ? 'Вы успешно зарегистрировались!'
            : 'Что-то пошло не так! Попробуйте ещё раз.'}
        </h3>

      </div>
    </div>
  );
}

export default InfoTooltip
