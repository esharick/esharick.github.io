var content, searchSubset;
var viewTotal = 0;

function getYtUrl(id) {
  return `https://www.youtube-nocookie.com/embed/${id}?autohide=1&amp;modestbranding=0&amp;rel=0`;
}

function displaySubset(start = 0) {
  // Calculate stop position within the subset or up to 20 entries
  let stop = Math.min(start + 20, searchSubset.length);
  for (let i = start; i < stop; i++) {
    let row = $("<tr>");
    let link = $("<a>")
      .attr(
        "href",
        `https://www.youtube.com/watch?v=${searchSubset[i].videoID}`
      )
      .text(searchSubset[i].title)
      .addClass("vidtitle");
    row.append($("<td>").append(link));
    row.append($("<td>").text(searchSubset[i].seenCnt));
    $("#top-videos-table").append(row);
  }
}

try {
  let data = sessionStorage.getItem("videos");
  if (data === null) throw "No data found";
  content = JSON.parse(data);
  searchSubset = content.filter((item) => Object.hasOwn(item, "videoID")); // Filter out entities without videoID
  viewTotal = searchSubset.reduce((acc, item) => acc + item.seenCnt, 0);
} catch (e) {
  console.error(e);
  window.location.replace("./index.html");
}

$("#most-watched-title").text(searchSubset[0].title);
$("#no1embed").attr("src", getYtUrl(searchSubset[0].videoID));
$("#most-watched-d").text(
  $("#most-watched-d")
    .text()
    .replace("{a}", searchSubset[0].seenCnt.toLocaleString("en-US"))
);
$("#totalvc").text(
  $("#totalvc").text().replace("{a}", viewTotal.toLocaleString("en-US"))
);
$("#uniquevc").text(
  $("#uniquevc").text().replace("{a}", content.length.toLocaleString("en-US"))
);

function calcTime() {
  let avgTime = parseFloat($("#avgtime").val());
  let totalMinutes = viewTotal * avgTime;
  let hours = Math.floor(totalMinutes / 60);
  let days = Math.floor(hours / 24);
  // Assuming a rate of 5 megabits per second (720p video), conversion to Gigabytes:
  let gigabytes = (totalMinutes * 60 * 5) / 8 / 1024;
  let storage =
    gigabytes > 1024
      ? [(gigabytes / 1024).toFixed(2) + " Terabytes"]
      : [gigabytes.toFixed(2) + " Gigabytes"];

  $("#timeout").html(
    `That's ${hours.toLocaleString("en-US")} hours (${days.toLocaleString(
      "en-US"
    )} days)<br />Or ${storage} of data`
  );
}

calcTime();
$("#avgtime").on("input", calcTime);

displaySubset();

$("#load-more").click(function () {
  let currentlyDisplayed = $("#top-videos-table tr").length;
  displaySubset(currentlyDisplayed);
  if (currentlyDisplayed + 20 >= searchSubset.length) {
    $(this).hide();
  }
});

$("#load-all").click(function () {
  displaySubset(0, searchSubset.length);
  $(this).hide();
});

$("#search").on("input", function () {
  let search = $(this).val().toLowerCase();
  searchSubset = content.filter((item) =>
    item.title.toLowerCase().includes(search)
  );
  $("#top-videos-table").empty();
  displaySubset();
  $("#load-more").toggle(searchSubset.length > 20);
  $("#load-all").hide();
});

$("#export-json").click(function () {
  let data = JSON.stringify(searchSubset);
  download("yt-history.json", data);
});

$("#export-xml").click(function () {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<videos>\n';
  // its just pain
  searchSubset.forEach((item) => {
    xml += `  <video>\n    <title>${item.title}</title>\n    <videoID>${item.videoID}</videoID>\n    <seenCnt>${item.seenCnt}</seenCnt>\n  </video>\n`;
  });
  xml += "</videos>";
  download("yt-history.xml", xml);
});

$("#loader").fadeOut(1000);
