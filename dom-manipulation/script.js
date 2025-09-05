// --------------------
// Initialization
// --------------------
const SERVER_URL = 'https://jsonplaceholder.typicode.com/posts';

let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { id: 1, text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { id: 2, text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { id: 3, text: "Do what you can, with what you have, where you are.", category: "Action" },
];

const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const exportBtn = document.getElementById('exportQuotes');
const importFile = document.getElementById('importFile');
const categoryFilter = document.getElementById('categoryFilter');

let lastSelectedCategory = localStorage.getItem('lastCategory') || 'all';

// --------------------
// Storage Helpers
// --------------------
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
  populateCategories();
}

// --------------------
// Random Quote Display
// --------------------
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category.toLowerCase() === selectedCategory.toLowerCase());

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

// --------------------
// Add Quote Form
// --------------------
function createAddQuoteForm() {
  const form = document.createElement('div');

  const quoteInput = document.createElement('input');
  quoteInput.setAttribute('type', 'text');
  quoteInput.setAttribute('id', 'newQuoteText');
  quoteInput.setAttribute('placeholder', 'Enter a new quote');

  const categoryInput = document.createElement('input');
  categoryInput.setAttribute('type', 'text');
  categoryInput.setAttribute('id', 'newQuoteCategory');
  categoryInput.setAttribute('placeholder', 'Enter quote category');

  const addBtn = document.createElement('button');
  addBtn.textContent = 'Add Quote';
  addBtn.addEventListener('click', addQuote);

  form.appendChild(quoteInput);
  form.appendChild(categoryInput);
  form.appendChild(addBtn);

  addQuoteFormContainer.appendChild(form);
}

// --------------------
// Add Quote
// --------------------
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert('Both quote text and category are required!');
    return;
  }

  const newQuote = {
    id: Date.now(),
    text,
    category,
  };

  quotes.push(newQuote);
  saveQuotes();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  alert('Quote added successfully!');
}

// --------------------
// Category Filter
// --------------------
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const option = document.createElement('option');
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });
  categoryFilter.value = lastSelectedCategory;
}

function filterQuotes() {
  lastSelectedCategory = categoryFilter.value;
  localStorage.setItem('lastCategory', lastSelectedCategory);
  showRandomQuote();
}

// --------------------
// JSON Import/Export
// --------------------
function exportQuotes() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'quotes.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function(event) {
    try {
      const importedQuotes = JSON.parse(event.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        alert('Quotes imported successfully!');
      } else {
        alert('Invalid JSON format.');
      }
    } catch (error) {
      alert('Error reading JSON file: ' + error.message);
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// --------------------
// Server Sync Simulation
// --------------------
async function fetchServerQuotes() {
  try {
    const response = await fetch(SERVER_URL);
    const data = await response.json();
    return data.slice(0, 5).map(post => ({
      id: post.id,
      text: post.title,
      category: 'Server',
    }));
  } catch (error) {
    console.error('Error fetching server quotes:', error);
    return [];
  }
}

async function syncWithServer() {
  const serverQuotes = await fetchServerQuotes();
  let hasConflict = false;

  serverQuotes.forEach(sq => {
    const localIndex = quotes.findIndex(lq => lq.id === sq.id);
    if (localIndex === -1) {
      quotes.push(sq);
    } else if (JSON.stringify(quotes[localIndex]) !== JSON.stringify(sq)) {
      quotes[localIndex] = sq;
      hasConflict = true;
    }
  });

  saveQuotes();

  if (hasConflict) {
    showConflictNotification();
  }
}

function showConflictNotification() {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = 'Quotes have been updated from the server. Conflicts resolved automatically.';
  document.body.insertBefore(notification, document.body.firstChild);
  setTimeout(() => notification.remove(), 5000);
}

// --------------------
// Initialization
// --------------------
createAddQuoteForm();
populateCategories();
newQuoteBtn.addEventListener('click', showRandomQuote);
categoryFilter.addEventListener('change', filterQuotes);
exportBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importFromJsonFile);

// Display last quote or random
const lastQuoteIndex = sessionStorage.getItem('lastQuoteIndex');
if (lastQuoteIndex !== null && quotes[lastQuoteIndex]) {
  const quote = quotes[lastQuoteIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
} else {
  showRandomQuote();
}

// Periodic server sync every 30 seconds
setInterval(syncWithServer, 30000);
