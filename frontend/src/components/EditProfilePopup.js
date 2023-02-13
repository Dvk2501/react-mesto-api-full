import React from "react";
import PopupWithForm from "./PopupWithForm";
import CurrentUserContext from "../contexts/CurrentUserContext";

function EditProfilePopup({ isOpen, onClose, onUpdateUser }) {
  const [name, setName] = React.useState("");
  const [description, setDescription] = React.useState("");
  const currentUser = React.useContext(CurrentUserContext);

  React.useEffect(() => {
    setName(currentUser.name);
    setDescription(currentUser.about);
  }, [currentUser,isOpen]);

  function handleChangeName(event) {
    const text = event.target.value;
    setName(text);
  }

  function handleChangeDescription(event) {
    const text = event.target.value;
    setDescription(text);
  }

  function handleSubmit(e) {
    e.preventDefault();
    onUpdateUser({
      name,
      about: description,
    });
  }
  return (
    <PopupWithForm
      onClose={onClose}
      isOpen={isOpen}
      onSubmit={handleSubmit}
      name="edit"
      title="Редактировать профиль"
      Btntext="Сохранить"
    >
      <fieldset className="form__set">
        <input
          onChange={handleChangeName}
          value={name ?? ""}
          type="text"
          name="username"
          id="name"
          className="form__input form__input_type_name"
          required
        />
        <span id="name-error" className="form__input-error"></span>
        <input
          onChange={handleChangeDescription}
          value={description ?? ""}
          type="text"
          name="job"
          id="job"
          className="form__input form__input_type_job"
          required
        />
        <span id="job-error" className="form__input-error"></span>
      </fieldset>
    </PopupWithForm>
  );
}

export default EditProfilePopup;
