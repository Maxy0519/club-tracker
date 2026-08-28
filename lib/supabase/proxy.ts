import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

export async function updateSession(
  request: NextRequest
) {
  let response = NextResponse.next({
    request,
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(
            ({ name, value }) => {
              request.cookies.set(name, value);
            }
          );

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options
              );
            }
          );
        },
      },
    }
  );

  const { data } =
    await supabase.auth.getClaims();

  const userId = data?.claims?.sub;

  const pathname =
    request.nextUrl.pathname;

  const isLoginPage =
    pathname.startsWith("/login");

  const isAuthRoute =
    pathname.startsWith("/auth");

  // Not signed in:
  // send protected pages to /login.
  if (
    !userId &&
    !isLoginPage &&
    !isAuthRoute
  ) {
    const url = request.nextUrl.clone();

    url.pathname = "/login";

    return NextResponse.redirect(url);
  }

  // Already signed in:
  // don't show login page again.
  if (userId && isLoginPage) {
    const url = request.nextUrl.clone();

    url.pathname = "/clubs";

    return NextResponse.redirect(url);
  }

  return response;
}