import View from "./View";

class SearchView extends View {
  _parentElement = document.querySelector(".search");

  getQuery() {
    const query = this._parentElement.querySelector(".search__field").value;
    this.#clearInput();
    return query;
  }

  addHandlerSearch(handler) {
    this._parentElement.addEventListener("submit", function (e) {
      e.preventDefault();
      handler();
    });
  }

  #clearInput() {
    this._parentElement.querySelector(".search__field").value = "";
  }
}
// const parentEl = document.querySelector(".search");
export default new SearchView();
