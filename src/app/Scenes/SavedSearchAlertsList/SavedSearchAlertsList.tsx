import { SavedSearchAlertsList_me$data } from "__generated__/SavedSearchAlertsList_me.graphql"
import { SavedSearchAlertsListQuery } from "__generated__/SavedSearchAlertsListQuery.graphql"
import { PageWithSimpleHeader } from "app/Components/PageWithSimpleHeader"
import { defaultEnvironment } from "app/relay/createEnvironment"
import { renderWithPlaceholder } from "app/utils/renderWithPlaceholder"
import React, { useState } from "react"
import { createFragmentContainer, graphql, QueryRenderer } from "react-relay"
import { SavedSearchAlertsListPlaceholder } from "./Components/SavedSearchAlertsListPlaceholder"
import { SavedSearchesListContainer as SavedSearchesList } from "./Components/SavedSearchesList"
import { SortButton } from "./Components/SortButton"
import { SortByModal, SortOption } from "./Components/SortByModal"

interface SavedSearchAlertsListProps {
  me: SavedSearchAlertsList_me$data
}

const SORT_OPTIONS: SortOption[] = [
  { value: "CREATED_AT_DESC", text: "Recently Added" },
  { value: "NAME_ASC", text: "Name (A-Z)" },
]

export const SavedSearchAlertsList: React.FC<SavedSearchAlertsListProps> = (props) => {
  const { me } = props
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedSortValue, setSelectedSortValue] = useState("CREATED_AT_DESC")

  const handleCloseModal = () => {
    setModalVisible(false)
  }

  const handleSelectOption = (option: SortOption) => {
    setSelectedSortValue(option.value)
    handleCloseModal()
  }

  return (
    <PageWithSimpleHeader
      title="Saved Alerts"
      right={<SortButton onPress={() => setModalVisible(true)} />}
    >
      <SavedSearchesList me={me} />
      <SortByModal
        visible={modalVisible}
        options={SORT_OPTIONS}
        selectedValue={selectedSortValue}
        onCloseModal={handleCloseModal}
        onSelectOption={handleSelectOption}
      />
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
