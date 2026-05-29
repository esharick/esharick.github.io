function verifyGrade10Schedule(scheduleData) {

    const errors = [];

    let totalCredits = 0;
    let limitedCredits = 0;

    let hasUH = false;
    let hasAV = false;

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

        // Required classes
        if (course.tags.includes("UH")) {
            hasUH = true;
        }

        if (course.tags.includes("AV")) {
            hasAV = true;
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
    if (!hasUH) {
        errors.push("Missing US History (UH) requirement.");
    }

    if (!hasAV) {
        errors.push("Missing American Voices (AV) requirement.");
    }

    // PE requirement
    if (peCredits < 0.5) {

        errors.push(
            `Grade 10 requires at least 0.5 PE credits. Currently has ${peCredits}.`
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