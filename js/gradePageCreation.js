const selectedCourses = {};

// Map subject codes to display names
const subjectNames = {
  EN: "English",
  MA: "Math",
  SC: "Science",
  SS: "Social Studies",
  WL: "World Language",
  VP: "Visual & Performing Arts",
  BU: "Business",
  TE: "Technology & Engineering",
  PE: "Physical Education",
  EL: "Electives"
};

// --- Detect current grade from URL (e.g. /pages/grade10.html → "10") ---
function getCurrentGrade() {
  const match = window.location.pathname.match(/grade(\d+)/i);
  return match ? match[1] : null;
}

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
  const grade = getCurrentGrade();

  // Filter to only courses available in the current grade
  const gradeCourses = grade
    ? coursesData.filter(c => c.grades && c.grades.includes(grade))
    : coursesData;

  const container = document.getElementById("course-selection");
  const grouped = groupBySubject(gradeCourses);

  container.innerHTML = "";

  Object.keys(grouped).forEach(subject => {
    const section = document.createElement("div");
    section.className = "subject-section";

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

    section.appendChild(label);
    section.appendChild(buttonContainer);
    container.appendChild(section);
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

  let totalCredits = 0;

  Object.entries(selectedCourses).forEach(([subject, course]) => {
    const levels = course.levels || [];
    const credits = parseFloat(course.credit) || 0;

    levels.forEach(level => {
      const numbers = course.courseNumbers?.[level] || [];
      const courseNumDisplay = numbers.join(", ") || "—";
      totalCredits += credits;

      const tr = document.createElement("tr");

      const tdName = document.createElement("td");
      tdName.textContent = course.name;

      const tdLevel = document.createElement("td");
      tdLevel.textContent = level;

      const tdNum = document.createElement("td");
      tdNum.textContent = courseNumDisplay;

      const tdCredits = document.createElement("td");
      tdCredits.textContent = credits % 1 === 0 ? credits.toFixed(0) : credits;

      tr.appendChild(tdName);
      tr.appendChild(tdLevel);
      tr.appendChild(tdNum);
      tr.appendChild(tdCredits);
      tbody.appendChild(tr);
    });
  });

  // Total row
  const totalTr = document.createElement("tr");
  totalTr.className = "total-row";

  const tdLabel = document.createElement("td");
  tdLabel.colSpan = 3;
  tdLabel.textContent = "Total Credits";

  const tdTotal = document.createElement("td");
  tdTotal.textContent = totalCredits % 1 === 0 ? totalCredits.toFixed(0) : totalCredits;

  totalTr.appendChild(tdLabel);
  totalTr.appendChild(tdTotal);
  tbody.appendChild(totalTr);
}

document.getElementById("clear-btn").onclick = () => {
  Object.keys(selectedCourses).forEach(key => delete selectedCourses[key]);

  document.querySelectorAll(".course-buttons button")
    .forEach(btn => btn.classList.remove("selected"));

  updateTable();
};

document.getElementById("print-btn").onclick = () => {
  window.print();
};

// Called when the page loads
loadCourses(renderCourses);