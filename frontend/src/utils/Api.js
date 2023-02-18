import { BASE_URL } from './utils';

class Api {

  constructor(config) {
    this._url = config.url;
  }

  #onResponce(res) {
    if (res.ok) {
      return res.json();
    }
    return Promise.reject({ message: 'Ошибка на стороне сервера', res });
  }

  getCardList(jwt) {
    return fetch(`${this._url}/cards`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    }).then(this.#onResponce);
  }

  removeCard(idCard,jwt) {
    return fetch(`${this._url}/cards/${idCard}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    }).then(this.#onResponce);
  }

  setUserAvatar(data,jwt) {
    return fetch(`${this._url}/users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        avatar: data.avatar,
      }),
    }).then(this.#onResponce);
  }

  getUserInfo(jwt) {
    return fetch(`${this._url}/users/me`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    }).then(this.#onResponce);
  }

  setUserInfo(data,jwt) {
    return fetch(`${this._url}/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(this.#onResponce);
  }

  changeLikeCardStatus(cardId,isLiked,jwt) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: `${!isLiked ? 'DELETE' : 'PUT'}`,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    }).then(this.#onResponce);
  }
  deleteLike(cardId,jwt) {
    return fetch(`${this._url}/cards/${cardId}/likes`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
    }).then(this.#onResponce);
  }

  addCard(data,jwt) {
    return fetch(`${this._url}/cards`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${jwt}`,
      },
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      }),
    }).then(this.#onResponce);
  }
}

const api = new Api  ({
  url: BASE_URL,
})

export default api
