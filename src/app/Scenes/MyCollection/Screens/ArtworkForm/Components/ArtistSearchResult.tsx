import { ArtistListItem_artist$data } from "__generated__/ArtistListItem_artist.graphql"
import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { Avatar, Flex, Spacer, Text } from "palette"

export const ArtistSearchResult: React.FC<{
  result: AutosuggestResult | ArtistListItem_artist$data
}> = ({ result }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      {/* @ts-ignore */}
      <Avatar src={result.imageUrl || result.image?.url || undefined} size="xs" />
      <Spacer ml="1" />
      <Flex flex={1} flexDirection="column" justifyContent="center">
        <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
          {result.displayLabel}
        </Text>
        {!!result.formattedNationalityAndBirthday && (
          <Text variant="xs" numberOfLines={1} color="black60" ellipsizeMode="tail">
            {result.formattedNationalityAndBirthday}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
