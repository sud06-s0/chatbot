// Generate unique session ID
export const generateSessionId = () => {
  return `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
};

// Get or create session ID from sessionStorage
export const getSessionId = () => {
  let sessionId = sessionStorage.getItem('intent_chatbot_session');
  if (!sessionId) {
    sessionId = generateSessionId();
    sessionStorage.setItem('intent_chatbot_session', sessionId);
  }
  return sessionId;
};

// Detect page type from URL
export const detectPageType = () => {
  const path = window.location.pathname.toLowerCase();
  const url = window.location.href.toLowerCase();
  
  if (path.includes('pricing') || url.includes('pricing')) return 'pricing';
  if (path.includes('product') || url.includes('product')) return 'product';
  if (path.includes('docs') || path.includes('documentation')) return 'docs';
  if (path.includes('about') || url.includes('about')) return 'about';
  if (path.includes('contact') || url.includes('contact')) return 'contact';
  if (path.includes('blog') || url.includes('blog')) return 'blog';
  
  return 'other';
};

// Calculate scroll depth percentage
export const getScrollDepth = () => {
  const windowHeight = window.innerHeight;
  const documentHeight = document.documentElement.scrollHeight;
  const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
  
  const scrollDepth = (scrollTop / (documentHeight - windowHeight)) * 100;
  return Math.min(Math.round(scrollDepth), 100);
};

// Get time spent on page (in seconds)
export const getTimeOnPage = (startTime) => {
  return Math.floor((Date.now() - startTime) / 1000);
};

// Sanitize user input
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input.trim().slice(0, 500); // Max 500 chars
};

// Format timestamp
export const formatTimestamp = () => {
  return new Date().toISOString();
};