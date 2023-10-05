import { Join, Spacer } from "@artsy/palette-mobile"
import { AppliedFilters } from "app/Components/NewArtworkFilter/NewArtworkFilterAppliedFilters"

export const NewArtworkFilter: React.FC<{}> = () => {
  return (
    <Join separator={<Spacer y={4} />}>
      <AppliedFilters />
    </Join>
  )
}
