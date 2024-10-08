(function () {
  emailjs.init("LxgRU5dnYA5avqHae"); // Replace YOUR_USER_ID with your user ID from EmailJS
})();

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', (event) => {
    event.preventDefault(); // Avoid default form submission

    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const message = document.getElementById('message').value.trim();

    let isValid = true;

    // Clear previous error messages
    const errorElements = form.querySelectorAll('.error');
    errorElements.forEach(el => el.remove());

    // Validate Name
    if (name === '') {
      showError('name', 'Name is required.');
      isValid = false;
    }

    // Validate Email
    if (email === '') {
      showError('email', 'Email is required.');
      isValid = false;
    } else if (!validateEmail(email)) {
      showError('email', 'Invalid email format.');
      isValid = false;
    }

    // Validate Phone
    if (phone === '') {
      showError('phone', 'Phone number is required.');
      isValid = false;
    } else if (!validatePhone(phone)) {
      showError('phone', 'Invalid phone number format.');
      isValid = false;
    }

    // Validate Message
    if (message === '') {
      showError('message', 'Message is required.');
      isValid = false;
    }

    if (isValid) {
      // If the form is valid, send the email
      emailjs.sendForm('service_5y0d8pb', 'template_suh6ft9', form)
        .then(function (response) {
          console.log('Success:', response);
          alert('Email sent successfully!');
          form.reset();
        }, function (error) {
          console.log('Failed:', error);
          alert('Failed to send email.');
        });
    } else {
      event.preventDefault(); // Prevent form submission if validation fails
    }
  });

  function showError(inputId, message) {
    const inputElement = document.getElementById(inputId);
    const errorElement = document.createElement('div');
    errorElement.className = 'error';
    errorElement.textContent = message;
    inputElement.parentElement.insertBefore(errorElement, inputElement.nextSibling);
  }

  function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  function validatePhone(phone) {
    const re = /^\d{10}$/; // Example: validates 10-digit phone numbers
    return re.test(phone);
  }
});

// Header effect
let header = document.querySelector("header");
window.addEventListener("scroll", function () {
  if (window.pageYOffset > 10) {
    header.style.transform = "translateY(-100%)";
  }
  if (window.pageYOffset < 10) {
    header.style.transform = "translateY(0px)";
  }
  if (window.pageYOffset > 300) {
    header.style.transform = "translateY(0px)";
  }
});

'use strict';

const cards = document.querySelectorAll('.card1');

cards.forEach(card => {
  const icon = card.querySelector('.heading-icon'); // Εύρεση του εικονιδίου μέσα στην κάρτα

  card.addEventListener('mouseenter', () => {
    icon.classList.add('fa-spin');
  });

  card.addEventListener('mouseleave', () => {
    icon.classList.remove('fa-spin');
  });
});


// document.getElementById('card2').addEventListener('click', function() {
//   window.scrollTo({
//     top: 0,
//     behavior: 'smooth' // Αυτό κάνει το scroll να είναι ομαλό
//   });
// });

/// Επιλογή στοιχείων
const modal = document.getElementById("videoModal");
const closeModal = document.getElementsByClassName("close")[0];
const video = document.getElementById("modalVideo");
const videoSource = document.getElementById("videoSource");

// Ορισμός των πηγών βίντεο για κάθε κάρτα
const videos = {
  openModal1: './PhotokinisiPresentation.mp4',
  openModal2: './EshopPresentation.mp4'
};

// Άνοιγμα modals για τις κάρτες και ενημέρωση του βίντεο
document.getElementById("openModal1").onclick = function() {
  openModalWithVideo("openModal1");
};

document.getElementById("openModal2").onclick = function() {
  openModalWithVideo("openModal2");
};

// Συνάρτηση για άνοιγμα του modal και ανανέωση του βίντεο
function openModalWithVideo(modalId) {
  videoSource.src = videos[modalId];
  video.load(); // Επαναφόρτωση του νέου βίντεο
  modal.style.display = "flex";
}

// Κλείσιμο του modal και παύση του βίντεο
closeModal.onclick = function() {
  modal.style.display = "none";
  video.pause();
  video.currentTime = 0;
};

// Κλείσιμο του modal όταν κάνεις κλικ έξω από αυτό
window.onclick = function(event) {
  if (event.target == modal) {
    modal.style.display = "none";
    video.pause();
    video.currentTime = 0;
  }
};
