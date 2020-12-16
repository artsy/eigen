import { ConfirmContactInfo_me } from "__generated__/ConfirmContactInfo_me.graphql"
import { ConfirmContactInfoQuery } from "__generated__/ConfirmContactInfoQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { PhoneInput } from "lib/Components/PhoneInput/PhoneInput"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import { useScreenDimensions } from "lib/utils/useScreenDimensions"
import { Box, Spacer, Text } from "palette"
import React, { useEffect, useRef, useState } from "react"
import { ActivityIndicator, ScrollView, View } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { BottomAlignedButton } from "../Components/BottomAlignedButton"

const ConfirmContactInfo: React.FC<{ me: ConfirmContactInfo_me | null }> = ({ me }) => {
  const { width, height } = useScreenDimensions()
  const isPad = width > 700
  const [phoneNumber, setPhoneNumber] = useState(me?.phone)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const inputRef = useRef<Input>(null)

  useEffect(() => {
    setPhoneNumber(me?.phone)
  }, [me?.phone])

  return (
    <BottomAlignedButton
      buttonText="Submit"
      disabled={!Boolean(me && phoneNumber)}
      onPress={() => console.warn("submitty")}
      showSeparator={isInputFocused}
    >
      <ScrollView style={{ flex: 1 }} alwaysBounceVertical={false} contentContainerStyle={{ paddingVertical: 40 }}>
        <View
          style={{
            alignSelf: "center",
            width: "100%",
            maxWidth: 540,
            flex: 1,
          }}
        >
          <Box px={2}>
            <Text variant="mediumText" style={{ textAlign: isPad ? "center" : "left" }}>
              Step 2 of 2
            </Text>
            <Spacer mb={1} />
            <Text variant="largeTitle" style={{ textAlign: isPad ? "center" : "left" }}>
              Confirm your contact information
            </Text>
            <Spacer mb={1} />
            <Text
              variant="text"
              color="black60"
              style={{ textAlign: isPad ? "center" : "left", marginBottom: isPad ? 80 : 0 }}
            >
              Please verify your phone number so we can reach you about the status of your work. This info will also be
              saved to your account.
            </Text>
            <Spacer mb={3} />
            {me ? (
              <PhoneInput
                ref={inputRef}
                title="Phone number"
                value={phoneNumber ?? ""}
                maxModalHeight={height * 0.75}
                onChangeText={setPhoneNumber}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
              />
            ) : (
              <ActivityIndicator />
            )}

            <Spacer mb={3} />
          </Box>
        </View>
      </ScrollView>
    </BottomAlignedButton>
  )
}

const ConfirmContactInfoContainer = createFragmentContainer(ConfirmContactInfo, {
  me: graphql`
    fragment ConfirmContactInfo_me on Me {
      phone
    }
  `,
})

export const ConfirmContactInfoQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<ConfirmContactInfoQuery>
      render={renderWithPlaceholder({
        Container: ConfirmContactInfoContainer,
        renderPlaceholder: () => <ConfirmContactInfo me={null} />,
      })}
      query={graphql`
        query ConfirmContactInfoQuery {
          me {
            ...ConfirmContactInfo_me
          }
        }
      `}
      cacheConfig={{ force: true }}
      environment={defaultEnvironment}
      variables={{}}
    />
  )
}
