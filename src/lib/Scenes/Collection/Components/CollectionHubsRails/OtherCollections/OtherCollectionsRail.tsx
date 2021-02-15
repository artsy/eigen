import { OtherCollectionsRail_collectionGroup } from "__generated__/OtherCollectionsRail_collectionGroup.graphql"
import { CardRailFlatList } from "lib/Components/Home/CardRailFlatList"
import { navigate } from "lib/navigation/navigate"
import { Sans, Spacer } from "palette"
import React, { useRef } from "react"
import { TouchableOpacity, View } from "react-native"
import { createFragmentContainer, graphql } from "react-relay"
import styled from "styled-components/native"

export interface OtherCollectionsRailProps {
  collectionGroup: OtherCollectionsRail_collectionGroup
}

export const CollectionGroupMemberPill = styled(Sans).attrs({
  px: 3,
  py: 2,
  size: "3t",
  bg: "black10",
})`
  overflow: hidden;
  border-radius: 6px;
`

export const OtherCollectionsRail: React.FC<OtherCollectionsRailProps> = ({ collectionGroup: { name, members } }) => {
  const ref = useRef<View | null>(null)

  return (
    <View ref={ref}>
      <Sans size="4" m="2">
        {name}
      </Sans>

      <CardRailFlatList
        data={members}
        initialNumToRender={3}
        keyExtractor={({ id }) => id}
        ItemSeparatorComponent={() => <Spacer mr="0.5" />}
        renderItem={({ item: { slug, title } }) => {
          return (
            <TouchableOpacity
              onPress={() => {
                navigate(`/collection/${slug}`)
              }}
            >
              <CollectionGroupMemberPill>{title}</CollectionGroupMemberPill>
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
