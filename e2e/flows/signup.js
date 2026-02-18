const timestamp = new Date().toISOString().replace(/:/g, "-").replace(/\./g, "-")
output.signup = {
  email: `mobileQA+maestro-${timestamp}@qa.qa`,
  password: `Pwd${timestamp}`, // pragma: allowlist secret
}
