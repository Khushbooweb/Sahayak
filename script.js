const data = [
    ["&#x1F525;", "Fire", "fire", "Move away from the fire, alert others, use stairs instead of elevators and move to a safe location."],
    ["&#x1F697;", "Road Accident", "accident", "Move to a safe place if possible, alert emergency services and avoid moving seriously injured people unless there is immediate danger."],
    ["&#x1F30D;", "Earthquake", "earthquake", "Drop, cover and hold on. Stay away from windows and remain indoors until the shaking stops."],
    ["&#x1F30A;", "Flood", "flood", "Move to higher ground, avoid walking or driving through floodwater and follow official evacuation instructions."],
    ["&#x26A1;", "Electrical Accident", "electric", "Do not touch a person who may still be in contact with electricity. Switch off power if safe and seek professional help."],
    ["&#x1F635;", "Unconscious Person", "unconscious", "Check responsiveness and breathing, call for emergency help and follow instructions from emergency professionals."]
];

const guides = document.getElementById("guides");

function showGuides(list = data) {
    guides.innerHTML = list.map(x => `
    <article class="card">
      <span>${x[0]}</span>
      <h3>${x[1]}</h3>
      <p>${x[3]}</p>
    </article>
  `).join("");
}

showGuides();

document.getElementById("search").oninput = e => {
    let q = e.target.value.toLowerCase();
    showGuides(data.filter(x =>
        x[1].toLowerCase().includes(q) || x[2].includes(q)
    ));
};


/* emergency  */

const checks = document.querySelectorAll(".kit input");
const score = document.getElementById("score");
const progress = document.getElementById("progress");
const status = document.getElementById("status");

checks.forEach((box, i) => {
    box.checked = localStorage.getItem("kit" + i) === "true";

    box.onchange = () => {
        localStorage.setItem("kit" + i, box.checked);
        update();
    };
});

function update() {
    let done = [...checks].filter(x => x.checked).length;
    let percent = Math.round(done / checks.length * 100);

    score.textContent = percent + "%";
    progress.style.width = percent + "%";

    status.textContent = percent === 100
        ? "🎉 Your emergency kit is complete!"
        : percent >= 60
            ? "&#x1F311; Good! Keep improving your preparedness."
            : "&#x1F315; Start preparing your emergency kit.";
}

update();


/* DARK MODE */

const theme = document.getElementById("theme");

if (theme) {
    if (localStorage.getItem("dark") === "true") {
        document.body.classList.add("dark");
        theme.textContent = "☀️";
    }

    theme.onclick = () => {
        document.body.classList.toggle("dark");

        let dark = document.body.classList.contains("dark");
        localStorage.setItem("dark", dark);
        theme.textContent = dark ? "☀️" : "🌙";
    };
}

const menuToggle = document.getElementById("menuToggle");
const navbar = document.getElementById("navbar");

if (menuToggle && navbar) {
    const syncMenuState = () => {
        const isOpen = navbar.classList.contains("open");
        menuToggle.setAttribute("aria-expanded", String(isOpen));
        menuToggle.innerHTML = isOpen
            ? '<i class="fa-solid fa-xmark"></i>'
            : '<i class="fa-solid fa-bars"></i>';
    };

    menuToggle.addEventListener("click", () => {
        navbar.classList.toggle("open");
        syncMenuState();
    });

    navbar.querySelectorAll("a").forEach(link => {
        link.addEventListener("click", () => {
            if (window.innerWidth <= 768) {
                navbar.classList.remove("open");
                syncMenuState();
            }
        });
    });

    window.addEventListener("resize", () => {
        if (window.innerWidth > 768) {
            navbar.classList.remove("open");
        }
        syncMenuState();
    });

    syncMenuState();
}

// ===============================
// SOS BUTTON & CALLING 112
// ===============================

const sosButton = document.getElementById("sosButton");
const sosModal = document.getElementById("sosModal");
const cancelSos = document.getElementById("cancelSos");
const confirmSos = document.getElementById("confirmSos");

