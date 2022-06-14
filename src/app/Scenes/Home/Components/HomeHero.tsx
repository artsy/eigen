import { tappedPromoSpace } from "@artsy/cohesion"
import { HomeHero_homePage$data } from "__generated__/HomeHero_homePage.graphql"
import { HeroUnit } from "app/Components/Home/HeroUnit"
import { navigate } from "app/navigation/navigate"
import React from "react"
import { createFragmentContainer, graphql } from "react-relay"
import { useTracking } from "react-tracking"

const HomeHero: React.FC<{ homePage: HomeHero_homePage$data }> = ({ homePage }) => {
  const tracking = useTracking()
  const unit = homePage?.heroUnits?.[0]
  if (!unit || !unit.backgroundImageURL || !unit.href) {
    return null
  }

  const handlePromoSpaceTap = () => {
    const path = unit.href!
    tracking.trackEvent(tappedPromoSpace({ path, subject: unit.title! }))
    navigate(path)
  }

  return <HeroUnit unit={unit} onPress={handlePromoSpaceTap} />
}

export const HomeHeroContainer = createFragmentContainer(HomeHero, {
  homePage: graphql`
    fragment HomeHero_homePage on HomePage
    @argumentDefinitions(heroImageVersion: { type: "HomePageHeroUnitImageVersion" }) {
      heroUnits(platform: MOBILE) {
        title
        subtitle
        creditLine
        linkText
        href
        backgroundImageURL(version: $heroImageVersion)
      }
    }
  `,
})
