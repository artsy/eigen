import { SavedSearchAlertsList_me$data } from "__generated__/SavedSearchAlertsList_me.graphql"
import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { FancyModal } from "app/Components/FancyModal/FancyModal"
import { FancyModalHeader } from "app/Components/FancyModal/FancyModalHeader"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { TouchableRow } from "app/Components/TouchableRow"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import { Flex, RadioDot, Text } from "palette"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from "./Components/SavedSearchAlertsListPlaceholder"
import { SavedSearchesListContainer as SavedSearchesList } from "./Components/SavedSearchesList"
import { SortButton } from "./Components/SortButton"

interface SavedSearchAlertsListProps {
  me: SavedSearchAlertsList_me$data
}

interface SortOption {
  value: "CREATED_AT_DESC" | "NAME_ASC"
  text: string
}

const SORT_OPTIONS: SortOption[] = [
  { value: "CREATED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

export const SavedSearchAlertsList: React.FC<SavedSearchAlertsListProps> = (props) => {
  const { me } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSortValue, setSelectedSortValue] = useState("CREATED_AT_DESC")

  const closeModal = () => {
    setModalVisible(false)
  }

  const handleSelectOption = (option: SortOption) => {
    setSelectedSortValue(option.value)
    closeModal()
  }

  return (
    <PageWithSimpleHeader
      title="Saved Alerts"
      right={<SortButton onPress={() => setModalVisible(true)} />}
    >
      <SavedSearchesList me={me} />

      <FancyModal visible={modalVisible} maxHeight={250} onBackgroundPressed={closeModal}>
        <FancyModalHeader useXButton onLeftButtonPress={closeModal}>
          Sort By
        </FancyModalHeader>
        {SORT_OPTIONS.map((option) => (
          <TouchableRow key={option.value} onPress={() => handleSelectOption(option)}>
            <Flex flexDirection="row" p={2} alignItems="center" justifyContent="space-between">
              <Flex flex={1} mr={1}>
                <Text numberOfLines={2}>{option.text}</Text>
              </Flex>
              <RadioDot selected={selectedSortValue === option.value} />
            </Flex>
          </TouchableRow>
        ))}
      </FancyModal>
    </PageWithSimpleHeader>
  )
}

export const SavedSearchAlertsListFragmentContainer = createFragmentContainer(
  SavedSearchAlertsList,
  {
    me: graphql`
      fragment SavedSearchAlertsList_me on Me {
        ...SavedSearchesList_me
      }
    `,
  }
)

export const SavedSearchAlertsListQueryRenderer: React.FC = () => {
  return (
    <QueryRenderer<SavedSearchAlertsListQuery>
      environment={defaultEnvironment}
      query={graphql`
        query SavedSearchAlertsListQuery {
          me {
            ...SavedSearchAlertsList_me
          }
        }
      `}
      variables={{}}
      cacheConfig={{ force: true }}
      render={renderWithPlaceholder({
        Container: SavedSearchAlertsListFragmentContainer,
        renderPlaceholder: () => (
          <PageWithSimpleHeader title="Saved Alerts" right={<SortButton disabled />}>
            <SavedSearchAlertsListPlaceholder />
          </PageWithSimpleHeader>
        ),
      })}
    />
  )
}
