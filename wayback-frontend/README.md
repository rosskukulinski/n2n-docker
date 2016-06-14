Wayback Frontned
## HTTP API

### GET :3001/version
Returns the current version string (from package.json)

### GET :3001/healthz
Returns 200 with no content if healthy
Returns 500 with error message if not healthy

### GET /

Requests the homepage
