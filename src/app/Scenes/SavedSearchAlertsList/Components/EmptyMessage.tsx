import { ArtworkIcon, BellStrokeIcon, FilterIcon } from "@artsy/icons/native"
import { Box, Button, Flex, Join, Spacer, Text } from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { RouterLink } from "app/system/navigation/RouterLink"
import { ScrollView } from "react-native"

interface InfoSectionProps {
  title: string
  body: string
  icon: JSX.Element
}

const InfoSection: React.FC<InfoSectionProps> = (props) => {
  return (
    <Flex flexDirection="row">
      <Flex alignItems="center" height="20px" width="18px" mr={1}>
        {props.icon}
      </Flex>
      <Box>
        <Text variant="sm" lineHeight="20px">
          {props.title}
        </Text>
        <Text variant="sm" color="mono60">
          {props.body}
        </Text>
      </Box>
    </Flex>
  )
}

const t = {
  header: {
    line1: "Hunting for a",
    line2: "particular artwork?",
  },
  search: {
    title: "Find your artist",
    body: "On an artist page, go to the Works for Sale section.",
  },
  filter: {
    title: "Filter",
    body: "Set the filters for any search criteria you have, like price, medium or size.",
  },
  create: {
    title: "Create alert",
    body: "When you’re ready, click “Create Alert”.",
  },
  match: {
    title: "Get a match",
    body: "Get notifications when there’s a match.",
  },
  button: {
    label: "Explore Artists",
  },
}

export const EmptyMessage: React.FC = () => {
  return (
    <ScrollView bounces={false}>
      <Box px={2}>
        <Text variant="lg">{t.header.line1}</Text>
        <Text variant="lg">{t.header.line2}</Text>
        <Spacer y={4} />
        <Join separator={<Spacer y={2} />}>
          <InfoSection title={t.search.title} body={t.search.body} icon={<SearchIcon />} />
          <InfoSection title={t.filter.title} body={t.filter.body} icon={<FilterIcon />} />
          <InfoSection title={t.create.title} body={t.create.body} icon={<BellStrokeIcon />} />
          <InfoSection title={t.match.title} body={t.match.body} icon={<ArtworkIcon />} />
        </Join>
        <Spacer y={4} />
        <RouterLink hasChildTouchable to="/search">
          <Button block variant="outline">
            {t.button.label}
          </Button>
        </RouterLink>
      </Box>
    </ScrollView>
  )
}
