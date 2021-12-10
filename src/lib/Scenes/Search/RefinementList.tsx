import PropTypes from "prop-types"
import React from "react"
import { connectRefinementList } from "react-instantsearch-core"
import { StyleSheet, Text, TouchableOpacity, View } from "react-native"

const styles = StyleSheet.create({
  // fill with styles on the next step
})

const RefinementList = ({ attribute, items, refine }) => (
  <View>
    <View>
      <Text style={{ fontSize: 20, fontWeight: "bold" }}>{attribute}</Text>
    </View>
    <View>
      {items.map((item) => {
        const labelStyle = {
          fontSize: 16,
          fontWeight: item.isRefined ? "800" : "400",
        }

        return (
          <TouchableOpacity key={item.value} onPress={() => refine(item.value)} style={styles.item}>
            <Text style={labelStyle}>{item.label}</Text>
          </TouchableOpacity>
        )
      })}
    </View>
  </View>
)

const ItemPropType = PropTypes.shape({
  value: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired,
  isRefined: PropTypes.bool.isRequired,
})

RefinementList.propTypes = {
  items: PropTypes.arrayOf(ItemPropType).isRequired,
  refine: PropTypes.func.isRequired,
}

export default connectRefinementList(RefinementList)
