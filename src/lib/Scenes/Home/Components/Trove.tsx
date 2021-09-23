import { Trove_trove } from "__generated__/Trove_trove.graphql"
import { HeroUnit } from "lib/Components/Home/HeroUnit"
import { navigate } from "lib/navigation/navigate"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"

const Trove: React.FC<{ trove: Trove_trove }> = ({ trove }) => {
  const troveUnit = trove?.heroUnits?.find((itm) => itm?.title === "Trove")
  if (!troveUnit || !troveUnit.backgroundImageURL || !troveUnit.href) {
    return null
  }

  const handleOnPress = () => {
    const path = troveUnit.href!
    // tracking.trackEvent(tappedPromoSpace({ path, subject: unit.title! }))
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
