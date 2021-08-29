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

  constructor(elt) {
    this.post = elt;
    this.navigatorDiagnostic();
  }

  navigatorDiagnostic() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { coords, timestamp } = position;
          const { latitude, longitude } = coords;
          const positionEl = GetPosition.printPositionElement(false, '', latitude, longitude, timestamp);
          this.post.insertAdjacentElement('beforeend', positionEl);
        }, () => {
          this.setUserCoords();
        },
      );
    } else {
      this.setUserCoords();
    }
    return this.post;
  }

  setUserCoords() {
    const positionEl = GetPosition.printPositionElement(true, '', '', '', '');
    const modal = new Modal('Нам не удалось определить Ваше местоположение', 'Возможно, Вы запретили это в настройках, или сеть недоступна. Пожалуйста, введите Ваши координаты в соответствующее поле.', this.post, positionEl);
    modal.addModal();

    // this.post.insertAdjacentElement('beforeend', positionEl);
  }
}
