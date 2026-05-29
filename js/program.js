// Global filter states - initialized to null so ALL courses show on first load
let selectedGrade = null; 
let selectedSubject = null; 

/**
 * Mapping Dictionary: Maps the production 'category' abbreviations found inside your JSON 
 * directly to your official, student-facing UI department headers.
 */
const tagToSubjectMap = {
  "EN": "English/Communications",
  "MA": "Math",
  "TE": "Tech/Engineering",
  "BT": "Tech/Engineering",
  "CC": "5CCT",
  "EL": "Individualized Learning",
  
  // Mappings for the rest of your curriculum layout
  "SS": "Social Studies", 
  "SCI": "Science",
  "WL": "World Languages",
  "PE": "Wellness/Fitness",
  "FC": "FCS",                       // FIX: Changed from FA/FCS to exactly match "FC" from your JSON
  "VP": "Visual and Performing Arts", // Visual Arts mapping
  "BU": "Business",
  "AP": "AP Capstone"
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

  // ALPHABETICAL FIX: Sort the subjects alphabetically before rendering them
  const sortedSubjects = [...subjects].sort((a, b) => a.localeCompare(b));

  // Generate Subject Filter Buttons Grid
  const subjectButtonsHTML = sortedSubjects.map(s => `
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

/**
 * Helper function to determine which primary UI subject group a course belongs to.
 */
function getCourseSubject(course) {
  if (!course.category || course.category.length === 0) return "Other";
  
  // Prioritize primary core subjects first if multiple tags exist
  if (course.category.includes("MA")) return "Math";
  if (course.category.includes("EN")) return "English/Communications";
  if (course.category.includes("TE") || course.category.includes("BT")) return "Tech/Engineering";
  if (course.category.includes("VP")) return "Visual and Performing Arts";
  if (course.category.includes("FC")) return "FCS"; // FIX: Adjusted to "FC" here as well
  if (course.category.includes("CC")) return "5CCT";
  if (course.category.includes("EL")) return "Individualized Learning";
  
  // Fallback map loop lookup
  for (let catTag of course.category) {
    if (tagToSubjectMap[catTag]) {
      return tagToSubjectMap[catTag];
    }
  }
  return "Other";
}

function filterAndDisplayCourses() {
  // 1. Filter data cleanly based on user selection rules
  const filteredCourses = coursesData.filter(course => {
    
    // Advanced Grade Matching (Handles strings, numbers, and grade ranges)
    let matchesGrade = true;
    if (selectedGrade !== null) {
      const courseGrades = course.grades || [];
      matchesGrade = courseGrades.some(g => {
        const stringGrade = String(g).trim();
        return stringGrade === selectedGrade || stringGrade.includes(selectedGrade);
      });
    }

    // Evaluate Subject Department Match
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
        No courses match Grade ${selectedGrade || 'Any'} within "${selectedSubject || 'Any'}".
        <br><button class="filter-btn" style="margin-top: 1rem;" onclick="resetFilters()">Clear Filters</button>
      </div>
    `;
    return;
  }

  // 2. CATEGORIZE & GROUP: Organize the matched records under unique subject headings
  const groupedCourses = {};
  filteredCourses.forEach(course => {
    const subjectGroup = getCourseSubject(course);
    if (!groupedCourses[subjectGroup]) {
      groupedCourses[subjectGroup] = [];
    }
    groupedCourses[subjectGroup].push(course);
  });

  // Sort grouped headers alphabetically
  const sortedSubjectGroups = Object.keys(groupedCourses).sort((a, b) => a.localeCompare(b));

  // 3. RENDER CONTENT: Generate structures sorted alphabetically
  let finalHTML = "";

  sortedSubjectGroups.forEach(subjectName => {
    // Sort items alphabetically by course name
    groupedCourses[subjectName].sort((a, b) => a.name.localeCompare(b.name));

    finalHTML += `
      <div class="subject-section-group">
        <h2 class="subject-group-title">${subjectName}</h2>
        <div class="subject-courses-grid">
    `;

    finalHTML += groupedCourses[subjectName].map(course => {
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

    finalHTML += `
        </div>
      </div>
    `;
  });

  coursesElement.innerHTML = finalHTML;
}

// Hook onto window DOM load to trigger logic
window.addEventListener("DOMContentLoaded", initCourseSelector);