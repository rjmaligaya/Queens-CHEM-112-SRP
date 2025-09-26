// private/config.js
// Site-wide configuration for CHEM112 SRP (overridable by environment if needed)
window.CHEM112_CONFIG = {
  // Functions endpoint (relative to domain)
  INGEST_URL: "/api/ingest",
  // Validation
  REQUIRE_DIGITS: 8,
  ALLOWED_WEEKS: [4,5,6,7,8,10],
  // Upload policy
  UPLOAD_ON_QUIT: true
};
