import { Flex, Text } from "@artsy/palette-mobile"
import { graphql, useFragment } from "react-relay"

export const HomeViewSectionGeneric: React.FC<{ section: any }> = (props) => {
  const { section } = props

  const data = useFragment(genericSectionFragment, section)
  const title = data.component?.title

  return (
    <Flex bg="black5" alignItems="center">
      <Text color="black60" p={2}>
        Need to render the{" "}
        <Text color="black100" fontSize="80%">
          {section.internalID}
        </Text>{" "}
        section as a{" "}
        <Text color="blue100" fontSize="80%">
          {section.__typename}
        </Text>{" "}
        component, titled{" "}
        <Text color="black100" fontWeight="bold">
          {title}
        </Text>{" "}
      </Text>
    </Flex>
  )
}

const genericSectionFragment = graphql`
  fragment HomeViewSectionGeneric_section on HomeViewSectionGeneric {
    __typename
    internalID
    component {
      title
      type
    }
  }
`
