import { Image } from "lib/Components/Bidding/Elements/Image"
import { Flex, Text, useColor } from "palette"
import React, { useState } from "react"
import { TouchableWithoutFeedback } from "react-native-gesture-handler"

export interface BannerProps {
  title: string
  text: string
  onClose?: () => void
  showCloseButton?: boolean
}

export const Banner: React.FC<BannerProps> = ({ title, text, onClose, showCloseButton = false }) => {
  const color = useColor()

  const [show, setShow] = useState(true)

  const handleClose = () => {
    setShow(false)

    onClose?.()
  }

  if (!show) {
    return null
  }

  return (
    <Flex backgroundColor={color("blue100")}>
      <Flex px={2} py={1} flexDirection="row" justifyContent="space-between">
        <Flex flex={1}>
          <Text fontWeight="bold" color={color("black5")}>
            {title}
          </Text>
          <Text color={color("black5")}>{text}</Text>
        </Flex>

        {!!showCloseButton && (
          <Flex>
            <TouchableWithoutFeedback onPress={handleClose}>
              <Image source={require("../../../../images/close-x.webp")} />
            </TouchableWithoutFeedback>
          </Flex>
        )}
      </Flex>
    </Flex>
  )
}
