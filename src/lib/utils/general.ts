import { unsafe__getUserEmail } from "lib/store/GlobalStore"

export const is__DEV__ = () => __DEV__

export const isDevOrArtsyUser = () => {
  if (is__DEV__()) return true

  const userEmail = unsafe__getUserEmail()
  if (userEmail !== undefined && (userEmail.endsWith("@artsymail.com") || userEmail.endsWith("@artsy.net"))) {
    return true
  }

  return false
}
