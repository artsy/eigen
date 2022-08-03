import { SavedAddressesFormTestsQuery } from "__generated__/SavedAddressesFormTestsQuery.graphql"
import { extractText } from "app/tests/extractText"
import { renderWithWrappersLEGACY } from "app/tests/renderWithWrappers"
import { Button, Input } from "palette"
import { Checkbox } from "palette/elements/Checkbox"
import { PhoneInput } from "palette/elements/Input/PhoneInput/PhoneInput"
import { graphql, QueryRenderer } from "react-relay"

import { getRelayEnvironment } from "app/relay/defaultEnvironment"
import { resolveMostRecentRelayOperation } from "app/tests/resolveMostRecentRelayOperation"
import { SavedAddressesFormContainer, SavedAddressesFormQueryRenderer } from "./SavedAddressesForm"

describe(SavedAddressesFormQueryRenderer, () => {
  const TestRenderer = ({ addressId }: { addressId?: string }) => (
    <QueryRenderer<SavedAddressesFormTestsQuery>
      environment={getRelayEnvironment()}
      query={graphql`
        query SavedAddressesFormTestsQuery {
          me {
            ...SavedAddressesForm_me
          }
        }
      `}
      render={({ props, error }) => {
        if (props?.me) {
          return <SavedAddressesFormContainer me={props.me} addressId={addressId} />
        } else if (error) {
          console.log(error)
        }
      }}
      variables={{}}
    />
  )

  it("render form screen", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer />).root
    resolveMostRecentRelayOperation({
      Me: () => ({
        id: "some-id",
        phone: "9379992",
        addressConnection: {
          edges: [],
        },
      }),
    })

    expect(tree.findAllByType(Input).length).toEqual(7)
    expect(tree.findAllByType(PhoneInput).length).toEqual(1)
    expect(tree.findAllByType(Checkbox).length).toEqual(1)
    expect(tree.findAllByType(Button).length).toEqual(1)
  })

  it("should display correct address data if it is Edit Address modal", () => {
    const tree = renderWithWrappersLEGACY(<TestRenderer addressId="5861" />).root
    resolveMostRecentRelayOperation({
      Me: () => ({
        id: "some-id",
        phone: "9379992",
        addressConnection: {
          edges: [
            {
              node: {
                id: "VXNlckFkZHJlc3M6NTg2MQ==",
                internalID: "5861",
                name: "George Testing",
                addressLine1: "401 Broadway",
                addressLine2: "24th Floor",
                addressLine3: null,
                city: "New York",
                region: "New York",
                postalCode: "NY 10013",
                phoneNumber: "1293581028945",
              },
            },
          ],
        },
      }),
    })
    const text = extractText(tree)

    expect(text).toContain("Edit Address")
    expect(text).toContain("Delete address")
  })
})
