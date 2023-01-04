// import ErrorPage, { PAGE_TYPES } from '@mindtickle/error-page';

// import { generateFallback as generateErrorFallback } from '@mindtickle/hocs/withErrorHandler';

// export const DEFAULT_ERROR_FALLBACK = generateErrorFallback(() => (
//   <ErrorPage pageType={PAGE_TYPES.CLIENT_ERROR} />
// ));

export const DEFAULT_ERROR_FALLBACK = () => "error fallback";

export const RESTRICT_IMPERSONATION_URL = '/new/ui/restrictions/impersonation';

export const AL_FEATURE_COOKIE = 'AL-feature';
