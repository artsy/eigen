import { Flex, useScreenDimensions, useSpace } from "@artsy/palette-mobile"
import { RouterLink } from "app/system/navigation/RouterLink"

export const MyProfileHeader: React.FC = () => {
  const { width } = useScreenDimensions()
  const space = useSpace()

  const WIDTH = width - 2 * space(2)

  return (
    <Flex justifyContent="center" alignItems="center" mt={2}>
      <RouterLink to="/collector-profile/my-collection">
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
      </RouterLink>
    </Flex>
  )
}
