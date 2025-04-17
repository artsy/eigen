import { Flex, Touchable, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"

export const MyProfileHeader: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const WIDTH = width - 2 * space(2)

  return (
    <Flex justifyContent="center" alignItems="center" mt={2}>
      <Touchable onPress={() => navigate("my-collection")}>
        <Flex
          minHeight={200}
          width={WIDTH}
          backgroundColor="mono0"
          borderRadius={20}
          style={{
            shadowColor: "black",
            shadowOffset: {
              width: 0,
              height: 3,
            },
            shadowOpacity: 0.15,
            shadowRadius: 5,
            // elevation: 12,
            elevation: 2,
          }}
        />
      </Touchable>
    </Flex>
  )
}
