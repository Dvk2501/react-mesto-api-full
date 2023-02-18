import React from "react";
import PopupWithForm from "./PopupWithForm";

function AddPlacePopup({ isOpen, onClose, onAddPlace }) {
  const [name, setName] = React.useState("");
  const [link, setLink] = React.useState("");

  React.useEffect(() => {
    setName("");
    setLink("");
  }, [isOpen]);

  function handleChangeName(event) {
    const text = event.target.value;
    setName(text);
  }

  function handleChangeLink(event) {
    const text = event.target.value;
    setLink(text);
  }

  function handleSubmit(event) {
    event.preventDefault();
    onAddPlace({
      name,
      link,
    });
  }

  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      name="edit"
      title="Новое место"
      Btntext="Создать"
      onSubmit={handleSubmit}
    >
      <input
        type="text"
        name="name"
        id="url-name"
        className="form__input form__input_type_name-card"
        placeholder="Название"
        required
        value={name}
        onChange={handleChangeName}
      />
      <span id="url-name-error" className="form__input-error"></span>
      <input
        type="url"
        name="link"
        id="url-card"
        className="form__input form__input_type_url-card"
        placeholder="Ссылка на картинку"
        required
        value={link}
        onChange={handleChangeLink}
      />
      <span id="url-card-error" className="form__input-error"></span>
    </PopupWithForm>
  );
}

export default AddPlacePopup;
