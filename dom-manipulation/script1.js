// Initialize quotes from localStorage 
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  { text: "My vibe? Dark mode with strong encryption.", category: "Style" },
  { text: "Think like a user. Defend like a hacker. Solve like an engineer.", category: "Mindset" },
  { text: "The best code is the one that never needs to be written.", category: "Efficiency" },
];

// Display a random quote and save it to sessionStorage
function showRandomQuote() {
  const quoteDisplay = document.getElementById('quoteDisplay');

  if (quotes.length === 0) {
    quoteDisplay.innerHTML = "No quotes available.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <blockquote>${randomQuote.text}</blockquote>
    <p class="category"><em>${randomQuote.category}</em></p>
  `;

  saveToSessionStorage(randomQuote); 
}

// Add a new quote and update localStorage
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
  localStorage.setItem('quotes', JSON.stringify(quotes)); // Save to localStorage

  textInput.value = "";
  categoryInput.value = "";

  showRandomQuote();
}

// Save the last viewed quote to sessionStorage
function saveToSessionStorage(quote) {
  sessionStorage.setItem('lastViewedQuote', JSON.stringify(quote));
}

// Export all quotes to a downloadable JSON file
function exportToJSON() {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "quotes.json");
  document.body.appendChild(downloadAnchorNode); // Required for Firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
}

// Import quotes from a JSON file
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

// Dynamically create the Add Quote form
function createAddQuoteForm() {
  const formContainer = document.getElementById('formContainer');

  // Clear any existing content
  formContainer.innerHTML = '';

  const textInput = document.createElement('input');
  textInput.id = 'newQuoteText';
  textInput.placeholder = 'Enter quote text';
  textInput.required = true;

  const categoryInput = document.createElement('input');
  categoryInput.id = 'newQuoteCategory';
  categoryInput.placeholder = 'Enter quote category';
  categoryInput.required = true;

  const addButton = document.createElement('button');
  addButton.id = 'addQuoteButton';
  addButton.textContent = 'Add Quote';

  // Append inputs and button to the form container
  formContainer.appendChild(textInput);
  formContainer.appendChild(categoryInput);
  formContainer.appendChild(addButton);

  // Add event listener to the button
  addButton.addEventListener('click', addQuote);
}
