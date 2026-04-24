# HerbWise Security Hardening - Complete Guide

## 🔒 Security Improvements Implemented

This document outlines all security fixes applied to the HerbWise application.

---

## 1. ✅ Frontend Security Fixes

### 1.1 Centralized API Client (`src/lib/api.js`)
**What was fixed:** All API calls now go through a centralized, secure client instead of hardcoded URLs.

- ✅ Input validation function: `validateInput()`
- ✅ Authentication token injection: Sends Bearer tokens in Authorization header
- ✅ Environment-based API URL: Uses `VITE_API_BASE_URL` from .env
- ✅ Error handling: Doesn't leak sensitive details

**Before:**
```javascript
run("http://localhost:8000/analyze/stream", { condition })
```

**After:**
```javascript
import { validateInput, authenticatedFetch } from "../lib/api"
const validated = validateInput(condition)
run("/analyze/stream", { condition: validated })
```

### 1.2 Environment Variables (`frontend/.env`)
**What was fixed:** All hardcoded URLs are now configurable.

```env
VITE_SUPABASE_URL=https://usjlxqvfgaqjzbhwhvow.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGc...
VITE_API_BASE_URL=http://localhost:8000
```

**For production:**
```env
VITE_API_BASE_URL=https://your-api-domain.com/api
```

### 1.3 Input Validation on All Pages
**What was fixed:** All user inputs are now validated before sending to backend.

```javascript
try {
  const validated = validateInput(condition)
  run("/analyze/stream", { condition: validated })
} catch (err) {
  alert(`Invalid input: ${err.message}`)
}
```

**Validation rules:**
- Max 500 characters
- No special characters: `<`, `>`, `{`, `}`, `[`, `]`, backticks
- No injection patterns: `<script>`, `javascript:`, `onerror=`, `eval(`, etc.

---

## 2. ✅ Backend Security Fixes

### 2.1 Environment Variables (`backend/.env`)
**What was fixed:** All API keys are now stored securely in environment variables.

```env
GROQ_API_KEY=your_groq_api_key_here
GEMINI_API_KEY=your_gemini_api_key_here
UPSTASH_REDIS_REST_URL=your_redis_url_here
UPSTASH_REDIS_REST_TOKEN=your_redis_token_here
```

### 2.2 Startup Environment Validation (`utils/security.py`)
**What was fixed:** Backend checks all required environment variables on startup.

```
❌ Startup Error: Missing required environment variables: GROQ_API_KEY, GEMINI_API_KEY
exit(1)
```

Fails fast if any required keys are missing.

### 2.3 Restricted CORS Configuration
**What was fixed:** CORS is now locked down to only allow your frontend.

**Before:**
```python
allow_origins=["http://localhost:3000", "http://localhost:5173"],
allow_methods=["*"],  # ALL methods
allow_headers=["*"],  # ALL headers
```

**After:**
```python
allow_origins=["http://localhost:5173"],  # Only dev frontend
allow_methods=["POST"],  # Only POST for API calls
allow_headers=["Content-Type", "Authorization"],  # Only needed headers
```

### 2.4 Rate Limiting Middleware
**What was fixed:** API is protected against brute force and DDoS attacks.

```python
RATE_LIMIT_MAX_REQUESTS = 20  # per minute
RATE_LIMIT_WINDOW = 60  # seconds
```

**Response when rate limited:**
```
HTTP 429 Too Many Requests
"Rate limit exceeded. Maximum 20 requests per minute."
```

### 2.5 Input Validation on All Endpoints
**What was fixed:** Server-side validation ensures data integrity.

```python
from utils.security import (
    validate_input_string,
    validate_integer_input,
    validate_float_input,
)

@app.post("/analyze/stream")
async def wellness_search(body: BaseInput, request: Request):
    try:
        condition = validate_input_string(body.condition)
        age = validate_integer_input(body.age, min_val=1, max_val=120)
        weight = validate_float_input(body.weight_kg, min_val=1, max_val=500)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
```

**Validation rules:**
- Strings: 1-500 characters, no injection patterns
- Integers: Within reasonable ranges (age 1-120, weight 1-500kg)
- Floats: Within reasonable ranges
- All dangerous patterns blocked

### 2.6 Authentication Token Verification
**What was fixed:** API now accepts and validates JWT tokens from Supabase.

```python
from utils.security import verify_auth_token

auth_header = request.headers.get("Authorization")
user_id = verify_auth_token(auth_header)  # Bearer token validation
```

**Token format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.7 Error Message Sanitization
**What was fixed:** Errors no longer expose sensitive system details.

```python
from utils.security import sanitize_error_message

try:
    # process request
except Exception as e:
    error_msg = sanitize_error_message(e)  # Safe for client
    raise HTTPException(status_code=500, detail=error_msg)
```

