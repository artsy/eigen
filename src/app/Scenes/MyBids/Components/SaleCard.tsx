import { ActionType, ContextModule, OwnerType } from "@artsy/cohesion"
import { SaleCard_me$data } from "__generated__/SaleCard_me.graphql"
import { SaleCard_sale$data } from "__generated__/SaleCard_sale.graphql"
import OpaqueImageView from "app/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "app/navigation/navigate"
import { SaleInfo } from "app/Scenes/MyBids/Components/SaleInfo"
import { ArrowRightIcon, Flex, Separator, Text, Touchable } from "palette"
import { ClockFill, ExclamationMarkCircleFill } from "palette/svgs/sf"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"
import { CompleteRegistrationCTAWrapper } from "../Components/CompleteRegistrationCTAWrapper"

export const COVER_IMAGE_HEIGHT = 100

export const RegistrationCTAWrapper: React.FunctionComponent<{ navLink?: string }> = (props) => (
  <Touchable
    style={{ marginTop: 15 }}
    underlayColor={props.navLink ? "black5" : "transparent"}
    onPress={() => props.navLink && navigate(props.navLink)}
  >
    <Flex flexDirection="row" alignItems="center" justifyContent="center" py={1} bg="black5" mt={1}>
      {!props.children && (
        <>
          <ExclamationMarkCircleFill fill="black100" />
          <Text mx={0.5} variant="sm">
            Complete registration
          </Text>
          <ArrowRightIcon />
        </>
      )}
      {props.children}
    </Flex>
  </Touchable>
)

interface SaleCardProps {
  sale: SaleCard_sale$data
  me: SaleCard_me$data
  smallScreen?: boolean
  hideChildren?: boolean
}

export const SaleCard: React.FC<SaleCardProps> = ({
  sale,
  me,
  smallScreen,
  hideChildren,
  children,
}) => {
  const { registrationStatus, internalID } = sale
  const tracking = useTracking()
  const pendingIdentityVerification = me.pendingIdentityVerification
  const shouldPromptIdVerification =
    !registrationStatus?.qualifiedForBidding &&
    sale.requireIdentityVerification &&
    !me.identityVerified &&
    !!pendingIdentityVerification
  let RegistrationCTA: React.FC

  if (registrationStatus) {
    if (registrationStatus?.qualifiedForBidding) {
      RegistrationCTA = () => null
    } else if (shouldPromptIdVerification) {
      RegistrationCTA = () => (
        <CompleteRegistrationCTAWrapper
          navLink={`/identity-verification/${me.pendingIdentityVerification?.internalID}`}
          saleID={internalID}
        />
      )
    } else {
      RegistrationCTA = () => (
        <RegistrationCTAWrapper>
          <ClockFill fill="black60" />
          <Text ml={0.5} color="black60" variant="sm">
            Registration pending
          </Text>
        </RegistrationCTAWrapper>
      )
    }
  } else {
    RegistrationCTA = () => (
      <RegistrationCTAWrapper navLink={`/auction-registration/${sale.slug}`} />
    )
  }

  return (
    <Touchable
      underlayColor="transparent"
      activeOpacity={0.8}
      onPress={() => {
        tracking.trackEvent({
          action: ActionType.tappedAuctionGroup,
          context_module: ContextModule.inboxActiveBids,
          context_screen_owner_type: OwnerType.inboxBids,
          destination_screen_owner_type: OwnerType.sale,
          destination_screen_owner_id: sale?.internalID,
          destination_screen_owner_slug: sale?.slug,
          type: "thumbnail",
        })

        navigate(sale?.href as string)
      }}
    >
      <Flex overflow="hidden" borderWidth={1} borderStyle="solid" borderColor="black10">
        <OpaqueImageView height={COVER_IMAGE_HEIGHT} imageURL={sale?.coverImage?.url} />
        <Flex style={{ margin: smallScreen! ? 10 : 15 }}>
          {!!sale.partner?.name && (
            <Text variant="xs" color="black60">
              {sale?.partner?.name}
            </Text>
          )}
          <Text variant="md">{sale?.name}</Text>

          <SaleInfo sale={sale} />
          <RegistrationCTA />
        </Flex>
        {!hideChildren && (
          <>
            <Separator mt={1} />
            <Flex style={{ marginHorizontal: smallScreen! ? 10 : 20, marginVertical: 10 }}>
              {children}
            </Flex>
          </>
        )}
      </Flex>
    </Touchable>
  )
}

export const SaleCardFragmentContainer = createFragmentContainer(SaleCard, {
  sale: graphql`
    fragment SaleCard_sale on Sale {
      internalID
      href
      slug
      name
      liveStartAt
      endAt
      coverImage {
        url
      }
      partner {
        name
      }
      registrationStatus {
        qualifiedForBidding
      }
      requireIdentityVerification
    }
  `,
  me: graphql`
    fragment SaleCard_me on Me {
      identityVerified
      pendingIdentityVerification {
        internalID
      }
    }
  `,
})
