import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { TabsContainer } from "@artsy/palette-mobile/dist/elements/Tabs/TabsContainer"
import { TabsWithHeaderProps } from "@artsy/palette-mobile/dist/elements/Tabs/TabsWithHeader"

export const TabsWithHeader2: React.FC<TabsWithHeaderProps> = ({
  headerProps = {},
  hideScreen = false,
  disableKeyboardAvoidance = false,
  title,
  ...rest
}) => {
  if (hideScreen) {
    return <Content title={title} {...rest} />
  }

  return (
    <Screen>
      <Screen.AnimatedHeader title={title} {...headerProps} />
      {/* <Screen.Header title={title} {...headerProps} /> */}

      <Screen.Body fullwidth disableKeyboardAvoidance={disableKeyboardAvoidance}>
        <Content title={title} {...rest} />
      </Screen.Body>
    </Screen>
  )
}

const Content: React.FC<Omit<TabsWithHeaderProps, "hideScreen" | "headerProps">> = ({
  BelowTitleHeaderComponent,
  children,
  showLargeHeaderText = true,
  title,
  ...rest
}) => {
  const showTitle = showLargeHeaderText && !!title

  return (
    <TabsContainer
      {...rest}
      renderHeader={() => {
        return (
          <>
            {!!showTitle && (
              <Flex my={1} px={2} justifyContent="center" pointerEvents="none">
                <Text variant="lg-display" numberOfLines={2}>
                  {title}
                </Text>
              </Flex>
            )}
            {!!BelowTitleHeaderComponent && <BelowTitleHeaderComponent />}
          </>
        )
      }}
    >
      {children}
    </TabsContainer>
  )
}
