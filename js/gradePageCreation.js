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
  EL: "Electives",
  CAP: "AP Capstone"
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

  // 1. Core Priority Order (Everything else automatically renders as an Elective)
  const coreOrder = ["EN", "MA", "SS", "SC", "WL", "PE"];
  const allSubjects = Object.keys(grouped);

  // 2. Separate Core Subjects from Elective-style Subjects
  const coreSubjects = coreOrder.filter(subj => allSubjects.includes(subj));
  const electiveSubjects = allSubjects.filter(subj => !coreOrder.includes(subj));

  // --- Helper function to build a standard button section ---
  function createSection(subject) {
    const section = document.createElement("div");
    section.className = "subject-section";

    const label = document.createElement("div");
    label.className = "subject-label";
    label.textContent = subject === "EN" ? "English" : (subjectNames[subject] || subject);

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "course-buttons";

    grouped[subject].forEach(course => {
      const btn = document.createElement("button");
      btn.textContent = course.name;
      
      if (selectedCourses[course.name]) {
        btn.classList.add("selected");
      }
      
      btn.onclick = () => selectCourse(subject, course, btn);
      buttonContainer.appendChild(btn);
    });

    section.appendChild(label);
    section.appendChild(buttonContainer);
    return section;
  }

  // 3. Render Main Core Subjects First
  coreSubjects.forEach(subject => {
    container.appendChild(createSection(subject));
  });

  // 4. Construct the Main "Electives" Dropdown Menu
  const mainElectivesDetails = document.createElement("details");
  mainElectivesDetails.className = "subject-section electives-main-dropdown";
  
  const mainElectivesSummary = document.createElement("summary");
  mainElectivesSummary.className = "subject-label";
  mainElectivesSummary.textContent = "Electives Menu";
  mainElectivesSummary.style.cursor = "pointer";
  mainElectivesDetails.appendChild(mainElectivesSummary);

  const mainElectivesContainer = document.createElement("div");
  mainElectivesContainer.style.paddingLeft = "15px";
  mainElectivesContainer.style.marginTop = "10px";

  // CHANGED: English Electives is now wrapped in a <details> dropdown format
  if (grouped["EN"]) {
    const enDetails = document.createElement("details");
    enDetails.style.marginBottom = "10px";

    const enSummary = document.createElement("summary");
    enSummary.className = "subject-label";
    enSummary.textContent = "English Electives";
    enSummary.style.cursor = "pointer";
    enSummary.style.fontSize = "14px";

    const enContent = createSection("EN");
    const oldEnLabel = enContent.querySelector(".subject-label");
    if (oldEnLabel) oldEnLabel.remove();

    enDetails.appendChild(enSummary);
    enDetails.appendChild(enContent);
    mainElectivesContainer.appendChild(enDetails);
  }

  // B. Group remaining sections (TE, VP, IL, AP, FC, BU, EL, etc.) underneath
  electiveSubjects.forEach(subject => {
    if (subject === "EN") return; 

    const innerDetails = document.createElement("details");
    innerDetails.style.marginBottom = "10px";

    const innerSummary = document.createElement("summary");
    innerSummary.className = "subject-label";
    innerSummary.textContent = subjectNames[subject] || subject;
    innerSummary.style.cursor = "pointer";
    innerSummary.style.fontSize = "14px";

    const innerContent = createSection(subject);
    const oldLabel = innerContent.querySelector(".subject-label");
    if (oldLabel) oldLabel.remove();

    innerDetails.appendChild(innerSummary);
    innerDetails.appendChild(innerContent);
    mainElectivesContainer.appendChild(innerDetails);
  });

  mainElectivesDetails.appendChild(mainElectivesContainer);
  container.appendChild(mainElectivesDetails);
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