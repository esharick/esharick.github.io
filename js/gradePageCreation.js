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
  EL: "Communications",
  CAP: "AP Capstone",
  IL: "Indepenedent Learning",
  FC: "Family Consumer Science",
  CT: "CCT"
};

// --- Detect current grade from URL (e.g. /pages/grade10.html → "10") ---
function getCurrentGrade() {
  const match = window.location.pathname.match(/grade(\d+)/i);
  return match ? match[1] : null;
}

// --- localStorage helpers ---
function getStorageKey() {
  const grade = getCurrentGrade();
  return grade ? `selectedCourses_grade${grade}` : "selectedCourses_unknown";
}

// --- STRUCTURAL SAVE MECHANISM ---
function saveSelections() {
  const key = getStorageKey();
  const grade = getCurrentGrade();
  
  const exportData = {
    year: grade ? parseInt(grade, 10) : "unknown",
    courses: []
  };

  Object.entries(selectedCourses).forEach(([courseName, course]) => {
    const levels = course.levels || [];
    
    const tableRow = Array.from(document.querySelectorAll("#schedule-table tbody tr"))
      .find(row => row.cells[0] && row.cells[0].textContent === courseName);
    
    let activeLevel = levels[0] || null;
    if (tableRow) {
      const selectElem = tableRow.cells[1].querySelector("select");
      if (selectElem) {
        activeLevel = selectElem.value;
      } else if (tableRow.cells[1].textContent !== "N/A") {
        activeLevel = tableRow.cells[1].textContent;
      }
    }

    const defaultNumbers = activeLevel
      ? course.courseNumbers?.[activeLevel] || []
      : Object.values(course.courseNumbers || {}).flat();

    const courseObj = {
      name: course.name,
      courseNumber: defaultNumbers.join(", ") || "—",
      credits: parseFloat(course.credit) || 0,
      tags: course.category || []
    };

    if (activeLevel) {
      courseObj.level = activeLevel;
    }

    exportData.courses.push(courseObj);
  });

  localStorage.setItem(key, JSON.stringify(exportData));
  alert("Selections saved successfully!");
}

