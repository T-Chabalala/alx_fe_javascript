async function syncQuotes() {
  const serverQuotes = await fetchQuotesFromServer();
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
  } else {
    showSyncNotification();
  }
}

function showSyncNotification() {
  const notification = document.createElement('div');
  notification.className = 'notification';
  notification.textContent = 'Quotes synced with server!';
  document.body.insertBefore(notification, document.body.firstChild);
  setTimeout(() => notification.remove(), 3000);
}
