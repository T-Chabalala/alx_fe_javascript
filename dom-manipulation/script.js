let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "The journey of a thousand miles begins with one step.", category: "Motivation" },
  { text: "Life is what happens when you're busy making other plans.", category: "Life" },
  { text: "Do what you can, with what you have, where you are.", category: "Action" },
];

// Optional: track last viewed quote in sessionStorage
const lastQuoteIndex = sessionStorage.getItem('lastQuoteIndex');

// DOM Elements
const quoteDisplay = document.getElementById('quoteDisplay');
const newQuoteBtn = document.getElementById('newQuote');
const addQuoteFormContainer = document.getElementById('addQuoteFormContainer');
const exportBtn = document.getElementById('exportQuotes');
const importFile = document.getElementById('importFile');

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem('quotes', JSON.stringify(quotes));
}

// Display a random quote
function showRandomQuote(category = null) {
  let filteredQuotes = category
    ? quotes.filter(q => q.category.toLowerCase() === category.toLowerCase())
    : quotes;

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const quote = filteredQuotes[randomIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;

  // Save last displayed quote index to sessionStorage
  sessionStorage.setItem('lastQuoteIndex', randomIndex);
}

// Create the add quote form dynamically
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

// Add a new quote
function addQuote() {
  const text = document.getElementById('newQuoteText').value.trim();
  const category = document.getElementById('newQuoteCategory').value.trim();

  if (!text || !category) {
    alert('Both quote text and category are required!');
    return;
  }

  quotes.push({ text, category });
  saveQuotes();

  document.getElementById('newQuoteText').value = '';
  document.getElementById('newQuoteCategory').value = '';

  alert('Quote added successfully!');
}

// Export quotes to JSON file
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

// Import quotes from JSON file
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

// Initialize app
createAddQuoteForm();
newQuoteBtn.addEventListener('click', () => showRandomQuote());
exportBtn.addEventListener('click', exportQuotes);
importFile.addEventListener('change', importFromJsonFile);

// Optionally show last viewed quote
if (lastQuoteIndex !== null && quotes[lastQuoteIndex]) {
  const quote = quotes[lastQuoteIndex];
  quoteDisplay.textContent = `"${quote.text}" — ${quote.category}`;
}
