import { initStripe } from "@stripe/stripe-react-native"
import { useEnvironment } from "app/utils/hooks/useEnvironment"
import { useEffect } from "react"

export function useStripeConfig() {
  const publishableKey = useEnvironment().stripePublishableKey
  useEffect(() => {
    if (publishableKey) {
      initStripe({ publishableKey })
    }
  }, [publishableKey])
}
