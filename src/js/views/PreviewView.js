import View from "./View";
import icons from "../../img/icons.svg";

export default class PreviewView extends View {
  _generateMarkup() {
    // console.log(this._data);
    const id = window.location.hash.slice(1);
    const renderedList = this._data.reduce(
      (full, recipe) =>
        (full += `
        <li class="preview">
        <a class="preview__link ${
          recipe.id === id ? "preview__link--active" : ""
        }" href="#${recipe.id}">
          <figure class="preview__fig">
            <img src="${recipe.image}" alt="${recipe.title}" />
          </figure>
          <div class="preview__data">
            <h4 class="preview__title">${recipe.title}</h4>
            <p class="preview__publisher">${recipe.publisher}</p>
            <div class="preview__user-generated ${recipe.key ? "" : "hidden"}">
              <svg>
                <use href="${icons}#icon-user"></use>
              </svg>
            </div>
          </div>
        </a>
      </li>
          `),
      ""
    );

    return renderedList;
  }
}
// export default new PreviewView();
