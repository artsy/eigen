import { Spacer, Text } from "@artsy/palette-mobile"
import { OtherCollectionsRail_collectionGroup$data } from "__generated__/OtherCollectionsRail_collectionGroup.graphql"
import { CardRailFlatList } from "app/Components/CardRail/CardRailFlatList"
import { navigate } from "app/system/navigation/navigate"
import React, { useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"

export interface OtherCollectionsRailProps {
  collectionGroup: OtherCollectionsRail_collectionGroup$data
}

export const OtherCollectionsRail: React.FC<OtherCollectionsRailProps> = ({
  collectionGroup: { name, members },
}) => {
  const ref = useRef<View | null>(null)

  return (
    <View ref={ref}>
      <Text variant="sm-display" m={2}>
        {name}
      </Text>

      <CardRailFlatList
        data={members}
        initialNumToRender={3}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={() => <Spacer x={0.5} />}
        renderItem={({ item: { slug, title } }) => {
          return (
            <TouchableOpacity
              accessibilityRole="button"
              onPress={() => {
                navigate(`/collection/${slug}`)
              }}
            >
              <Text
                variant="sm"
                px={4}
                py={2}
                backgroundColor="mono10"
                style={{
                  overflow: "hidden",
                  borderRadius: 6,
                }}
              >
                {title}
              </Text>
            </TouchableOpacity>
          )
        }}
      />
    </View>
  )
}

export const OtherCollectionsRailContainer = createFragmentContainer(OtherCollectionsRail, {
  collectionGroup: graphql`
    fragment OtherCollectionsRail_collectionGroup on MarketingCollectionGroup {
      groupType
      name
      members {
        id
        slug
        title
      }
    }
  `,
})
