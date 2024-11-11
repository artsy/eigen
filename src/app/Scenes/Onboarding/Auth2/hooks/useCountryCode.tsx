import { useCountryCodeQuery } from "__generated__/useCountryCodeQuery.graphql"
import { useClientQuery } from "app/utils/useClientQuery"
import { graphql } from "react-relay"

const USE_COUNTRY_CODE_QUERY = graphql`
  query useCountryCodeQuery {
    requestLocation {
      countryCode
    }
  }
`

export const useCountryCode = () => {
  const { data, loading, error } = useClientQuery<useCountryCodeQuery>({
    query: USE_COUNTRY_CODE_QUERY,
    cacheConfig: {
      networkCacheConfig: {
        force: false,
      },
    },
  })

  const countryCode = data?.requestLocation?.countryCode

  const isAutomaticallySubscribed = !!(countryCode && !GDPR_COUNTRY_CODES.includes(countryCode))

  return {
    countryCode,
    error,
    isAutomaticallySubscribed,
    loading,
  }
}

export const GDPR_COUNTRY_CODES = [
  "AT",
  "BE",
  "BG",
  "CY",
  "CZ",
  "DE",
  "DK",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "HR",
  "HU",
  "IE",
  "IT",
  "LT",
  "LU",
  "LV",
  "MT",
  "NL",
  "PL",
  "PT",
  "RO",
  "SE",
  "SI",
  "SK",
]
