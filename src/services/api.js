const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const API_KEY = import.meta.env.VITE_API_KEY;

// ============================================
// DEBUG LOGGING (Removes after testing)
// ============================================
console.log('🔍 Frontend API Configuration:');
console.log('  Base URL:', API_BASE_URL);
console.log('  API Key (first 15 chars):', API_KEY ? API_KEY.substring(0, 15) + '...' : '❌ MISSING');
console.log('  API Key (full):', API_KEY);
console.log('  All env vars:', import.meta.env);
// ============================================

// Helper: Make API request
const apiRequest = async (endpoint, method = 'GET', body = null) => {
  const fullUrl = `${API_BASE_URL}${endpoint}`;
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': API_KEY,
    },
  };

  if (body) {
    options.body = JSON.stringify(body);
  }

  // Debug log for each request
  console.log(`📡 API Request: ${method} ${fullUrl}`);
  console.log('  Headers:', options.headers);
  if (body) console.log('  Body:', body);

  try {
    const response = await fetch(fullUrl, options);
    
    console.log(`📥 API Response: ${response.status} ${response.statusText}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ API Error Response:', errorText);
      throw new Error(`API Error: ${response.status} - ${errorText}`);
    }
    
    const data = await response.json();
    console.log('✅ API Success:', data);
    return data;
    
  } catch (error) {
    console.error('❌ API Request failed:', error);
    throw error;
  }
};

// Initialize session
export const initSession = async (sessionId, pageType, domain = window.location.hostname) => {
  return apiRequest('/tracking/init', 'POST', {
    sessionId,
    pageType,
    timestamp: new Date().toISOString(),
  });
};

// Send behavioral signal
export const sendSignal = async (sessionId, signalType, data, pageType) => {
  return apiRequest('/tracking/signal', 'POST', {
    sessionId,
    signalType,
    data,
    pageType,
    timestamp: new Date().toISOString(),
  });
};

// Check intent status
export const checkIntentStatus = async (sessionId) => {
  return apiRequest(`/tracking/status/${sessionId}`, 'GET');
};

// Start chat conversation
export const startChat = async (sessionId, intentType) => {
  return apiRequest('/chat/start', 'POST', {
    sessionId,
    intentType,
  });
};

// Send chat message
export const sendMessage = async (conversationId, message, isButton = false) => {
  return apiRequest('/chat/message', 'POST', {
    conversationId,
    message,
    isButton,
    timestamp: new Date().toISOString(),
  });
};

// Get conversation history
export const getConversation = async (conversationId) => {
  return apiRequest(`/chat/conversation/${conversationId}`, 'GET');
};

// Escalate to human
export const escalateToHuman = async (conversationId, reason) => {
  return apiRequest('/chat/escalate', 'POST', {
    conversationId,
    reason,
  });
};

// Get full context for LLM
export const getContext = async (sessionId) => {
  return apiRequest(`/chat/context/${sessionId}`, 'GET');
};
