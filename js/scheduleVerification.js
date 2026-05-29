async function verifySchedule() {

    try {

        // Load schedule.json
        const response = await fetch("/data/schedule.json");

        if (!response.ok) {
            throw new Error("Failed to load schedule.json");
        }

        const schedule = await response.json();

        // Find Grade 9
        const grade9 = schedule.find(year => year.year === 9);

        if (!grade9) {
            console.error("Grade 9 schedule not found.");
            return;
        }

        // Run verification
        const result = verifyGrade9(grade9);

        // Console output
        if (result.valid) {

            console.log("✅ Grade 9 schedule PASSED verification.");

        } else {

            console.log("❌ Grade 9 schedule FAILED verification.");

            result.errors.forEach(error => {
                console.log("- " + error);
            });
        }

        console.log("Total Credits:", result.totalCredits);
        console.log("Limited Credits:", result.limitedCredits);

    } catch (error) {

        console.error("Verification error:", error);
    }
}

function verifyGrade9(scheduleData) {

    const errors = [];

    let totalCredits = 0;
    let limitedCredits = 0;

    let hasLF = false;
    let hasWH = false;
    let hasBI = false;

    scheduleData.courses.forEach(course => {

        const credits = Number(course.credits);

        totalCredits += credits;

        // Check if cocurricular
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

    // Required courses
    if (!hasLF) {
        errors.push("Missing Literary Foundations (LF) requirement.");
    }

    if (!hasWH) {
        errors.push("Missing World History (WH) requirement.");
    }

    if (!hasBI) {
        errors.push("Missing Biology (BI) requirement.");
    }

    return {
        valid: errors.length === 0,
        totalCredits,
        limitedCredits,
        errors
    };
}

// Run verifier
verifySchedule();