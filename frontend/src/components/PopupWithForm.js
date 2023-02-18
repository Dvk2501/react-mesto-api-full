import React from "react";

function PopupWithForm(props) {
  return (
    <div
      className={
        `popup popup_type_${props.name}` + (props.isOpen && " popup_opened")
      }
    >
      <div className="popup__container">
        <button
          aria-label="Закрыть"
          type="button"
          className="popup__close"
          onClick={props.onClose}
        ></button>
        <h3 className="popup__title">{props.title}</h3>
        <form
          name={`${props.name}`}
          className="popup__form form"
          onSubmit={props.onSubmit}
        >
          {props.children}
          <button type="submit" className="form__submit">
            {props.Btntext}
          </button>
        </form>
      </div>
    </div>
  );
}

export default PopupWithForm;
