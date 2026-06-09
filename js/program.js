// Global filter states - initialized to null so ALL courses show on first load
let selectedGrade = null; 
let selectedSubject = null; 
let searchQuery = ""; //actively searches for desired course

/**
 * Mapping Dictionary: Maps the production 'category' abbreviations found inside your JSON 
 * directly to your official, student-facing UI department headers.
 */
const tagToSubjectMap = {
  "EN": "English",
  "SS": "Social Studies", 
  "MA": "Math",
  "SC": "Science",                  
  "WL": "World Languages",
  "PE": "Wellness/Fitness",
  "ENE": "English Electives",
  "SSE": "Social Studies Electives",
  "TE": "Tech/Engineering",
  "BU": "Business",                  
  "FC": "FCS",                       
  "CAP": "AP Capstone",
  "HS": "Highway safety",
  "VP": "Visual and Performing Arts", 
  "IL": "Individualized Learning",
  "ELD": "English Language Development",
  "CC": "Co-Curricular",
  "EL": "Elective"
};

// Define the precise order of subjects across the entire application
const subjectsOrder = [
  "English",
  "Social Studies",
  "Math",
  "Science",
  "World Languages",
  "Wellness/Fitness",
  "English Electives",
  "Social Studies Electives",
  "Tech/Engineering",
  "Business",
  "FCS",
  "AP Capstone",
  "Highway safety",
  "Visual and Performing Arts",
  "Individualized Learning",
  "English Language Development (ELD)"
];

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

  // Generate Subject Filter Buttons Grid using the precise order array
  const subjectButtonsHTML = subjectsOrder.map(s => `
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
   <div class="filter-row" style="position: relative;">
      <div class="filter-group">
        <div class="filter-header-row" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
          <div>
            <span class="filter-label">Select Grade:</span>
            ${clearBtnHTML}
          </div>
          <div class="search-wrapper" style="margin-left: auto;">
            <input type="text" id="course-search-bar" placeholder="Search courses..." value="${searchQuery}" oninput="updateSearchFilter(this.value)" style="padding: 6px 12px; border: 1px solid #ccc; border-radius: 4px; width: 220px; font-size: 14px;" />
          </div>
        </div>
        <div class="btn-group" style="margin-top: 8px;">${gradeButtonsHTML}</div>
      </div>
      <div class="filter-group">
        <span class="filter-label">Select Subject:</span>
        <div class="btn-group subject-grid">${subjectButtonsHTML}</div>
      </div>
    </div>
  `;
}

function updateSearchFilter(value){
  searchQuery = value;
  filterAndDisplayCourses();
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
  //searchQuery = "";
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
  
  // 1. ELECTIVE SPLITS (Intercepting elective combinations specifically)
  if (c.includes("EN") && c.includes("EL")) return "English Electives";
  if (c.includes("SS") && c.includes("EL")) return "Social Studies Electives";  
  if (c.includes("MA") && c.includes("EL")) return "Math Elective"; // keeping fallback structural safety
  if (c.includes("SC") && c.includes("EL")) return "Science Elective";

  // 2. CORE CATEGORIES (Non-electives)
  if (c.includes("EN")) return "English";
  if (c.includes("SS")) return "Social Studies";
  if (c.includes("MA")) return "Math";
  if (c.includes("SC")) return "Science";

  // 3. DEPARTMENTAL & SPECIAL TRACKS
  if (c.includes("WL")) return "World Languages";
  if (c.includes("PE")) return "Wellness/Fitness";
  if (c.includes("TE")) return "Tech/Engineering";
  if (c.includes("BU")) return "Business";
  if (c.includes("FC")) return "FCS"; 
  if (c.includes("CAP") || c.includes("AP")) return "AP Capstone";
  if (c.includes("HS")) return "Highway safety";
  if (c.includes("VP")) return "Visual and Performing Arts";
  if (c.includes("IL")) return "Individualized Learning";
  if (c.includes("ELD")) return "English Language Development (ELD)";
  if (c.includes("CC")) return "Co-curricular";

  // Fallback dictionary loop lookup if none of the above matched
  for (let catTag of c) {
    if (tagToSubjectMap[catTag]) {
      // Map ELD shorttag to its full title safely
      if (catTag === "ELD") return "English Language Development (ELD)";
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

    let matchesSearch = true;
    if(searchQuery.trim() !== ""){
      const normalizedCourseName = (course.name || "").toLowerCase();
      const normalizedSearchQuery = searchQuery.toLowerCase().trim();
      matchesSearch = normalizedCourseName.includes(normalizedSearchQuery);
    }
    return matchesGrade && matchesSubject && matchesSearch;
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

  // Extract keys and sort them based on your strict array order index
  const subjectGroups = Object.keys(groupedCourses).sort((a, b) => {
    let indexA = subjectsOrder.indexOf(a);
    let indexB = subjectsOrder.indexOf(b);
    
    // Fallback if custom group isn't defined in index array
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    
    return indexA - indexB;
  });

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