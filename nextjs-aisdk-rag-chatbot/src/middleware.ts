import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';


const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
const isAdminRoute = createRouteMatcher(["/upload"]);

export default clerkMiddleware(async (auth, req) => {
  const { sessionClaims } = await auth()
  const isAdmin = sessionClaims?.metadata?.role === "admin"

  if (isAdminRoute(req) && !isAdmin) {
    const url = new URL("/", req.url);
    return NextResponse.redirect(url);
  }

 if (!isPublicRoute(req)) {
     await auth.protect();
  }

});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};


//=====================================================================================================

// import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
// import { NextResponse } from 'next/server';


// const isPublicRoute = createRouteMatcher(["/", "/sign-in(.*)", "/sign-up(.*)"]);
// const isAdminRoute = createRouteMatcher(["/upload"]);


// export default clerkMiddleware(async (auth, req) => {
//   const { sessionClaims, userId } = await auth();
//   const isAdmin = sessionClaims?.metadata?.role === "admin";

//   const url = new URL(req.url);

//   // ✅ Redirect logged-in users from "/" to "/chat"
//   if (userId && url.pathname === "/") {
//     return NextResponse.redirect(new URL("/chat", req.url));
//   }

//   // ✅ Protect admin route
//   if (isAdminRoute(req) && !isAdmin) {
//     return NextResponse.redirect(new URL("/", req.url));
//   }

//   // ✅ Protect private routes
//   if (!isPublicRoute(req)) {
//     await auth.protect();
//   }
// });


// export const config = {
//   matcher: [
//     '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
//     '/(api|trpc)(.*)',
//   ],
// };