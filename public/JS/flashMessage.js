console.log("Flash-Skript geladen");

const flashMessages = document.querySelectorAll(".flash-message");

flashMessages.forEach((msg) => {
  setTimeout(() => {
    msg.style.transition = "opacity 0.5s ease";
    msg.style.opacity = "0";
    setTimeout(() => msg.remove(), 500);
  }, 3000);
});
