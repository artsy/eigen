import { useEnvironment } from "app/utils/hooks/useEnvironment"
import { useEffect } from "react"
// @ts-expect-error no typings
import stripe from "tipsi-stripe"

export function useStripeConfig() {
  const publishableKey = useEnvironment().stripePublishableKey
  useEffect(() => {
    stripe.setOptions({ publishableKey })
  }, [publishableKey])
}
