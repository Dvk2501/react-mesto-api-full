class Api {

  constructor(config) {
    this._url = config.url;
    this._headers = config.headers;
  }

  #onResponce(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject({ message: 'Ошибка на стороне сервера', res });
  }

  getCardList() {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: this._headers,
    }).then(this.#onResponce);
  }

  removeCard(idCard) {
    return fetch(`${this._url}/cards/${idCard}`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this.#onResponce);
  }

  setUserAvatar(data) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this.#onResponce);
  }

  getUserInfo() {
    return fetch(`${this._url}/users/me`, {
      headers: this._headers,
    }).then(this.#onResponce);
  }

  setUserInfo(data) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(this.#onResponce);
  }

  changeLikeCardStatus(cardId,isLiked) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: `${!isLiked ? 'DELETE' : 'PUT'}`,
      headers: this._headers,
    }).then(this.#onResponce);
  }
  deleteLike(cardId) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: this._headers,
    }).then(this.#onResponce);
  }

  addCard(data) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: this._headers,
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this.#onResponce);
  }
}

const api = new Api  ({
  url: 'https://mesto.nomoreparties.co/v1/cohort-51',
  headers: {
    authorization: 'c1d711c0-3ad8-435d-b45d-89726a640339',
    'Content-Type': 'application/json',
  },
});

export default api
