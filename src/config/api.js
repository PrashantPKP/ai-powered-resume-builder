// Central API configuration
// Set VITE_API_BASE_URL in .env to switch between local and production
const API_BASE = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const API_URLS = {
  // AI endpoints
  AI_CHATBOT:                `${API_BASE}/api/ai/chatbot`,
  AI_SUGGEST_IMPROVEMENTS:   `${API_BASE}/api/ai/suggest-improvements`,
  AI_GENERATE_SUGGESTIONS:   `${API_BASE}/api/ai/generate-profile-suggestions`,
  AI_ENHANCE_CONTENT:        `${API_BASE}/api/ai/enhance-content`,
  AI_COMPLETE_RESUME:        `${API_BASE}/api/ai/complete-resume`,
  AI_GENERATE_KEYWORDS:      `${API_BASE}/api/ai/generate-keywords`,
  AI_TEST:                   `${API_BASE}/api/ai/test-ai`,

  // PDF endpoint
  PDF_GENERATE:              `${API_BASE}/api/pdf/generate-pdf`,
};

export default API_BASE;
