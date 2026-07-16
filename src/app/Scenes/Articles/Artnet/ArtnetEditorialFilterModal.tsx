import {
  Button,
  Checkbox,
  Flex,
  Input,
  RadioButton,
  Separator,
  Spacer,
  Text,
  useScreenDimensions,
} from "@artsy/palette-mobile"
import { NavigationHeader } from "app/Components/NavigationHeader"
import {
  ArtnetEditorialFilters,
  ArtnetFacetOption,
  countActiveArtnetFilters,
} from "app/Scenes/Articles/Artnet/artnetGatewayV2"
import { useArtnetFilterFacets } from "app/Scenes/Articles/Artnet/useArtnetFilterFacets"
import { useEffect, useState } from "react"
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
  const { top, bottom } = useScreenDimensions().safeAreaInsets
  const { facets, loading, error } = useArtnetFilterFacets(visible)

  const [staged, setStaged] = useState<ArtnetEditorialFilters>(currentFilters)

  // reset staged edits to the currently-applied filters whenever the modal opens,
  // so closing without applying discards changes
  useEffect(() => {
    if (visible) {
      setStaged(currentFilters)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visible])

  const toggleFacet = (key: FacetKey, value: string) => {
    setStaged((prev) => {
      const selected = prev[key] ?? []
      const next = selected.includes(value)
        ? selected.filter((v) => v !== value)
        : [...selected, value]
      return { ...prev, [key]: next }
    })
  }

  const stagedCount = countActiveArtnetFilters(staged)

  return (
    <Modal visible={visible} onRequestClose={onClose} animationType="slide">
      <Flex flex={1} backgroundColor="mono0" pt={Platform.OS === "ios" ? `${top}px` : 0}>
        <NavigationHeader
          useXButton
          onLeftButtonPress={onClose}
          rightButtonText="Clear"
          rightButtonDisabled={stagedCount === 0}
          onRightButtonPress={() => setStaged({ sort: staged.sort ?? "DESC" })}
        >
          Filters
        </NavigationHeader>

        <ScrollView contentContainerStyle={{ padding: 20 }}>
          <Input
            title="Search"
            placeholder="Search articles"
            value={staged.search ?? ""}
            onChangeText={(text) => setStaged((prev) => ({ ...prev, search: text }))}
            returnKeyType="search"
          />

          <Spacer y={2} />
          <Separator />
          <Spacer y={2} />

          <Text variant="sm-display" mb={1}>
            Sort
          </Text>
          <Flex flexDirection="row" alignItems="center">
            <RadioButton
              selected={(staged.sort ?? "DESC") === "DESC"}
              onPress={() => setStaged((prev) => ({ ...prev, sort: "DESC" }))}
              text="Newest first"
            />
            <Spacer x={4} />
            <RadioButton
              selected={staged.sort === "ASC"}
              onPress={() => setStaged((prev) => ({ ...prev, sort: "ASC" }))}
              text="Oldest first"
            />
          </Flex>

          {!!error && (
            <>
              <Spacer y={2} />
              <Text variant="xs" color="mono60">
                Couldn't load filter options: {error.message}
              </Text>
            </>
          )}

          <FacetSection
            title="Section"
            options={facets.sections}
            selected={staged.sectionIds ?? []}
            loading={loading}
            onToggle={(value) => toggleFacet("sectionIds", value)}
          />
          <FacetSection
            title="Topic"
            options={facets.topics}
            selected={staged.topicSlugs ?? []}
            loading={loading}
            onToggle={(value) => toggleFacet("topicSlugs", value)}
          />
          <FacetSection
            title="Author"
            options={facets.authors}
            selected={staged.authorNicenames ?? []}
            loading={loading}
            onToggle={(value) => toggleFacet("authorNicenames", value)}
          />

          <Spacer y={2} />
        </ScrollView>

        <Flex
          p={2}
          pb={`${bottom || 20}px`}
          borderTopWidth={1}
          borderTopColor="mono10"
          backgroundColor="mono0"
        >
          <Button
            block
            haptic
            onPress={() => {
              onApply(staged)
              onClose()
            }}
          >
            {stagedCount > 0 ? `Apply filters (${stagedCount})` : "Apply filters"}
          </Button>
        </Flex>
      </Flex>
    </Modal>
  )
}

interface FacetSectionProps {
  title: string
  options: ArtnetFacetOption[]
  selected: string[]
  loading: boolean
  onToggle: (value: string) => void
}

const FacetSection: React.FC<FacetSectionProps> = ({
  title,
  options,
  selected,
  loading,
  onToggle,
}) => {
  // hide the section until its options load (unless already loaded empty)
  if (!options.length) {
    return null
  }

  return (
    <>
      <Spacer y={2} />
      <Separator />
      <Spacer y={2} />
      <Text variant="sm-display" mb={1}>
        {title}
      </Text>
      {options.map((option) => (
        <Checkbox
          key={option.value}
          checked={selected.includes(option.value)}
          onPress={() => onToggle(option.value)}
          accessibilityLabel={option.label}
          mb={1}
        >
          <Text>
            {option.label} <Text color="mono60">({option.count})</Text>
          </Text>
        </Checkbox>
      ))}
      {!!loading && (
        <Text variant="xs" color="mono60">
          Updating…
        </Text>
      )}
    </>
  )
}
