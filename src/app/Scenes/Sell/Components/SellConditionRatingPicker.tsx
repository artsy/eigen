import { SellOption, SellOptionCards } from "app/Scenes/Sell/Components/SellOptionCards"

export type SellConditionRating = "POOR" | "FAIR" | "VERY_GOOD" | "EXCELLENT"

const RATINGS: SellOption<SellConditionRating>[] = [
  {
    value: "POOR",
    title: "Poor",
    description: "Significant damage or wear; will need conservation.",
  },
  {
    value: "FAIR",
    title: "Fair",
    description: "Some visible wear or light restoration; structurally sound.",
  },
  {
    value: "VERY_GOOD",
    title: "Very Good",
    description: "Minor, expected wear consistent with age; no conservation needed.",
  },
  {
    value: "EXCELLENT",
    title: "Excellent",
    description: "No visible wear; in original, pristine condition.",
  },
]

interface SellConditionRatingPickerProps {
  value: SellConditionRating | null
  onChange: (rating: SellConditionRating) => void
}

export const SellConditionRatingPicker: React.FC<SellConditionRatingPickerProps> = ({
  value,
  onChange,
}) => <SellOptionCards options={RATINGS} value={value} onChange={onChange} />
