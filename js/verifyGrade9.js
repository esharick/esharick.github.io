function verifyGrade9Schedule(scheduleData) {

    const errors = [];

    let totalCredits = 0;
    let limitedCredits = 0;

    let hasLF = false;
    let hasWH = false;
    let hasBI = false;
    let hasHF = false;

    let peCredits = 0;

    scheduleData.courses.forEach(course => {

        const credits = Number(course.credits);

        totalCredits += credits;

        // Cocurricular check
        const isCC = course.tags.includes("CC");

        // CC courses do not count toward limit
        if (!isCC) {
            limitedCredits += credits;
        }

        // Required tags
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

        // PE credits
        if (course.tags.includes("PE")) {
            peCredits += credits;
        }
    });

    // Credit minimum
    if (limitedCredits < 6) {

        errors.push(
            `Minimum 6 credits required. Currently has ${limitedCredits}.`
        );
    }

    // Credit maximum
    if (limitedCredits > 8) {

        errors.push(
            `Maximum 8 credits allowed (excluding CC courses). Currently has ${limitedCredits}.`
        );
    }

    // Required classes
    if (!hasLF) {
        errors.push("Missing Literary Foundations (LF) requirement.");
    }

    if (!hasWH) {
        errors.push("Missing World History (WH) requirement.");
    }

    if (!hasBI) {
        errors.push("Missing Biology (BI) requirement.");
    }

    if (!hasHF) {
        errors.push("Missing Health & Fitness 9 (HF) requirement.");
    }

    // PE requirement
    if (peCredits < 0.25) {

        errors.push(
            `Grade 9 requires at least 0.25 PE credits. Currently has ${peCredits}.`
        );
    }

    return {
        valid: errors.length === 0,
        totalCredits,
        limitedCredits,
        peCredits,
        errors
    };
}