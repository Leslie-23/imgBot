// Global variables
let currentQuote = "";
const loadingIndicator = document.getElementById("loading-indicator");

// Fetch a funny quote from the API
async function fetchFunnyQuote() {
  try {
    showLoading(true);
    const response = await fetch(
      "https://v2.jokeapi.dev/joke/Miscellaneous?type=single"
    );

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    const data = await response.json();
    showLoading(false);
    return data.joke;
  } catch (error) {
    console.error("Error fetching funny quote:", error);
    showLoading(false);
    return "Failed to fetch funny quote. Please try again later.";
  }
}

// Update the quote on the page
async function updateFunnyQuote() {
  const quoteText = document.getElementById("quote-text");

  // Add fade-out effect
  quoteText.style.opacity = "0";

  // Fetch new quote
  currentQuote = await fetchFunnyQuote();

  // Update text and fade in
  setTimeout(() => {
    quoteText.textContent = currentQuote;
    quoteText.style.opacity = "1";
  }, 300);
}

// Show or hide loading indicator
function showLoading(isLoading) {
  if (isLoading) {
    loadingIndicator.style.display = "flex";
  } else {
    loadingIndicator.style.display = "none";
  }
}

// Share the current quote
function shareQuote() {
  if (navigator.share && currentQuote) {
    navigator
      .share({
        title: "Daily Quote Bot",
        text: currentQuote + " - Shared from Daily Quote Bot",
        url: window.location.href,
      })
      .then(() => console.log("Quote shared successfully"))
      .catch((error) => console.log("Error sharing quote:", error));
  } else {
    // Fallback for browsers that don't support the Web Share API
    const tempInput = document.createElement("textarea");
    tempInput.value = currentQuote + " - Shared from Daily Quote Bot";
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);

    alert("Quote copied to clipboard!");
  }
}

// Handle contact form submission
function handleContactFormSubmit(event) {
  event.preventDefault();

  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;

  // In a real application, you would send this data to a server
  console.log("Form submitted:", { name, email, message });

  // Show success message
  alert(`Thank you, ${name}! Your message has been received.`);

  // Reset form
  event.target.reset();
}

// Smooth scrolling for navigation links
function setupSmoothScrolling() {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault();

      const targetId = this.getAttribute("href");
      const targetElement = document.querySelector(targetId);

      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop,
          behavior: "smooth",
        });
      }
    });
  });
}

// Initialize the application
function initApp() {
  // Set up event listeners
  document
    .getElementById("nextButton")
    .addEventListener("click", updateFunnyQuote);
  document.getElementById("shareButton").addEventListener("click", shareQuote);
  document
    .getElementById("contact-form")
    .addEventListener("submit", handleContactFormSubmit);

  // Set up smooth scrolling
  setupSmoothScrolling();

  // Add CSS transitions for quote text
  const quoteText = document.getElementById("quote-text");
  quoteText.style.transition = "opacity 0.3s ease";

  // Load the first quote
  updateFunnyQuote();
}

// Run initialization when the DOM is fully loaded
window.addEventListener("DOMContentLoaded", initApp);
