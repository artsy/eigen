import { LoggedOutTabPlaceholder } from "app/Components/AuthBottomSheet/LoggedOutTabPlaceholder"
import { registerScreen, StackNavigator } from "app/Navigation/AuthenticatedRoutes/StackNavigator"
import { sharedRoutes } from "app/Navigation/AuthenticatedRoutes/sharedRoutes"
import { modules } from "app/Navigation/utils/modules"
import { GlobalStore } from "app/store/GlobalStore"

export const FavoritesTab: React.FC = () => {
  const userID = GlobalStore.useAppState((state) => state.auth.userID)

  if (!userID) {
    return (
      <LoggedOutTabPlaceholder
        title="Favorites"
        body="Save artworks you love. Sign up or log in to start your collection."
        intent="save_artwork"
      />
    )
  }

  return (
    <StackNavigator.Navigator screenOptions={{ headerShown: false }} initialRouteName="Favorites">
      {registerScreen({
        name: "Favorites",
        module: modules["Favorites"],
      })}

      {sharedRoutes()}
    </StackNavigator.Navigator>
  )
}
