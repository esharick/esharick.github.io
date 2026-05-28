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

// UNCHANGED: Kept exactly as it was originally
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

  // 1. Define your strict custom sorting order
  const customOrder = ["EN", "MA", "SS", "SC", "WL"];

  // 2. Gather all subjects that exist in your current grouped data
  const allSubjects = Object.keys(grouped);

  // 3. Sort them: explicit priorities first, everything else follows underneath
  const sortedSubjects = allSubjects.sort((a, b) => {
    const indexA = customOrder.indexOf(a);
    const indexB = customOrder.indexOf(b);

    // If both subjects are in our custom list, sort by their defined priority
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    
    // If only 'a' is prioritized, push it above 'b'
    if (indexA !== -1) return -1;
    
    // If only 'b' is prioritized, push it above 'a'
    if (indexB !== -1) return 1;

    // If neither is prioritized, keep their original structural order
    return 0;
  });

  // 4. Loop through the correctly sorted subjects to generate the HTML
  sortedSubjects.forEach(subject => {
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

// CHANGED: Toggles individual buttons independently and tracks by name so you can pick multiple
function selectCourse(subject, course, button) {
  const isAlreadySelected = button.classList.contains("selected");

  if (isAlreadySelected) {
    button.classList.remove("selected");
    delete selectedCourses[course.name];
  } else {
    button.classList.add("selected");
    selectedCourses[course.name] = course;
  }

  // Refresh the schedule table with the new state
  updateTable();
}

// CHANGED: Only adjusted the loop mapping to extract course data from unique course names
function updateTable() {
  const tbody = document.querySelector("#schedule-table tbody");
  tbody.innerHTML = "";

  let totalCredits = 0;

  Object.entries(selectedCourses).forEach(([courseName, course]) => {
    const levels = course.levels || [];
    const credits = parseFloat(course.credit) || 0;
    const hasLevels = levels.length > 0;
    const defaultLevel = hasLevels ? levels[0] : null;

    // If no levels, flatten all courseNumbers values
    const defaultNumbers = defaultLevel
      ? course.courseNumbers?.[defaultLevel] || []
      : Object.values(course.courseNumbers || {}).flat();

    totalCredits += credits;

    const tr = document.createElement("tr");

    // Course Name
    const tdName = document.createElement("td");
    tdName.textContent = course.name;

    // Level — dropdown if levels exist, otherwise "N/A"
    const tdLevel = document.createElement("td");

    // Course # — declared here so the dropdown's change handler can reference it
    const tdNum = document.createElement("td");
    tdNum.textContent = defaultNumbers.join(", ") || "—";

    if (hasLevels) {
      const select = document.createElement("select");

      levels.forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        select.appendChild(option);
      });

      // When level changes, update Course # cell
      select.addEventListener("change", () => {
        const nums = course.courseNumbers?.[select.value] || [];
        tdNum.textContent = nums.join(", ") || "—";
      });

      tdLevel.appendChild(select);
    } else {
      tdLevel.textContent = "EL";
    }

    // Credits
    const tdCredits = document.createElement("td");
    tdCredits.textContent = credits % 1 === 0 ? credits.toFixed(0) : credits;

    tr.appendChild(tdName);
    tr.appendChild(tdLevel);
    tr.appendChild(tdNum);
    tr.appendChild(tdCredits);
    tbody.appendChild(tr);
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