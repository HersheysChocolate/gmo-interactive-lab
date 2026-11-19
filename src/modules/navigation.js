export function initNavigation() {
  const views = [...document.querySelectorAll(".view")];
  const nav = [...document.querySelectorAll(".nav")];
  const crumb = document.querySelector("#crumb");
  function show(name) {
    views.forEach(v => v.classList.toggle("active", v.id === `view-${name}`));
    nav.forEach(b => b.classList.toggle("active", b.dataset.view === name));
    const selected = nav.find(b => b.dataset.view === name);
    if (crumb) crumb.textContent = selected ? selected.textContent.trim().replace(/^[^A-Za-z]+/, "") : "Overview";
    window.scrollTo({top: 0, behavior: "smooth"});
    window.dispatchEvent(new CustomEvent("gmo:viewchange", {detail:{view:name}}));
  }
  nav.forEach(b => b.addEventListener("click", () => show(b.dataset.view)));
  document.querySelectorAll("[data-go]").forEach(b => b.addEventListener("click", () => show(b.dataset.go)));
  document.querySelector("#reset").addEventListener("click", () => {
    window.dispatchEvent(new Event("gmo:reset")); show("overview");
  });
}
