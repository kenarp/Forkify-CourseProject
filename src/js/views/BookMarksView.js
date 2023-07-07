// import View from "./View";
import icons from "../../img/icons.svg";
import { API_URL } from "../config";
import previewView from "./PreviewView";

class BookmarksView extends previewView {
  _parentElement = document.querySelector(".bookmarks__list");
  _errorMessage = "Empty Bookmark";
}
export default new BookmarksView();
