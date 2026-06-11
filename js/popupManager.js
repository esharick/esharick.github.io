// =====================================================
// Popup Manager
// =====================================================

let popupInitialized = false;
let popupDragged = false;

function initializeGraduationPopup() {

    if (popupInitialized) {
        return;
    }

    popupInitialized = true;

    document
        .getElementById("minimizeAlertBtn")
        ?.addEventListener(
            "click",
            toggleAlert
        );

    makePopupDraggable();
}

// =====================================================
// Show Popup
// =====================================================

function showGraduationAlert(errors) {

    initializeGraduationPopup();

    const popup =
        document.getElementById(
            "graduationAlert"
        );

    const body =
        document.getElementById(
            "alertBody"
        );

    let html = "<ul>";

    errors.forEach(error => {

        html += `
            <li>${error}</li>
        `;
    });

    html += "</ul>";

    body.innerHTML = html;

    popup.dataset.errorCount =
        errors.length;

    if (!popupDragged) {

        popup.style.top = "20px";
        popup.style.right = "20px";
        popup.style.left = "auto";
    }

    popup.style.display = "block";

    updateMinimizedTitle();
}

function hideGraduationAlert() {

    const popup =
        document.getElementById(
            "graduationAlert"
        );

    if (!popup) {
        return;
    }

    popup.style.display = "none";
}

// =====================================================
// Minimize
// =====================================================

function toggleAlert() {

    const popup =
        document.getElementById(
            "graduationAlert"
        );

    popup.classList.toggle(
        "minimized"
    );

    keepPopupOnScreen();

    updateMinimizedTitle();
}

function updateMinimizedTitle() {

    const popup =
        document.getElementById(
            "graduationAlert"
        );

    const title =
        document.getElementById(
            "alertTitle"
        );

    if (
        popup.classList.contains(
            "minimized"
        )
    ) {

        const count =
            popup.dataset.errorCount || 0;

        title.textContent =
            `${count} Errors Remaining`;
    }
    else {

        title.textContent =
            "Graduation Requirements Not Met";
    }
}

// =====================================================
// Dragging
// =====================================================

function makePopupDraggable() {

    const popup =
        document.getElementById(
            "graduationAlert"
        );

    const header =
        document.getElementById(
            "alertHeader"
        );

    let dragging = false;

    let offsetX = 0;
    let offsetY = 0;

    header.addEventListener(
        "mousedown",
        e => {

            if (
                e.target.id ===
                "minimizeAlertBtn"
            ) {
                return;
            }

            dragging = true;

            popupDragged = true;

            offsetX =
                e.clientX -
                popup.offsetLeft;

            offsetY =
                e.clientY -
                popup.offsetTop;

            popup.style.right =
                "auto";
        }
    );

    document.addEventListener(
        "mousemove",
        e => {

            if (!dragging) {
                return;
            }

            let x =
                e.clientX - offsetX;

            let y =
                e.clientY - offsetY;

            const maxX =
                window.innerWidth -
                popup.offsetWidth;

            const maxY =
                window.innerHeight -
                popup.offsetHeight;

            x = Math.max(
                0,
                Math.min(x, maxX)
            );

            y = Math.max(
                0,
                Math.min(y, maxY)
            );

            popup.style.left =
                x + "px";

            popup.style.top =
                y + "px";
        }
    );

    document.addEventListener(
        "mouseup",
        () => {

            dragging = false;
        }
    );
}

// =====================================================
// Bounds
// =====================================================

function keepPopupOnScreen() {

    const popup =
        document.getElementById(
            "graduationAlert"
        );

    const maxX =
        window.innerWidth -
        popup.offsetWidth;

    const maxY =
        window.innerHeight -
        popup.offsetHeight;

    popup.style.left =
        Math.max(
            0,
            Math.min(
                popup.offsetLeft,
                maxX
            )
        ) + "px";

    popup.style.top =
        Math.max(
            0,
            Math.min(
                popup.offsetTop,
                maxY
            )
        ) + "px";
}

window.addEventListener(
    "resize",
    keepPopupOnScreen
);