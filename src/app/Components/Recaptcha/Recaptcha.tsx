import { Box } from "@artsy/palette-mobile"
import { RecaptchaWebView } from "app/Components/Recaptcha/RecaptchaWebView"
import { useCallback, useState } from "react"

type State = "idle" | "error" | undefined
type UseRecaptchaProps = { source: string; action: string }

export const useRecaptcha = ({ source, action }: UseRecaptchaProps) => {
  const [token, setToken] = useState<string | undefined>()
  const [state, setState] = useState<State>()

  const handleOnToken = (token: string) => {
    setToken(token)
  }

  const handleOnError = (error: string) => {
    console.log(`[Recaptcha error [${source} for action ${action}]`, error)
    setState("error")
  }

  interface RecaptchaComponentProps {
    active?: boolean
  }

  const RecaptchaComponent: React.FC<RecaptchaComponentProps> = useCallback(({ active }) => {
    if (!active) {
      return null
    }

    return (
      <Box height={0}>
        <RecaptchaWebView action={action} onToken={handleOnToken} onError={handleOnError} />
      </Box>
    )
  }, [])

  return { Recaptcha: RecaptchaComponent, token, state }
}
