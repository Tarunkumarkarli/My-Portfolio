// Interactive portfolio behavior. No frameworks or build tools required.
const roles = ["intelligent things", "AI-powered ideas", "data-driven solutions", "Python projects"];
const typed = document.querySelector("#typed-role");
let roleIndex = 0, charIndex = 0, deleting = false;
function typeLoop() {
  if (!typed) return;
  const word = roles[roleIndex];
  charIndex += deleting ? -1 : 1;
  typed.textContent = word.slice(0, charIndex);
  let delay = deleting ? 45 : 85;
  if (!deleting && charIndex === word.length) { deleting = true; delay = 1300; }
  else if (deleting && charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % roles.length; delay = 350; }
  window.setTimeout(typeLoop, delay);
}
typeLoop();

const menuToggle = document.querySelector(".menu-toggle");
const nav = document.querySelector(".nav-links");
menuToggle?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(open));
});
nav?.querySelectorAll("a").forEach(link => link.addEventListener("click", () => {
  nav.classList.remove("open");
  menuToggle?.setAttribute("aria-expanded", "false");
}));

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add("visible");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll(".reveal").forEach(el => revealObserver.observe(el));

const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");
filterButtons.forEach(button => button.addEventListener("click", () => {
  filterButtons.forEach(b => b.classList.toggle("active", b === button));
  const filter = button.dataset.filter;
  projectCards.forEach(card => {
    const categories = (card.dataset.category || "").split(" ");
    card.classList.toggle("hidden", filter !== "all" && !categories.includes(filter));
  });
}));

const dialog = document.querySelector("#project-dialog");
const toast = document.querySelector(".toast");
let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}
document.querySelectorAll(".details-btn").forEach(button => button.addEventListener("click", () => {
  document.querySelector("#dialog-title").textContent = button.dataset.title;
  document.querySelector("#dialog-description").textContent = button.dataset.description;
  const stack = document.querySelector("#dialog-stack");
  stack.replaceChildren();
  (button.dataset.stack || "").split(" · ").filter(Boolean).forEach(item => {
    const tag = document.createElement("span");
    tag.textContent = item;
    stack.appendChild(tag);
  });
  dialog.showModal();
}));
document.querySelector(".dialog-close")?.addEventListener("click", () => dialog.close());
dialog?.addEventListener("click", event => {
  if (event.target === dialog) dialog.close();
});

document.querySelector(".copy-email")?.addEventListener("click", async event => {
  const email = event.currentTarget.dataset.email;
  try {
    await navigator.clipboard.writeText(email);
    showToast("Email copied to clipboard");
  } catch {
    showToast("Update the email address in index.html");
  }
});

document.querySelector("#year").textContent = new Date().getFullYear();
document.addEventListener("pointermove", event => {
  const glow = document.querySelector(".cursor-glow");
  if (glow && event.pointerType !== "touch") {
    glow.style.left = `${event.clientX}px`;
    glow.style.top = `${event.clientY}px`;
  }
});
