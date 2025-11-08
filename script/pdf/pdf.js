const main = document.getElementById("main");

// Extract folder prefix from URL query
const prefix = new URLSearchParams(window.location.search).get("prefix") || "";
const apiUrl = new URL("https://pdf.tomaszkkmaher.workers.dev/");
if (prefix && prefix !== "/") {
  apiUrl.searchParams.append("prefix", prefix);
}

/**
 * Create an HTML element for a file or folder entry.
 * @param {string} tag - The HTML tag to create.
 * @param {string} name - The display name.
 * @param {string} [href] - Optional link URL.
 * @returns {HTMLElement} - The created element.
 */
function createItem(tag, name, href) {
  const element = document.createElement(tag);
  element.innerText = name;

  if (href) {
    element.classList.add("button");
    element.setAttribute("href", href);
  }

  return element;
}

/**
 * Populate the main content area with files and folders.
 * @param {Object} data - Folder data from the API.
 */
function populate(data) {
  main.innerHTML = ""; // clear previous content

  // Folder title
  const title = document.createElement("div");
  title.textContent = `📂 /${data.prefix}`;
  main.appendChild(title);

  const list = document.createElement("ul"); // list container for folder content

  // Files
  data.files.forEach(file => {
    const li = document.createElement("li");
    li.appendChild(createItem("a", `📄 ${file.name}`, file.url));
    list.appendChild(li);
  });

  // Subfolders
  data.folders.forEach(folder => {
    const name = folder.slice(0, -1).split("/").pop();
    const link = `/pdf/?prefix=${folder}`;
    const li = document.createElement("li");
    li.appendChild(createItem("a", `📁 ${name}`, link));
    list.appendChild(li);
  });

  // Parent folder
  const parent = document.createElement("li");
  parent.appendChild(createItem("a", "📁 ../", `/pdf/?prefix=${data.suffix}`));
  list.appendChild(parent);

  main.appendChild(list);
}

/**
 * Fetch and display folder data from API.
 * @param {URL} path - API endpoint to fetch.
 */
async function getFolder(path) {
  try {
    const response = await fetch(path);
    const data = await response.json();
    populate(data);
  } catch (error) {
    console.error("Failed to load folder data:", error);
  }
}

getFolder(apiUrl);