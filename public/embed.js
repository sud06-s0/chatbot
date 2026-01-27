(function() {
  'use strict';

  // Configuration
  const WIDGET_URL = 'https://your-widget.vercel.app'; // Replace after deployment
  const WIDGET_ID = 'intent-chatbot-root';

  // Prevent multiple initializations
  if (document.getElementById(WIDGET_ID)) {
    console.warn('Intent Chatbot Widget already initialized');
    return;
  }

  // Create container div
  const container = document.createElement('div');
  container.id = WIDGET_ID;
  document.body.appendChild(container);

  // Load CSS
  const link = document.createElement('link');
  link.rel = 'stylesheet';
  link.href = `${WIDGET_URL}/assets/index.css`;
  document.head.appendChild(link);

  // Load JavaScript
  const script = document.createElement('script');
  script.type = 'module';
  script.src = `${WIDGET_URL}/assets/index.js`;
  script.async = true;
  script.onerror = function() {
    console.error('Failed to load Intent Chatbot Widget');
  };
  document.head.appendChild(script);

  console.log('Intent Chatbot Widget initialized');
})();