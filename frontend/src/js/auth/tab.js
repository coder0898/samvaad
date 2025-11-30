export function initTab() {
  const tabButtons = document.querySelectorAll(".tab-button .tabs");
  const formContents = document.querySelectorAll(".form-content");

  tabButtons.forEach((tab) => {
    tab.addEventListener("click", () => {
      const tabId = tab.dataset.tab;

      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tab.classList.add("active");

      formContents.forEach((content) => content.classList.remove("active"));
      formContents.forEach((content) => {
        if (content.dataset.tab === tabId) content.classList.add("active");
      });
    });
  });
}
