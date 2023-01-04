// import PropTypes from 'prop-types';

// import ErrorPage, { PAGE_TYPES } from '@mindtickle/error-page';
// import NetworkError from '@mindtickle/error-page/NetworkError';
// import { generateFallback as generateErrorFallback } from '@mindtickle/hocs/withErrorHandler';

// const ErrorHandler = ({ reset: tryAgain, error }) => {
//   if (error?.data?.statusCode) {
//     return (
//       <NetworkError
//         statusCode={error.data.statusCode}
//         propsToPass={{
//           showLogo: false,
//           tryAgain: () => tryAgain(),
//         }}
//       />
//     );
//   }

//   return (
//     <ErrorPage
//       pageType={PAGE_TYPES.CLIENT_ERROR}
//       tryAgain={() => tryAgain()}
//       showLogo={false}
//       showGoToHome={false}
//     />
//   );
// };

// ErrorHandler.propTypes = {
//   error: PropTypes.object,
//   resetError: PropTypes.func,
//   Component: PropTypes.oneOfType([PropTypes.element, PropTypes.func]).isRequired,
// };

// export default generateErrorFallback(ErrorHandler);
export default () => <>ErrorHandler</>