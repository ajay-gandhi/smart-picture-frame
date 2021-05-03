$("button").on("click", function () {
  const fdata = new FormData();
  const files = $("input").get(0).files;
  $("span").text("Uploading " + files.length + " files...");

  $.each(files, function (i, file) {
    fdata.append("file" + i, file);
  });

  $.ajax({
    url: "/upload",
    type: "POST",
    data: fdata,
    processData: false,
    contentType: false,
    success: function (response, status, jqxhr) {
      $("span").text("Finished! " + files.length + " files were uploaded");
    },
    error: function (jqxhr, status, errorMessage) {
      $("span").text("Failed! Error message: " + errorMessage);
    }
  });
});
