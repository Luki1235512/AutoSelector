console.log("Custom DevTools panel loaded!");

const selectorTypes = ["id", "class", "cssPath", "name", "tag", "xpath"];

const selectorInput = document.getElementById(
  "selectorInput",
) as HTMLInputElement;
const resultsDiv = document.getElementById("results") as HTMLDivElement;

const highlightElements = (selector: string, isXPath: boolean = false) => {
  return `(${injectedHighlighter.toString()})(${JSON.stringify(selector)}, ${isXPath})`;
};

const clearHighlights = () => {
  return `(function() { document.getElementById("selector-highlight-style")?.remove(); })()`;
};

function injectedHighlighter(sel: string, xpath: boolean) {
  document.getElementById("selector-highlight-style")?.remove();

  let elements: Element[] = [];

  try {
    if (xpath) {
      const result = document.evaluate(
        sel,
        document,
        null,
        XPathResult.ORDERED_NODE_SNAPSHOT_TYPE,
        null,
      );
      for (let i = 0; i < result.snapshotLength; i++) {
        const item = result.snapshotItem(i);
        if (item) elements.push(item as Element);
      }
    } else {
      elements = Array.from(document.querySelectorAll(sel));
    }

    if (elements.length > 0) {
      const selectors = elements
        .map((el) => {
          const path: string[] = [];
          let current: Element | null = el;

          while (current && current !== document.body) {
            let selector = current.tagName.toLowerCase();
            if (current.id) {
              selector += `#${current.id}`;
              path.unshift(selector);
              break;
            } else {
              const parent = current.parentElement;
              if (parent) {
                const siblings = Array.from(parent.children).filter(
                  (child) => child.tagName === current!.tagName,
                );
                if (siblings.length > 1) {
                  const index = siblings.indexOf(current) + 1;
                  selector += `:nth-of-type(${index})`;
                }
              }
              path.unshift(selector);
            }
            current = current.parentElement;
          }
          return path.join(" > ");
        })
        .join(", ");

      const style = document.createElement("style");
      style.id = "selector-highlight-style";
      style.textContent = `
        ${selectors} {
          outline: 2px solid #007acc !important;
          outline-offset: -2px !important;
          box-shadow: inset 0 0 0 2000px rgba(0, 122, 204, 0.1) !important;
        }
      `;
      document.head.appendChild(style);
    }

    return elements.length;
  } catch (error) {
    throw new Error((error as Error).message);
  }
}

function getSelectedElementSelector() {
  // @ts-ignore - $0 is a DevTools global variable
  const element = $0;
  if (!element) return null;

  const selectors: { [key: string]: string } = {};

  const path: string[] = [];
  let current: Element | null = element;
  while (current && current !== document.body) {
    let selector = current.tagName.toLowerCase();
    if (current.id) {
      selector += `#${current.id}`;
      path.unshift(selector);
      break;
    } else {
      const parent = current.parentElement;
      if (parent) {
        const siblings = Array.from(parent.children).filter(
          (child) => child.tagName === current!.tagName,
        );
        if (siblings.length > 1) {
          const index = siblings.indexOf(current) + 1;
          selector += `:nth-of-type(${index})`;
        }
      }
      path.unshift(selector);
    }
    current = current.parentElement;
  }
  selectors.cssPath = path.join(" > ");

  if (element.id) {
    selectors.id = `#${element.id}`;
  }

  if (element.className && typeof element.className === "string") {
    const classes = element.className.trim().split(/\s+/).filter(Boolean);
    if (classes.length > 0) {
      selectors.class = `.${classes.join(".")}`;
    }
  }

  let xpath = "";
  let node: Element | null = element;
  while (node && node !== document.body) {
    let index = 1;
    let sibling = node.previousElementSibling;
    while (sibling) {
      if (sibling.tagName === node.tagName) index++;
      sibling = sibling.previousElementSibling;
    }
    const tagName = node.tagName.toLowerCase();
    xpath = `/${tagName}[${index}]${xpath}`;
    node = node.parentElement;
  }
  selectors.xpath = `/html/body${xpath}`;

  selectors.tag = element.tagName.toLowerCase();

  if (element.getAttribute("name")) {
    selectors.name = `[name="${element.getAttribute("name")}"]`;
  }

  return JSON.stringify(selectors);
}