// --- FIXED: Safely parsing storage data after data array is populated ---
function loadSelections() {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    
    if (parsed && Array.isArray(parsed.courses)) {
      // Clear out any old state to prepare fresh UI sync
      Object.keys(selectedCourses).forEach(k => delete selectedCourses[k]);

      parsed.courses.forEach(savedCourse => {
        // Double-check if external courses array source exists
        if (typeof coursesData !== "undefined" && Array.isArray(coursesData)) {
          const found = coursesData.find(c => c.name === savedCourse.name);
          if (found) {
            selectedCourses[found.name] = found;
          }
        }
      });
    }
  } catch (e) {
    console.warn("Could not load saved selections:", e);
  }
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

  const gradeCourses = grade
    ? coursesData.filter(c => c.grades && c.grades.includes(grade))
    : coursesData;

  const coreEnglishCourses = gradeCourses.filter(
    c => c.category.includes("EN") && !c.category.includes("EL")
  );
  const englishElectiveCourses = gradeCourses.filter(
    c => c.category.includes("EN") && c.category.includes("EL")
  );

  const coreSocialStudiesCourses = gradeCourses.filter(
    c => c.category.includes("SS") && !c.category.includes("EL")
  );
  const socialStudiesElectiveCourses = gradeCourses.filter(
    c => c.category.includes("SS") && c.category.includes("EL")
  );

  const isGrade11 = (grade === "11");
  const cctCourses = isGrade11
    ? gradeCourses.filter(c => c.category.includes("CT"))
    : [];

  const remainingCourses = gradeCourses.filter(c => {
    if (c.category.includes("EN") || c.category.includes("SS")) return false;
    if (isGrade11 && c.category.includes("CT")) return false;
    return true;
  });

  const grouped = groupBySubject(remainingCourses);

  const container = document.getElementById("course-selection");
  container.innerHTML = "";

  const coreOrder = ["MA", "SC", "WL", "PE"];
  const allSubjects = Object.keys(grouped);

  const coreSubjects = coreOrder.filter(subj => allSubjects.includes(subj));
  const electiveSubjects = allSubjects.filter(subj => !coreOrder.includes(subj));

  function createSection(labelName, coursesList) {
    const section = document.createElement("div");
    section.className = "subject-section";

    const label = document.createElement("div");
    label.className = "subject-label";
    label.textContent = labelName;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "course-buttons";

    coursesList.forEach(course => {
      const btn = document.createElement("button");
      btn.textContent = course.name;

      if (selectedCourses[course.name]) {
        btn.classList.add("selected");
      }

      btn.onclick = () => selectCourse(labelName, course, btn);
      buttonContainer.appendChild(btn);
    });

    section.appendChild(label);
    section.appendChild(buttonContainer);
    return section;
  }

  if (coreEnglishCourses.length > 0) {
    container.appendChild(createSection("English", coreEnglishCourses));
  }

  if (coreSocialStudiesCourses.length > 0) {
    container.appendChild(createSection("Social Studies", coreSocialStudiesCourses));
  }

  coreSubjects.forEach(subject => {
    container.appendChild(createSection(subjectNames[subject] || subject, grouped[subject]));

    if (subject === "PE" && isGrade11 && cctCourses.length > 0) {
      container.appendChild(createSection(subjectNames["CT"] || "CCT", cctCourses));
    }
  });

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

  if (englishElectiveCourses.length > 0) {
    const enDetails = document.createElement("details");
    enDetails.style.marginBottom = "10px";

    const enSummary = document.createElement("summary");
    enSummary.className = "subject-label";
    enSummary.textContent = "English Electives";
    enSummary.style.cursor = "pointer";
    enSummary.style.fontSize = "14px";

    const enContent = createSection("English Electives", englishElectiveCourses);
    const oldEnLabel = enContent.querySelector(".subject-label");
    if (oldEnLabel) oldEnLabel.remove();

    enDetails.appendChild(enSummary);
    enDetails.appendChild(enContent);
    mainElectivesContainer.appendChild(enDetails);
  }

  if (socialStudiesElectiveCourses.length > 0) {
    const ssDetails = document.createElement("details");
    ssDetails.style.marginBottom = "10px";

    const ssSummary = document.createElement("summary");
    ssSummary.className = "subject-label";
    ssSummary.textContent = "Social Studies Electives";
    ssSummary.style.cursor = "pointer";
    ssSummary.style.fontSize = "14px";

    const ssContent = createSection("Social Studies Electives", socialStudiesElectiveCourses);
    const oldSsLabel = ssContent.querySelector(".subject-label");
    if (oldSsLabel) oldSsLabel.remove();

    ssDetails.appendChild(ssSummary);
    ssDetails.appendChild(ssContent);
    mainElectivesContainer.appendChild(ssDetails);
  }

  electiveSubjects.forEach(subject => {
    const innerDetails = document.createElement("details");
    innerDetails.style.marginBottom = "10px";

    const innerSummary = document.createElement("summary");
    innerSummary.className = "subject-label";
    innerSummary.textContent = subjectNames[subject] || subject;
    innerSummary.style.cursor = "pointer";
    innerSummary.style.fontSize = "14px";

    const innerContent = createSection(subjectNames[subject] || subject, grouped[subject]);
    const oldLabel = innerContent.querySelector(".subject-label");
    if (oldLabel) oldLabel.remove();

    innerDetails.appendChild(innerSummary);
    innerDetails.appendChild(innerContent);
    mainElectivesContainer.appendChild(innerDetails);
  });

  mainElectivesDetails.appendChild(mainElectivesContainer);
  container.appendChild(mainElectivesDetails);

  updateTable();
}

function selectCourse(subject, course, button) {
  const isAlreadySelected = button.classList.contains("selected");

  if (isAlreadySelected) {
    button.classList.remove("selected");
    delete selectedCourses[course.name];
  } else {
    button.classList.add("selected");
    selectedCourses[course.name] = course;
    showCoursePopup(course);
  }

  updateTable();
}

function showCoursePopup(course) {
  const existingPopup = document.getElementById("course-modal-overlay");
  if (existingPopup) existingPopup.remove();

  const overlay = document.createElement("div");
  overlay.id = "course-modal-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "99999";

  const modal = document.createElement("div");
  modal.className = "course-modal-content";
  modal.style.backgroundColor = "var(--surface, #1e1e1e)";
  modal.style.border = "1px solid var(--border, #333)";
  modal.style.borderRadius = "8px";
  modal.style.width = "90%";
  modal.style.maxWidth = "550px";
  modal.style.padding = "24px";
  modal.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.6)";
  modal.style.maxHeight = "80vh";
  modal.style.overflowY = "auto";
  modal.style.position = "relative";

  const gradesDisplay = course.grades ? course.grades.join(", ") : "N/A";
  const prereqDisplay = course.prerequisites && course.prerequisites.trim() !== ""
    ? course.prerequisites
    : "None";

  modal.innerHTML = `
    <div class="modal-header" style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
      <h3 style="margin: 0; color: var(--primary, #4cafef); font-size: 22px;">${course.name}</h3>
      <button class="modal-close-btn" style="background: transparent; border: none; color: var(--muted, #888); font-size: 28px; cursor: pointer; line-height: 1; padding: 0 5px;">&times;</button>
    </div>
    <div class="modal-meta" style="font-size: 14px; color: #b0b0b0;">
      <p style="margin: 6px 0;"><strong>Credits:</strong> ${course.credit}</p>
      <p style="margin: 6px 0;"><strong>Grades:</strong> ${gradesDisplay}</p>
      <p style="margin: 6px 0;"><strong>Term:</strong> ${course.term === "Y" ? "Full Year" : course.term}</p>
      <p style="margin: 6px 0;"><strong>Prerequisites:</strong> ${prereqDisplay}</p>
    </div>
    <hr class="modal-divider" style="border: 0; border-top: 1px solid var(--border, #333); margin: 15px 0;">
    <div class="modal-body" style="font-size: 14px; line-height: 1.6; color: var(--text, #e0e0e0);">
      <p>${course.description ? course.description.replace(/\n/g, '<br>') : "No description available."}</p>
    </div>
  `;

  overlay.appendChild(modal);
  document.body.appendChild(overlay);

  const closePopup = () => overlay.remove();
  modal.querySelector(".modal-close-btn").onclick = closePopup;
  overlay.onclick = (e) => {
    if (e.target === overlay) closePopup();
  };
}

