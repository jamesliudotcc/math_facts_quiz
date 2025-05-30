/**
 * Test utilities for the Math Facts Quiz application
 */

import { JSDOM } from 'jsdom';
import fs from 'node:fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Sets up a JSDOM environment for testing
 * @returns {Promise<JSDOM>} The JSDOM instance
 */
export async function setupDOM() {
  // Load HTML content
  const htmlContent = await fs.readFile(
    path.resolve(__dirname, '../index.html'),
    'utf-8'
  );

  // Create a JSDOM instance
  const dom = new JSDOM(htmlContent, {
    url: 'http://localhost/',
    runScripts: 'outside-only',
  });

  return dom;
}

/**
 * Waits for a specified time (useful for timeout testing)
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
