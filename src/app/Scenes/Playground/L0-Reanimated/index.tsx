import { Flex, Join, Separator, Text } from "@artsy/palette-mobile"
import { ScrollView } from "react-native-gesture-handler"

export default function App() {
  const content = [
    {
      title: "DECLARATIVE",
      description: "Declarative API that's a lot more straightforward than the RN Animated API",
    },
    {
      title: "PERFORMANT",
      description: "Smooth experience running on native UI thread! just like Native!",
    },
    {
      title: "FEATURE-RICH",
      description:
        "Lots of Built-in components and hooks to make it easier to build complex animations and gestures",
    },
  ]

  const ContentItem: React.FC<{ item: { title: string; description: string } }> = ({ item }) => {
    return (
      <Flex>
        <Text variant="sm-display" fontWeight="bold">
          {item.title}
        </Text>
        <Text>{item.description}</Text>
      </Flex>
    )
  }

  return (
    <Flex height="100%">
      <ScrollView contentContainerStyle={{ padding: 20, flexGrow: 1 }}>
        <Join separator={<Separator my={2} />}>
          {content.map((item, index) => (
            <ContentItem key={index} item={item} />
          ))}
        </Join>
      </ScrollView>
    </Flex>
  )
}
