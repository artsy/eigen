import { Color, Flex, Stopwatch, Text } from "@artsy/palette-mobile"
import { ArtworkPrice_me$data } from "__generated__/ArtworkPrice_me.graphql"
import { formattedTimeLeftForPartnerOffer } from "app/Scenes/Artwork/utils/formattedTimeLeftForPartnerOffer"
import { getTimer } from "app/utils/getTimer"
import { ExtractNodeType } from "app/utils/relayHelpers"
import { FC, useEffect, useRef, useState } from "react"

const INTERVAL = 1000

interface ExpiresInTimerProps {
  item: ExtractNodeType<ArtworkPrice_me$data["partnerOffersConnection"]>
}

const WatchIcon: FC<{ fill?: Color }> = ({ fill = "red100" }) => {
  return <Stopwatch fill={fill} height={15} width={15} mr="2px" />
}

export const ExpiresInTimer: FC<ExpiresInTimerProps> = ({ item }) => {
  const expiresAt = item?.endAt ?? ""

  const intervalId = useRef<ReturnType<typeof setInterval> | null>(null)
  const [time, setTime] = useState(getTimer(expiresAt)["time"])
  const [hasEnded, setHasEnded] = useState(getTimer(expiresAt)["hasEnded"])

  const { timerCopy, textColor } = formattedTimeLeftForPartnerOffer(time)

  useEffect(() => {
    intervalId.current = setInterval(() => {
      const { hasEnded: timerHasEnded, time: timerTime } = getTimer(expiresAt)

      setHasEnded(timerHasEnded)
      setTime(timerTime)
    }, INTERVAL)

    return () => {
      if (intervalId.current) clearInterval(intervalId.current)
    }
  }, [])

  if (hasEnded) {
    return (
      <Flex flexDirection="row" alignItems="center">
        <WatchIcon />

        <Text variant="xs" color="red100">
          Expired
        </Text>
      </Flex>
    )
  }

  return (
    <Flex flexDirection="row" alignItems="center">
      <WatchIcon fill={textColor} />

      <Text variant="xs" color={textColor}>
        Expires in {timerCopy}
      </Text>
    </Flex>
  )
}
