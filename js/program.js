let selectedGrade = null; 
let selectedSubject = null; 
let searchQuery = ""; 

const tagToSubjectMap = {
  "EN": "English",
  "SS": "Social Studies", 
  "MA": "Math",
  "SC": "Science",                  
  "WL": "World Languages",
  "PE": "Wellness/Fitness",
  "CT": "CCT",
  "TE": "Tech/Engineering",
  "BU": "Business",                  
  "FC": "FCS",                       
  "CAP": "AP Capstone",
  "VP": "Visual and Performing Arts", 
  "IL": "Individualized Learning"
};

// UPDATED: Standardized to single consolidated "ELD" and "Highway safety" button labels
const subjectsOrder = [
  "English",
  "Social Studies",
  "Math",
  "Science",
  "World Languages",
  "Wellness/Fitness",
  "CCT",
  "Tech/Engineering",
  "Business",
  "FCS",
  "AP Capstone",
  "Highway safety",
  "Visual and Performing Arts",
  "Individualized Learning",
  "ELD"
];

function initCourseSelector() {
  loadCourses(() => {
    renderFilterInterface();
    filterAndDisplayCourses(); 
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

  const grades = ["9", "10", "11", "12"];
  const gradeButtonsHTML = grades.map(g => `
    <button class="filter-btn grade-btn ${selectedGrade === g ? 'active' : ''}" 
            onclick="updateGradeFilter('${g}')">
      Grade ${g}
    </button>
  `).join("");

  const subjectButtonsHTML = subjectsOrder.map(s => `
    <button class="filter-btn subj-btn ${selectedSubject === s ? 'active' : ''}" 
            onclick="updateSubjectFilter('${s}')">
      ${s}
    </button>
  `).join("");

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

function resetFilters() {
  selectedGrade = null;
  selectedSubject = null;
  renderFilterInterface();
  filterAndDisplayCourses();
}

function getCourseSubject(course) {
  let c = course.category;
  let name = (course.name || "").toLowerCase();
  if (!c || !Array.isArray(c) || c.length === 0) return "Other";
  
  // UPDATED: Routes all matching custom semester iterations directly to unified "Highway safety" and "ELD" groups
  if (name.includes("highway safety")) {
    return "Highway safety";
  }

  if (c.includes("ELD") || name.includes("english language development")) {
    return "ELD";
  }

  if (c.includes("CT") || name.includes("college and career transition") || name.includes("cct")) {
    return "CCT";
  }

  if (c.includes("EN")) return "English";
  if (c.includes("SS")) return "Social Studies";
  if (c.includes("MA")) return "Math";
  if (c.includes("SC")) return "Science";
  if (c.includes("WL")) return "World Languages";
  if (c.includes("PE")) return "Wellness/Fitness";
  if (c.includes("TE")) return "Tech/Engineering";
  if (c.includes("BU")) return "Business";
  if (c.includes("FC")) return "FCS"; 
  if (c.includes("CAP") || c.includes("AP")) return "AP Capstone";
  if (c.includes("VP")) return "Visual and Performing Arts";
  if (c.includes("IL")) return "Individualized Learning";

  for (let catTag of c) {
    if (catTag !== "CC" && tagToSubjectMap[catTag]) {
      return tagToSubjectMap[catTag];
    }
  }
  return "Other";
}

function filterAndDisplayCourses() {
  const filteredCourses = coursesData.filter(course => {
    let matchesGrade = true;
    if (selectedGrade !== null) {
      const courseGrades = course.grades || [];
      matchesGrade = courseGrades.some(g => {
        const stringGrade = String(g).trim();
        return stringGrade === selectedGrade || stringGrade.includes(selectedGrade);
      });
    }

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

  const groupedCourses = {};
  filteredCourses.forEach(course => {
    const subjectGroup = getCourseSubject(course);
    if (!groupedCourses[subjectGroup]) {
      groupedCourses[subjectGroup] = [];
    }
    groupedCourses[subjectGroup].push(course);
  });

  // UPDATED: Sorts generated structural layout categories mapping sequence back to match subjectsOrder offsets
  const subjectGroups = Object.keys(groupedCourses).sort((a, b) => {
    let indexA = subjectsOrder.indexOf(a);
    let indexB = subjectsOrder.indexOf(b);
    
    if (indexA === -1) indexA = 999;
    if (indexB === -1) indexB = 999;
    
    return indexA - indexB;
  });

  let finalHTML = "";

  subjectGroups.forEach(subjectName => {
    groupedCourses[subjectName].sort((a, b) => a.name.localeCompare(b.name));

    finalHTML += `
      <div class="subject-section-group">
        <h2 class="subject-group-title">${subjectName}</h2>
        <div class="subject-courses-grid">
    `;

    finalHTML += groupedCourses[subjectName].map(course => {
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

window.addEventListener("DOMContentLoaded", initCourseSelector);