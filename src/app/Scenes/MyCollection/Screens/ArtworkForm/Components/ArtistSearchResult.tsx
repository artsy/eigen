import { Avatar, Flex, Spacer, Text } from "@artsy/palette-mobile"
import { AutosuggestResult } from "app/Components/AutosuggestResults/AutosuggestResults"

export const ArtistSearchResult: React.FC<{
  result: AutosuggestResult
  icon?: React.ReactElement
}> = ({ result, icon }) => {
  return (
    <Flex flexDirection="row" alignItems="center">
      <Avatar
        src={result.imageUrl || undefined}
        initials={result.initials || undefined}
        size="xs"
      />
      <Spacer x={1} />
      <Flex flex={1} flexDirection="column" justifyContent="center">
        <Flex flexDirection="row" alignItems="center" height={30}>
          <Text variant="sm-display" ellipsizeMode="tail" numberOfLines={1} lineHeight="18px">
            {result.displayLabel}
          </Text>
          {icon}
        </Flex>
        {!!result.formattedNationalityAndBirthday && (
          <Text variant="xs" numberOfLines={1} color="black60" ellipsizeMode="tail">
            {result.formattedNationalityAndBirthday}
          </Text>
        )}
      </Flex>
    </Flex>
  )
}
