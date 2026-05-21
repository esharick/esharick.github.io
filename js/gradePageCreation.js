
const selectedCourses = {};

// Map subject codes to display names
const subjectNames = {
  EN: "English",
  MA: "Math",
  SC: "Science",
  SS: "Social Studies",
  WL: "World Language"
};

function groupBySubject(courses) {
  const grouped = {};

  courses.forEach(course => {
    const subject = course.category[0];

    if (!grouped[subject]) {
      grouped[subject] = [];
    }

    grouped[subject].push(course);
  });

  return grouped;
}

function renderCourses() {
  const container = document.getElementById("course-selection");
  const grouped = groupBySubject(coursesData);

  container.innerHTML = "";

  Object.keys(grouped).forEach(subject => {
    const row = document.createElement("div");
    row.className = "subject-row";

    const label = document.createElement("div");
    label.className = "subject-label";
    label.textContent = subjectNames[subject] || subject;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "course-buttons";

    grouped[subject].forEach(course => {
      const btn = document.createElement("button");
      btn.textContent = course.name;

      btn.onclick = () => selectCourse(subject, course, btn);

      buttonContainer.appendChild(btn);
    });

    row.appendChild(label);
    row.appendChild(buttonContainer);
    container.appendChild(row);
  });
}

function selectCourse(subject, course, button) {
  // Remove selection from other buttons in same row
  const parent = button.parentElement;
  Array.from(parent.children).forEach(btn => btn.classList.remove("selected"));

  button.classList.add("selected");

  selectedCourses[subject] = course;

  updateTable();
}

function updateTable() {
  const tbody = document.querySelector("#schedule-table tbody");
  tbody.innerHTML = "";

  Object.entries(selectedCourses).forEach(([subject, course]) => {
    const tr = document.createElement("tr");

    const tdSubject = document.createElement("td");
    tdSubject.textContent = subjectNames[subject] || subject;

    const tdCourse = document.createElement("td");
    tdCourse.textContent = course.name;

    tr.appendChild(tdSubject);
    tr.appendChild(tdCourse);
    tbody.appendChild(tr);
  });
}


document.getElementById("clear-btn").onclick = () => {
  Object.keys(selectedCourses).forEach(key => delete selectedCourses[key]);

  document.querySelectorAll(".course-buttons button")
    .forEach(btn => btn.classList.remove("selected"));

  updateTable();
};

document.getElementById("print-btn").onclick = () => {
  window.print(); // replace with redirect later if needed
};


//Called when the page loads
loadCourses(renderCourses);

