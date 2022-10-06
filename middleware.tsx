import { getToken } from "next-auth/jwt";
import { NextRequest, NextResponse } from "next/server";

// export async function middleware(req: NextRequest) {
//   const token = await getToken({ req, secret: process.env.JWT_SECRET });
//   const url = req.nextUrl.clone();
//   // console.log(url);
//   const { pathname } = req.nextUrl;

//   if (pathname.includes("/api/auth") || token) {
//     return NextResponse.next();
//   }

//   if (!token && pathname !== "/login") {
//     url.pathname = "/login";
//     return NextResponse.rewrite(new URL("/login", url));
//   }
// }
export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const token = await getToken({ req, secret: process.env.JWT_SECRET });
  const { pathname } = req.nextUrl;

  if (pathname.startsWith("/_next/") || pathname.includes(".")) {
    // static files
    return;
  }
  if (token && pathname === "/login") {
    url.pathname = "/";
    return NextResponse.redirect(url);
  }
  if (pathname.includes("/api/auth") || token) {
    return NextResponse.next();
  }

  if (!token && pathname !== "/login") {
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }
}
