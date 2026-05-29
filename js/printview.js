async function loadSchedule() {

    try {

        const response = await fetch("/data/schedule.json");

        if (!response.ok) {
            throw new Error("Failed to load schedule.json");
        }

        const schedule = await response.json();

        const container = document.getElementById("scheduleContainer");

        container.innerHTML = "";

        schedule.forEach(yearData => {

            const section = document.createElement("div");
            section.className = "grade-section";

            // Grade Header
            const title = document.createElement("div");
            title.className = "grade-title";
            title.textContent = `Grade ${yearData.year}`;

            section.appendChild(title);

            // Table
            const table = document.createElement("table");

            // Table Header
            const thead = document.createElement("thead");

            thead.innerHTML = `
                <tr>
                    <th>Course</th>
                    <th>Course Number</th>
                    <th>Credits</th>
                </tr>
            `;

            table.appendChild(thead);

            // Table Body
            const tbody = document.createElement("tbody");

            let totalCredits = 0;

            yearData.courses.forEach(course => {

                totalCredits += Number(course.credits);
            
                const row = document.createElement("tr");
            
                row.innerHTML = `
                    <td>${course.name}</td>
                    <td>${course.courseNumber}</td>
                    <td>${course.credits}</td>
                `;
            
                tbody.appendChild(row);
            });

            // Total Credits Row
            const totalRow = document.createElement("tr");
            totalRow.className = "total-row";

            totalRow.innerHTML = `
                <td>Total Credits</td>
                <td></td>
                <td>${totalCredits}</td>
            `;

            tbody.appendChild(totalRow);

            table.appendChild(tbody);

            section.appendChild(table);

            container.appendChild(section);
        });

    } catch (error) {

        console.error("Error loading schedule:", error);
    }
}

// Print Button
document.addEventListener("DOMContentLoaded", () => {

    loadSchedule();

    document.getElementById("printButton")
        .addEventListener("click", () => {

            window.print();
        });
});