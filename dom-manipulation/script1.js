// Initilize from localStorage.setItem
let quotes = JSON.parse(localStorage.getItem('quotes')) || [
  {text : " My vibe? Dark mode with strong encrypyion.", category: "Style"},
  {text : "Think like a user. Defend like a hacker. Solve like  an engineer", category: "Mindset"},
  {text : "The best code is the one that never needs to be written.", category: "Efficiency"},
];

// Save quotes to localStorage.setItem
function saveQuotes() {
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

    //Add new quote
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
    textInput.value = "";
    categoryInput.value = "";
    showRandomQuote();
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
// Save to sessionStorage(last viewed)
function saveToSessionStorage() {
    sessionStorage.setItem('lastViewedQuote', JSON.stringify(quotes));
}
// Export quotes to JSON file
function exportToJSON() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(quotes, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "quotes.json");
    document.body.appendChild(downloadAnchorNode); // required for firefox
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
// Import quotes from JSON file
function importFromJSON(event) {
    const file = event.target.files[0];
    if (!file) {
        alert("No file selected.");
        return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
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
