function displayVerificationView(elementId) {
    loadCourses(() => {
      const html = coursesData.map(course => {
  
        const levels = (course.levels || []).join(", ");
        const grades = (course.grades || []).join(", ");
        const category = (course.category || []).join(", ");
  
        const courseNumbersHTML = Object.entries(course.courseNumbers || {})
          .map(([key, values]) => {
            return `<div><strong>${key}:</strong> ${values.join(", ")}</div>`;
          })
          .join("");
  
        return `
          <div class="course">
  
            <div class="parsed">
              <h3>${course.name}</h3>
  
              <p><strong>Levels:</strong> ${levels}</p>
              <p><strong>Grades:</strong> ${grades}</p>
              <p><strong>Category:</strong> ${category}</p>
              <p><strong>Term:</strong> ${course.term}</p>
              <p><strong>Credit:</strong> ${course.credit}</p>
  
              <p><strong>Course Numbers:</strong></p>
              ${courseNumbersHTML}
  
              <p><strong>Prerequisites:</strong> ${course.prerequisites || ""}</p>
            </div>
  
            <div class="original">
              <strong>Original Description:</strong>
              <pre>${course.description}</pre>
            </div>
  
          </div>
          <hr>
        `;
      }).join("");
  
      document.getElementById(elementId).innerHTML = html;
    });
  }
  
  displayVerificationView("courses");
