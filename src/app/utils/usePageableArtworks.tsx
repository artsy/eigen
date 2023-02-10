import { GlobalStore } from "app/store/GlobalStore"

interface UsePageableArtworksProps<T> {
  artworks: ReadonlyArray<T>
}

export interface PageableArtworksEvents {
  onEnablePageableArtworks?: () => void
}

export function usePageableArtworks<T extends { slug: string }>(
  props: UsePageableArtworksProps<T>
) {
  const slugs = props.artworks.map((artwork) => artwork.slug)

  const enablePageableArtworks = () => {
    GlobalStore.actions.pageable.setPageableSlugs(slugs)
  }

  return {
    enablePageableArtworks,
  }
}
