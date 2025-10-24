import { Flex, Spacer, Text } from "@artsy/palette-mobile"
import { HomeViewSectionScreenQuery$data } from "__generated__/HomeViewSectionScreenQuery.graphql"
import { HomeViewSectionScreenArtworks } from "app/Scenes/HomeViewSectionScreen/Components/HomeViewSectionScreenArtworks"

type HomeViewSectionScreenContentT = NonNullable<
  HomeViewSectionScreenQuery$data["homeView"]["section"]
>

export const HomeViewSectionScreenContent: React.FC<{ section: HomeViewSectionScreenContentT }> = (
  props
) => {
  const { section } = props

  switch (section.__typename) {
    case "HomeViewSectionArtworks":
      return <HomeViewSectionScreenArtworks section={section} />

    default:
      if (__DEV__) {
        return (
          <Flex p={2}>
            <Text fontWeight="500">Non supported screen section:</Text>

            <Spacer y={2} />

            <Text>
              Section Type:{" "}
              <Text fontWeight={500} color="devpurple">
                {section.__typename}
              </Text>
            </Text>
            <Text>
              Section ID:{" "}
              <Text fontWeight={500} color="devpurple">
                {section.internalID}
              </Text>
            </Text>
          </Flex>
        )
      }
      return null
  }
}
