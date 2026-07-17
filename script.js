const driverData = {
  name: "El Flaco",
  phone: "527295421168",
  city: "Ixtapan de la Sal, Estado de México",
  baseMessage: "Hola, Flaco. Quiero cotizar un viaje.",
  quoteMessage: "Hola, quiero cotizar un viaje con Taxi El Flaco. Salgo de: _____. Mi destino es: _____. Fecha y hora: _____.",
};

const header = document.querySelector("[data-header]");
const navToggle = document.querySelector("[data-nav-toggle]");
const nav = document.querySelector("[data-nav]");
const whatsappLinks = document.querySelectorAll("[data-whatsapp-link]");
const whatsappQuoteLinks = document.querySelectorAll("[data-whatsapp-quote]");
const floatingActions = document.querySelectorAll(".floating-whatsapp, .floating-quote");
const fareSection = document.querySelector("#tarifa");
let isFareSectionVisible = false;

function buildWhatsappUrl(message = driverData.baseMessage) {
  return `https://wa.me/${driverData.phone}?text=${encodeURIComponent(message)}`;
}

function setWhatsappLinks(links, message) {
  links.forEach((link) => {
    link.href = buildWhatsappUrl(message);
  });
}

function updateHeaderState() {
  header.classList.toggle("is-scrolled", window.scrollY > 12);
  const hideFloatingActions = isFareSectionVisible && window.matchMedia("(max-width: 620px)").matches;
  floatingActions.forEach((action) => {
    action.classList.toggle("is-visible", window.scrollY > 360 && !hideFloatingActions);
  });
}

function closeMobileNav() {
  document.body.classList.remove("nav-open");
  header.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
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

window.addEventListener("scroll", updateHeaderState, { passive: true });
window.addEventListener("resize", updateHeaderState);

if (fareSection && "IntersectionObserver" in window) {
  const fareObserver = new IntersectionObserver(
    ([entry]) => {
      isFareSectionVisible = entry.isIntersecting;
      document.body.classList.toggle("fare-in-view", isFareSectionVisible);
      updateHeaderState();
    },
    { threshold: 0.08 }
  );
  fareObserver.observe(fareSection);
}

setWhatsappLinks(whatsappLinks, driverData.baseMessage);
setWhatsappLinks(whatsappQuoteLinks, driverData.quoteMessage);
updateHeaderState();
