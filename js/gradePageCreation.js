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

function saveSelections() {
  const key = getStorageKey();
  localStorage.setItem(key, JSON.stringify(selectedCourses));
}

function loadSelections() {
  const key = getStorageKey();
  const saved = localStorage.getItem(key);
  if (!saved) return;

  try {
    const parsed = JSON.parse(saved);
    Object.assign(selectedCourses, parsed);
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

  // Filter to only courses available in the current grade
  const gradeCourses = grade
    ? coursesData.filter(c => c.grades && c.grades.includes(grade))
    : coursesData;

  // --- Isolate English Electives from Core English ---
  const coreEnglishCourses = gradeCourses.filter(
    c => c.category.includes("EN") && !c.category.includes("EL")
  );
  const englishElectiveCourses = gradeCourses.filter(
    c => c.category.includes("EN") && c.category.includes("EL")
  );

  // --- Isolate Social Studies Electives from Core Social Studies ---
  const coreSocialStudiesCourses = gradeCourses.filter(
    c => c.category.includes("SS") && !c.category.includes("EL")
  );
  const socialStudiesElectiveCourses = gradeCourses.filter(
    c => c.category.includes("SS") && c.category.includes("EL")
  );

  // --- NEW: Isolate CCT (CT) if it is 11th Grade ---
  const isGrade11 = (grade === "11");
  const cctCourses = isGrade11
    ? gradeCourses.filter(c => c.category.includes("CT"))
    : [];

  // Remaining courses: Exclude EN, SS, and conditionally CT so it doesn't duplicate in Electives
  const remainingCourses = gradeCourses.filter(c => {
    if (c.category.includes("EN") || c.category.includes("SS")) return false;
    if (isGrade11 && c.category.includes("CT")) return false;
    return true;
  });

  // Group the remaining courses using your standard structural logic
  const grouped = groupBySubject(remainingCourses);

  const container = document.getElementById("course-selection");
  container.innerHTML = "";

  // 1. Core Priority Order (Note: EN and SS are handled manually below)
  const coreOrder = ["MA", "SC", "WL", "PE"];
  const allSubjects = Object.keys(grouped);

  const coreSubjects = coreOrder.filter(subj => allSubjects.includes(subj));
  const electiveSubjects = allSubjects.filter(subj => !coreOrder.includes(subj));

  // --- Helper function to build a button section with info buttons ---
  function createSection(labelName, coursesList) {
    const section = document.createElement("div");
    section.className = "subject-section";

    const label = document.createElement("div");
    label.className = "subject-label";
    label.textContent = labelName;

    const buttonContainer = document.createElement("div");
    buttonContainer.className = "course-buttons";

    coursesList.forEach(course => {
      // Wrapper to anchor the main button and info button together neatly
      const wrapper = document.createElement("div");
      wrapper.className = "course-btn-wrapper";

      const btn = document.createElement("button");
      btn.className = "course-select-btn";
      btn.textContent = course.name;

      // Restore selected state from savedCourses
      if (selectedCourses[course.name]) {
        btn.classList.add("selected");
      }

      btn.onclick = () => selectCourse(labelName, course, btn);

      // Dedicated Info Button
      const infoBtn = document.createElement("button");
      infoBtn.className = "course-info-btn";
      infoBtn.innerHTML = "&#9432;"; // Unified layout standard info symbol (i)
      infoBtn.title = "View Course Info";
      
      infoBtn.onclick = (e) => {
        e.stopPropagation(); // Stop selection trigger
        showCoursePopup(course);
      };

      wrapper.appendChild(btn);
      wrapper.appendChild(infoBtn);
      buttonContainer.appendChild(wrapper);
    });

    section.appendChild(label);
    section.appendChild(buttonContainer);
    return section;
  }

  // 3. Render Core English First (Only if courses exist)
  if (coreEnglishCourses.length > 0) {
    container.appendChild(createSection("English", coreEnglishCourses));
  }

  // Render Core Social Studies (Only if courses exist)
  if (coreSocialStudiesCourses.length > 0) {
    container.appendChild(createSection("Social Studies", coreSocialStudiesCourses));
  }

  // Render Main Remaining Core Subjects (Math, Science, World Language, PE)
  coreSubjects.forEach(subject => {
    container.appendChild(createSection(subjectNames[subject] || subject, grouped[subject]));

    // --- NEW: Inject CCT immediately after PE row if we are on Grade 11 ---
    if (subject === "PE" && isGrade11 && cctCourses.length > 0) {
      container.appendChild(createSection(subjectNames["CT"] || "CCT", cctCourses));
    }
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

  // English Electives dropdown (EN + EL)
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

  // Social Studies Electives dropdown (SS + EL)
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

  // B. Group remaining sections (TE, VP, IL, AP, FC, BU, EL, etc.) underneath
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

  // Restore table after rendering buttons
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
  }

  // Save to localStorage whenever selection changes
  saveSelections();

  // Refresh the schedule table with the new state
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

  // Also clear this grade's localStorage entry
  localStorage.removeItem(getStorageKey());

  document.querySelectorAll(".course-buttons .course-select-btn")
    .forEach(btn => btn.classList.remove("selected"));

  updateTable();
};

// --- FORCE ACCESSIBLE DARK THEME OVERRIDE ON THE WHOLE PAGE ---
(function forceDarkTheme() {
  const darkStyle = document.createElement("style");
  darkStyle.id = "forced-dark-theme-override";

  darkStyle.textContent = `
    body {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }

    .container, #course-selection, main, div {
      background-color: transparent;
    }

    h1, h2, h3, h4, .subject-section {
      color: #e0e0e0 !important;
    }

    .subject-label {
      color: #4cafef !important;
    }

    .subject-section {
      border-color: #333333 !important;
    }

    /* Core Wrapper setup for side-by-side buttons */
    .course-btn-wrapper {
      display: inline-flex !important;
      align-items: stretch !important;
      margin: 5px !important;
    }

    .course-buttons .course-select-btn {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      border: 1px solid #333333 !important;
      border-right: none !important;
      border-top-left-radius: 4px !important;
      border-bottom-left-radius: 4px !important;
      margin: 0 !important;
      padding: 8px 12px !important;
      cursor: pointer;
    }

    .course-buttons .course-select-btn.selected {
      background-color: #4cafef !important;
      color: #000000 !important;
      border-color: #4cafef !important;
      font-weight: bold !important;
    }

    /* Beautiful Dedicated (i) Button Styling */
    .course-buttons .course-info-btn {
      background-color: #2a2a2a !important;
      color: #4cafef !important;
      border: 1px solid #333333 !important;
      border-top-right-radius: 4px !important;
      border-bottom-right-radius: 4px !important;
      margin: 0 !important;
      padding: 8px 10px !important;
      font-size: 14px !important;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }

    .course-buttons .course-info-btn:hover {
      background-color: #383838 !important;
    }

    /* Adjust info button if the primary course button is active */
    .course-buttons .course-select-btn.selected + .course-info-btn {
      border-left-color: #000000 !important;
    }

    table, #schedule-table {
      background: #1e1e1e !important;
      color: #e0e0e0 !important;
    }

    th, td {
      border: 1px solid #333333 !important;
      color: #e0e0e0 !important;
    }

    th {
      background-color: #2a2a2a !important;
    }

    details summary.subject-label::-webkit-details-marker {
      color: #4cafef !important;
    }
  `;

  document.head.appendChild(darkStyle);
})();

// Load saved selections first, then fetch and render courses
loadSelections();
if (typeof loadCourses === "function") {
  loadCourses(renderCourses);
} else {
  renderCourses();
}