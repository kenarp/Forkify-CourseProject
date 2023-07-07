// import View from "./View";
import icons from "../../img/icons.svg";
import { API_URL } from "../config";
import PreviewView from "./PreviewView";

class ResultsView extends PreviewView {
  _parentElement = document.querySelector(".results");
  _errorMessage = "We Could Not find any recipes. Please try again!";
}

export default new ResultsView();
