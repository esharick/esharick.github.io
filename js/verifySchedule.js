document.addEventListener(
    "DOMContentLoaded",
    verifyGraduationRequirements
);

async function verifyGraduationRequirements() {

    try {

        console.log("Graduation verifier started");

        const response =
            await fetch("/data/schedule.json");

        if (!response.ok) {

            throw new Error(
                `Unable to load schedule.json (${response.status})`
            );
        }

        const schedule =
            await response.json();

        console.log("Loaded schedule:", schedule);

        let courses = [];

        // Supports both:
        // { year: 9, courses: [...] }
        // and
        // [ { year: 9, courses: [...] }, ... ]

        if (Array.isArray(schedule)) {

            courses = schedule.flatMap(
                year => year.courses || []
            );

        } else if (schedule.courses) {

            courses = schedule.courses;

        } else {

            throw new Error(
                "schedule.json format not recognized"
            );
        }

        console.log("All courses:", courses);

        const errors = [];

        const totalCredits =
            sumCredits(courses);

        const englishCredits =
            countCreditsByTag(courses, "EN");

        const mathCredits =
            countCreditsByTag(courses, "MA");

        const scienceCredits =
            countCreditsByTag(courses, "SC");

        const socialStudiesCredits =
            countCreditsByTag(courses, "SS");

        const worldLanguageCredits =
            countCreditsByTag(courses, "WL");

        const electiveCredits =
            countCreditsByTag(courses, "EL");

        const hasBusinessOrTechnology =
            hasTag(courses, "BU") ||
            hasTag(courses, "TE") ||
            hasTag(courses, "BT");

        const hasFC =
            hasTag(courses, "FC");

        const hasVP =
            hasTag(courses, "VP");

        const hasCCT =
            hasTag(courses, "CC");

        if (englishCredits < 4) {

            errors.push(
                `English Credits: ${englishCredits} / 4`
            );
        }

        if (mathCredits < 3) {

            errors.push(
                `Math Credits: ${mathCredits} / 3`
            );
        }

        if (scienceCredits < 3) {

            errors.push(
                `Science Credits: ${scienceCredits} / 3`
            );
        }

        if (socialStudiesCredits < 3) {

            errors.push(
                `Social Studies Credits: ${socialStudiesCredits} / 3`
            );
        }

        if (worldLanguageCredits < 2) {

            errors.push(
                `World Language Credits: ${worldLanguageCredits} / 2`
            );
        }

        if (electiveCredits < 4.5) {

            errors.push(
                `Elective Credits: ${electiveCredits} / 4.5`
            );
        }

        if (totalCredits < 24) {

            errors.push(
                `Total Credits: ${totalCredits} / 24`
            );
        }

        if (!hasBusinessOrTechnology) {

            errors.push(
                "Missing Business or Technology course"
            );
        }

        if (!hasFC) {

            errors.push(
                "Missing Family Consumer Sciences course"
            );
        }

        if (!hasVP) {

            errors.push(
                "Missing Visual & Performing Arts course"
            );
        }

        if (!hasCCT) {

            errors.push(
                "Missing College Career Transition (CCT)"
            );
        }

        console.log("Verification errors:", errors);

        if (errors.length > 0) {

            showGraduationAlert(errors);

        } else {

            console.log(
                "Graduation requirements satisfied"
            );
        }

    } catch (error) {

        console.error(
            "Graduation verification failed:",
            error
        );

        alert(
            "Graduation verifier error. Check browser console."
        );
    }
}

function countCreditsByTag(courses, tag) {

    return courses
        .filter(course =>
            Array.isArray(course.tags) &&
            course.tags.includes(tag)
        )
        .reduce(
            (sum, course) =>
                sum + Number(course.credits || 0),
            0
        );
}

function sumCredits(courses) {

    return courses.reduce(
        (sum, course) =>
            sum + Number(course.credits || 0),
        0
    );
}

function hasTag(courses, tag) {

    return courses.some(
        course =>
            Array.isArray(course.tags) &&
            course.tags.includes(tag)
    );
}

function showGraduationAlert(errors) {

    console.log("Showing graduation popup");

    const alertBox =
        document.getElementById(
            "graduationAlert"
        );

    if (!alertBox) {

        console.error(
            "graduationAlert element not found"
        );

        return;
    }

    let html = `
        <h3>Graduation Requirements Not Met</h3>
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

    alertBox.style.display = "block";
}