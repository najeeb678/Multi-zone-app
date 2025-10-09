# Multi-Zone Authentication Implementation

## 🔐 Secure Cookie-Based Authentication

This implementation provides secure, domain-based authentication that works across all zones in the multi-zone application.

## How It Works

### 1. Authentication Flow

```
1. User logs in at http://localhost:3000 (host-app)
2. Host app generates secure session token
3. Cookie is set with appropriate domain configuration
4. All zones can access the shared authentication cookie
5. Middleware in each zone validates the cookie
6. Unauthorized users are redirected to host app login
```

### 2. Cookie Configuration

#### Development (localhost)

```javascript
// For localhost - no domain restriction
document.cookie = `sessionToken=${token}; path=/; SameSite=Lax; ${isSecure ? "Secure" : ""}`;
```

#### Production (actual domain)

```javascript
// For production - shared across subdomains
document.cookie = `sessionToken=${token}; path=/; domain=.yourdomain.com; SameSite=None; Secure`;
```

### 3. Domain Strategy

**Development Setup:**

- `localhost:3000` → host-app
- `localhost:3000/v2` → lastmile-app (via rewrites)
- `localhost:3000/v3` → fulfillment-app (via rewrites)
- Cookies work due to same origin

**Production Setup:**

- `yourdomain.com` → host-app
- `yourdomain.com/v2` → lastmile-app (via rewrites)
- `yourdomain.com/v3` → fulfillment-app (via rewrites)
- Cookie domain: `.yourdomain.com` (shared across all)

**Alternative Production Setup (subdomains):**

- `app.yourdomain.com` → host-app
- `lastmile.yourdomain.com` → lastmile-app
- `fulfillment.yourdomain.com` → fulfillment-app
- Cookie domain: `.yourdomain.com` (shared across all)

## Implementation Details

### 1. Shared Authentication Utilities (`utils/auth.js`)

```javascript
// Common auth configuration
export const AUTH_CONFIG = {
  COOKIE_NAME: "sessionToken",
  PRODUCTION_DOMAIN: process.env.NEXT_PUBLIC_AUTH_DOMAIN || "yourdomain.com",
  SECURE_COOKIES: process.env.NODE_ENV === "production",
};

// Server-side authentication check (middleware)
export function isAuthenticated(request) {
  const sessionToken = request.cookies.get(AUTH_CONFIG.COOKIE_NAME);
  return sessionToken && sessionToken.value.startsWith("session_");
}

// Client-side authentication check
export function checkClientAuth() {
  // Check if cookie exists and is valid
}
```

### 2. Middleware Protection

Each zone has middleware that:

- Checks for valid authentication cookie
- Redirects unauthenticated users to host app
- Allows authenticated users to proceed
- Skips static assets and API routes

### 3. Login Component Features

- **Smart Cookie Setting**: Automatically detects localhost vs production
- **Secure Token Generation**: Creates unique session tokens
- **Domain Detection**: Sets appropriate cookie domain
- **Cross-Zone Navigation**: Provides links to other zones
- **Authentication Status**: Shows current auth state

## Security Features

### 1. Cookie Security

- **HttpOnly**: Not implemented (needed for client-side access)
- **Secure**: Enabled in production (HTTPS only)
- **SameSite**:
  - `Lax` for localhost (same-origin)
  - `None` for production with `Secure` (cross-site)

### 2. Token Security

- **Unique Tokens**: Each login generates a new token
- **Timestamp**: Tokens include creation timestamp
- **Random Component**: Cryptographically random suffix

### 3. Middleware Security

- **Route Protection**: Only authenticated users access zones
- **Automatic Redirect**: Seamless redirect to login
- **Static Asset Bypass**: Performance optimization

## Production Deployment

### 1. Environment Variables

Set these in production:

```bash
NEXT_PUBLIC_AUTH_DOMAIN=yourdomain.com
NODE_ENV=production
```

### 2. Domain Configuration

**Option A: Path-based routing (Recommended)**

```
yourdomain.com       → host-app
yourdomain.com/v2    → lastmile-app
yourdomain.com/v3    → fulfillment-app
```

**Option B: Subdomain-based routing**

```
app.yourdomain.com       → host-app
lastmile.yourdomain.com  → lastmile-app
fulfillment.yourdomain.com → fulfillment-app
```

### 3. Cookie Domain Settings

For path-based: Cookie domain = `.yourdomain.com`
For subdomain-based: Cookie domain = `.yourdomain.com`

## Testing Authentication

### 1. Test Flow

1. Start all three zones
2. Visit `http://localhost:3000`
3. Log in with any credentials
4. Navigate to zones via links
5. Verify authentication status displays
6. Test logout from any zone
7. Verify all zones require re-authentication

### 2. Expected Behavior

**Authenticated State:**

- ✅ Green authentication status box
- 🔑 Session token displayed
- 🚀 Access to all zones
- 🔄 Shared state across zones

**Unauthenticated State:**

- ❌ Red authentication status (if shown)
- 🚫 Redirect to login when accessing zones
- 🔒 No access to protected content

## Troubleshooting

### Common Issues

1. **Cookie not shared between zones**

   - Check domain configuration
   - Verify SameSite settings
   - Ensure Secure flag for HTTPS

2. **Middleware not triggered**

   - Check middleware configuration
   - Verify matcher patterns
   - Check static asset exclusions

3. **Authentication not persisting**
   - Check cookie expiration
   - Verify token format
   - Check browser cookie settings

### Debug Tools

- Browser DevTools → Application → Cookies
- Console logs in middleware
- Authentication status components
- Network tab for redirects

## Future Enhancements

1. **Token Validation**: Server-side token verification
2. **Token Refresh**: Automatic token renewal
3. **Session Management**: Centralized session store
4. **Role-Based Access**: Different permissions per zone
5. **SSO Integration**: External authentication providers
