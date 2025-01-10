import { Pill, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
import { FlatList } from "react-native-gesture-handler"

export const HomeViewSectionQuickLinks: React.FC<{}> = () => {
  const space = useSpace()

  return (
    <FlatList
      data={Pills}
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{
        paddingHorizontal: space(2),
      }}
      ItemSeparatorComponent={() => <Spacer x={0.5} />}
      renderItem={({ item: pill }) => (
        <Pill
          key={pill.title}
          accessibilityLabel={pill.title}
          accessibilityRole="link"
          testID={`pill-${pill.title}`}
          variant="link"
          onPress={() => {
            navigate(pill.href)
          }}
        >
          <Text variant="xs" color="black100">
            {pill.title}
          </Text>
        </Pill>
      )}
    />
  )
}

type QuickLinkPill = {
  title: string
  href: string
}

export const Pills: Array<QuickLinkPill> = [
  { title: "Follows", href: "/favorites" },
  { title: "Auctions", href: "/auctions" },
  { title: "Saves", href: "/favorites/saves" },
  { title: "Art under $1000", href: "/collect?price_range=%2A-1000" },
  { title: "Price Database", href: "/price-database" },
  { title: "Editorial", href: "/news" },
]
