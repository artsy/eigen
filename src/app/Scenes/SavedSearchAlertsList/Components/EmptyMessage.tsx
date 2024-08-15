import {
  Spacer,
  Flex,
  Box,
  Text,
  Button,
  Join,
  FilterIcon,
  BellIcon,
  ArtworkIcon,
} from "@artsy/palette-mobile"
import SearchIcon from "app/Components/Icons/SearchIcon"
import { switchTab } from "app/system/navigation/navigate"
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
        <Text variant="sm" color="black60">
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
    <ScrollView>
      <Box px={2} py={4}>
        <Text variant="lg">{t.header.line1}</Text>
        <Text variant="lg">{t.header.line2}</Text>
        <Spacer y={4} />
        <Join separator={<Spacer y={2} />}>
          <InfoSection title={t.search.title} body={t.search.body} icon={<SearchIcon />} />
          <InfoSection title={t.filter.title} body={t.filter.body} icon={<FilterIcon />} />
          <InfoSection title={t.create.title} body={t.create.body} icon={<BellIcon />} />
          <InfoSection title={t.match.title} body={t.match.body} icon={<ArtworkIcon />} />
        </Join>
        <Spacer y={4} />
        <Button block variant="outline" onPress={() => switchTab("home")}>
          {t.button.label}
        </Button>
      </Box>
    </ScrollView>
  )
}
