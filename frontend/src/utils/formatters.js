/**
 * MedGuide AI — Utility Formatters
 * Formatting helpers for time, confidence, and markdown section parsing.
 */

/**
 * Format elapsed milliseconds into a human-readable string.
 * @param {number} ms - Elapsed time in milliseconds
 * @returns {string} e.g. "1.2s" or "450ms"
 */
export function formatElapsedTime(ms) {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

/**
 * Convert a float score (0-1) to a readable percentage.
 * @param {number} score - Confidence score between 0 and 1
 * @returns {string} e.g. "87%"
 */
export function formatConfidence(score) {
  if (score == null || isNaN(score)) return 'N/A';
  return `${Math.round(score * 100)}%`;
}

/**
 * Get a color class based on confidence score.
 * @param {number} score - Confidence score between 0 and 1
 * @returns {string} Tailwind color class
 */
export function getConfidenceColor(score) {
  if (score >= 0.8) return 'text-emerald-600';
  if (score >= 0.6) return 'text-amber-500';
  return 'text-red-500';
}

/**
 * Get a background color class based on confidence score.
 * @param {number} score - Confidence score between 0 and 1
 * @returns {string} Tailwind bg class
 */
export function getConfidenceBg(score) {
  if (score >= 0.8) return 'bg-emerald-50';
  if (score >= 0.6) return 'bg-amber-50';
  return 'bg-red-50';
}

/**
 * Parse a markdown answer string into sections for structured display.
 * Splits on ## headings and returns an array of { title, content } objects.
 * @param {string} markdown - The raw markdown answer from the LLM
 * @returns {Array<{ title: string, content: string }>}
 */
export function parseMarkdownSections(markdown) {
  if (!markdown) return [];

  const lines = markdown.split('\n');
  const sections = [];
  let currentSection = null;

  for (const line of lines) {
    const headingMatch = line.match(/^#{1,3}\s+(.+)$/);
    if (headingMatch) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = {
        title: headingMatch[1].trim(),
        content: '',
      };
    } else if (currentSection) {
      currentSection.content += line + '\n';
    } else {
      // Content before any heading becomes the intro
      if (!sections.length && line.trim()) {
        if (!currentSection) {
          currentSection = { title: '', content: '' };
        }
        currentSection.content += line + '\n';
      }
    }
  }

  if (currentSection) {
    sections.push(currentSection);
  }

  // Trim trailing whitespace from content
  return sections.map((s) => ({
    ...s,
    content: s.content.trimEnd(),
  }));
}

/**
 * Truncate text to a given max length with ellipsis.
 * @param {string} text
 * @param {number} maxLength
 * @returns {string}
 */
export function truncateText(text, maxLength = 120) {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength).trimEnd() + '…';
}

/**
 * Format a source type badge label.
 * @param {string} sourceType - "local" or "web"
 * @returns {string}
 */
export function formatSourceType(sourceType) {
  if (sourceType === 'web') return 'Web Source';
  return 'Clinical Guideline';
}

/**
 * Generate a unique ID.
 * @returns {string}
 */
export function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