function getFirstMatchingElementSelector(sel: string, xpath: boolean) {
  let element: Element | null = null;

  try {
    if (xpath) {
      const result = document.evaluate(
        sel,
        document,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null,
      );
      element = result.singleNodeValue as Element | null;
    } else {
      element = document.querySelector(sel);
    }

    if (!element) return null;

    const selectors: { [key: string]: string } = {};

    const path: string[] = [];
    let current: Element | null = element;
    while (current && current !== document.body) {
      let selector = current.tagName.toLowerCase();
      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break;
      } else {
        const parent = current.parentElement;
        if (parent) {
          const siblings = Array.from(parent.children).filter(
            (child) => child.tagName === current!.tagName,
          );
          if (siblings.length > 1) {
            const index = siblings.indexOf(current) + 1;
            selector += `:nth-of-type(${index})`;
          }
        }
        path.unshift(selector);
      }
      current = current.parentElement;
    }
    selectors.cssPath = path.join(" > ");

    if (element.id) {
      selectors.id = `#${element.id}`;
    }

    if (element.className && typeof element.className === "string") {
      const classes = element.className.trim().split(/\s+/).filter(Boolean);
      if (classes.length > 0) {
        selectors.class = `.${classes.join(".")}`;
      }
    }

    let xpathStr = "";
    let node: Element | null = element;
    while (node && node !== document.body) {
      let index = 1;
      let sibling = node.previousElementSibling;
      while (sibling) {
        if (sibling.tagName === node.tagName) index++;
        sibling = sibling.previousElementSibling;
      }
      const tagName = node.tagName.toLowerCase();
      xpathStr = `/${tagName}[${index}]${xpathStr}`;
      node = node.parentElement;
    }
    selectors.xpath = `/html/body${xpathStr}`;

    selectors.tag = element.tagName.toLowerCase();

    if (element.getAttribute("name")) {
      selectors.name = `[name="${element.getAttribute("name")}"]`;
    }

    return JSON.stringify(selectors);
  } catch (error) {
    return null;
  }
}

selectorInput?.addEventListener("input", (e) => {
  const selector = (e.target as HTMLInputElement).value.trim();

  if (!selector) {
    selectorTypes.forEach((type) => {
      const element = document.getElementById(`selector-${type}`);
      if (element) {
        element.textContent = "Not available";
        element.classList.add("empty");
      }
    });
    chrome.devtools.inspectedWindow.eval(clearHighlights());
    return;
  }

  const isXPath = selector.startsWith("/") || selector.startsWith("//");

  chrome.devtools.inspectedWindow.eval(
    highlightElements(selector, isXPath),
    (result, isException) => {
      const statusElement = document.getElementById("selector-status");
      if (statusElement) {
        if (isException) {
          statusElement.textContent = `Error: Invalid ${isXPath ? "XPath" : "CSS"} selector`;
          statusElement.style.color = "#f48771";
        } else {
          const selectorType = isXPath ? "XPath" : "CSS";
          statusElement.textContent = `Found ${result} element(s) matching ${selectorType} selector`;
          statusElement.style.color = "#4ec9b0";

          if (typeof result === "number" && result > 0) {
            chrome.devtools.inspectedWindow.eval(
              `(${getFirstMatchingElementSelector.toString()})(${JSON.stringify(selector)}, ${isXPath})`,
              (selectorResult, selectorException) => {
                if (
                  !selectorException &&
                  selectorResult &&
                  typeof selectorResult === "string"
                ) {
                  const selectors = JSON.parse(selectorResult);

                  selectorTypes.forEach((type) => {
                    const element = document.getElementById(`selector-${type}`);
                    if (element) {
                      if (selectors[type]) {
                        element.textContent = selectors[type];
                        element.classList.remove("empty");
                      } else {
                        element.textContent = "Not available";
                        element.classList.add("empty");
                      }
                    }
                  });
                }
              },
            );
          }
        }
      }
    },
  );
});

chrome.devtools.panels.elements.onSelectionChanged.addListener(() => {
  chrome.devtools.inspectedWindow.eval(
    `(${getSelectedElementSelector.toString()})()`,
    (result, isException) => {
      if (!isException && result && typeof result === "string") {
        const selectors = JSON.parse(result);

        selectorInput.value = selectors.cssPath || "";

        selectorTypes.forEach((type) => {
          const element = document.getElementById(`selector-${type}`);
          if (element) {
            if (selectors[type]) {
              element.textContent = selectors[type];
              element.classList.remove("empty");
            } else {
              element.textContent = "Not available";
              element.classList.add("empty");
            }
          }
        });

        selectorInput.dispatchEvent(new Event("input"));
      }
    },
  );
});
