import { MyAccountEditNameQuery } from "__generated__/MyAccountEditNameQuery.graphql"
import { Input } from "lib/Components/Input/Input"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { PlaceholderBox } from "lib/utils/placeholders"
import { renderWithPlaceholder } from "lib/utils/renderWithPlaceholder"
import React, { useRef, useState } from "react"
import { Alert } from "react-native"
import { createFragmentContainer, graphql, QueryRenderer, RelayProp } from "react-relay"
import { MyAccountEditName_me } from "../../../__generated__/MyAccountEditName_me.graphql"
import { MyAccountFieldEditScreen, MyAccountFieldEditScreenPlaceholder } from "./Components/MyAccountFieldEditScreen"
import { updateMyUserProfile } from "./updateMyUserProfile"

const MyAccountEditName: React.FC<{ me: MyAccountEditName_me; relay: RelayProp }> = ({ me }) => {
  const [name, setName] = useState<string>(me.name ?? "")
  const inputRef = useRef(null)

  return (
    <MyAccountFieldEditScreen
      title={"Full Name"}
      canSave={!!name.trim() && name.trim() !== me.name}
      onSave={async dismiss => {
        try {
          await updateMyUserProfile({ name })
          dismiss()
        } catch (e) {
          Alert.alert(typeof e === "string" ? e : "Something went wrong.")
        }
      }}
    >
      <Input enableClearButton value={name} onChangeText={setName} autoFocus ref={inputRef} />
    </MyAccountFieldEditScreen>
  )
}

const MyAccountEditNamePlaceholder: React.FC<{}> = ({}) => {
  return (
    <MyAccountFieldEditScreenPlaceholder title="Full Name">
      <PlaceholderBox height={40} />
    </MyAccountFieldEditScreenPlaceholder>
  )
}

const MyAccountEditNameContainer = createFragmentContainer(MyAccountEditName, {
  me: graphql`
    fragment MyAccountEditName_me on Me {
      name
    }
  `,
})

export const MyAccountEditNameQueryRenderer: React.FC<{}> = () => {
  return (
    <QueryRenderer<MyAccountEditNameQuery>
      environment={defaultEnvironment}
      query={graphql`
        query MyAccountEditNameQuery {
          me {
            ...MyAccountEditName_me
          }
        }
      `}
      render={renderWithPlaceholder({
        Container: MyAccountEditNameContainer,
        renderPlaceholder: () => <MyAccountEditNamePlaceholder />,
      })}
      variables={{}}
    />
  )
}
