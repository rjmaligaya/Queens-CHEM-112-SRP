// Private hosting configuration
window.CHEM112_CONFIG = {
  ALLOWED_WEEKS: [4,5,6,7,8,10],
  REQUIRE_DIGITS: 8,
  // Choose one of: 'auto', 'node', 'php', 'netlify'
  ENDPOINT: 'auto',
  // Endpoints map
  ENDPOINTS: {
    node: '/api/ingest',         // Node/Express server
    php:  '/upload.php',          // PHP upload
    netlify: '/.netlify/functions/ingest' // Netlify function
  }
};
