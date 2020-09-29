import { FancyModal } from "lib/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "lib/Components/FancyModal/FancyModalHeader"
import { ScreenMargin } from "lib/Scenes/MyCollection/Components/ScreenMargin"
import { AppStore } from "lib/store/AppStore"
import { Spacer, Text } from "palette"
import React, { useEffect, useState } from "react"

export const InfoModal: React.FC<{ show?: boolean }> = ({ show = false }) => {
  const navActions = AppStore.actions.myCollection.navigation
  const infoModalType = AppStore.useAppState((state) => state.myCollection.navigation.sessionState.infoModalType)
  const [showModal, setShowModal] = useState(show)

  useEffect(() => {
    if (infoModalType) {
      setShowModal(true)
    }
  }, [infoModalType])

  if (!infoModalType) {
    return null
  }

  const getModalContent = () => {
    switch (infoModalType) {
      case "artistMarket":
        return {
          title: "Artist Market Insights",
          content: (
            <>
              <Text>
                This data set includes 36 months of auction results from top commercial auction houses and sales hosted
                on Artsy.
              </Text>
              <Spacer my={1} />
              <Text>Last updated Aug 30, 2020.</Text>
            </>
          ),
        }
      case "auctionResults":
        return {
          title: "Auction Data",
          content: (
            <>
              <Text>
                This data set includes 36 months of auction results from top commercial auction houses and sales hosted
                on Artsy.
              </Text>
              <Spacer my={1} />
              <Text>Last updated Aug 30, 2020.</Text>
            </>
          ),
        }
      case "demandIndex":
        return {
          title: "Demand Index",
          content: (
            <>
              <Text>
                Overall strength of demand for this artist and medium combination in the art market. Based on 36 months
                of auction result data including liquidity, sell-through rate, data 3, data 4. 2020.
              </Text>
              <Spacer my={1} />
              <Text>Last updated Aug 30, 2020.</Text>
            </>
          ),
        }
      case "priceEstimate":
        return {
          title: "Estimated Price Range",
          content: (
            <>
              <Text>
                This is an estimated range based on artist, medium, and size, and is not an official valuation for your
                exact artwork. This is based on 36 months of auction result data.
              </Text>
              <Spacer my={1} />
              <Text>Last updated Aug 30, 2020.</Text>
            </>
          ),
        }
    }
  }

  const { title, content } = getModalContent() as { title: string; content: JSX.Element }
  const hideModal = () => {
    setShowModal(false)
    setTimeout(() => {
      navActions.showInfoModal(null)
    }, 400)
  }

  return (
    <FancyModal visible={showModal} onBackgroundPressed={hideModal}>
      <FancyModalHeader onLeftButtonPress={hideModal}>{title}</FancyModalHeader>
      <Spacer my={1} />
      <ScreenMargin>{content}</ScreenMargin>
    </FancyModal>
  )
}
