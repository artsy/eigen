import { ContextModule } from "@artsy/cohesion"
import { AlertFillIcon, ChevronRightIcon } from "@artsy/icons/native"
import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { navigate } from "app/system/navigation/navigate"
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
      accessibilityRole="button"
      style={{ marginTop: 15 }}
      underlayColor="mono5"
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
        bg="mono5"
        mt={1}
      >
        <>
          <AlertFillIcon fill="mono100" />
          <Text mx={0.5} variant="sm">
            Complete registration
          </Text>
          <ChevronRightIcon />
        </>
      </Flex>
    </Touchable>
  )
}
