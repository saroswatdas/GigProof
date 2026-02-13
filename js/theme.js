(function () {
  const KEY = "gigproof_theme";

  function applyTheme(theme) {
    if (theme === "light") document.documentElement.setAttribute("data-theme", "light");
    else document.documentElement.removeAttribute("data-theme");
  }

  function getSavedTheme() {
    return localStorage.getItem(KEY);
  }

  function setSavedTheme(theme) {
    localStorage.setItem(KEY, theme);
  }

  // Default: dark
  const saved = getSavedTheme();
  if (saved) applyTheme(saved);

  // Hook up button if exists
  window.addEventListener("DOMContentLoaded", () => {
    const btn = document.getElementById("themeToggle");
    if (!btn) return;

    function updateLabel() {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      btn.innerHTML = `
        <span class="themeDot"></span>
        ${isLight ? "Light" : "Dark"}
      `;
    }

    btn.addEventListener("click", () => {
      const isLight = document.documentElement.getAttribute("data-theme") === "light";
      const next = isLight ? "dark" : "light";
      applyTheme(next);
      setSavedTheme(next);
      updateLabel();
    });

    updateLabel();
  });
})();
