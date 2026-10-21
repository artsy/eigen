import { AddIcon, TagIcon } from "@artsy/icons/native"
import { Button, Flex, Text, useSpace } from "@artsy/palette-mobile"
import { Tab } from "app/Scenes/MyCollection/MyCollection"
import { RouterLink } from "app/system/navigation/RouterLink"

/**
 * The "Add Work" and "Sell" buttons shown on the left of the My Collection artworks filter header.
 */
export const MyCollectionArtworksActions: React.FC = () => {
  const space = useSpace()

  return (
    <Flex flexDirection="row" alignItems="center" gap={1}>
      <RouterLink
        to="my-collection/artworks/new"
        navigationProps={{ source: Tab.collection }}
        accessibilityLabel="Add Work"
      >
        <Flex flexDirection="row" alignItems="center" gap={0.5}>
          <AddIcon />
          <Text variant="xs">Add Work</Text>
        </Flex>
      </RouterLink>

      <RouterLink hasChildTouchable to="/sell">
        <Button
          variant="fillDark"
          size="small"
          haptic
          icon={<TagIcon />}
          testID="sell-button"
          accessibilityLabel="Sell"
        >
          Sell{" "}
          <Flex
            backgroundColor="blue100"
            // @ts-expect-error
            style={{
              paddingHorizontal: "2px",
              paddingVertical: "2px",
            }}
          >
            <Text
              color="white"
              style={{ paddingHorizontal: space(0.5) }}
              backgroundColor="blue100"
              variant="xs"
            >
              BETA
            </Text>
          </Flex>
        </Button>
      </RouterLink>
    </Flex>
  )
}
