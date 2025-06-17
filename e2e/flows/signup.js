const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-")
output.signup = {
  email: `maestro-test+${timestamp}@testdomain.com`,
  password: `Pwd${timestamp}`, // pragma: allowlist secret
}
