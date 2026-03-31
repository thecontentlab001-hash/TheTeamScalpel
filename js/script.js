// Immediate Preloader Safety Logic (Outside any listeners)
const preloader = document.getElementById('preloader');
const hidePreloader = () => {
  if (preloader) {
    preloader.classList.add('fade-out');
    setTimeout(() => { preloader.style.display = 'none'; }, 600);
  }
};

// Immediate Safety Timeout: Hide after 3.5s regardless of load event
const safetyTimeout = setTimeout(hidePreloader, 3500);

window.addEventListener('load', () => {
  clearTimeout(safetyTimeout);
  setTimeout(hidePreloader, 500);
});

// ==========================================
// AI Chat Assistant System (Injected Early)
// ==========================================
const injectAI = () => {
  if (document.getElementById('aiChatWidget')) return;
  const fabChatBtn = document.getElementById('openChatBtn');
  if (fabChatBtn) {
    const chatHTML = `
      <div class="chat-widget" id="aiChatWidget">
        <div class="chat-header">
          <div style="display:flex; flex-direction:column;">
            <h4>Virtual Assistant</h4>
            <span style="font-size:0.7rem; color:rgba(255,255,255,0.7);">Multi-lingual Support Enabled</span>
          </div>
          <div class="chat-controls">
            <button class="voice-toggle" id="voiceToggleBtn" title="Toggle Voice Feedback"><i class="fas fa-volume-up"></i></button>
            <button class="close-chat" id="closeChatBtn">&times;</button>
          </div>
        </div>
        <div class="chat-body" id="chatBody">
          <div class="chat-msg bot">Hello! I am Dr. Agarwal's AI Assistant. How can I help you today? Please feel free to type or speak to me in your preferred language. <br><br><em>(Disclaimer: Not for emergency medical use.)</em></div>
          <div class="typing-indicator" id="typingIndicator">
            <span></span><span></span><span></span>
          </div>
        </div>
        <div class="chat-footer">
          <button class="mic-btn" id="micBtn" title="Voice Typing"><i class="fas fa-microphone"></i></button>
          <input type="text" class="chat-input" id="chatInput" placeholder="Describe symptoms or speak..." autocomplete="off">
          <button class="chat-send" id="chatSendBtn"><i class="fas fa-paper-plane"></i></button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', chatHTML);
    initializeAI();
  }
};

const initializeAI = () => {
  const chatWidget = document.getElementById('aiChatWidget');
  const fabChatBtn = document.getElementById('openChatBtn');
  const closeBtn = document.getElementById('closeChatBtn');
  const voiceToggleBtn = document.getElementById('voiceToggleBtn');
  const micBtn = document.getElementById('micBtn');
  const chatBody = document.getElementById('chatBody');
  const chatInput = document.getElementById('chatInput');
  const chatSendBtn = document.getElementById('chatSendBtn');
  const typingIndicator = document.getElementById('typingIndicator');

  let isVoiceEnabled = localStorage.getItem('aiVoiceEnabled') === 'true';
  voiceToggleBtn.innerText = isVoiceEnabled ? '🔊' : '🔇';

  const loadVoices = () => { window.speechSynthesis.getVoices(); };
  if (window.speechSynthesis.onvoiceschanged !== undefined) window.speechSynthesis.onvoiceschanged = loadVoices;
  loadVoices();

  const speakText = (text) => {
    if (!isVoiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const cleanText = text.replace(/<[^>]*>?/gm, '');
    const utterance = new SpeechSynthesisUtterance(cleanText);
    const targetLang = document.getElementById('languageSelect')?.value || 'en';
    const langMap = { 'hi': 'hi-IN' };
    const locale = langMap[targetLang] || targetLang;
    utterance.lang = locale;
    const voices = window.speechSynthesis.getVoices();
    const matchedVoice = voices.find(v => v.lang === locale || v.lang.startsWith(targetLang)) || voices.find(v => v.default);
    if (matchedVoice) utterance.voice = matchedVoice;
    window.speechSynthesis.speak(utterance);
  };

  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  let recognition;
  if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.onstart = () => { micBtn.classList.add('active'); chatInput.placeholder = "Listening..."; };
    recognition.onresult = (event) => { chatInput.value = event.results[0][0].transcript; sendMessage(); };
    recognition.onend = () => { micBtn.classList.remove('active'); chatInput.placeholder = "Describe symptoms or speak..."; };
    recognition.onerror = () => { micBtn.classList.remove('active'); };
  }

  micBtn.addEventListener('click', () => {
    if (recognition) {
      const curLang = document.getElementById('languageSelect')?.value || 'en';
      const sttLangMap = { 'hi': 'hi-IN' };
      recognition.lang = sttLangMap[curLang] || curLang;
      try { recognition.start(); } catch(e) { recognition.stop(); }
    } else { alert("Voice typing is not supported in this browser."); }
  });

    voiceToggleBtn.addEventListener('click', () => {
    isVoiceEnabled = !isVoiceEnabled;
    localStorage.setItem('aiVoiceEnabled', isVoiceEnabled);
    voiceToggleBtn.innerHTML = isVoiceEnabled ? '<i class="fas fa-volume-up"></i>' : '<i class="fas fa-volume-mute"></i>';
    if (!isVoiceEnabled) window.speechSynthesis.cancel();
  });
  closeBtn.addEventListener('click', () => { chatWidget.classList.remove('active'); window.speechSynthesis.cancel(); });

  const sendMessage = () => {
    const text = chatInput.value.trim();
    if (!text) return;
    const userMsg = document.createElement('div');
    userMsg.className = 'chat-msg user';
    userMsg.innerText = text;
    chatBody.insertBefore(userMsg, typingIndicator);
    chatInput.value = '';
    chatBody.scrollTop = chatBody.scrollHeight;
    typingIndicator.style.display = 'block';
    setTimeout(() => {
      typingIndicator.style.display = 'none';
      const responseText = processNLP(text.toLowerCase());
      const botMsg = document.createElement('div');
      botMsg.className = 'chat-msg bot';
      botMsg.innerHTML = responseText;
      chatBody.insertBefore(botMsg, typingIndicator);
      chatBody.scrollTop = chatBody.scrollHeight;
      speakText(responseText);
    }, 1200);
  };

  chatSendBtn.addEventListener('click', sendMessage);
  chatInput.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
};

// Start AI Injection ASAP
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', injectAI);
} else {
  injectAI();
}

document.addEventListener('DOMContentLoaded', () => {
  // Initialize AOS with Elite Smoothing
  AOS.init({
    duration: 1000,
    easing: 'ease-out-quint',
    once: true,
    mirror: false,
    anchorPlacement: 'top-bottom',
  });

  try {
    // Awwwards-Level Custom Cursor
    const cursor = document.createElement('div');
    const follower = document.createElement('div');
    cursor.className = 'custom-cursor';
    follower.className = 'cursor-follower';
    document.body.appendChild(cursor);
    document.body.appendChild(follower);

    document.addEventListener('mousemove', (e) => {
      cursor.style.transform = `translate3d(${e.clientX - 4}px, ${e.clientY - 4}px, 0)`;
      follower.style.transform = `translate3d(${e.clientX - 20}px, ${e.clientY - 20}px, 0)`;
    });

    // Magnetic Buttons & Elements
    const magnets = document.querySelectorAll('.btn, .nav-brand, .social-link-item, .card:not(.video-card)');
    magnets.forEach((mag) => {
      mag.addEventListener('mousemove', (e) => {
        const rect = mag.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;
        mag.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
        follower.style.transform = `scale(1.5)`;
      });
      mag.addEventListener('mouseleave', () => {
        mag.style.transform = `translate(0, 0)`;
        follower.style.transform = `scale(1)`;
      });
    });

    // Text Reveal Interaction Observer
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('reveal-active');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('section').forEach(section => revealObserver.observe(section));

    // Custom Smooth Scroll Logic
    document.querySelectorAll('a[href^="#"]:not([href="#"])').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
          window.scrollTo({
            top: target.offsetTop - 80,
            behavior: 'smooth'
          });
        }
      });
    });
  } catch (e) {
    console.error("Elite Interactions Error:", e);
  }

  // Scroll Progress Bar
  const scrollElement = document.createElement('div');
  scrollElement.id = 'scrollProgress';
  document.body.appendChild(scrollElement);
  
  window.addEventListener('scroll', () => {
    const scrollPx = document.documentElement.scrollTop;
    const winHeightPx = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const scrolled = (scrollPx / winHeightPx) * 100;
    scrollElement.style.width = scrolled + '%';
  });

  // Mobile Menu Toggle
  const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  const body = document.body;
  
  if (mobileMenuBtn && navLinks) {
    const toggleMenu = () => {
      mobileMenuBtn.classList.toggle('active');
      navLinks.classList.toggle('active');
      body.classList.toggle('mobile-menu-active');
    };

    mobileMenuBtn.addEventListener('click', toggleMenu);

    // Close menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (navLinks.classList.contains('active')) {
          toggleMenu();
        }
      });
    });

    // Close menu when clicking outside (on the body/overlay)
    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') && 
          !navLinks.contains(e.target) && 
          !mobileMenuBtn.contains(e.target)) {
        toggleMenu();
      }
    });
  }

  // Navbar scroll state is managed by the class toggler in index.html or global styles

  // Appointment Form Submission Handler (Mailto)
  const appointmentForm = document.getElementById('appointmentForm');
  if (appointmentForm) {
    appointmentForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitBtn');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Preparing Email...';
      submitBtn.disabled = true;
      const formData = new FormData(appointmentForm);
      const data = Object.fromEntries(formData.entries());
      const doctorEmail = "bkdr.alokagrawal@gmail.com";
      const subject = `New Appointment Request: ${data.name || 'Patient'}`;
      let body = `Hello Dr. Alok Agarwal / Admin,\n\nA new appointment request has been submitted. Details below:\n\n--- PATIENT DETAILS ---\nName: ${data.name}\nPhone: ${data.phone}\nEmail: ${data.email}\nDate Requested: ${data.date}\nPreferred Time: ${data.time}\nService/Consultation Type: ${data.service}\n\n`;
      if(data.message && data.message.trim() !== "") body += `--- MEDICAL CONCERN ---\n${data.message}\n\n`;
      body += `Please contact the patient to confirm the appointment slot.\n\nSent from Elite Surgical Website.`;
      window.location.href = `mailto:${doctorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        alert("Your email client has been opened to send the request securely to Dr. Agarwal.");
        appointmentForm.reset();
      }, 500);
    });
  }

  // Feedback Form Submission Handler (Mailto)
  const feedbackForm = document.getElementById('feedbackForm');
  if (feedbackForm) {
    feedbackForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = document.getElementById('submitFeedbackBtn');
      const originalText = submitBtn.innerText;
      submitBtn.innerText = 'Preparing Review...';
      submitBtn.disabled = true;
      const formData = new FormData(feedbackForm);
      const data = Object.fromEntries(formData.entries());
      const doctorEmail = "bkdr.alokagrawal@gmail.com";
      const subject = `Patient Feedback: ${data.ptName} - ${data.rating} Stars`;
      let body = `Hello Dr. Alok Agarwal / Admin,\n\nA new patient review has been submitted via the website:\n\n--- FEEDBACK DETAILS ---\nPatient Name: ${data.ptName}\nTreatment: ${data.treatment}\nRating: ${data.rating} out of 5 Stars\n\n--- COMMENTS ---\n${data.review}\n\nThank you,\nElite Surgical Website Automated System.`;
      window.location.href = `mailto:${doctorEmail}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      setTimeout(() => {
        submitBtn.innerText = originalText;
        submitBtn.disabled = false;
        alert("Your email client has been opened to securely send your rating directly to the clinic. Thank you!");
        feedbackForm.reset();
      }, 500);
    });
  }
});

// Professional Surgical Diagnostic Engine
const CONDITION_DB = {
  hernia: { name: "Abdominal/Inguinal Hernia", keywords: ["bulge", "lump", "groin"], advice: "Avoid heavy lifting. Hernias require surgical Mesh Repair.", solution: "Laparoscopic Mesh Repair." },
  gallbladder: { name: "Gallstones (Cholelithiasis)", keywords: ["stone", "right side pain", "upper stomach"], advice: "Low-fat diet recommended. Sharp pain requires Cholecystectomy.", solution: "Laparoscopic Cholecystectomy." },
  proctology: { name: "Piles/Anal Fissure", keywords: ["blood", "piles", "fissure", "bleeding"], advice: "Increase fiber intake. Laser surgery is the painless solution.", solution: "Advanced Laser Surgery." },
  appendix: { name: "Acute Appendicitis", keywords: ["appendix", "lower right pain", "navel pain"], advice: "This is a surgical emergency. Seek clinical evaluation immediately.", solution: "Laparoscopic Appendectomy." }
};

let userAssessedTopic = null;
let diagnosticStep = 0;

function processNLP(input) {
  const text = input.toLowerCase();
  if (text.includes('hi') || text.includes('hello')) { diagnosticStep = 0; userAssessedTopic = null; return "Hello. I am the Elite Surgical Assistant. To provide guidance, please describe your symptoms."; }
  if (!userAssessedTopic) {
    for (const key in CONDITION_DB) {
      if (CONDITION_DB[key].keywords.some(kw => text.includes(kw))) { userAssessedTopic = CONDITION_DB[key]; diagnosticStep = 1; return `I understand. Tell me, do you have any sharp pain or fever?`; }
    }
    return "I have noted your concern. Could you clarify exactly where you feel the discomfort and for how long?";
  }
  if (diagnosticStep === 1) {
    const condition = userAssessedTopic;
    diagnosticStep = 0; userAssessedTopic = null;
    return `<strong>Assessment:</strong> Symptoms are clinically consistent with <strong>${condition.name}</strong>.<br><br><strong>Advice:</strong> ${condition.advice}<br><br><strong>Solution:</strong> ${condition.solution}<br><br><a href="appointment.html" class="btn btn-primary" style="display:inline-block; margin-top:0.5rem; font-size:0.85rem; padding:0.4rem 0.8rem;">Request Appointment</a>`;
  }
  return "Please provide more details so I can assist you better with professional surgical guidance.";
}

// ==========================================
// Global Language Translation Integration
// ==========================================
function googleTranslateElementInit() {
  new google.translate.TranslateElement({
    pageLanguage: 'en',
    autoDisplay: false
  }, 'google_translate_element');
}

function changeLanguage(lang) {
  // Retry logic if Google Translate hasn't loaded yet
  const attemptChange = (retries) => {
    const gtCombo = document.querySelector('.goog-te-combo');
    if (gtCombo) {
      gtCombo.value = lang;
      gtCombo.dispatchEvent(new Event('change'));
    } else if (retries > 0) {
      setTimeout(() => attemptChange(retries - 1), 500);
    }
  };
  attemptChange(10); // Attempt for 5 seconds
}

// Global initialization
document.addEventListener('DOMContentLoaded', () => {
  // 1. Inject hidden Google Translate element if not present
  if (!document.getElementById('google_translate_element')) {
    const gElement = document.createElement('div');
    gElement.id = 'google_translate_element';
    gElement.style.display = 'none';
    document.body.appendChild(gElement);
  }

  // 2. Load Google Translate script globally
  if (!document.querySelector('script[src*="translate.google.com"]')) {
    const gScript = document.createElement('script');
    gScript.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
    document.body.appendChild(gScript);
  }
});
