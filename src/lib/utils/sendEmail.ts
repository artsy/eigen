import _ from "lodash"
import { Alert, Linking } from "react-native"

export const sendEmail = (emailAddress: string, params?: { [key: string]: string }) => {
  let mailToString = `mailto:${emailAddress}`
  if (params) {
    const paramsString = _.toPairs(params)
      .map(([key, value]) => `${key}=${value}`)
      .join("&")
    mailToString += `?${paramsString}`
  }

  sendEmailWithMailTo(mailToString)
}

export const sendEmailWithMailTo = (mailToString: string) => {
  const emailAddress = mailToString.split(":")[1].split("?")[0]
  Linking.canOpenURL(mailToString)
    .then((canOpenURL) => {
      if (canOpenURL) {
        Linking.openURL(mailToString)
      } else {
        showEmailAlert(emailAddress)
      }
    })
    .catch(() => {
      showEmailAlert(emailAddress)
    })
}

const showEmailAlert = (emailAddress: string) => {
  Alert.alert("No email configured", `Please email ${emailAddress} for assistance.`)
}
