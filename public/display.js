const DURATION = 5000;
let files = [];
let index = 0;

function showNext() {
  if (files[index]) {
    $("img").attr("src", "/file/" + files[index]);
    index++;
    setTimeout(showNext, DURATION);
  } else {
    index = 0;
    showNext();
  }
}

function getPhotos() {
  $.ajax({
    url: "/list",
    type: "GET",
    success: function (response, status, jqxhr) {
      files = response;
      index = 0;
      showNext();
    },
    error: function (jqxhr, status, errorMessage) {
      if (files.length === 0) {
        $("#slideshow").text("Failed! Error message: " + errorMessage);
      }
    }
  });
}

window.onload = function () {
  getPhotos();
}
