const apiKey = 'd93ed21e';
const searchForm = document.getElementById ('searchForm');
const searchInput = document.getElementById ('searchInput');
const resultsContainer = document.getElementById ('results');
const statusEl = document.getElementById ('status');
const suggestionsEl = document.getElementById ('suggestions');
const typeFilter = document.getElementById ('typeFilter');
const sortSelect = document.getElementById ('sortSelect');
const yearFilter = document.getElementById ('yearFilter');

let suggestionResults = [];
let selectedSuggestionIndex = -1;
let currentResults = [];

function showSuggestions (items) {
  if (!items || items.length === 0) {
    suggestionsEl.classList.remove ('visible');
    suggestionsEl.innerHTML = '';
    selectedSuggestionIndex = -1;
    return;
  }

  suggestionsEl.innerHTML = items
    .slice (0, 6)
    .map (
      (item, index) => `
        <button type="button" class="suggestion-item ${index === selectedSuggestionIndex ? 'active' : ''}" data-index="${index}">
          ${item.Title} (${item.Year})
        </button>
      `
    )
    .join ('');

  suggestionsEl.classList.add ('visible');

  suggestionsEl.querySelectorAll ('.suggestion-item').forEach (button => {
    button.addEventListener ('click', () => {
      const index = Number (button.dataset.index);
      const chosen = suggestionResults[index];
      if (chosen) {
        searchInput.value = chosen.Title;
        suggestionsEl.classList.remove ('visible');
        searchTitles (chosen.Title);
      }
    });
  });
}

