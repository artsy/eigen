import path from "path"
import { getPackageJson, RunOptions } from "@expo/config"
import envPaths from "env-paths"

const { temp: TEMP_PATH } = envPaths("github-build-cache-provider")

export function isDevClientBuild({
  runOptions,
  projectRoot,
}: {
  runOptions: RunOptions
  projectRoot: string
}): boolean {
  if (!hasDirectDevClientDependency(projectRoot)) {
    return false
  }

  if ("variant" in runOptions && runOptions.variant !== undefined) {
    return runOptions.variant === "debug"
  }
  if ("configuration" in runOptions && runOptions.configuration !== undefined) {
    return runOptions.configuration === "Debug"
  }

  return true
}

export function hasDirectDevClientDependency(projectRoot: string): boolean {
  const { dependencies = {}, devDependencies = {} } = getPackageJson(projectRoot)
  return !!dependencies["expo-dev-client"] || !!devDependencies["expo-dev-client"]
}

export const getTmpDirectory = (): string => TEMP_PATH
export const getBuildRunCacheDirectoryPath = (): string =>
  path.join(getTmpDirectory(), "build-run-cache")
