function verifyGrade12Schedule(scheduleData) {

    const errors = [];

    let totalCredits = 0;
    let limitedCredits = 0;
    let englishCredits = 0;

    scheduleData.courses.forEach(course => {

        const credits = Number(course.credits);

        totalCredits += credits;

        const isCC = course.tags.includes("CC");

        if (!isCC) {
            limitedCredits += credits;
        }

        if (course.tags.includes("EN")) {
            englishCredits += credits;
        }
    });

    if (limitedCredits < 5.5) {
        errors.push(
            `Minimum 5.5 credits required. Currently has ${limitedCredits}.`
        );
    }

    if (limitedCredits > 8) {
        errors.push(
            `Maximum 8 credits allowed (excluding CC courses). Currently has ${limitedCredits}.`
        );
    }

    if (englishCredits < 1) {
        errors.push(
            `Grade 12 requires at least 1 English credit. Currently has ${englishCredits}.`
        );
    }

    return {
        valid: errors.length === 0,
        totalCredits,
        limitedCredits,
        englishCredits,
        errors
    };
}

function verifyGrade12FromStorage() {

    const gradeData = getGradeData(12);

    if (!gradeData) {
        return {
            valid: false,
            errors: ["No Grade 12 schedule found."]
        };
    }

    return verifyGrade12Schedule(gradeData);
}