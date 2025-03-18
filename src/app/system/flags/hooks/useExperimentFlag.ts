import { useFlag } from "@unleash/proxy-client-react"
import { EXPERIMENT_NAME } from "app/system/flags/experiments"

export function useExperimentFlag(name: EXPERIMENT_NAME) {
  return useFlag(name)
}
