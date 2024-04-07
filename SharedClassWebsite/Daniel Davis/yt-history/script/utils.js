class Video {
  constructor(title, id, date) {
    this.title = title;
    this.id = id;
    this.seenCnt = 1;
    this.date = [date];
  }

  static foundVideo(title, id, date) {
    for (let video of videos) {
      if (video.id === id) {
        video.seenCnt += 1;
        video.date.push(date);
        return true;
      }
    }
    videos.push(new Video(title, id, 1));
  }
}

function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text)
  );
  element.setAttribute("download", filename);

  element.style.display = "none";
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}
