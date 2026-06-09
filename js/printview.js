document.addEventListener(
    "DOMContentLoaded",
    initializePrintView
);

function initializePrintView() {

    const rawData =
        localStorage.getItem(
            "student_course_plan"
        );

    if (!rawData) {

        document.getElementById(
            "scheduleContainer"
        ).innerHTML =
            "<p>No schedule found.</p>";

        return;
    }

    const schedule =
        JSON.parse(rawData);

    renderSchedule(schedule);

    document
        .getElementById("printButton")
        .addEventListener(
            "click",
            () => window.print()
        );
}

function renderSchedule(schedule) {

    const container =
        document.getElementById(
            "scheduleContainer"
        );

    container.innerHTML = "";

    schedule.forEach(yearData => {

        const section =
            document.createElement("div");

        section.className =
            "grade-section";

        const title =
            document.createElement("div");

        title.className =
            "grade-title";

        title.textContent =
            `Grade ${yearData.year}`;

        section.appendChild(title);

        const table =
            document.createElement("table");

        table.innerHTML = `
            <thead>
                <tr>
                    <th>Course</th>
                    <th>Course Number</th>
                    <th>Credits</th>
                </tr>
            </thead>
            <tbody></tbody>
        `;

        const tbody =
            table.querySelector("tbody");

        let totalCredits = 0;

        yearData.courses.forEach(course => {

            totalCredits +=
                Number(course.credits);

            const row =
                document.createElement("tr");

            const displayName =
                formatCourseName(course);

            const courseNumber =
                Array.isArray(
                    course.courseNumber
                )
                    ? course.courseNumber.join(", ")
                    : course.courseNumber;

            row.innerHTML = `
                <td>${displayName}</td>
                <td>${courseNumber}</td>
                <td>${course.credits}</td>
            `;

            tbody.appendChild(row);
        });

        const totalRow =
            document.createElement("tr");

        totalRow.className =
            "total-row";

        totalRow.innerHTML = `
            <td colspan="2">
                Total Credits
            </td>
            <td>
                ${totalCredits}
            </td>
        `;

        tbody.appendChild(totalRow);

        section.appendChild(table);

        container.appendChild(section);
    });
}

function formatCourseName(course) {

    if (
        !course.level ||
        course.level === "N/A"
    ) {
        return course.name;
    }

    // Avoid "AP AP Statistics"
    if (
        course.level === "AP" &&
        course.name.startsWith("AP ")
    ) {
        return course.name;
    }

    return `${course.level} ${course.name}`;
}