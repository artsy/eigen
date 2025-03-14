import { useFlag } from "@unleash/proxy-client-react"
import { EXPERIMENT_NAME } from "app/utils/experiments/experiments"

export function useExperimentFlag(name: EXPERIMENT_NAME) {
  return useFlag(name)
}
