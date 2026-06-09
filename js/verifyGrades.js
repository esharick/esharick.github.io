function getStudentCoursePlan() {

    const rawData =
        localStorage.getItem(
            "student_course_plan"
        );

    if (!rawData) {
        return [];
    }

    return JSON.parse(rawData);
}

function getGradeData(year) {

    const schedule =
        getStudentCoursePlan();

    return schedule.find(
        grade => grade.year === year
    );
}

function showRequirementAlert(
    title,
    errors
) {

    const alertBox =
        document.getElementById(
            "requirementAlert"
        );

    if (!alertBox) {
        return;
    }

    if (
        !errors ||
        errors.length === 0
    ) {

        alertBox.style.display =
            "none";

        return;
    }

    let html = `
        <h3>${title}</h3>
        <ul>
    `;

    errors.forEach(error => {

        html += `
            <li>${error}</li>
        `;
    });

    html += `
        </ul>
    `;

    alertBox.innerHTML = html;

    alertBox.style.display =
        "block";
}

function hideRequirementAlert() {

    const alertBox =
        document.getElementById(
            "requirementAlert"
        );

    if (alertBox) {

        alertBox.style.display =
            "none";
    }
}