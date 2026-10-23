import { NextResponse, type NextRequest } from "next/server";

export async function proxy(request: NextRequest) {
  if (
    request.nextUrl.pathname === "/login" ||
    request.nextUrl.pathname === "/login/"
  ) {
    return NextResponse.next();
  }

  const token = request.cookies.get("access-token")?.value.trim();

  // Reject malformed cookie values before building an Authorization header.
  if (token && /^[\x21-\x7e]+$/.test(token)) {
    if (request.nextUrl.pathname === "/") {
      return NextResponse.redirect(new URL("/homePage", request.url));
    }

    return NextResponse.next();
  } else {
    const response = NextResponse.redirect(new URL("/login", request.url), 303);
    response.cookies.delete("access-token");
    response.headers.set("Cache-Control", "no-store");
    return response;
  }
}

export const config = {
  matcher: [
    "/((?!_next/static(?:/|$)|_next/image(?:/|$)|_next/webpack-hmr(?:/|$)|logos(?:/|$)|images(?:/|$)|webfonts(?:/|$)|favicon\\.ico$|robots\\.txt$|sitemap\\.xml$).*)",
  ],
};
