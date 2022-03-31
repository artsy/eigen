export const getEnv = (name) => {
  const value = process.env[name] ?? null

  if (value) {
    return value
  }

  throw new Error(`Environment variable [${name}] not found`)
}