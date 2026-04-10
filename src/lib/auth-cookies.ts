import { cookies } from 'next/headers';

const AUTH_COOKIE_NAMES = ['accessToken', 'refreshToken'] as const;

type AuthCookieName = (typeof AUTH_COOKIE_NAMES)[number];
type SameSite = 'lax' | 'strict' | 'none';
type ParsedSetCookie = {
  name: string;
  value: string;
  domain?: string;
  expires?: Date;
  httpOnly: boolean;
  path?: string;
  sameSite?: SameSite;
  secure: boolean;
};

const getSameSite = (sameSite?: string): SameSite => {
  if (!sameSite) {
    return 'lax';
  }

  const normalizedSameSite = sameSite.toLowerCase();

  if (
    normalizedSameSite === 'strict' ||
    normalizedSameSite === 'lax' ||
    normalizedSameSite === 'none'
  ) {
    return normalizedSameSite;
  }

  return 'lax';
};

export const syncAuthCookiesFromResponse = async (response: Response) => {
  const setCookieHeaders = response.headers.getSetCookie();
  const parsedCookies = setCookieHeaders
    .map((header) => {
      const [nameValuePair, ...attributeParts] = header.split(';');
      const [rawName, ...rawValueParts] = nameValuePair.split('=');
      const name = rawName.trim();
      const value = rawValueParts.join('=').trim();

      if (!name || !value) {
        return null;
      }

      const parsedCookie: ParsedSetCookie = {
        name,
        value,
        httpOnly: false,
        secure: false,
      };

      for (const attributePart of attributeParts) {
        const trimmedAttributePart = attributePart.trim();
        const [rawAttributeName, ...rawAttributeValueParts] =
          trimmedAttributePart.split('=');
        const attributeName = rawAttributeName.toLowerCase();
        const attributeValue = rawAttributeValueParts.join('=').trim();

        switch (attributeName) {
          case 'domain':
            parsedCookie.domain = attributeValue || undefined;
            break;
          case 'expires':
            parsedCookie.expires =
              attributeValue ? new Date(attributeValue) : undefined;
            break;
          case 'httponly':
            parsedCookie.httpOnly = true;
            break;
          case 'path':
            parsedCookie.path = attributeValue || undefined;
            break;
          case 'samesite':
            parsedCookie.sameSite = getSameSite(attributeValue);
            break;
          case 'secure':
            parsedCookie.secure = true;
            break;
          default:
            break;
        }
      }

      return parsedCookie;
    })
    .filter(
      (parsedCookie): parsedCookie is ParsedSetCookie => parsedCookie !== null,
    )
    .filter((parsedCookie) =>
      AUTH_COOKIE_NAMES.includes(parsedCookie.name as AuthCookieName),
    );

  if (parsedCookies.length !== AUTH_COOKIE_NAMES.length) {
    return false;
  }

  const cookieStore = await cookies();

  for (const parsedCookie of parsedCookies) {
    const sameSite = parsedCookie.sameSite ?? 'lax';

    cookieStore.set({
      name: parsedCookie.name,
      value: parsedCookie.value,
      expires: parsedCookie.expires,
      httpOnly: parsedCookie.httpOnly || true,
      path: parsedCookie.path ?? '/',
      secure: parsedCookie.secure || sameSite === 'none',
      sameSite,
    });
  }

  return true;
};
