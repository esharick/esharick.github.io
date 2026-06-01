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

  // --- Helper function to build a standard button section ---
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
}

// CHANGED: Toggles individual buttons independently and tracks by name so you can pick multiple
// MODIFIED: Manages selecting the course AND handles rendering a centered floating popup box
function selectCourse(subject, course, button) {
  const isAlreadySelected = button.classList.contains("selected");

  if (isAlreadySelected) {
    button.classList.remove("selected");
    delete selectedCourses[course.name];
  } else {
    button.classList.add("selected");
    selectedCourses[course.name] = course;
    
    // Trigger the floating pop-up box with details over everything else
    showCoursePopup(course);
  }

  // Refresh the schedule table with the new state
  updateTable();
}

// NEW: Generates and injects a floating modal overlay directly onto the screen viewport
function showCoursePopup(course) {
  // 1. Remove any existing popup instance just in case
  const existingPopup = document.getElementById("course-modal-overlay");
  if (existingPopup) existingPopup.remove();

  // 2. Create full-screen backing overlay
  const overlay = document.createElement("div");
  overlay.id = "course-modal-overlay";
  
  // FORCE OVERRIDE STYLES: This forces it to cover the screen no matter what your CSS file says
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100vw";
  overlay.style.height = "100vh";
  overlay.style.backgroundColor = "rgba(0, 0, 0, 0.85)";
  overlay.style.display = "flex";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.zIndex = "99999"; // High index ensures it sits over headers/navbars

  // 3. Create inner content panel box
  const modal = document.createElement("div");
  modal.className = "course-modal-content";
  
  // FORCE OVERRIDE STYLES: Styles the popup box cleanly in the center
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

  // Assemble HTML elements inside modal layout
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
  
  // Append right onto the master window body layer
  document.body.appendChild(overlay);

  // Close popup logic
  const closePopup = () => overlay.remove();

  // Setup multiple interactive close triggers
  modal.querySelector(".modal-close-btn").onclick = closePopup;
  overlay.onclick = (e) => {
    if (e.target === overlay) closePopup();
  };
}

