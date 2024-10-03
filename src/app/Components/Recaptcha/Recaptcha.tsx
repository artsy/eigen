import { RecaptchaWebView } from "app/Components/Recaptcha/RecaptchaWebView"
import { useCallback, useState } from "react"

type State = "idle" | "error" | undefined
type UseRecaptchaProps = { source: string; action: string }

export const useRecaptcha = ({ source, action }: UseRecaptchaProps) => {
  const [token, setToken] = useState<string | undefined>()
  const [state, setState] = useState<State>()

  const handleOnToken = (token: string) => {
    if (state !== "idle") {
      setState("idle")
      setToken(token)
    }
  }

  const handleOnError = (error: string) => {
    console.log(`[Recaptcha error [${source} for action ${action}]`, error)
    setState("error")
  }

  const RecaptchaComponent = useCallback(
    () => <RecaptchaWebView action={action} onToken={handleOnToken} onError={handleOnError} />,
    [action]
  )

  return { Recaptcha: RecaptchaComponent, token, state }
}
