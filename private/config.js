window.CHEM112_CONFIG = {
  ALLOWED_WEEKS: [4,5,6,7,8,10],
  REQUIRE_DIGITS: 8,
  ENDPOINT: 'node', // we’ll use the 'node' slot for the Worker route
  ENDPOINTS: {
    node: '/api/ingest' // Worker route bound to your domain
  }
};
