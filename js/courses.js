let coursesData = [];

function loadCourses(callback) {
  const CACHE_ENABLED = false; //set to true after data cleaning

  let cachedRaw = localStorage.getItem("coursesData");
  let cachedVersion = localStorage.getItem("coursesVersion");

  fetch("/data/courses.json")
    .then(response => response.json())
    .then(data => {
      if (CACHE_ENABLED && cachedRaw && cachedVersion === data.version) {
        coursesData = JSON.parse(cachedRaw);
        console.log("Loaded courses from cache (same version)");
      } else {
        coursesData = data.courses;
        localStorage.setItem("coursesData", JSON.stringify(coursesData));
        localStorage.setItem("coursesVersion", data.version);
        console.log("Fetched updated courses JSON (new version)");
      }
      callback();
    })
    .catch(err => console.error("Error loading courses:", err));
}
