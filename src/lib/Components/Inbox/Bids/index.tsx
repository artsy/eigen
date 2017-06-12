import * as React from "react"
import * as Relay from "react-relay"
import { View } from "react-native"
import { LargeHeadline } from "../typography"

class ActiveBids extends React.Component<any, any> {
  render() {
    console.log(this.props.me)
    return (
      <View>
        <LargeHeadline>Active Bids</LargeHeadline>
      </View>
    )
  }
}


export default Relay.createContainer(ActiveBids, {
  fragments: {
    me: () => Relay.QL`
      fragment on Me {
        lot_standings(active_positions: true) {
          active_bid {
            id
            display_max_bid_amount_dollars
            max_bid {
              cents
              display
            }
            sale_artwork {
              lot_label
              lot_number
              position
              highest_bid {
                cents
                display
              }
              artwork {
                id
                title
                image {
                  image_url
                }
                artist {
                  name
                }
              }
            }
          }
        }
      }
    `
  }
})