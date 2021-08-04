import { PageWithSimpleHeader } from "lib/Components/PageWithSimpleHeader"
import { useScreenDimensions } from 'lib/utils/useScreenDimensions'
import { Separator, useTheme } from "palette"
import React from "react"
import { FlatList } from "react-native"
import { AlertListItem } from "./Components/AlertListItem"

const data = Array.from(new Array(100), (_, index) => ({
  id: `alert-${index}`,
  label: `Saved Alert ${index}`,
}))

export const SavedSearchAlertsList: React.FC<{}> = () => {
  const { space } = useTheme()
  const { width } = useScreenDimensions()
  const handlePressItem = () => {
    console.log("pressed")
  }

  return (
    <PageWithSimpleHeader title="Saved Alerts">
      <FlatList
        data={data}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <Separator width={width - 2 * space(2)} mx={2} />}
        renderItem={({ item }) => {
          return <AlertListItem title={item.label} pills={["Unique", "Painting", "$10,000-$50,000", "Limted Edition"]} onPress={handlePressItem} />
        }}
      />
    </PageWithSimpleHeader>
  )
}
