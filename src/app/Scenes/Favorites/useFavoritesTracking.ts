import { ActionType, ContextModule, OwnerType, TappedInfoBubble } from "@artsy/cohesion"
import {
  SelectedFromDrawer,
  SelectedFromDrawerSubject,
  TappedAlertsGroup,
  TappedArtworkList,
  TappedNewArtworkList,
  TappedOfferSettings,
} from "@artsy/cohesion/dist/Schema/Events/Favorites"
import { FavoritesTab } from "app/Scenes/Favorites/FavoritesContextStore"
import { useTracking } from "react-tracking"

export const useFavoritesTracking = () => {
  const { trackEvent } = useTracking()

  const trackTappedNavigationTab = (key: FavoritesTab) => {
    const payload = {
      action: ActionType.tappedNavigationTab,
      context_module: key,
      subject: key,
    }

    trackEvent(payload)
  }

  const trackTappedInfoBubble = (activeTab: FavoritesTab) => {
    let contextScreen: ContextModule

    switch (activeTab) {
      case "saves":
        contextScreen = ContextModule.favoritesSaves
        break
      case "follows":
        contextScreen = ContextModule.favoritesFollows
        break
      case "alerts":
        contextScreen = ContextModule.favoritesAlerts
        break
      default:
        throw new Error(`Unhandled tab: ${activeTab}`)
    }

    const payload: TappedInfoBubble = {
      action: ActionType.tappedInfoBubble,
      context_screen_owner_type: OwnerType.favorites,
      context_module: contextScreen,
      subject: "favoritesHeader",
    }

    trackEvent(payload)
  }

  const trackTappedOfferSettings = () => {
    const payload: TappedOfferSettings = {
      action: ActionType.tappedOfferSettings,
      context_screen: OwnerType.favoritesSaves,
    }

    trackEvent(payload)
  }

  const trackTappedNewArtworkList = () => {
    const payload: TappedNewArtworkList = {
      action: ActionType.tappedNewArtworkList,
      context_screen: OwnerType.favoritesSaves,
    }

    trackEvent(payload)
  }

  const trackTappedArtworkList = (internalID: string) => {
    const payload: TappedArtworkList = {
      action: ActionType.tappedArtworkList,
      destination_screen_owner_type: OwnerType.artworkList,
      destination_screen_owner_id: internalID,
    }

    trackEvent(payload)
  }

  const trackSelectedFromDrawer = (value: SelectedFromDrawerSubject) => {
    const payload: SelectedFromDrawer = {
      action: ActionType.selectedFromDrawer,
      context_screen: OwnerType.favoritesFollows,
      subject: value,
    }

    trackEvent(payload)
  }

  const trackTappedAlertsGroup = (alertId: string) => {
    const payload: TappedAlertsGroup = {
      action: ActionType.tappedAlertsGroup,
      context_screen: OwnerType.favoritesAlerts,
      destination_screen_owner_type: OwnerType.alert,
      destination_screen_owner_id: alertId,
    }

    trackEvent(payload)
  }

  return {
    trackTappedNavigationTab,
    trackTappedInfoBubble,
    trackTappedOfferSettings,
    trackTappedNewArtworkList,
    trackTappedArtworkList,
    trackSelectedFromDrawer,
    trackTappedAlertsGroup,
  }
}
