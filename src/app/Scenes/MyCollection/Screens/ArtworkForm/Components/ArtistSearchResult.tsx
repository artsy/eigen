import { Avatar, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"

export const ArtistSearchResult: React.FC<{
  result: AutosuggestResult
}> = ({ result }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Avatar
        src={result.imageUrl || undefined}
        initials={result.initials || undefined}
        size="xs"
      />
      <Spacer x={1} />
      <Flex flex={1} flexDirection="column" justifyContent="center">
        <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1}>
          {result.displayLabel}
        </Text>
        {!!result.formattedNationalityAndBirthday && (
          <Text variant="xs" numberOfLines={1} color="mono60" ellipsizeMode="tail">
            {result.formattedNationalityAndBirthday}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