**What gets hidden:**
- File paths
- Database connection strings
- Internal service names
- Stack traces

---

## 🚨 CRITICAL: Action Items for User

### Immediate (DO THIS NOW):

1. **Regenerate All API Keys**
   - All credentials were exposed in previous development
   - ⚠️ Current keys should be considered compromised
   
   **For each service:**
   - [ ] Groq: https://console.groq.com → Regenerate API key
   - [ ] Gemini: https://aistudio.google.com → Create new API key
   - [ ] Upstash Redis: https://console.upstash.com → Rotate auth tokens
   - [ ] Supabase: https://supabase.com → Create new service role key
   
2. **Update Environment Files**
   - [ ] Fill in `backend/.env` with new API keys
   - [ ] Keep `frontend/.env` with frontend URL only (no secrets)
   - [ ] Never commit `.env` files to git

3. **Verify .gitignore**
   ```bash
   # Check .gitignore includes:
   .env
   .env.local
   .env.*.local
   __pycache__/
   .venv/
   node_modules/
   ```

---

## 📋 Production Deployment Checklist

- [ ] Update `VITE_API_BASE_URL` to production backend domain
- [ ] Update CORS `allow_origins` to include only production frontend domain
- [ ] Set `ENVIRONMENT=production` in backend/.env
- [ ] Enable HTTPS/TLS on all domains
- [ ] Set `DEBUG=false` in backend/.env
- [ ] Rotate all API keys
- [ ] Use strong passwords for Supabase, Redis, etc.
- [ ] Enable 2FA on all service dashboards
- [ ] Monitor rate limiting thresholds
- [ ] Set up error logging/monitoring (e.g., Sentry)
- [ ] Test auth flow with signed-in users
- [ ] Test guest limit enforcement

---

## 🔧 Testing Security

### Test Input Validation
```bash
# Valid request
curl -X POST http://localhost:8000/analyze/stream \
  -H "Content-Type: application/json" \
  -d '{"condition": "headache"}'

# Invalid - too long
curl -X POST http://localhost:8000/analyze/stream \
  -H "Content-Type: application/json" \
  -d '{"condition": "aaaaaa....(>500 chars)...aaaa"}'
# Expected: 400 Bad Request

# Invalid - injection attempt
curl -X POST http://localhost:8000/analyze/stream \
  -H "Content-Type: application/json" \
  -d '{"condition": "<script>alert(1)</script>"}'
# Expected: 400 Bad Request
```

### Test Rate Limiting
```bash
# Make 25 requests in quick succession
for i in {1..25}; do
  curl -X POST http://localhost:8000/analyze/stream \
    -H "Content-Type: application/json" \
    -d '{"condition": "test"}' &
done
wait

# Expected: First 20 succeed, rest get 429 Too Many Requests
```

### Test CORS
```bash
# Request from disallowed origin
curl -X POST http://localhost:8000/analyze/stream \
  -H "Origin: https://malicious-site.com" \
  -H "Content-Type: application/json" \
  -d '{"condition": "test"}'
# Expected: CORS error
```

---

## 📚 Code Changes Summary

### Frontend Files Updated
- `src/lib/api.js` - NEW - Centralized secure API client
- `src/hooks/usePipeline.js` - Updated to use authenticated fetch
- `frontend/.env` - Added VITE_API_BASE_URL
- `src/pages/*.jsx` - All pages updated with:
  - Input validation
  - Authenticated API calls
  - Error handling

### Backend Files Updated
- `utils/security.py` - NEW - Security utilities module
- `main.py` - Updated with:
  - Environment validation on startup
  - Restricted CORS
  - Rate limiting middleware
  - Input validation on all endpoints
  - Error sanitization
  - Auth token verification
- `backend/.env` - NEW - Environment variable template

---

## 🔐 Security Best Practices Going Forward

1. **Never hardcode secrets** - Use environment variables
2. **Always validate on server** - Never trust client validation alone
3. **Use HTTPS everywhere** - Especially for authenticated requests
4. **Rotate keys regularly** - At least quarterly
5. **Monitor rate limits** - Adjust thresholds based on usage
6. **Log security events** - Failed auth attempts, injection attempts, etc.
7. **Keep dependencies updated** - Run `npm audit` and `pip --audit` regularly
8. **Use security headers** - Add CSP, X-Frame-Options, etc.
9. **Test security** - Include security test cases in CI/CD
10. **Review Supabase RLS** - Ensure row-level security is properly configured

---

## 📖 Additional Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Supabase Security](https://supabase.com/docs/guides/auth)
- [FastAPI Security](https://fastapi.tiangolo.com/tutorial/security/)
- [Authentication Best Practices](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Last Updated:** April 21, 2026  
**Security Level:** Hardened for Development  
**Next Review:** Before Production Deployment