async function loadSuggestions (query) {
  const trimmed = query.trim ();
  if (!trimmed || trimmed.length < 2) {
    suggestionsEl.classList.remove ('visible');
    suggestionsEl.innerHTML = '';
    return;
  }

  try {
    const response = await fetch (
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent (trimmed)}`
    );
    const data = await response.json ();
    suggestionResults = data.Search || [];

    if (data.Response === 'True' && suggestionResults.length > 0) {
      showSuggestions (suggestionResults);
    } else {
      suggestionsEl.classList.remove ('visible');
      suggestionsEl.innerHTML = '';
    }
  } catch (error) {
    suggestionsEl.classList.remove ('visible');
    suggestionsEl.innerHTML = '';
  }
}

searchInput.addEventListener ('input', event => {
  const value = event.target.value;
  selectedSuggestionIndex = -1;
  loadSuggestions (value);
});

searchInput.addEventListener ('keydown', event => {
  const items = suggestionsEl.querySelectorAll ('.suggestion-item');
  if (!items.length) return;

  if (event.key === 'ArrowDown') {
    event.preventDefault ();
    selectedSuggestionIndex = Math.min (
      selectedSuggestionIndex + 1,
      items.length - 1
    );
    items[selectedSuggestionIndex].classList.add ('active');
    for (let i = 0; i < items.length; i++) {
      if (i !== selectedSuggestionIndex) items[i].classList.remove ('active');
    }
  }

  if (event.key === 'ArrowUp') {
    event.preventDefault ();
    selectedSuggestionIndex = Math.max (selectedSuggestionIndex - 1, 0);
    items[selectedSuggestionIndex].classList.add ('active');
    for (let i = 0; i < items.length; i++) {
      if (i !== selectedSuggestionIndex) items[i].classList.remove ('active');
    }
  }

  if (event.key === 'Enter' && selectedSuggestionIndex >= 0) {
    event.preventDefault ();
    const selected = suggestionResults[selectedSuggestionIndex];
    if (selected) {
      searchInput.value = selected.Title;
      suggestionsEl.classList.remove ('visible');
      searchTitles (selected.Title);
    }
  }

  if (event.key === 'Escape') {
    suggestionsEl.classList.remove ('visible');
    suggestionsEl.innerHTML = '';
  }
});

document.addEventListener ('click', event => {
  if (!event.target.closest ('.search-field-wrap')) {
    suggestionsEl.classList.remove ('visible');
  }
});

function determineThemeByTime () {
  const now = new Date ();
  const hour = now.getHours ();
  const prefersLight =
    window.matchMedia &&
    window.matchMedia ('(prefers-color-scheme: light)').matches;

  if (hour >= 7 && hour < 19) {
    return prefersLight ? 'light' : 'light';
  }

  return 'dark';
}

function applyTheme (theme) {
  const isLight = theme === 'light';
  document.body.classList.toggle ('light-mode', isLight);
  localStorage.setItem ('movieMastersTheme', theme);
}

function initializeTheme () {
  const savedTheme = localStorage.getItem ('movieMastersTheme');
  const theme = savedTheme || determineThemeByTime ();
  applyTheme (theme);
}

window.matchMedia &&
  window
    .matchMedia ('(prefers-color-scheme: light)')
    .addEventListener ('change', () => {
      const savedTheme = localStorage.getItem ('movieMastersTheme');
      if (!savedTheme) {
        initializeTheme ();
      }
    });

function populateYearFilter (items) {
  const years = [
    ...new Set (
      items
        .map (item => Number (item.Year))
        .filter (year => Number.isInteger (year) && year > 0)
        .sort ((a, b) => b - a)
    ),
  ];

  const currentYear = yearFilter.value;
  yearFilter.innerHTML =
    '<option value="all">All years</option>' +
    years.map (year => `<option value="${year}">${year}</option>`).join ('');

  if (years.includes (Number (currentYear))) {
    yearFilter.value = String (currentYear);
  } else {
    yearFilter.value = 'all';
  }
}

function sortAndFilterResults (items) {
  const typeValue = typeFilter.value;
  const yearValue = yearFilter.value;
  const sortValue = sortSelect.value;

  let filtered = [...items];

  if (typeValue !== 'all') {
    filtered = filtered.filter (
      item => item.Type && item.Type.toLowerCase () === typeValue
    );
  }

  if (yearValue !== 'all') {
    filtered = filtered.filter (
      item => Number (item.Year) === Number (yearValue)
    );
  }

  if (sortValue === 'year-desc') {
    filtered.sort ((a, b) => Number (b.Year || 0) - Number (a.Year || 0));
  } else if (sortValue === 'year-asc') {
    filtered.sort ((a, b) => Number (a.Year || 0) - Number (b.Year || 0));
  } else if (sortValue === 'title-asc') {
    filtered.sort ((a, b) => a.Title.localeCompare (b.Title));
  }

  return filtered;
}

function applyCurrentResults () {
  const processed = sortAndFilterResults (currentResults);
  renderResults (processed);

  const count = processed.length;
  const typeLabel = typeFilter.value === 'all' ? 'all types' : typeFilter.value;
  const yearLabel = yearFilter.value === 'all'
    ? 'all years'
    : `year ${yearFilter.value}`;
  statusEl.textContent = `Showing ${Math.min (count, 6)} ${typeLabel} results for ${yearLabel}`;
}

function setControls () {
  typeFilter.value = 'all';
  yearFilter.value = 'all';
  sortSelect.value = 'relevance';
}

function renderResults (items) {
  if (!items || items.length === 0) {
    resultsContainer.innerHTML =
      '<div class="no-results">No results found.</div>';
    return;
  }

  const limitedItems = items.slice (0, 6);

  resultsContainer.innerHTML = limitedItems
    .map (
      item => `
        <article class="result-card">
          <img src="${item.Poster && item.Poster !== 'N/A' ? item.Poster : 'https://placehold.co/300x450/111827/ffffff?text=No+Image'}" alt="${item.Title}" />
          <div class="result-content">
            <h3>${item.Title}</h3>
            <div class="result-meta">${item.Year} • ${item.Type}</div>
          </div>
        </article>
      `
    )
    .join ('');
}

async function searchTitles (query) {
  const trimmedQuery = query.trim ();

  if (!trimmedQuery) {
    statusEl.textContent = 'Please enter a search term.';
    resultsContainer.innerHTML = '';
    return;
  }

  statusEl.textContent = 'Searching...';
  resultsContainer.innerHTML = '';

  try {
    const response = await fetch (
      `https://www.omdbapi.com/?apikey=${apiKey}&s=${encodeURIComponent (trimmedQuery)}`
    );

    if (!response.ok) {
      throw new Error ('Request failed');
    }

    const data = await response.json ();

    if (data.Response === 'False') {
      currentResults = [];
      statusEl.textContent = data.Error || 'No results found.';
      renderResults ([]);
      return;
    }

    currentResults = data.Search || [];
    populateYearFilter (currentResults);
    applyCurrentResults ();
  } catch (error) {
    console.error (error);
    statusEl.textContent = 'Something went wrong while loading results.';
    resultsContainer.innerHTML =
      '<div class="error">Unable to fetch data right now.</div>';
  }
}

searchForm.addEventListener ('submit', event => {
  event.preventDefault ();
  searchTitles (searchInput.value);
});

typeFilter.addEventListener ('change', () => {
  if (currentResults.length) {
    applyCurrentResults ();
  }
});

yearFilter.addEventListener ('change', () => {
  if (currentResults.length) {
    applyCurrentResults ();
  }
});

sortSelect.addEventListener ('change', () => {
  if (currentResults.length) {
    applyCurrentResults ();
  }
});

setControls ();
initializeTheme ();
searchTitles (searchInput.value);
