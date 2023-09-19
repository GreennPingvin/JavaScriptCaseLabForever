//elements
const switcherInput = document.querySelector(".switcher__input");
const body = document.body;

const THEME_KEY = "themeName";
const LIGHT_THEME = "light";
const DARK_THEME = "dark";

//events
switcherInput.addEventListener("change", () => toggleTheme());

//functions
function setTheme(themeName: string) {
  body.className = `${themeName}`;
  saveTheme(themeName);
}

function toggleTheme() {
  const oldTheme = getTheme();
  const newTheme = oldTheme === LIGHT_THEME ? DARK_THEME : LIGHT_THEME;
  setTheme(newTheme);
}

function saveTheme(themeName: string) {
  localStorage.setItem(THEME_KEY, themeName);
}

function getTheme() {
  return localStorage.getItem(THEME_KEY);
}

function init() {
  let themeName = getTheme();
  if (!themeName) {
    themeName = LIGHT_THEME;
  }
  setTheme(themeName);
  (switcherInput as HTMLInputElement).checked = themeName !== LIGHT_THEME;
}

(function () {
  init();
})();
