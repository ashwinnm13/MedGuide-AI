/**
 * MedGuide AI — API Service Layer
 * Centralized API client for communicating with the FastAPI backend.
 */

import { API_BASE_URL } from '../utils/constants';

/**
 * Generic fetch wrapper with error handling.
 * @param {string} endpoint - API endpoint path (e.g. "/chat")
 * @param {object} options  - Fetch options
 * @returns {Promise<any>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;

  const config = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorBody = await response.text().catch(() => '');
    throw new Error(
      `API Error ${response.status}: ${response.statusText}${errorBody ? ` — ${errorBody}` : ''}`
    );
  }

  return response.json();
}

/**
 * Submit a clinical query to the chat endpoint.
 * Returns { answer, sources, verification }.
 * @param {string} query - The user's clinical question
 * @param {number} topK  - Number of documents to retrieve (default 5)
 * @returns {Promise<{ answer: string, sources: Array, verification: object|null }>}
 */
export async function submitQuery(query, topK = 5) {
  return request('/chat', {
    method: 'POST',
    body: JSON.stringify({ query, top_k: topK }),
  });
}

/**
 * Retrieve documents without generating an answer.
 * Returns { results: RetrievedChunk[] }.
 * @param {string} query - Search query
 * @param {number} topK  - Number of results
 * @returns {Promise<{ results: Array }>}
 */
export async function retrieveDocuments(query, topK = 5) {
  return request('/retrieve', {
    method: 'POST',
    body: JSON.stringify({ query, top_k: topK }),
  });
}

/**
 * Check backend health status.
 * @returns {Promise<{ status: string }>}
 */
export async function checkHealth() {
  return request('/health', { method: 'GET' });
}