function startSosCall() {
    if (sosModal) {
        sosModal.classList.add("active");
    }
    showNotification("Initiating emergency SOS call to 112...");
    window.location.href = "tel:112";
}

if (sosButton) {
    // Handle both click and touch events for immediate SOS 112 call
    sosButton.addEventListener("click", (e) => {
        e.preventDefault();
        startSosCall();
    });

    sosButton.addEventListener("touchstart", (e) => {
        e.preventDefault();
        startSosCall();
    }, { passive: false });
}

if (cancelSos) {
    cancelSos.addEventListener("click", () => {
        if (sosModal) sosModal.classList.remove("active");
    });
}

if (confirmSos) {
    confirmSos.addEventListener("click", () => {
        window.location.href = "tel:112";
    });
}

// Close modal by clicking outside
if (sosModal) {
    sosModal.addEventListener("click", (event) => {
        if (event.target === sosModal) {
            sosModal.classList.remove("active");
        }
    });
}


// ===============================
// ADD EMERGENCY CONTACT
// ===============================

const addContactBtn = document.getElementById("addContactBtn");
const contactModal = document.getElementById("contactModal");
const closeContact = document.getElementById("closeContact");
const saveContact = document.getElementById("saveContact");
const contactName = document.getElementById("contactName");
const contactPhone = document.getElementById("contactPhone");
const familyNumber = document.getElementById("familyNumber");

if (addContactBtn && contactModal && contactName) {
    addContactBtn.addEventListener("click", () => {
        contactModal.classList.add("active");
        contactName.focus();
    });
}

if (closeContact && contactModal) {
    closeContact.addEventListener("click", () => {
        contactModal.classList.remove("active");
    });
}

if (saveContact) {
    saveContact.addEventListener("click", () => {
        const name = contactName ? contactName.value.trim() : "";
        const phone = contactPhone ? contactPhone.value.trim() : "";

        if (name === "" || phone === "") {
            showNotification("Please enter name and phone.");
            return;
        }

        if (familyNumber) familyNumber.textContent = phone;
        if (contactModal) contactModal.classList.remove("active");

        if (contactName) contactName.value = "";
        if (contactPhone) contactPhone.value = "";

        showNotification(`${name} added as an emergency contact.`);
    });
}

// Close contact modal outside click
if (contactModal) {
    contactModal.addEventListener("click", (event) => {
        if (event.target === contactModal) {
            contactModal.classList.remove("active");
        }
    });
}



// ===============================
// NOTIFICATION TOAST
// ===============================

function showNotification(message) {
    const notification = document.getElementById("notification");
    const notificationText = document.getElementById("notificationText");

    if (notificationText) notificationText.textContent = message;

    if (notification) {
        notification.classList.add("show");

        setTimeout(() => {
            notification.classList.remove("show");
        }, 3000);
    }
}

// ===============================
// EMERGENCY NOTIFICATIONS MODAL
// ===============================

const headerNotifBtn = document.getElementById("headerNotifBtn");
const notifModal = document.getElementById("notifModal");
const closeNotif = document.getElementById("closeNotif");
const clearNotif = document.getElementById("clearNotif");
const notifBadge = document.getElementById("notifBadge");

if (headerNotifBtn && notifModal) {
    headerNotifBtn.addEventListener("click", () => {
        notifModal.classList.add("active");
    });
}

if (closeNotif && notifModal) {
    closeNotif.addEventListener("click", () => {
        notifModal.classList.remove("active");
    });
}

if (clearNotif) {
    clearNotif.addEventListener("click", () => {
        if (notifBadge) {
            notifBadge.style.display = "none";
        }
        if (notifModal) {
            notifModal.classList.remove("active");
        }
        showNotification("All emergency notifications marked as read.");
    });
}

if (notifModal) {
    notifModal.addEventListener("click", (event) => {
        if (event.target === notifModal) {
            notifModal.classList.remove("active");
        }
    });
}

