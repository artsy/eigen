import { RecaptchaAction, RecaptchaClient } from "@google-cloud/recaptcha-enterprise-react-native"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { useCallback, useEffect, useRef, useState } from "react"
import { getRecaptchaClient } from "./RecaptchaClientProvider"

type State = "idle" | "loading" | "error" | undefined
type UseRecaptchaProps = { source: string; action: string }

const getRecaptchaAction = (action: string) => {
  switch (action) {
    case "verify_email":
      return RecaptchaAction.custom("verify_email")
    case "login":
      return RecaptchaAction.LOGIN()
    case "signup":
      return RecaptchaAction.SIGNUP()
    default:
      return RecaptchaAction.custom(action)
  }
}

export const useRecaptcha = ({ source, action }: UseRecaptchaProps) => {
  const [token, setToken] = useState<string | undefined>()
  const [tokenTimestamp, setTokenTimestamp] = useState<number | undefined>()
  const [state, setState] = useState<State>()
  const isStaging = useIsStaging()
  const recaptchaClientRef = useRef<RecaptchaClient>(null)

  const executeRecaptcha = useCallback(async () => {
    try {
      setState("loading")

      if (!recaptchaClientRef.current) {
        recaptchaClientRef.current = await getRecaptchaClient(isStaging)
      }

      const recaptchaAction = getRecaptchaAction(action)
      const newToken = await recaptchaClientRef.current.execute(recaptchaAction, 10000)

      setToken(newToken)
      setTokenTimestamp(Date.now())
      setState("idle")
    } catch (error) {
      console.log(`[Recaptcha error [${source} for action ${action}]`, error)
      setState("error")
    }
  }, [action, source, isStaging])

  // Initialize and execute on mount
  useEffect(() => {
    executeRecaptcha()
  }, [executeRecaptcha])

  // Check if token is still valid (tokens expire after ~2 minutes)
  const isTokenValid = useCallback(() => {
    if (!token || !tokenTimestamp) return false
    const age = Date.now() - tokenTimestamp
    return age < 120000 // 2 minutes in milliseconds
  }, [token, tokenTimestamp])

  // Refresh the token by re-executing
  const refreshToken = useCallback(() => {
    setToken(undefined)
    setTokenTimestamp(undefined)
    setState(undefined)
    executeRecaptcha()
  }, [executeRecaptcha])

  return { token, state, isTokenValid, refreshToken }
}