function updateTable() {
  const tbody = document.querySelector("#schedule-table tbody");
  tbody.innerHTML = "";

  let totalCredits = 0;
  const tableOrder = ["EN", "MA", "SS", "SC", "WL", "PE"];

  const sortedEntries = Object.entries(selectedCourses).sort(([nameA, courseA], [nameB, courseB]) => {
    const subjA = courseA.category[0];
    const subjB = courseB.category[0];
    const indexA = tableOrder.indexOf(subjA);
    const indexB = tableOrder.indexOf(subjB);

    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    return subjA.localeCompare(subjB);
  });

  sortedEntries.forEach(([courseName, course]) => {
    const levels = course.levels || [];
    const credits = parseFloat(course.credit) || 0;
    const defaultLevel = levels[0] || null;

    const defaultNumbers = defaultLevel
      ? course.courseNumbers?.[defaultLevel] || []
      : Object.values(course.courseNumbers || {}).flat();

    totalCredits += credits;

    const tr = document.createElement("tr");
    const tdName = document.createElement("td");
    tdName.textContent = course.name;

    const tdLevel = document.createElement("td");
    const tdNum = document.createElement("td");
    tdNum.textContent = defaultNumbers.join(", ") || "—";

    if (levels.length > 1) {
      const select = document.createElement("select");
      levels.forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        select.appendChild(option);
      });

      select.addEventListener("change", () => {
        const nums = course.courseNumbers?.[select.value] || [];
        tdNum.textContent = nums.join(", ") || "—";
      });
      tdLevel.appendChild(select);
    } else if (levels.length === 1) {
      tdLevel.textContent = levels[0];
    } else {
      tdLevel.textContent = "N/A";
    }

    const tdCredits = document.createElement("td");
    tdCredits.textContent = credits % 1 === 0 ? credits.toFixed(0) : credits;

    tr.appendChild(tdName);
    tr.appendChild(tdLevel);
    tr.appendChild(tdNum);
    tr.appendChild(tdCredits);
    tbody.appendChild(tr);
  });

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
  localStorage.removeItem(getStorageKey());
  document.querySelectorAll(".course-buttons button").forEach(btn => btn.classList.remove("selected"));
  updateTable();
};

const saveBtn = document.getElementById("print-btn");
if (saveBtn) {
  saveBtn.textContent = "Save";
  saveBtn.onclick = () => {
    saveSelections();
  };
}

// --- FORCE ACCESSIBLE DARK THEME OVERRIDE ON THE WHOLE PAGE ---
(function forceDarkTheme() {
  const darkStyle = document.createElement("style");
  darkStyle.id = "forced-dark-theme-override";
  darkStyle.textContent = `
    body { background-color: #121212 !important; color: #e0e0e0 !important; }
    .container, #course-selection, main, div { background-color: transparent; }
    h1, h2, h3, h4, .subject-section { color: #e0e0e0 !important; }
    .subject-label { color: #4cafef !important; }
    .subject-section { border-color: #333333 !important; }
    .course-buttons button { background-color: #2a2a2a !important; color: #e0e0e0 !important; border: 1px solid #333333 !important; }
    .course-buttons button.selected { background-color: #4cafef !important; color: #000000 !important; border-color: #4cafef !important; font-weight: bold !important; }
    table, #schedule-table { background: #1e1e1e !important; color: #e0e0e0 !important; }
    th, td { border: 1px solid #333333 !important; color: #e0e0e0 !important; }
    th { background-color: #2a2a2a !important; }
    details summary.subject-label::-webkit-details-marker { color: #4cafef !important; }
  `;
  document.head.appendChild(darkStyle);
})();

// --- FIXED CHRONOLOGY: FETCH DATABASE FIRST, THEN LOAD SAVED, THEN RENDER ---
loadCourses(() => {
  loadSelections(); 
  renderCourses();
});