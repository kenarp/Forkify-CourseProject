import View from "./View";
import icons from "../../img/icons.svg";
import { RES_PER_PAGE } from "../config";

class PaginationView extends View {
  _parentElement = document.querySelector(".pagination");
  #currPage;

  setPage(page) {
    this.#currPage = page;
  }

  addHandlerPagination(handler) {
    this._parentElement.addEventListener("click", function (e) {
      const button = e.target.closest(".btn--inline");
      if (!button) return;
      const gotoPage = +button.dataset.goto;
      //console.log(gotoPage);
      handler(gotoPage);
    });
  }

  _generateMarkup() {
    const resultsLength = this._data;
    const currPage = this.#currPage;
    const leftEntries = resultsLength - RES_PER_PAGE * currPage;
    const hasPrevPage = currPage > 1 ? true : false;
    const hasNextPage = leftEntries > 0 ? true : false;
    let markup = "";
    if (hasPrevPage) {
      markup += `
        <button data-goto="${
          currPage - 1
        }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currPage - 1}</span>
        </button>`;
    }
    if (hasNextPage) {
      markup += `
        <button data-goto="${
          currPage + 1
        }" class="btn--inline pagination__btn--next">
            <span>Page ${currPage + 1}</span>
            <svg class="search__icon">
                <use href="${icons}#icon-arrow-right"></use>
            </svg>
        </button>
        `;
    }
    return markup;
  }
}

export default new PaginationView();
