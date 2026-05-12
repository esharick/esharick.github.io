let coursesData = [];

function loadCourses(callback) {
  const cachedData = localStorage.getItem("coursesData");

  if (cachedData) {
    coursesData = JSON.parse(cachedData);
    console.log("Loaded courses from localStorage");
    callback();
  } else {
    fetch("/data/courses.json")
      .then(response => response.json())
      .then(data => {
        coursesData = data;

        localStorage.setItem("coursesData", JSON.stringify(coursesData));

        console.log("Fetched and stored courses JSON");

        callback();
      })
      .catch(err => console.error("Error loading courses:", err));
  }
}

