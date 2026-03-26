export { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";

/**
 * Standalone login URL generator
 * For development: uses /api/dev/login
 * For production: uses /api/oauth/callback with your OAuth provider
 */
export const getLoginUrl = () => {
  // For development, use the dev login endpoint
  if (import.meta.env.DEV) {
    return "/api/dev/login?email=dev@example.com&name=Developer";
  }

  // For production, you can implement your OAuth provider
  // Example with Auth0:
  // const oauthPortalUrl = import.meta.env.VITE_OAUTH_PORTAL_URL;
  // const appId = import.meta.env.VITE_APP_ID;
  // const redirectUri = `${window.location.origin}/api/oauth/callback`;
  // const state = btoa(redirectUri);
  // const url = new URL(`${oauthPortalUrl}/app-auth`);
  // url.searchParams.set("appId", appId);
  // url.searchParams.set("redirectUri", redirectUri);
  // url.searchParams.set("state", state);
  // return url.toString();

  // For now, redirect to dev login
  return "/api/dev/login";
};

/**
 * Get logout URL
 */
export const getLogoutUrl = () => {
  return "/api/dev/logout";
};
