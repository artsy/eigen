import { fireEvent, screen } from "@testing-library/react-native"
import { SellConditionPhoto } from "app/Scenes/Sell/Components/SellConditionPhotos"
import { SellConditionRating } from "app/Scenes/Sell/Components/SellConditionRatingPicker"
import { SellConditionSection } from "app/Scenes/Sell/Components/SellConditionSection"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { useState } from "react"

const TestConditionSection: React.FC = () => {
  const [rating, setRating] = useState<SellConditionRating | null>(null)
  const [photos, setPhotos] = useState<SellConditionPhoto[]>([])
  const [notes, setNotes] = useState("")

  return (
    <SellConditionSection
      rating={rating}
      onRatingChange={setRating}
      photos={photos}
      onPhotosChange={setPhotos}
      notes={notes}
      onNotesChange={setNotes}
    />
  )
}

describe("SellConditionSection", () => {
  it("keeps the rating and notes the user enters", () => {
    renderWithWrappers(<TestConditionSection />)

    fireEvent.press(screen.getByRole("radio", { name: /^Fair\./ }))
    fireEvent.changeText(screen.getByLabelText("Notes"), "Small tear at the corner")

    expect(screen.getByRole("radio", { name: /^Fair\./ })).toBeChecked()
    expect(screen.getByLabelText("Notes")).toHaveDisplayValue("Small tear at the corner")
  })
})
