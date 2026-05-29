async function verifySchedule() {

    try {

        const response = await fetch("/data/schedule.json");

        if (!response.ok) {
            throw new Error("Failed to load schedule.json");
        }

        const schedule = await response.json();

        // Grade 9
        const grade9Data = schedule.find(year => year.year === 9);

        if (grade9Data) {

            const grade9Result =
                verifyGrade9Schedule(grade9Data);

            console.log("GRADE 9");

            if (grade9Result.valid) {

                console.log("✅ Passed");

            } else {

                console.log("❌ Failed");

                grade9Result.errors.forEach(error => {
                    console.log("- " + error);
                });
            }
        }

        // Grade 10
        const grade10Data = schedule.find(year => year.year === 10);

        if (grade10Data) {

            const grade10Result =
                verifyGrade10Schedule(grade10Data);

            console.log("GRADE 10");

            if (grade10Result.valid) {

                console.log("✅ Passed");

            } else {

                console.log("❌ Failed");

                grade10Result.errors.forEach(error => {
                    console.log("- " + error);
                });
            }
        }

    } catch (error) {

        console.error("Verification error:", error);
    }
}

verifySchedule();