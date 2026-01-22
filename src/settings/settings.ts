interface Settings {
  copyOnEnter: boolean;
  shorterXPath: boolean;
  customSelectors: boolean;
}

const defaultSettings: Settings = {
  copyOnEnter: false,
  shorterXPath: false,
  customSelectors: false,
};

function loadSettings() {
  chrome.storage.sync.get(defaultSettings, (settings: Settings) => {
    (document.getElementById("copyOnEnter") as HTMLInputElement).checked =
      settings.copyOnEnter;
    (document.getElementById("shorterXPath") as HTMLInputElement).checked =
      settings.shorterXPath;
    (document.getElementById("customSelectors") as HTMLInputElement).checked =
      settings.customSelectors;
  });
}

function saveSettings() {
  const settings: Settings = {
    copyOnEnter: (document.getElementById("copyOnEnter") as HTMLInputElement)
      .checked,
    shorterXPath: (document.getElementById("shorterXPath") as HTMLInputElement)
      .checked,
    customSelectors: (
      document.getElementById("customSelectors") as HTMLInputElement
    ).checked,
  };

  chrome.storage.sync.set(settings, () => {
    const statusElement = document.getElementById("saveStatus");
    if (statusElement) {
      statusElement.textContent = "Settings saved successfully!";
      setTimeout(() => {
        statusElement.textContent = "";
      }, 3000);
    }
  });
}

document.addEventListener("DOMContentLoaded", loadSettings);
document.getElementById("saveButton")?.addEventListener("click", saveSettings);
