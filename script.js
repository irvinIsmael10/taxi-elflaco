const driverData = {
  name: "El Flaco",
  phone: "527295421168",
  city: "Ixtapan de la Sal, Estado de México",
  baseMessage: "Hola, Flaco. Quiero cotizar un viaje.",
};

const zoneCopy = {
  ixtapan: {
    title: "Ixtapan de la Sal y alrededores",
    text: "Viajes locales, hoteles, balnearios, consultas, compras y traslados familiares.",
  },
  regional: {
    title: "Tonatico, El Mogote y Pilcaya",
    text: "Traslados cercanos con precio acordado antes de salir y pago en efectivo o transferencia.",
  },
  rutas: {
    title: "Tenancingo y Coatepec Harinas",
    text: "Viajes regionales bajo confirmación de disponibilidad, ruta y horario.",
  },
};

const serviceRates = {
  local: { base: 45, km: 8 },
  tonatico: { fixed: 60 },
  regional: { base: 80, km: 13 },
  long: { base: 120, km: 15 },
};

const timeMultipliers = {
  day: 1,
  early: 1.12,
  wait: 1.22,
};

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const zoneButtons = document.querySelectorAll("[data-zone]");
const zoneOutput = document.querySelector("[data-zone-output]");
const fareForm = document.querySelector("[data-fare-form]");
const distanceInput = document.querySelector("[data-distance]");
const distanceOutput = document.querySelector("[data-distance-output]");
const fareOutput = document.querySelector("[data-fare-output]");
const floatingActions = document.querySelectorAll(".floating-whatsapp, .floating-quote");

function buildWhatsappUrl(message = driverData.baseMessage) {
  return `https://wa.me/${driverData.phone}?text=${encodeURIComponent(message)}`;
}

function setWhatsappLinks(message) {
  whatsappLinks.forEach((link) => {
    link.href = buildWhatsappUrl(message);
  });
}

function updateHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  floatingActions.forEach((action) => {
    action.classList.toggle("is-visible", window.scrollY > 360);
  });
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
}

function updateZone(zoneKey) {
  const selectedZone = zoneCopy[zoneKey];

  if (!selectedZone) {
    return;
  }

  zoneButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.zone === zoneKey);
  });

  zoneOutput.innerHTML = `
    <h3>${selectedZone.title}</h3>
    <p>${selectedZone.text}</p>
  `;
}

function calculateFare() {
  const formData = new FormData(fareForm);
  const service = formData.get("service");
  const time = formData.get("time");
  const distance = Number(formData.get("distance"));
  const rate = serviceRates[service] || serviceRates.local;
  const multiplier = timeMultipliers[time] || 1;
  const subtotal = rate.fixed || rate.base + distance * rate.km;
  const total = Math.ceil(subtotal * multiplier / 10) * 10;
  const serviceLabel = fareForm.elements.service.selectedOptions[0].textContent;
  const timeLabel = fareForm.elements.time.selectedOptions[0].textContent;
  const message = `Hola, ${driverData.name}. Quiero cotizar un ${serviceLabel.toLowerCase()} de aproximadamente ${distance} km en horario ${timeLabel.toLowerCase()}.`;

  distanceOutput.textContent = distance;
  fareOutput.textContent = `$${total.toLocaleString("es-MX")} MXN`;
  setWhatsappLinks(message);
}

navToggle.addEventListener("click", () => {
  const isOpen = header.classList.toggle("is-open");
  document.body.classList.toggle("nav-open", isOpen);
  navToggle.setAttribute("aria-expanded", String(isOpen));
});

nav.addEventListener("click", (event) => {
  if (event.target.matches("a")) {
    closeMobileNav();
  }
});

zoneButtons.forEach((button) => {
  button.addEventListener("click", () => updateZone(button.dataset.zone));
});

fareForm.addEventListener("input", calculateFare);
fareForm.addEventListener("change", calculateFare);
window.addEventListener("scroll", updateHeaderState, { passive: true });

setWhatsappLinks();
calculateFare();
updateHeaderState();
