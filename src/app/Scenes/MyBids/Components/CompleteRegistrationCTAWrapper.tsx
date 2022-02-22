import { ContextModule } from "@artsy/cohesion"
import { navigate } from "app/navigation/navigate"
import { ArrowRightIcon, Flex, Text, Touchable } from "palette"
import { ExclamationMarkCircleFill } from "palette/svgs/sf"
import React from "react"
import { useTracking } from "react-tracking"

interface CompleteRegistrationCTAWrapperProps {
  navLink: string
  saleID: string
}

export const CompleteRegistrationCTAWrapper: React.FunctionComponent<
  CompleteRegistrationCTAWrapperProps
> = ({ navLink, saleID }) => {
  const tracking = useTracking()

  return (
    <Touchable
      style={{ marginTop: 15 }}
      underlayColor="black5"
      onPress={() => {
        tracking.trackEvent({
          action: "tappedVerifyIdentity",
          context_module: ContextModule.inboxActiveBids,
          context_screen_owner_type: "inboxBids",
          sale_id: saleID,
          subject: "Complete registration",
        })

        navigate(navLink)
      }}
    >
      <Flex
        flexDirection="row"
        alignItems="center"
        justifyContent="center"
        py={1}
        bg="black5"
        mt={1}
      >
        {
          <>
            <ExclamationMarkCircleFill fill="black100" />
            <Text mx={0.5} variant="sm">
              Complete registration
            </Text>
            <ArrowRightIcon />
          </>
        }
      </Flex>
    </Touchable>
  )
}
