import { Button } from "@artsy/palette-mobile"
import { StickyTabPageScrollView } from "app/Components/StickyTabPage/StickyTabPageScrollView"
import { navigate } from "app/system/navigation/navigate"

export const ArtworkLists = () => {
  const handleNavigateToScreen = () => {
    navigate("/artwork-lists/select-lists-for-artwork")
  }

  return (
    <StickyTabPageScrollView contentContainerStyle={{ paddingVertical: 20 }}>
      <Button onPress={handleNavigateToScreen}>Open #1</Button>
    </StickyTabPageScrollView>
  )
}
