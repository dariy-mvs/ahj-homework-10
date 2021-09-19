import Modal from './Modal';

export default class GetPosition {
  static printPositionElement(isMakeUser, coordsUser = '', latitude = '', longitude = '', time = '') {
    let timestamp;
    let coords;
    if (isMakeUser) {
      timestamp = Date.now();
      coords = `${coordsUser}`;
    } else {
      timestamp = time;
      coords = `[${latitude} - ${longitude}]`;
    }
    timestamp = new Date(timestamp);
    const date = `${timestamp.getDate()}.${timestamp.getMonth() + 1}.${timestamp.getFullYear()}`;
    const posElement = document.createElement('div');
    posElement.className = 'geoposition';
    posElement.innerHTML = `<p class="geoposition__text">${coords}</p>
    <p class="time">${date}</p>`;
    return posElement;
  }

  static setUserCoords(post) {
    const positionEl = GetPosition.printPositionElement(true, '', '', '', '');
    const modal = new Modal('Нам не удалось определить Ваше местоположение', 'Возможно, Вы запретили это в настройках, или сеть недоступна. Пожалуйста, введите Ваши координаты в соответствующее поле.', post, positionEl);
    modal.addModal();
  }

  static async navigatorDiagnostic(post) {
    const postWithPosition = post;
    if (navigator.geolocation) {
      await new Promise((res) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { coords, timestamp } = position;
            const { latitude, longitude } = coords;
            const positionEl = GetPosition.printPositionElement(false, '', latitude, longitude, timestamp);
            postWithPosition.insertAdjacentElement('beforeend', positionEl);
            res();
          }, () => {
            GetPosition.setUserCoords(postWithPosition);
          },
        );
      });
      return postWithPosition;
    }
    GetPosition.setUserCoords(postWithPosition);
    return postWithPosition;
  }

  constructor() {
    console.log('');
  }
}
