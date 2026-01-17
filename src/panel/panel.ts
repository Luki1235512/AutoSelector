console.log("Custom DevTools panel loaded!");

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

selectorInput?.addEventListener("input", (e) => {
  const selector = (e.target as HTMLInputElement).value.trim();

  if (!selector) {
    resultsDiv.textContent = "Enter a selector to search";
    chrome.devtools.inspectedWindow.eval(clearHighlights());
    return;
  }

  const isXPath = selector.startsWith("/") || selector.startsWith("//");

  chrome.devtools.inspectedWindow.eval(
    highlightElements(selector, isXPath),
    (result, isException) => {
      if (isException) {
        resultsDiv.textContent = `Error: Invalid ${isXPath ? "XPath" : "CSS"} selector`;
      } else {
        const selectorType = isXPath ? "XPath" : "CSS";
        resultsDiv.textContent = `Found ${result} element(s) matching ${selectorType} selector: ${selector}`;
      }
    },
  );
});
