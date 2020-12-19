"use strict";

var tempResult = [];
var url = "";

function validateAllNumbersAreEntered() {
  return tempResult.every((number) => number >= 0);
}

function getResultText() {
  return tempResult.map((number) => (number == -1 ? "X" : number)).join("");
}

function displayResult() {
  var resultElement = document.getElementById("muf-result");
  resultElement.textContent = getResultText();
}

function click(e) {
  tempResult[e.target.cellIndex] = e.target.innerText;

  displayResult();

  if (validateAllNumbersAreEntered()) {
    chrome.tabs.create({
      url: `${url}${tempResult.join("")}`,
    });
  }
}

function restore_options() {
  chrome.storage.sync.get(
    {
      contentUrl: "",
      numbers: [-1, -1, -1, -1],
    },
    function (items) {
      var table = document.getElementById("muf-table");

      tempResult = [...items.numbers];
      url = items.contentUrl;

      items.numbers.forEach((number, index) => {
        if (number >= 0) {
          table.rows[number].cells[index].classList.add("selected");
        }
      });

      displayResult();
    }
  );
}

document.addEventListener("DOMContentLoaded", function () {
  restore_options();

  var divs = document.querySelectorAll("td");
  for (var i = 0; i < divs.length; i++) {
    divs[i].addEventListener("click", click);
  }
});
