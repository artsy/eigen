import { Flex, Text } from "palette"
import { isValidElement } from "react"
import { Image, ImageSourcePropType } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

interface HomeFeedModalCarouselScreenWrapperProps {
  title: string
  imgSrc?: ImageSourcePropType
  description: string | JSX.Element
}

export const HomeFeedModalCarouselScreenWrapper: React.FC<
  HomeFeedModalCarouselScreenWrapperProps
> = ({ description, imgSrc, title }) => {
  const { bottom: bottomInset } = useSafeAreaInsets()
  return (
    <Flex pt={2} flex={1}>
      <Flex px={2}>
        <Text variant="lg-display">{title}</Text>
        {isValidElement(description) ? (
          description
        ) : (
          <Text variant="sm-display" mt={1}>
            {description}
          </Text>
        )}
      </Flex>

      {!!imgSrc && (
        <Flex alignItems="center" mt={1} pb={bottomInset + 70} justifyContent="center" flexGrow={1}>
          <Image source={imgSrc} style={{ flex: 1 }} resizeMode="contain" />
        </Flex>
      )}
    </Flex>
  )
}
