import { type NextRequest, NextResponse } from "next/server";
import {
  HOME_ROUTE,
  LOGIN_ROUTE,
  SESSION_COOKIE_NAME,
} from "@/utils/constants";

/**
 * Takes a URL path and converts it into a matching regex
 *
 * @example
 *   /users/:userid/posts/:postid becomes `/users/${wild}/posts/${wild}`
 *
 * @param path - The URL path
 * @returns The matching regex
 */
const regex = (path: string): RegExp => {
  // Replace each :parameterName with a ([^/]+) capturing group
  const regexPattern = path.replace(/:[^/]+/g, "([^/]+)");

  // Escape slashes
  const regexEscaped = regexPattern.replace(/\//g, "\\/");

  // Construct regex and ensure match from start to end
  const regexPath = new RegExp("^" + regexEscaped + "$");

  return new RegExp(regexPath);
};

/**
 * Takes a URL path and checks if it matches any route in routes
 *
 * @example
 *   /users/asdf matches ["/users/:userid"]
 *
 * @param path - The URL path
 * @param routes - A route or an array of routes to check against
 * @returns Whether path matches any route in routes
 */
const match = (path: string, routes: string[] | string): boolean => {
  if (typeof routes === "string") {
    return regex(routes).test(path);
  } else {
    return routes.some((route) => regex(route).test(path));
  }
};

/** All valid routes in the website */
const routes = {
  /** Routes related to authentication */
  authPaths: [
    "/auth/:oobcode/reset-password",
    "/auth/:oobcode/verify-email",
    "/auth/forgot-password",
    "/auth/login",
    "/auth/send-verify-email",
    "/auth/signup",
  ],

  /** Users can access */
  userPaths: ["/about"],

  /** Users can access only in certain conditions; admins can access */
  userRestrictedPaths: ["/users/:userid"],

  /** Admins can access */
  adminPaths: ["/dashboard"],

  /** Anyone can access */
  publicPaths: ["/"],
};

export const middleware = (request: NextRequest) => {
  /**
   * The current session cookie
   *
   * NOTE: the value of the cookie represents the custom claim of the user. For
   * example, a cookie value "user" means user-level permissions while a cookie
   * value "admin" means admin-level permissions.
   */
  const authenticated = request.cookies.get(SESSION_COOKIE_NAME)?.value
    ? true
    : false;
  const claims = request.cookies.get(SESSION_COOKIE_NAME)?.value || "";

  /** URL path */
  const path = request.nextUrl.pathname;

  // Define redirects
  const redirectLogin = NextResponse.redirect(
    new URL(LOGIN_ROUTE, request.nextUrl.origin)
  );
  const redirectHome = NextResponse.redirect(
    new URL(HOME_ROUTE, request.nextUrl.origin)
  );

  switch (true) {
    // Auth paths
    // - Public : YES
    // - Users  : NO
    // - Admins : NO
    case match(path, routes.authPaths):
      if (authenticated) {
        return redirectHome;
      }
      break;

    // User paths
    // - Public : NO
    // - Users  : YES
    // - Admins : YES
    case match(path, routes.userPaths):
      if (!authenticated) {
        return redirectLogin;
      }
      break;

    // User restricted paths
    // - Public : NO
    // - Users  : YES (in some cases)
    // - Admins : YES
    case match(path, routes.userRestrictedPaths):
      if (!authenticated) {
        return redirectLogin;
      } else if (
        authenticated &&
        claims?.user &&
        match(path, "/users/:userid")
      ) {
        console.log("check for access");
      }
      // Everyone else can access
      break;

    // Admin paths
    // - Public : NO
    // - Users  : NO
    // - Admins : YES
    case match(path, routes.adminPaths):
      if (!authenticated) {
        return redirectLogin;
      } else if (authenticated && !claims?.admin) {
        return redirectHome;
      }
      break;

    // Public paths
    // - Public : YES
    // - Users  : YES
    // - Admins : YES
    case match(path, routes.publicPaths):
      break;

    // Default case
    // - Public : YES
    // - Users  : YES
    // - Admins : YES
    default:
      break;
  }
};

export const config = {
  /** Paths that are handled by the middleware */
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
