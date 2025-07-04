// Intial quote array
const quotes = [
  {text : " My vibe? Dark mode with strong encrypyion.", category: "Style"},
  {text : "Think like a user. Defend like a hacker. Solve like  an engineer", category: "Mindset"},
  {text : "The best code is the one that never needs to be written.", category: "Efficiency"},
];

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
// Optionally display the new quote 
showRandomQuote();

// Attach event listeners
document.getElementById('showQuoteButton').addEventListener('click', showRandomQuote);
document.getElementById('addQuoteButton').addEventListener('click', addQuote);

// Inital quote display
showRandomQuote();