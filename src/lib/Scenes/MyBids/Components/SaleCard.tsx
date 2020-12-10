import OpaqueImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import { navigate } from "lib/navigation/navigate"
import { SaleInfo } from "lib/Scenes/MyBids/Components/SaleInfo"
import { ArrowRightIcon, Flex, Join, Separator, Text, Touchable } from "palette"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

import { ClockFill, ExclamationMarkCircleFill } from "palette/svgs/sf"

import { SaleCard_me } from "__generated__/SaleCard_me.graphql"
import { SaleCard_sale } from "__generated__/SaleCard_sale.graphql"

import { ActiveLotFragmentContainer as ActiveLot, ClosedLotFragmentContainer as ClosedLot } from "."
import { isLotStandingComplete } from "../helpers/timely"

export const COVER_IMAGE_HEIGHT = 100

export const RegistrationCTAWrapper: React.FunctionComponent<{ navLink?: string }> = (props) => (
  <Touchable
    underlayColor={props.navLink ? "black5" : "transparent"}
    onPress={() => props.navLink && navigate(props.navLink)}
  >
    <Flex flexDirection="row" alignItems="center" justifyContent="center" py={1} bg="black5" mt={1}>
      {!props.children && (
        <>
          <ExclamationMarkCircleFill fill="black100" />
          <Text mx={0.5} variant="mediumText">
            Complete registration
          </Text>
          <ArrowRightIcon />
        </>
      )}
      {props.children}
    </Flex>
  </Touchable>
)

const ContentWrapper: React.FC<{ smallScreen?: boolean }> = (props) => (
  <>
    <Separator mt={1} />
    <Flex style={{ marginHorizontal: props.smallScreen! ? 10 : 20, marginVertical: 10 }}>{props.children}</Flex>
  </>
)

export class SaleCard extends React.Component<{
  sale: SaleCard_sale
  me: SaleCard_me
  smallScreen?: boolean
  lotStandings?: any[]
}> {
  render() {
    const { sale, me, smallScreen, lotStandings } = this.props
    const { registrationStatus } = sale

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
          <RegistrationCTAWrapper navLink={`/identity-verification/${me.pendingIdentityVerification?.internalID}`} />
        )
      } else {
        RegistrationCTA = () => (
          <RegistrationCTAWrapper>
            <ClockFill fill="black60" />
            <Text ml={0.5} color="black60" variant="mediumText">
              Registration pending
            </Text>
          </RegistrationCTAWrapper>
        )
      }
    } else {
      RegistrationCTA = () => <RegistrationCTAWrapper navLink={`/auction-registration/${sale.slug}`} />
    }

    return (
      <React.Fragment>
        <Touchable underlayColor="transparent" activeOpacity={0.8} onPress={() => navigate(sale?.href as string)}>
          <Flex overflow="hidden" borderWidth={1} borderStyle="solid" borderColor="black10" borderRadius={4}>
            <OpaqueImageView height={COVER_IMAGE_HEIGHT} imageURL={sale?.coverImage?.url} />
            <Flex style={{ margin: smallScreen! ? 10 : 15 }}>
              {!!sale.partner?.name && (
                <Text variant="small" color="black60">
                  {sale?.partner?.name}
                </Text>
              )}
              <Text variant="title">{sale?.name}</Text>

              <SaleInfo sale={sale} />
              <RegistrationCTA />
            </Flex>
            {!lotStandings && !!registrationStatus?.qualifiedForBidding && (
              <ContentWrapper smallScreen={smallScreen}>
                <Text color="black60" py={1} textAlign="center">
                  You haven't placed any bids on this sale
                </Text>
              </ContentWrapper>
            )}
            {!!lotStandings && (
              <ContentWrapper smallScreen={smallScreen}>
                <Join separator={<Separator my={1} />}>
                  {lotStandings.map((ls) => {
                    if (ls && sale) {
                      const LotInfoComponent = isLotStandingComplete(ls) ? ClosedLot : ActiveLot
                      return <LotInfoComponent lotStanding={ls} key={ls?.lotState?.internalID} />
                    }
                  })}
                </Join>
              </ContentWrapper>
            )}
          </Flex>
        </Touchable>
      </React.Fragment>
    )
  }
}

export const SaleCardFragmentContainer = createFragmentContainer(SaleCard, {
  sale: graphql`
    fragment SaleCard_sale on Sale {
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
