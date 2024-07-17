import { Flex, Screen, Separator, Spacer, Text } from "@artsy/palette-mobile"
import { goBack } from "app/system/navigation/navigate"

const SCREEN_TITLE = "HomeView WIP"

const dummyData = Array.from({ length: 10 }).map((_, i) => {
  return {
    index: i,
  }
})

export const HomeView: React.FC = () => {
  return (
    <Screen>
      <Screen.AnimatedHeader onBack={goBack} title={SCREEN_TITLE} />

      <Screen.StickySubHeader
        title={SCREEN_TITLE}
        separatorComponent={<Separator borderColor="black5" />}
      />

      <Screen.Body fullwidth>
        <Screen.FlatList
          data={dummyData}
          keyExtractor={(item) => `${item.index}`}
          renderItem={({ item }) => {
            return <Placeholder item={item} />
          }}
          ItemSeparatorComponent={() => <Spacer y={1} />}
        />
      </Screen.Body>
    </Screen>
  )
}

const Placeholder: React.FC<{ item: any }> = (props) => {
  const { item } = props
  return (
    <Flex bg="black10" alignItems="center">
      <Text color="black60" py={2}>
        Section {item.index}
      </Text>
    </Flex>
  )
}
