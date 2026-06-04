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
  "CC": "Co-Curricular",
  "EL": "Elective",
  "SS": "Social Studies", 
  "SC": "Science",                  
  "WL": "World Languages",
  "PE": "Wellness/Fitness",
  "FC": "FCS",                       
  "VP": "Visual and Performing Arts", 
  "BU": "Business",                  
  "CAP": "AP Capstone",
  "CT": "College and Career Transition",
  "IL": "Individual Learning",
  "ELD": "English Language Development"
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
    "English",
    "Social Studies",
    "Math",
    "Science",
    "World Languages",
    "Wellness/Fitness",
    "Communications",
    "Visual and Performing Arts",
    "AP Capstone",
    "FCS",
    "Business",
    "Tech/Engineering",
    "Individualized Learning",
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

/**
 * Helper function to determine which primary UI subject group a course belongs to.
 * Priority rules are placed at the top to prevent cross-listed tracks from miscategorizing.
 */
function getCourseSubject(course) {
  let c = course.category;
  if (!c || !Array.isArray(c) || c.length === 0) return "Other";
  
  // 1. ELECTIVE SPLITS (Check these first so they don't get swallowed by core categories)
  if (c.includes("MA") && !c.includes("EL")) return "Math";
  if (c.includes("EN") && !c.includes("EL")) return "English";
  if (c.includes("TE")) return "Tech/Engineering";
  if (c.includes("VP") && c.includes("EL")) return "Visual and Performing Arts";
  if (c.includes("FC") && c.includes ("EL")) return "FCS"; 
  if (c.includes("SC") && !c.includes("EL")) return "Science";
  if (c.includes("BU") && c.includes("EL")) return "Business";
  if (c.includes("SC") && c.includes("EL")) return "Science Elective";
  if (c.includes("MA") && c.includes("EL")) return "Math Elective";
  if (c.includes("EN") && c.includes("EL")) return "Communications";
  if (c.includes("SS") && c.includes("EL")) return "Social Studies Elective";  
  if (c.includes("SS")) return "Social Studies";
  
  // 3. DEPARTMENTAL & SPECIAL TRACKS
  if (c.includes("WL")) return "World Languages";
  if (c.includes("PE")) return "Wellness/Fitness";
  if (c.includes("CAP") || c.includes("AP")) return "AP Capstone";
  if (c.includes("CC")) return "Co-curricular";
  if (c.includes("IL")) return "Individualized Learning";

  // Fallback dictionary loop lookup if none of the above matched
  for (let catTag of c) {
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
      matchesSubject = (getCourseSubject(course) === selectedSubject);
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

  // Sort groups by the order of that list:   
  const subjects = [
    "English",
    "Social Studies",
    "Math",
    "Science",
    "World Languages",
    "Wellness/Fitness",
    "Communications",
    "Visual and Performing Arts",
    "AP Capstone",
    "FCS",
    "Business",
    "Tech/Engineering",
    "Individualized Learning",
  ];
  const subjectGroups = Object.keys(groupedCourses);

  // 3. RENDER CONTENT: Generate structures sorted alphabetically
  let finalHTML = "";

  subjectGroups.forEach(subjectName => {
    // Sort items alphabetically by course name
    //TODO: Sort by grades instead of alphabetically
    groupedCourses[subjectName].sort((a, b) => a.name.localeCompare(b.name));

    finalHTML += `
      <div class="subject-section-group">
        <h2 class="subject-group-title">${subjectName}</h2>
        <div class="subject-courses-grid">
    `;

    finalHTML += groupedCourses[subjectName].map(course => {
      // SPLIT DESCRIPTION: Separates the first line (level description) to bold it safely
      const descText = course.description || "";
      const firstBreakIndex = descText.indexOf("\n");
      let boldHeaderHTML = "";
      let remainingDescText = descText;

      if (firstBreakIndex !== -1) {
        const firstLine = descText.substring(0, firstBreakIndex);
        boldHeaderHTML = `<div class="description-level-header" style="margin-bottom: 4px;"><strong>${firstLine}</strong></div>`;
        remainingDescText = descText.substring(firstBreakIndex + 1);
      } else if (descText.trim().length > 0) {
        boldHeaderHTML = `<div class="description-level-header" style="margin-bottom: 4px;"><strong>${descText}</strong></div>`;
        remainingDescText = "";
      }

      // Term, Credit, Prerequisites, and Course Number HTML rows completely removed.
      // Content drops straight into the description header and block wrapper.
      return `
        <details class="course-card">
          <summary class="course-summary-header">
            <span class="course-title-text">${course.name}</span>
          </summary>
          
          <div class="course-expanded-content">
            <hr class="accordion-divider">
            <div class="course-description-block">
              ${boldHeaderHTML}
              <pre class="clean-description" style="margin-top: 4px;">${remainingDescText}</pre>
            </div>
          </div>
        </details>
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