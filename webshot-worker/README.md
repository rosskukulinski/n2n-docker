Simple Webshot app

## HTTP API

### GET /version
Returns the current version string (from package.json)

### GET /healthz
Returns 200 with no content if healthy
Returns 500 with error message if not healthy

### GET /?url=https://github.com/rosskukulinski

Requests a new screenshot of the specified page.  The raw png image is
streamed back.
