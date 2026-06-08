document.addEventListener(
    "DOMContentLoaded",
    runFullAudit
);

function verifyGraduationRequirements() {
    const errors = [];

    try {

        console.log("Graduation verifier started");

        const rawData =
            localStorage.getItem(
                "student_course_plan"
            );

        if (!rawData) {

            throw new Error(
                "No saved course plan found"
            );
        }

        const schedule =
            JSON.parse(rawData);

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
            hasTag(courses, "CT");

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

    return {
        valid: errors.length === 0,
        errors
    };
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

function collectGradeErrors() {

    const errors = [];

    const grade9 = verifyGrade9FromStorage();

    if (!grade9.valid) {

        grade9.errors.forEach(error => {

            errors.push(
                `Grade 9: ${error}`
            );
        });
    }

    const grade10 = verifyGrade10FromStorage();

    if (!grade10.valid) {

        grade10.errors.forEach(error => {

            errors.push(
                `Grade 10: ${error}`
            );
        });
    }

    const grade11 = verifyGrade11FromStorage();

    if (!grade11.valid) {

        grade11.errors.forEach(error => {

            errors.push(
                `Grade 11: ${error}`
            );
        });
    }

    const grade12 = verifyGrade12FromStorage();

    if (!grade12.valid) {

        grade12.errors.forEach(error => {

            errors.push(
                `Grade 12: ${error}`
            );
        });
    }

    return errors;
}

function runFullAudit() {

    const allErrors = [];

    allErrors.push(
        ...collectGradeErrors()
    );

    const graduation =
        verifyGraduationRequirements();

    if (!graduation.valid) {

        graduation.errors.forEach(error => {

            allErrors.push(
                `Graduation: ${error}`
            );
        });
    }

    if (allErrors.length > 0) {

        showGraduationAlert(
            allErrors
        );
    }
    else {

        hideGraduationAlert();
    }
}