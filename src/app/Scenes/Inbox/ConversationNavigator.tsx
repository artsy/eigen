import NavigatorIOS from "app/utils/__legacy_do_not_use__navigator-ios-shim"
import React from "react"
import { ConversationQueryRenderer as Conversation } from "./Screens/Conversation"

export const ConversationNavigator: React.FC<{ conversationID: string }> = ({ conversationID }) => {
  const initialRoute = { component: Conversation, passProps: { conversationID }, title: "" }

  return <NavigatorIOS initialRoute={initialRoute} />
}
