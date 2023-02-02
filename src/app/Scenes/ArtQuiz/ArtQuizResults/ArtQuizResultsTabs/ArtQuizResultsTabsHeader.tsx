import { Button, Flex, Spacer, Text } from "palette"

interface ArtQuizResultsTabsHeaderProps {
  title: string
  subtitle: string
}

export const ArtQuizResultsTabsHeader = ({ title, subtitle }: ArtQuizResultsTabsHeaderProps) => {
  return (
    <Flex px={2}>
      <Text variant="lg">{title}</Text>
      <Text variant="sm" color="black60">
        {subtitle}
      </Text>
      <Spacer m={1} />
      <Button size="small" variant="outlineGray">
        Email My Results
      </Button>
    </Flex>
  )
}
