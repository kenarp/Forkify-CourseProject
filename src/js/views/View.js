import icons from "../../img/icons.svg";

export default class View {
  _parentElement;
  _data;

  renderSpinner() {
    const markup = `
    <div class="spinner">
        <svg>
          <use href="${icons}#icon-loader"></use>
        </svg>
    </div>
    `;
    // console.log(this._parentElement);
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  /**
   * Render the received Object to the DOM
   * @param {Object|Object[]} data The data to be rendered(e.g. recipe)
   * @returns {undefined | String} A markup String is returned if render = false
   * @this {Object} View instance
   */

  render(data) {
    if (!data || (Array.isArray(data) && data.length === 0)) {
      return this.renderError();
    }

    this._data = data;
    this._clear();
    const markup = this._generateMarkup();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderError(message = this._errorMessage) {
    const markup =
      message !== "Empty Bookmark"
        ? `
      <div class="error">
        <div>
          <svg>
            <use href="${icons}#icon-alert-triangle"></use>
          </svg>
        </div>
        <p>${message}</p>
      </div>
  `
        : this.renderMessage(
            "No bookmarks yet. Find a nice recipe and bookmark it :)",
            false
          );
    this._clear();
    this._parentElement.insertAdjacentHTML("afterbegin", markup);
  }

  renderMessage(message = this._message, render = true) {
    const markup = `
    <div class="message">
        <div>
            <svg>
                <use href="${icons}#icon-smile"></use>
            </svg>
        </div>
        <p>
            ${message}
        </p>
    </div>
`;
    if (render) {
      this._clear();
      this._parentElement.insertAdjacentHTML("afterbegin", markup);
    }
    return markup;
  }

  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup); //A Virtual DOM lives in the memory
    const newElements = Array.from(newDOM.querySelectorAll("*")); //Convert NodeList to array
    // console.log(newElements);
    const curElements = Array.from(this._parentElement.querySelectorAll("*"));

    newElements.forEach((newEl, i) => {
      const curEl = curElements[i];

      //Update changed TEXT
      if (
        !newEl.isEqualNode(curEl) &&
        newEl.firstChild?.nodeValue.trim() !== ""
      ) {
        curEl.textContent = newEl.textContent;
      }

      //Update changed Attributes
      if (!newEl.isEqualNode(curEl)) {
        Array.from(newEl.attributes).forEach((attr) =>
          curEl.setAttribute(attr.name, attr.value)
        );
      }
    });
  }

  _clear() {
    this._parentElement.innerHTML = "";
  }
}
