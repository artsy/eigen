import { formattedTimeLeft } from "app/Scenes/Activity/utils/formattedTimeLeft"

export const formattedTimeLeftForPartnerOffer = (time: {
  days: string
  hours: string
  minutes: string
  seconds: string
}) => {
  const { textColor: timerColor, timerCopy } = formattedTimeLeft(time)

  let textColor = timerColor
  if (timerColor === "orange100") {
    textColor = "red100"
  }

  return { timerCopy, textColor }
}
