import { storiesOf } from "@storybook/react-native"
import * as React from "react"
import "react-native"
import Avatar from "../Avatar"

storiesOf("Conversations - Avatar").add("User with Two Initials", () =>
  <Avatar isUser={true} senderName={"Maxim Cramer"} />
)

storiesOf("Conversations - Avatar").add("User with Three Initials", () =>
  <Avatar isUser={true} senderName={"Amazing Person Name"} />
)

storiesOf("Conversations - Avatar").add("User with Many Initials", () =>
  <Avatar isUser={true} senderName={"Amazing Person With Very Very Long Name"} />
)

storiesOf("Conversations - Avatar").add("Gallery with Two Initials", () =>
  <Avatar isUser={false} senderName={"Best Gallery"} />
)

storiesOf("Conversations - Avatar").add("Gallery with Many Initials", () =>
  <Avatar isUser={false} senderName={"Best Gallery Ever But Has Very Long Name"} />
)

storiesOf("Conversations - Avatar").add("Gallery with lowercase name", () =>
  <Avatar isUser={false} senderName={"all lower case though"} />
)
