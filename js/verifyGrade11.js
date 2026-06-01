function verifyGrade11Schedule(scheduleData) {

    const errors = [];

    let totalCredits = 0;
    let limitedCredits = 0;

    let hasLC = false;
    let hasCT = false;
    let hasGV = false;

    scheduleData.courses.forEach(course => {

        const credits = Number(course.credits);

        totalCredits += credits;

        const isCC = course.tags.includes("CC");

        if (!isCC) {
            limitedCredits += credits;
        }

        if (course.tags.includes("LC")) {
            hasLC = true;
        }

        if (course.tags.includes("CT")) {
            hasCT = true;
        }

        if (course.tags.includes("GV")) {
            hasGV = true;
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

    if (!hasLC) {
        errors.push(
            "Missing Language and Composition (LC) requirement."
        );
    }

    if (!hasCT) {
        errors.push(
            "Missing College Career Transition (CT) requirement."
        );
    }

    if (!hasGV) {
        errors.push(
            "Missing U.S. Government (GV) requirement."
        );
    }

    return {
        valid: errors.length === 0,
        totalCredits,
        limitedCredits,
        errors
    };
}