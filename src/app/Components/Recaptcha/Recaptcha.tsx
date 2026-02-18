import { Box } from "@artsy/palette-mobile"
import { RecaptchaWebView } from "app/Components/Recaptcha/RecaptchaWebView"
import { useCallback, useState } from "react"

type State = "idle" | "error" | undefined
type UseRecaptchaProps = { source: string; action: string }

export const useRecaptcha = ({ source, action }: UseRecaptchaProps) => {
  const [token, setToken] = useState<string | undefined>()
  const [tokenTimestamp, setTokenTimestamp] = useState<number | undefined>()
  const [state, setState] = useState<State>()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleOnToken = useCallback((token: string) => {
    setToken(token)
    setTokenTimestamp(Date.now())
  }, [])

  const handleOnError = useCallback(
    (error: string) => {
      console.log(`[Recaptcha error [${source} for action ${action}]`, error)
      setState("error")
    },
    [action, source]
  )

  // Check if token is still valid (tokens expire after ~2 minutes)
  const isTokenValid = useCallback(() => {
    if (!token || !tokenTimestamp) return false
    const age = Date.now() - tokenTimestamp
    return age < 120000 // 2 minutes in milliseconds
  }, [token, tokenTimestamp])

  // Refresh the token by remounting the WebView
  const refreshToken = useCallback(() => {
    setToken(undefined)
    setTokenTimestamp(undefined)
    setState(undefined)
    setRefreshKey((prev) => prev + 1)
  }, [])

  interface RecaptchaComponentProps {
    active?: boolean
  }

  const RecaptchaComponent: React.FC<RecaptchaComponentProps> = useCallback(
    ({ active }) => {
      if (!active) {
        return null
      }

      return (
        <Box height={0}>
          <RecaptchaWebView
            key={refreshKey}
            action={action}
            onToken={handleOnToken}
            onError={handleOnError}
          />
        </Box>
      )
    },
    [refreshKey, action, handleOnToken, handleOnError]
  )

  return { Recaptcha: RecaptchaComponent, token, state, isTokenValid, refreshToken }
}
