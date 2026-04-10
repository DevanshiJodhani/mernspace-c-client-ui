const INTERNAL_SERVICE_ROUTES = [
  {
    prefix: '/api/auth',
    envName: 'INTERNAL_AUTH_SERVICE_URL',
    defaultBaseUrl: 'http://auth-svc.auth.svc.cluster.local',
  },
  {
    prefix: '/api/catalog',
    envName: 'INTERNAL_CATALOG_SERVICE_URL',
    defaultBaseUrl: 'http://catalog-svc.catalog.svc.cluster.local',
  },
  {
    prefix: '/api/order',
    envName: 'INTERNAL_ORDER_SERVICE_URL',
    defaultBaseUrl: 'http://order-svc.order.svc.cluster.local',
  },
  {
    prefix: '/socket.io',
    envName: 'INTERNAL_WS_SERVICE_URL',
    defaultBaseUrl: 'http://ws-svc.ws.svc.cluster.local',
  },
] as const;

type ServerFetchInit = RequestInit & {
  next?: {
    revalidate?: number | false;
    tags?: string[];
  };
};

const RETRYABLE_NETWORK_CODES = new Set([
  'EAI_AGAIN',
  'ECONNREFUSED',
  'ECONNRESET',
  'ENOTFOUND',
]);

const joinUrl = (baseUrl: string, path: string) => {
  const normalizedBaseUrl =
    baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;

  return `${normalizedBaseUrl}${normalizedPath}`;
};

const getPublicApiUrl = (path: string) => {
  const publicBaseUrl =
    process.env.BACKEND_URL ?? process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!publicBaseUrl) {
    throw new Error(
      'Missing BACKEND_URL or NEXT_PUBLIC_BACKEND_URL configuration',
    );
  }

  return joinUrl(publicBaseUrl, path);
};

const getInternalApiUrl = (path: string) => {
  const matchedRoute = INTERNAL_SERVICE_ROUTES.find(({ prefix }) =>
    path.startsWith(prefix),
  );

  if (!matchedRoute) {
    return null;
  }

  const baseUrl =
    process.env[matchedRoute.envName] ?? matchedRoute.defaultBaseUrl;
  const internalPath = path.slice(matchedRoute.prefix.length) || '/';

  return joinUrl(baseUrl, internalPath);
};

const isRetryableNetworkError = (error: unknown) => {
  if (
    !(error instanceof Error) ||
    typeof error.cause !== 'object' ||
    error.cause === null
  ) {
    return false;
  }

  const code = 'code' in error.cause ? error.cause.code : undefined;

  return typeof code === 'string' && RETRYABLE_NETWORK_CODES.has(code);
};

export const fetchServerApi = async (path: string, init?: ServerFetchInit) => {
  const internalApiUrl = getInternalApiUrl(path);

  if (internalApiUrl) {
    try {
      return await fetch(internalApiUrl, init);
    } catch (error) {
      if (!isRetryableNetworkError(error)) {
        throw error;
      }
    }
  }

  return fetch(getPublicApiUrl(path), init);
};
