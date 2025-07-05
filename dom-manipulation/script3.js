// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "My vibe? Dark mode with strong encryption.", category: "Style" },
  { text: "Think like a user. Defend like a hacker. Solve like an engineer.", category: "Mindset" },
  { text: "The best code is the one that never needs to be written.", category: "Efficiency" },
];

// Display a random quote (filtered by selected category)
function showRandomQuote() {
  const selectedCategory = localStorage.getItem('selectedCategory') || 'all';
  const filteredQuotes = selectedCategory === 'all'
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  const quoteDisplay = document.getElementById('quoteDisplay');

  if (filteredQuotes.length === 0) {
    quoteDisplay.innerHTML = `<p>No quotes found for category: <strong>${selectedCategory}</strong></p>`;
    return;
  }

  const randomQuote = filteredQuotes[Math.floor(Math.random() * filteredQuotes.length)];

  quoteDisplay.innerHTML = `
    <blockquote>${randomQuote.text}</blockquote>
    <p class="category"><em>${randomQuote.category}</em></p>
  `;

  saveToSessionStorage(randomQuote);
}

// Add new quote and update storage and dropdown
function addQuote() {
  const textInput = document.getElementById('newQuoteText');
  const categoryInput = document.getElementById('newQuoteCategory');

  const newQuoteText = textInput.value.trim();
  const newQuoteCategory = categoryInput.value.trim();

  if (newQuoteText === "" || newQuoteCategory === "") {
    alert("Please fill in both fields.");
    return;
  }

  const newQuote = {
    text: newQuoteText,
    category: newQuoteCategory
  };

  quotes.push(newQuote);
  localStorage.setItem('quotes', JSON.stringify(quotes));

  textInput.value = "";
  categoryInput.value = "";

  populateCategories();  // Update dropdown
  showRandomQuote();     // Show updated quote
}

// Create dropdown from unique quote categories
function populateCategories() {
  const categorySelect = document.getElementById('categoryFilter');
  const currentCategory = localStorage.getItem('selectedCategory') || 'all';

  const categories = [...new Set(quotes.map(q => q.category))]; // <- uses map
  categorySelect.innerHTML = `<option value="all">All Categories</option>`;

  categories.forEach(category => {
    const option = document.createElement('option');
    option.value = category;
    option.textContent = category;
    categorySelect.appendChild(option);
  });

  categorySelect.value = currentCategory;
}

// Filter and display quotes by selected category
function filterQuotes() {
  const selectedCategory = document.getElementById('categoryFilter').value;
  localStorage.setItem('selectedCategory', selectedCategory);
  showRandomQuote();
}

// Save last viewed quote in sessionStorage
function saveToSessionStorage(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Export quotes to JSON
function exportToJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchorNode);
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Import quotes from uploaded JSON file
function importFromJSON(event) {
  const file = event.target.files[0];
  if (!file) {
    alert("No file selected.");
    return;
  }

  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes = importedQuotes;
        localStorage.setItem('quotes', JSON.stringify(quotes));
        populateCategories();
        showRandomQuote();
      } else {
        alert("Invalid JSON format.");
      }
    } catch (error) {
      alert("Error reading file: " + error.message);
    }
  };
  reader.readAsText(file);
}

// Create the add-quote form dynamically
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter quote text';

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteButton';
  addButton.textContent = 'Add Quote';

  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  addButton.addEventListener('click', addQuote);
}

// Initialize the app
document.addEventListener('DOMContentLoaded', function () {
  populateCategories();
  showRandomQuote();
  createAddQuoteForm();

  document.getElementById('showQuoteButton').addEventListener('click', showRandomQuote);
  document.getElementById('importFile').addEventListener('change', importFromJSON);
  document.getElementById('categoryFilter').addEventListener('change', filterQuotes);
});
