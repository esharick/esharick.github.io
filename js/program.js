// Global filter states - initialized to null so ALL courses show on first load
let selectedGrade = null; 
let selectedSubject = null; 

/**
 * Mapping Dictionary: Maps the 'category' abbreviations found inside your JSON 
 * directly to your 13 official, student-facing UI department headers.
 */
const tagToSubjectMap = {
  "EN": "English/Communications",
  "MA": "Math",
  "SS": "Social Studies",         // Prepared for your Social Studies courses
  "TE": "Tech/Engineering",
  "BT": "Tech/Engineering",       // Maps both TE and BT safely to Tech/Engineering
  "CC": "5CCT",
  "EL": "Electives",
  "VP": "Visual and Performing Arts",
  "FA": "Family and Consumer Science",
  // Maps EL to Individualized Learning
  // If you add other tags later (e.g., "SCI": "Science", "WL": "World Languages"), add them right here!
};

// Initialize app when loadCourses finishes fetching your JSON array
function initCourseSelector() {
  loadCourses(() => {
    renderFilterInterface();
    filterAndDisplayCourses(); // Renders the full course list initially
  });
}

function renderFilterInterface() {
  let filterContainer = document.getElementById("filter-controls");
  
  if (!filterContainer) {
    filterContainer = document.createElement("div");
    filterContainer.id = "filter-controls";
    const navbar = document.getElementById("navbar");
    navbar.parentNode.insertBefore(filterContainer, navbar.nextSibling);
  }

  // Generate Grade Filter Buttons Row
  const grades = ["9", "10", "11", "12"];
  const gradeButtonsHTML = grades.map(g => `
    <button class="filter-btn grade-btn ${selectedGrade === g ? 'active' : ''}" 
            onclick="updateGradeFilter('${g}')">
      Grade ${g}
    </button>
  `).join("");

  // Your exact 13 big subject categories
  const subjects = [
    "Individualized Learning",
    "5CCT",
    "AP Capstone",
    "English/Communications",
    "Social Studies",
    "Math",
    "Science",
    "World Languages",
    "Wellness/Fitness",
    "FCS",
    "Business",
    "Tech/Engineering",
    "Visual and Performing Arts"
  ];

  // Generate Subject Filter Buttons Grid
  const subjectButtonsHTML = subjects.map(s => `
    <button class="filter-btn subj-btn ${selectedSubject === s ? 'active' : ''}" 
            onclick="updateSubjectFilter('${s}')">
      ${s}
    </button>
  `).join("");

  // Clear Filter Status layout text or Action Button
  const clearBtnHTML = (selectedGrade || selectedSubject) 
    ? `<button class="clear-filters-btn" onclick="resetFilters()">Reset Filters (Showing Filtered)</button>` 
    : `<span class="all-indicator">Showing All Available Courses</span>`;

  filterContainer.innerHTML = `
    <div class="filter-row">
      <div class="filter-group">
        <div class="filter-header-row">
          <span class="filter-label">Select Grade:</span>
          ${clearBtnHTML}
        </div>
        <div class="btn-group">${gradeButtonsHTML}</div>
      </div>
      <div class="filter-group">
        <span class="filter-label">Select Subject:</span>
        <div class="btn-group subject-grid">${subjectButtonsHTML}</div>
      </div>
    </div>
  `;
}

// Interactive handlers toggle states off if clicked a second time
function updateGradeFilter(grade) {
  selectedGrade = (selectedGrade === grade) ? null : grade;
  renderFilterInterface();
  filterAndDisplayCourses();
}

function updateSubjectFilter(subject) {
  selectedSubject = (selectedSubject === subject) ? null : subject;
  renderFilterInterface();
  filterAndDisplayCourses();
}

// Reset filters to default state to view all items
function resetFilters() {
  selectedGrade = null;
  selectedSubject = null;
  renderFilterInterface();
  filterAndDisplayCourses();
}

function filterAndDisplayCourses() {
  // Filters data cleanly or leaves list unchanged if filter configurations are empty
  const filteredCourses = coursesData.filter(course => {
    // 1. Evaluate Grade Match
    let matchesGrade = true;
    if (selectedGrade !== null) {
      matchesGrade = (course.grades || []).includes(selectedGrade);
    }

    // 2. Evaluate Subject Department Match
    let matchesSubject = true;
    if (selectedSubject !== null) {
      matchesSubject = (course.category || []).some(catTag => {
        const mappedSubject = tagToSubjectMap[catTag];
        return mappedSubject === selectedSubject;
      });
    }

    return matchesGrade && matchesSubject;
  });

  const coursesElement = document.getElementById("courses");
  
  if (filteredCourses.length === 0) {
    coursesElement.innerHTML = `
      <div class="no-courses-alert">
        No courses match Grade ${selectedGrade} within "${selectedSubject}".
        <br><button class="filter-btn" style="margin-top: 1rem;" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  // Map loop rendering matching courses array
  coursesElement.innerHTML = filteredCourses.map(course => {
    const levelsHTML = (course.levels || []).length 
      ? course.levels.map(l => `<span class="badge level-${l.replace('*', '-star')}">${l}</span>`).join(" ")
      : `<span class="badge level-none">Standard</span>`;

    const gradesHTML = (course.grades || []).map(g => `<span class="badge grade-pill">Grade ${g}</span>`).join(" ");

    const courseNumbersHTML = Object.entries(course.courseNumbers || {})
      .map(([key, values]) => `<div><strong>${key}:</strong> <code>${values.join(", ")}</code></div>`)
      .join("");

    return `
      <div class="course-card">
        <div class="course-main">
          <div class="course-header">
            <h3>${course.name}</h3>
            <div class="meta-badges">${levelsHTML} ${gradesHTML}</div>
          </div>
          <div class="course-details">
            <p><strong>Term:</strong> ${course.term === 'Y' ? 'Full Year' : 'Semester'} | <strong>Credit:</strong> ${course.credit}</p>
            ${course.prerequisites ? `<p class="prereq-alert"><strong>Prerequisites:</strong> ${course.prerequisites}</p>` : ''}
            <div class="course-numbers-box">${courseNumbersHTML}</div>
          </div>
        </div>
        <div class="course-sidebar">
          <details>
            <summary>Description</summary>
            <div class="sidebar-content">
              <pre>${course.description}</pre>
            </div>
          </details>
        </div>
      </div>
    `;
  }).join("");
}

// Hook onto window DOM load to trigger logic
window.addEventListener("DOMContentLoaded", initCourseSelector);