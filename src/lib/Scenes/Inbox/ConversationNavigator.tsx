import { Theme } from "palette"
import React from "react"
import NavigatorIOS from "react-native-navigator-ios"
import { ConversationQueryRenderer as Conversation } from "./Screens/Conversation"

export const ConversationNavigator: React.FC<{ conversationID: string }> = ({ conversationID }) => {
  const initialRoute = { component: Conversation, passProps: { conversationID }, title: "" }

  return (
    <Theme>
      <NavigatorIOS initialRoute={initialRoute} navigationBarHidden={true} style={{ flex: 1 }} />
    </Theme>
  )
}
