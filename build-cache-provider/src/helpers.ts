import path from "path"
import { getPackageJson, RunOptions } from "@expo/config"

let TEMP_PATH: string

async function getTempPath(): Promise<string> {
  if (!TEMP_PATH) {
    const envPaths = (await import("env-paths")).default
    TEMP_PATH = envPaths("github-build-cache-provider").temp
  }
  return TEMP_PATH
}

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

export const getTmpDirectory = async (): Promise<string> => await getTempPath()
export const getBuildRunCacheDirectoryPath = async (): Promise<string> =>
  path.join(await getTmpDirectory(), "build-run-cache")
