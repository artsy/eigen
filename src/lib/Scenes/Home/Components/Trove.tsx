import { Trove_trove } from "__generated__/Trove_trove.graphql"
import { HeroUnit } from "lib/Components/Home/HeroUnit"
import { navigate } from "lib/navigation/navigate"
import React, { useEffect } from "react"
import { createFragmentContainer, graphql } from "react-relay"

interface TroveProps {
  trove: Trove_trove
  onHide?: () => void
  onShow?: () => void
}

const Trove: React.FC<TroveProps> = ({ trove, onHide, onShow }) => {
  const troveUnit = trove?.heroUnits?.find((itm) => itm?.title === "Trove")

  const showTrove = !!troveUnit && !!troveUnit.backgroundImageURL && !!troveUnit.href

  useEffect(() => {
    showTrove ? onShow?.() : onHide?.()
  }, [showTrove])

  if (!showTrove) {
    return null
  }

  const handleOnPress = () => {
    const path = troveUnit!.href!
    navigate(path)
  }

  return <HeroUnit unit={troveUnit} onPress={handleOnPress} isTrove />
}

export const TroveContainer = createFragmentContainer(Trove, {
  trove: graphql`
    fragment Trove_trove on HomePage @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
      heroUnits(platform: MOBILE) {
        title
        subtitle
        creditLine
        href
        backgroundImageURL(version: $heroImageVersion)
      }
    }
  `,
})
