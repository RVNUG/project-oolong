/**
 * Implement Gatsby's Browser APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/browser-apis/
 */

// You can delete this file if you're not using it

// Temporarily disable image plugins that require sharp
// This is to workaround the ARM64 compatibility issue
exports.onClientEntry = () => {
  console.log('Gatsby started');
};