// CHANGED: Only adjusted the loop mapping to extract course data from unique course names
// MODIFIED: Restores saved level configurations cleanly if they exist in state tracking data
function updateTable() {
  const tbody = document.querySelector("#schedule-table tbody");
  tbody.innerHTML = "";

  let totalCredits = 0;

  // 1. Define the strict sorting order for the table
  const tableOrder = ["EN", "MA", "SS", "SC", "WL", "PE"];

  // 2. Get the selected courses as an array and sort them by their subject category
  const sortedEntries = Object.entries(selectedCourses).sort(([nameA, courseA], [nameB, courseB]) => {
    const subjA = courseA.category[0];
    const subjB = courseB.category[0];

    const indexA = tableOrder.indexOf(subjA);
    const indexB = tableOrder.indexOf(subjB);

    // If both subjects are in our custom list, sort by their defined priority
    if (indexA !== -1 && indexB !== -1) return indexA - indexB;
    
    // If only 'a' is prioritized, push it to the top
    if (indexA !== -1) return -1;
    
    // If only 'b' is prioritized, push it to the top
    if (indexB !== -1) return 1;

    // If neither is prioritized, sort alphabetically by subject code
    return subjA.localeCompare(subjB);
  });

  // 3. Loop through the correctly sorted entries to build the table rows
  sortedEntries.forEach(([courseName, course]) => {
    const levels = course.levels || [];
    const credits = parseFloat(course.credit) || 0;
    const hasLevels = levels.length > 0;
    
    // Use the saved selected level if it exists, otherwise fallback to standard default first option
    const activeLevel = course.selectedLevel && levels.includes(course.selectedLevel)
      ? course.selectedLevel
      : (hasLevels ? levels[0] : null);

    // Dynamic numbers lookup matching the targeted choice
    const defaultNumbers = activeLevel
      ? course.courseNumbers?.[activeLevel] || []
      : Object.values(course.courseNumbers || {}).flat();

    totalCredits += credits;

    const tr = document.createElement("tr");
    tr.setAttribute("data-course-name", course.name); // Tag row to extract data later during saves

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
      select.className = "level-dropdown-select";

      levels.forEach(level => {
        const option = document.createElement("option");
        option.value = level;
        option.textContent = level;
        if (level === activeLevel) option.selected = true;
        select.appendChild(option);
      });

      // When level changes, update local tracking instantly alongside view state text numbers
      select.addEventListener("change", () => {
        course.selectedLevel = select.value;
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

// Clear button logic handles clearing browser cache memory as well
document.getElementById("clear-btn").onclick = () => {
  Object.keys(selectedCourses).forEach(key => delete selectedCourses[key]);
  localStorage.removeItem("selectedCoursesCache");

  document.querySelectorAll(".course-buttons button")
    .forEach(btn => btn.classList.remove("selected"));

  updateTable();
};

// REMOVED: print-btn setup
// NEW: save-btn loops through table elements to lock down specific selected level configurations 
const saveButton = document.getElementById("save-btn");
if (saveButton) {
  saveButton.onclick = () => {
    try {
      // Look over table structure to verify current chosen level drops match our saving state
      document.querySelectorAll("#schedule-table tbody tr[data-course-name]").forEach(row => {
        const name = row.getAttribute("data-course-name");
        const selectDropdown = row.querySelector(".level-dropdown-select");
        if (selectedCourses[name] && selectDropdown) {
          selectedCourses[name].selectedLevel = selectDropdown.value;
        }
      });

      localStorage.setItem("selectedCoursesCache", JSON.stringify(selectedCourses));
      alert("Selections and levels successfully saved!");
    } catch (error) {
      console.error("Failed to save choices to local browser storage", error);
    }
  };
}

// --- FORCE ACCESSIBLE DARK THEME OVERRIDE ON THE WHOLE PAGE ---
(function forceDarkTheme() {
  // 1. Create a dynamic style block
  const darkStyle = document.createElement("style");
  darkStyle.id = "forced-dark-theme-override";
  
  // 2. Inject raw dark mode CSS rules to override the layout completely
  darkStyle.textContent = `
    /* Body & Main Container Fallbacks */
    body {
      background-color: #121212 !important;
      color: #e0e0e0 !important;
    }
    
    .container, #course-selection, main, div {
      background-color: transparent; 
    }

    /* Primary and Secondary Headers */
    h1, h2, h3, h4, .subject-section {
      color: #e0e0e0 !important;
    }
    
    /* Subject Category Section Titles */
    .subject-label {
      color: #4cafef !important; /* Electric Blue Theme */
    }

    /* Course Selection Row Dividing Lines */
    .subject-section {
      border-color: #333333 !important;
    }

    /* Non-selected Default Course Buttons */
    .course-buttons button {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      border: 1px solid #333333 !important;
    }

    /* Selected Active Course Buttons */
    .course-buttons button.selected {
      background-color: #4cafef !important;
      color: #000000 !important;
      border-color: #4cafef !important;
      font-weight: bold !important;
    }

    /* Schedule Output Matrix Table */
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

    /* Style level dropdowns neatly in dark mode */
    .level-dropdown-select {
      background-color: #2a2a2a !important;
      color: #e0e0e0 !important;
      border: 1px solid #333333 !important;
      border-radius: 4px;
      padding: 2px 4px;
    }
    
    /* Native Details Arrow Disclosures */
    details summary.subject-label::-webkit-details-marker {
      color: #4cafef !important;
    }
  `;

  // 3. Attach it strictly onto the main document head layout frame
  document.head.appendChild(darkStyle);
})();

// NEW: Automatically check and parse out selections from localStorage cache right away
(function loadCachedData() {
  try {
    const cachedData = localStorage.getItem("selectedCoursesCache");
    if (cachedData) {
      const parsedData = JSON.parse(cachedData);
      Object.assign(selectedCourses, parsedData);
    }
  } catch (error) {
    console.error("Failed to extract cached items from localStorage configuration frame", error);
  }
})();

// Called when the page loads
loadCourses(() => {
  renderCourses();
  updateTable(); // Ensures table gets constructed with cached data and explicit levels visible immediately
});