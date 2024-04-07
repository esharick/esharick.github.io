let videos = [];

$(document).ready(function () {
  if (sessionStorage.getItem("videos")) {
    $("#foundDataRow").show();
  }

  $("#clear").on("click", function () {
    sessionStorage.removeItem("videos");
    location.reload();
    event.stopPropagation();
  });

  $("#explore").on("click", function () {
    window.location.href = "explore.html";
    event.stopPropagation();
  });

  $("#uploadArea").on("dragover", function (e) {
    e.preventDefault();
    e.stopPropagation();
  });

  $("#uploadArea").on("drop", function (e) {
    e.preventDefault();
    e.stopPropagation();
    $("#loader").show();
    var file = e.originalEvent.dataTransfer.files[0];
    if (file && /html$/.test(file.name)) {
      var reader = new FileReader();
      reader.onload = function (e) {
        parseVideos(e.target.result);
      };
      reader.readAsText(file);
    } else {
      alert("Please upload a valid HTML file.");
    }
  });

  $("#uploadArea").on("click", function () {
    var fileInput = $(
      '<input type="file" style="display: none;" accept=".html, text/html" />'
    );
    fileInput.on("change", function (e) {
      $("#loader").show();
      var file = e.target.files[0];
      if (file && /html$/.test(file.name)) {
        var reader = new FileReader();
        reader.onload = function (e) {
          parseVideos(e.target.result);
        };
        reader.readAsText(file);
      } else {
        alert("Please upload a valid HTML file.");
      }
    });
    fileInput.click();
  });
});

function parseVideos(htmlContent) {
  $("#loader").show();
  let parser = new DOMParser();
  let doc = parser.parseFromString(htmlContent, "text/html");

  let videoDivs = doc.querySelectorAll(".mdl-grid");

  videoDivs.forEach((div) => {
    let title = div.querySelector("a").textContent.trim();
    if (title.length > 100) {
      title = title.substring(0, 100) + "...";
    }
    let dateInfo = "No Date Found";
    try {
      dateInfo = div
        .querySelector(
          ".content-cell.mdl-cell.mdl-cell--6-col.mdl-typography--body-1 a"
        )
        .textContent.trim();
    } catch (error) {}

    let videoLink = div.querySelector("a").getAttribute("href");
    let videoId = "No Video ID Found";
    try {
      videoId = videoLink.split("=")[1];
    } catch (error) {}

    Video.foundVideo(title, videoId, dateInfo);
  });

  videos.sort((a, b) => b.seenCnt - a.seenCnt);

  let output = videos.map((video) => {
    return {
      title: video.title,
      seenCnt: video.seenCnt,
      videoID: video.id,
    };
  });

  var stringOut = JSON.stringify(output);
  $("#loader").hide();

  try {
    sessionStorage.setItem("videos", stringOut);
    window.location.href = "explore.html";
  } catch (error) {
    alert("File too big to explore. Press OK to download your converted file.");
    download("yt-history.json", stringOut);
  }
}
