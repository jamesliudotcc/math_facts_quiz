/**
 * Spaced Repetition System (SRS) logic based on SM-2 algorithm
 */

/**
 * @typedef {Object} SRSMetadata
 * @property {number} nextReview - Timestamp (ms)
 * @property {number} interval - Days until next review
 * @property {number} easeFactor - Multiplier for interval
 * @property {number} repetitions - Number of consecutive correct answers
 */

const FAST_RESPONSE_THRESHOLD = 3000; // 3 seconds

/**
 * Updates the SRS stats for a given problem
 * @param {Object.<string, SRSMetadata>} stats - Current stats object
 * @param {string} problemKey - "factor1,factor2,operator"
 * @param {boolean} isCorrect - Whether the answer was correct
 * @param {number} responseTime - Time taken to answer in ms
 * @returns {Object.<string, SRSMetadata>} Updated stats object
 */
export function updateSRSStats(stats, problemKey, isCorrect, responseTime) {
  const newStats = { ...stats };
  const current = newStats[problemKey] || {
    repetitions: 0,
    interval: 0,
    easeFactor: 2.5,
    nextReview: 0
  };

  let { repetitions, interval, easeFactor } = current;

  if (!isCorrect) {
    repetitions = 0;
    interval = 1;
  } else {
    // Determine "quality" (0-5) based on correctness and speed
    // 5: perfect response (< 3s)
    // 4: correct response after a hesitation (> 3s)
    // 3: correct response with serious difficulty
    let quality = responseTime < FAST_RESPONSE_THRESHOLD ? 5 : 4;

    if (repetitions === 0) {
      interval = 1;
    } else if (repetitions === 1) {
      interval = 6;
    } else {
      interval = Math.round(interval * easeFactor);
    }

    repetitions++;
    easeFactor = easeFactor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    if (easeFactor < 1.3) easeFactor = 1.3;
  }

  // Convert interval (days) to timestamp
  const nextReview = Date.now() + interval * 24 * 60 * 60 * 1000;

  newStats[problemKey] = {
    repetitions,
    interval,
    easeFactor,
    nextReview
  };

  return newStats;
}
