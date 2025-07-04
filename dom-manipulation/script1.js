// Initilize from localStorage or use default quotes
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  {text : "My vibe? Dark mode with strong encryption.", category: "Style"},
  {text : "Think like a user. Defend like a hacker. Solve like an engineer", category: "Mindset"},
  {text : "The best code is the one that never needs to be written.", category: "Efficiency"},
];

// Save quotes to localStorage 
function saveQuotes() {
    localStorage.setItem('quotes', JSON.stringify(quotes));
}

   // Display a random quote
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
    }
     // Add new quote
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
    saveQuotes();
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote();
}
// Export qotes to JSON file
function exportToJSON() {
    const dataStr = JSON.stringify(quotes, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = 'quotes.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

// Import quotes from JSON file
function importFromJSON(event) {
    const fileReader = new FileReader();
    fileReader.onload = function(e) {
        try {
            const importedQuotes = JSON.parse(e.target.result);
            if (Array.isArray(importedQuotes)) {
                quotes = importedQuotes;
                saveQuotes();
                showRandomQuote();
            } else {
                alert("Invalid file format. Please upload a valid JSON file.");
            }
        } catch (error) {
            alert("Error reading file: " + error.message);
        }
    };
    if (event.target.files && event.target.files[0]) {
        fileReader.readAsText(event.target.files[0]);
    }
}
// Attach event listeners
document.getElementById('showQuoteButton').addEventListener('click', showRandomQuote
);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);
document.getElementById('exportButton').addEventListener('click', exportToJSON);
document.getElementById('importButton').addEventListener('change', importFromJSON);
