import { CheckmarkIcon, ChevronRightIcon } from "@artsy/icons/native"
import {
  Flex,
  Separator,
  Spacer,
  Text,
  Touchable,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { NavigationHeader } from "app/Components/NavigationHeader"
import { ArtnetSearchInput } from "app/Scenes/Articles/Artnet/ArtnetSearchInput"
import {
  ArtnetEditorialFilters,
  ArtnetFacetOption,
  countActiveArtnetFilters,
} from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useArtnetFilterFacets } from "app/Scenes/Articles/Artnet/useArtnetFilterFacets"
import { useState } from "react"
import { Modal, Platform, ScrollView } from "react-native"

interface ArtnetEditorialFilterModalProps {
  visible: boolean
  currentFilters: ArtnetEditorialFilters
  onClose: () => void
  onApply: (filters: ArtnetEditorialFilters) => void
}

// which multi-select facet keys map to which filter field
type FacetKey = "sectionIds" | "topicSlugs" | "authorNicenames"

export const ArtnetEditorialFilterModal: React.FC<ArtnetEditorialFilterModalProps> = ({
  visible,
  currentFilters,
  onClose,
  onApply,
}) => {
  const { top } = useScreenDimensions().safeAreaInsets
  const { facets, loading, error } = useArtnetFilterFacets(visible)

  const activeCount = countActiveArtnetFilters(currentFilters)

  // tapping a value replaces all facets with just that one (single-select "browse by"),
  // preserving the inline search + default newest-first sort, then dismisses the modal.
  // re-tapping the currently-active value clears it (shows all articles).
  const selectFacet = (key: FacetKey, value: string) => {
    const isActive = (currentFilters[key] ?? []).includes(value)
    onApply({
      sort: "DESC",
      search: currentFilters.search,
      ...(isActive ? {} : { [key]: [value] }),
    })
    onClose()
  }

  const clearFilters = () => {
    onApply({ sort: "DESC", search: currentFilters.search })
  }

  const sections: { key: FacetKey; title: string; options: ArtnetFacetOption[] }[] = [
    { key: "sectionIds", title: "Section", options: facets.sections },
    { key: "topicSlugs", title: "Topic", options: facets.topics },
    { key: "authorNicenames", title: "Author", options: facets.authors },
  ]

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Flex flex={1} backgroundColor="mono0" pt={Platform.OS === "ios" ? `${top}px` : 0}>
        <NavigationHeader
          useXButton
          onLeftButtonPress={onClose}
          rightButtonText="Clear"
          rightButtonDisabled={activeCount === 0}
          onRightButtonPress={clearFilters}
        >
          Browse By
        </NavigationHeader>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          {!!error && (
            <Text variant="xs" color="mono60">
              Couldn't load filter options: {error.message}
            </Text>
          )}

          {sections
            .filter((section) => section.options.length > 0)
            .map((section, index) => (
              <FacetSection
                key={section.key}
                title={section.title}
                options={section.options}
                selected={currentFilters[section.key] ?? []}
                loading={loading}
                // separators divide sections; skip the leading one to avoid a
                // stray line + whitespace under the header
                showSeparator={index > 0}
                onSelect={(value) => selectFacet(section.key, value)}
              />
            ))}

          <Spacer y={2} />
        </ScrollView>
      </Flex>
    </Modal>
  )
}

interface FacetSectionProps {
  title: string
  options: ArtnetFacetOption[]
  selected: string[]
  loading: boolean
  showSeparator: boolean
  onSelect: (value: string) => void
}

// number of options shown before the list collapses behind the search input
const COLLAPSED_COUNT = 4

const FacetSection: React.FC<FacetSectionProps> = ({
  title,
  options,
  selected,
  loading,
  showSeparator,
  onSelect,
}) => {
  const [query, setQuery] = useState("")

  // hide the section until its options load (unless already loaded empty)
  if (!options.length) {
    return null
  }

  const searchable = options.length > COLLAPSED_COUNT
  const q = query.trim().toLowerCase()

  let visible: ArtnetFacetOption[]
  if (q) {
    // searching: show every client-side match
    visible = options.filter((option) => option.label.toLowerCase().includes(q))
  } else if (searchable) {
    // collapsed: first N, plus any selected beyond that so selections stay visible
    const head = options.slice(0, COLLAPSED_COUNT)
    const extraSelected = options
      .slice(COLLAPSED_COUNT)
      .filter((option) => selected.includes(option.value))
    visible = [...head, ...extraSelected]
  } else {
    visible = options
  }

  const hiddenCount = options.length - visible.length

  return (
    <>
      {!!showSeparator && (
        <>
          <Spacer y={2} />
          <Separator />
          <Spacer y={2} />
        </>
      )}
      <Text variant="sm-display" mb={1}>
        {title}
      </Text>

      {!!searchable && (
        <Flex mb={1}>
          <ArtnetSearchInput
            placeholder={`Search ${title.toLowerCase()}`}
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={() => {}}
            onClear={() => setQuery("")}
          />
        </Flex>
      )}

      {visible.map((option) => {
        const isActive = selected.includes(option.value)
        return (
          <Touchable
            key={option.value}
            haptic
            onPress={() => onSelect(option.value)}
            accessibilityLabel={option.label}
          >
            <Flex flexDirection="row" alignItems="center" justifyContent="space-between" py={1}>
              <Text color={isActive ? "blue100" : "mono100"} numberOfLines={1} style={{ flex: 1 }}>
                {option.label} <Text color="mono60">({option.count})</Text>
              </Text>
              {isActive ? <CheckmarkIcon fill="blue100" /> : <ChevronRightIcon fill="mono60" />}
            </Flex>
          </Touchable>
        )
      })}

      {!q && hiddenCount > 0 && (
        <Text variant="xs" color="mono60">
          Search to see {hiddenCount} more
        </Text>
      )}
      {!!q && visible.length === 0 && (
        <Text variant="xs" color="mono60">
          No matches for "{query.trim()}"
        </Text>
      )}
      {!!loading && (
        <Text variant="xs" color="mono60">
          Updating…
        </Text>
      )}
    </>
  )
}
