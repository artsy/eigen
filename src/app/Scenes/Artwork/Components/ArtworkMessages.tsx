import { Banner } from "@artsy/palette-mobile"

export const UnavailableOfferMessage: React.FC = () => {
  return (
    <Banner
      variant="brand"
      text="Sorry, this artwork is no longer available. Please create an alert or contact the gallery to find similar artworks."
      dismissable
    />
  )
}

export const ExpiredOfferMessage: React.FC = () => {
  return (
    <Banner
      variant="brand"
      text="This offer has expired. Please make an offer, purchase, or contact the gallery."
      dismissable
    />
  )
}
