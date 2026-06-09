function verifyGrade9Schedule(scheduleData) {

    const errors = [];

    let totalCredits = 0;
    let limitedCredits = 0;

    let hasLF = false;
    let hasWH = false;
    let hasBI = false;
    let hasHF = false;

    let wellnessCredits = 0;

    scheduleData.courses.forEach(course => {

        const credits = Number(course.credits);

        totalCredits += credits;

        const isCC = course.tags.includes("CC");

        // CC courses do not count toward credit limits
        if (!isCC) {
            limitedCredits += credits;
        }

        if (course.tags.includes("LF")) {
            hasLF = true;
        }

        if (course.tags.includes("WH")) {
            hasWH = true;
        }

        if (course.tags.includes("BI")) {
            hasBI = true;
        }

        if (course.tags.includes("HF")) {
            hasHF = true;
        }

        // Count all wellness credits
        if (
            course.tags.includes("HF") ||
            course.tags.includes("PE")
        ) {
            wellnessCredits += credits;
        }
    });

    // Credit minimum
    if (limitedCredits < 6) {

        errors.push(
            `Minimum 6 credits required. Currently has ${limitedCredits}.`
        );
    }

    // Credit maximum
    if (limitedCredits > 7) {

        errors.push(
            `Maximum 7 credits allowed (excluding CC courses). Currently has ${limitedCredits}.`
        );
    }

    // Required courses

    if (!hasLF) {
        errors.push(
            "Missing Literary Foundations (LF) requirement."
        );
    }

    if (!hasWH) {
        errors.push(
            "Missing World History (WH) requirement."
        );
    }

    if (!hasBI) {
        errors.push(
            "Missing Biology (BI) requirement."
        );
    }

    if (!hasHF) {
        errors.push(
            "Missing Health & Fitness 9 (HF) requirement."
        );
    }

    // Wellness requirement
    if (wellnessCredits < 0.75) {

        errors.push(
            `Grade 9 requires 0.75 Wellness credits (HF + PE). Currently has ${wellnessCredits}.`
        );
    }

    return {
        valid: errors.length === 0,
        totalCredits,
        limitedCredits,
        wellnessCredits,
        errors
    };
}

function verifyGrade9FromStorage() {

    const gradeData = getGradeData(9);

    if (!gradeData) {
        return {
            valid: false,
            errors: ["No Grade 9 schedule found."]
        };
    }

    return verifyGrade9Schedule(gradeData);
}