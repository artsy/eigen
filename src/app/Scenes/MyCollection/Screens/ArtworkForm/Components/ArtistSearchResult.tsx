import { AutosuggestResult } from "app/Scenes/Search/AutosuggestResults"
import { Avatar, Flex, Spacer, Text } from "palette"

export const ArtistSearchResult: React.FC<{ result: AutosuggestResult }> = ({ result }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Avatar src={result.imageUrl || undefined} size="xs" />
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
