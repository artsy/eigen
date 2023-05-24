import { Flex, Text, Screen } from "@artsy/palette-mobile"
import { AnimatedTabsHeader, HeaderProps } from "app/Components/Tabs/AnimatedTabsHeader"
import { TabsContainer } from "app/Components/Tabs/TabsContainer"
import { CollapsibleProps } from "react-native-collapsible-tab-view"

interface TabsWithHeaderProps {
  title: string
  HeaderComponent?: () => JSX.Element
  headerProps?: HeaderProps
  showLargeHeaderText?: boolean
  children: CollapsibleProps["children"]
}

export const TabsWithHeader: React.FC<TabsWithHeaderProps> = ({
  children,
  HeaderComponent,
  headerProps = {},
  showLargeHeaderText = true,
  title,
}) => {
  return (
    <Screen>
      <AnimatedTabsHeader title={title} {...headerProps} />
      <Screen.Body fullwidth>
        <TabsContainer
          renderHeader={() => {
            if (!showLargeHeaderText || !title) {
              return null
            }

            return (
              <>
                <Flex my={1} pl={2} justifyContent="center" alignSelf="flex-start">
                  <Text variant="lg-display" numberOfLines={2}>
                    {title}
                  </Text>
                </Flex>
                {!!HeaderComponent && <HeaderComponent />}
              </>
            )
          }}
        >
          {children}
        </TabsContainer>
      </Screen.Body>
    </Screen>
  )
}
