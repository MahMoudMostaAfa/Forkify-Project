import icons from '../../img/icons.svg';
export default class View {
  _data;
  /**
   *
   * @param {*} data
   * @param {*} render
   * @returns
   */
  render(data, render = true) {
    this._data = data;
    //console.log(this._data);
    const markup = this._generateMarkup();
    if (!render) return markup;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  update(data) {
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderError();
    this._data = data;
    //console.log(this._data);
    const newMarkup = this._generateMarkup();
    const newDom = document.createRange().createContextualFragment(newMarkup);
    // change dom to nodelist then to  array
    const newElements = Array.from(newDom.querySelectorAll('*'));
    const currentElements = Array.from(
      this._parentElement.querySelectorAll('*')
    );
    newElements.forEach((newEl, i) => {
      const curEl = currentElements[i];
      // replace textcontent
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ''
      ) {
        curEl.textContent = newEl.textContent;
      }
      //replace attributes
      if (!newEl.isEqualNode(curEl))
        Array.from(newEl.attributes).forEach(atr => {
          curEl.setAttribute(atr.name, atr.value);
        });
    });
    //console.log(newElements, currentElements);
  }
  _clear() {
    this._parentElement.innerHTML = '';
  }
  renderSpiner() {
    const markup = `
    <div class="spinner">
            <svg>
              <use href="${icons}icons.svg#icon-loader"></use>
            </svg>
          </div>
    `;
    //console.log(this._parentElement);
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderError(message = this._errorMessage) {
    const markup = `
    <div class="error">
            <div>
              <svg>
                <use href="${icons}#icon-alert-triangle"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
  renderSucces(message = this._SucessMessage) {
    const markup = `
    <div class="message">
            <div>
              <svg>
                <use href="${icons}#icon-smile"></use>
              </svg>
            </div>
            <p>${message}</p>
          </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
