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

        const grade11Data = schedule.find(year => year.year === 11);

        if (grade11Data) {

            const grade11Result =
                verifyGrade11Schedule(grade11Data);

            console.log("GRADE 11");

            if (grade11Result.valid) {

                console.log("✅ Passed");

            } else {

                console.log("❌ Failed");

                grade11Result.errors.forEach(error => {
                    console.log("- " + error);
                });
            }
        }

        const grade12Data = schedule.find(year => year.year === 12);

        if (grade12Data) {

            const grade12Result =
                verifyGrade12Schedule(grade12Data);

            console.log("GRADE 12");

            if (grade12Result.valid) {

                console.log("✅ Passed");

            } else {

                console.log("❌ Failed");

                grade12Result.errors.forEach(error => {
                    console.log("- " + error);
                });
            }
        }

    } catch (error) {

        console.error("Verification error:", error);
    }
}

verifySchedule();