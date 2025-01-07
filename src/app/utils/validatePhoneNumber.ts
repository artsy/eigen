import { validatePhoneNumberQuery } from "__generated__/validatePhoneNumberQuery.graphql"
import { getRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { debounce } from "lodash"
import { useCallback, useEffect, useState } from "react"
import { fetchQuery, graphql } from "react-relay"

type PhoneNumber = {
  national: string
  regionCode: string
}

const validator = debounce(
  async ({ national, regionCode }: PhoneNumber, resolve: (value: boolean) => void) => {
    if (!national || national.length < 5 || !regionCode) {
      return resolve(false)
    }

    try {
      const response = await fetchQuery<validatePhoneNumberQuery>(
        getRelayEnvironment(),
        graphql`
          query validatePhoneNumberQuery($phoneNumber: String!, $regionCode: String) {
            phoneNumber(phoneNumber: $phoneNumber, regionCode: $regionCode) {
              isValid
            }
          }
        `,
        { phoneNumber: national, regionCode }
      ).toPromise()

      if (!response?.phoneNumber) {
        // Assume the phone number is valid if we can't validate it
        return resolve(true)
      }

      return resolve(!!response.phoneNumber.isValid)
    } catch (err) {
      console.error(err)

      // Assume the phone number is valid if we can't validate it
      return resolve(true)
    }
  },
  200
)

// Since the validator is debounced, we need to wrap in a parent promise
export const validatePhoneNumber = (phoneNumber: PhoneNumber): Promise<boolean> => {
  return new Promise((resolve) => {
    validator(phoneNumber, resolve)
  })
}

export const useValidatePhoneNumber = ({ national, regionCode }: PhoneNumber) => {
  const [isPhoneNumberValid, setIsPhoneNumberValid] = useState(true)

  const validate = useCallback(async () => {
    const isValid = await validatePhoneNumber({
      national,
      regionCode,
    })

    setIsPhoneNumberValid(isValid)
  }, [national, regionCode])

  useEffect(() => {
    validate()
  }, [national, regionCode, validate])

  return isPhoneNumberValid
}
