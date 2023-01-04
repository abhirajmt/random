import { gql } from "@apollo/client";
import { DEVICE_FRAG } from "./fragments";

export const GET_ACTIVE_DASHBOARD_NB = gql`
  ${DEVICE_FRAG}
  query GetActiveDashboard(
    $isWeb: Boolean!
    $isMobile: Boolean!
    $isTablet: Boolean!
  ) {
    user {
      getUser {
        hasAccessibleModules: hasContent(filter: { type: MODULE })
        dashboard {
          id
          localeUrl
          name
          description
          devices {
            web @include(if: $isWeb) {
              ...deviceFrag
            }
            tablet @include(if: $isTablet) {
              ...deviceFrag
            }
            mobile @include(if: $isMobile) {
              ...deviceFrag
            }
          }
        }
      }
    }
  }
`;

export default `
${DEVICE_FRAG}
query GetActiveDashboard($isWeb: Boolean!, $isMobile: Boolean!, $isTablet: Boolean!) {
  user {
    getUser {
      hasAccessibleModules: hasContent(filter: { type: MODULE })
      dashboard {
        id
        localeUrl
        name
        description
        devices {
          web @include(if: $isWeb) {
            ...deviceFrag
          }
          tablet @include(if: $isTablet) {
            ...deviceFrag
          }
          mobile @include(if: $isMobile) {
            ...deviceFrag
          }
        }
      }
    }
  }
}
`;
