import fetch from "node-fetch"
import { getEnv } from "./env"
import { waitUntil } from "./fetch"

const baseURL = "https://mailtrap.io/api/v1"
const headers = {
  "Content-Type": "application/json",
  Authorization: "Bearer " + getEnv("MAILTRAP_API_TOKEN"),
}

const matcher = (s, matcher) => {
  if (matcher === undefined) {
    return true
  }
  return typeof matcher === "string" ? s === matcher : matcher.exec(s) !== null
}

export const waitForEmail = (args) => {
  const inboxId = args.mailtrapInbox || getEnv("MAILTRAP_PULSE_INBOX")
  console.info(`checking emails for ${args.to}`)

  return waitUntil(() => {
    return fetch(`${baseURL}/inboxes/${inboxId}/messages`, { headers }).then(res => {
      if (!res.ok) {
        return false
      }

      return res.json().then(msgs => {
        let found = false

        for (let msg of msgs) {
          if (msg.to_email === args.to && matcher(msg.subject, args.match.title)) {
            found = true
            break
          }
        }
        return found
      })
    })
  })
}