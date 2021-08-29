export default class Modal {
  static validationString(string) {
    return /^\[?\d{1,2}.\d{4,20}, ?- ?\d{1,2}.\d{4,20}\]?$/g.test(string);
  }

  constructor(title, text, elt, positionElt) {
    this.title = title;
    this.text = text;
    this.post = elt;
    this.positionElt = positionElt;
  }

  addModal() {
    const modal = this.printModal();
    document.body.insertAdjacentElement('beforeend', modal);
  }

  printModal() {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `<div class="modal__popup">
    <h3 class="popup__title">${this.title}</h3>
    <p class="popup__text">${this.text}</p>
    <form action="" class="popup__form">
      <input class="popup__field">
      <button class="popup__btn">отправить</button>
    </form>
    </div>`;
    modal.addEventListener('click', (e) => {
      const { target } = e;
      if (target.classList.contains('modal')) {
        target.remove();
      }
    });
    const field = modal.querySelector('.popup__field');
    modal.querySelector('.popup__btn').addEventListener('click', (e) => {
      this.validation(field);
      document.querySelector('.posts').insertAdjacentElement('beforeend', this.post);
      e.preventDefault();
    });
    return modal;
  }

  validation(el) {
    const field = el;
    const testStr = Modal.validationString(field.value);
    if (testStr) {
      this.positionElt.querySelector('.geoposition__text').textContent = field.value;
      this.post.insertAdjacentElement('beforeend', this.positionElt);
      document.querySelector('.modal').remove();
    } else {
      field.classList.add('errorfield');
    }
  }
}
