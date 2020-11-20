/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 68cc0c67d78d123177899171d155a57a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InboxTestsQueryVariables = {};
export type InboxTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Inbox_me" | "MyBids_me">;
    } | null;
};
export type InboxTestsQuery = {
    readonly response: InboxTestsQueryResponse;
    readonly variables: InboxTestsQueryVariables;
};



/*
query InboxTestsQuery {
  me {
    ...Inbox_me
    ...MyBids_me
    id
  }
}

fragment ActiveBid_bid on LotStanding {
  is_leading_bidder: isLeadingBidder
  sale {
    href
    is_live_open: isLiveOpen
    id
  }
  most_recent_bid: mostRecentBid {
    id
    sale_artwork: saleArtwork {
      artwork {
        href
        image {
          url
        }
        artist_names: artistNames
        id
      }
      counts {
        bidder_positions: bidderPositions
      }
      highest_bid: highestBid {
        display
      }
      lot_label: lotLabel
      reserve_status: reserveStatus
      id
    }
  }
}

fragment ActiveBids_me on Me {
  lot_standings: lotStandings(live: true) {
    most_recent_bid: mostRecentBid {
      id
    }
    ...ActiveBid_bid
  }
}

fragment ActiveLot_lotStanding on AuctionsLotStanding {
  isHighestBidder
  lotState {
    internalID
    bidCount
    reserveStatus
    soldStatus
    askingPrice: onlineAskingPrice {
      displayAmount(fractionalDigits: 0)
    }
    sellingPrice: floorSellingPrice {
      displayAmount(fractionalDigits: 0)
    }
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    sale {
      liveStartAt
      id
    }
    id
  }
}

fragment ClosedLot_lotStanding on AuctionsLotStanding {
  isHighestBidder
  lotState {
    internalID
    saleId
    bidCount
    reserveStatus
    soldStatus
    askingPrice: onlineAskingPrice {
      displayAmount(fractionalDigits: 0)
    }
    sellingPrice: floorSellingPrice {
      displayAmount(fractionalDigits: 0)
    }
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    sale {
      endAt
      status
      id
    }
    id
  }
}

fragment ConversationSnippet_conversation on Conversation {
  internalID
  to {
    name
    id
  }
  lastMessage
  lastMessageAt
  unread
  items {
    item {
      __typename
      ... on Artwork {
        date
        title
        artistNames
        image {
          url
        }
      }
      ... on Show {
        fair {
          name
          id
        }
        name
        coverImage {
          url
        }
      }
      ... on Node {
        __isNode: __typename
        id
      }
    }
  }
  messagesConnection {
    totalCount
  }
}

fragment Conversations_me on Me {
  conversations: conversationsConnection(first: 10, after: "") {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        internalID
        last_message: lastMessage
        ...ConversationSnippet_conversation
        id
        __typename
      }
      cursor
    }
    totalUnreadCount
  }
}

fragment Inbox_me on Me {
  lot_standings: lotStandings(live: true) {
    most_recent_bid: mostRecentBid {
      id
    }
  }
  conversations_existence_check: conversationsConnection(first: 1) {
    edges {
      node {
        internalID
        id
      }
    }
  }
  ...Conversations_me
  ...ActiveBids_me
}

fragment Lot_saleArtwork on SaleArtwork {
  lotLabel
  artwork {
    artistNames
    href
    image {
      url(version: "medium")
    }
    id
  }
}

fragment MyBids_me on Me {
  auctionsLotStandingConnection(first: 25) {
    edges {
      node {
        ...ActiveLot_lotStanding
        ...ClosedLot_lotStanding
        lotState {
          internalID
          saleId
          soldStatus
          id
        }
        saleArtwork {
          position
          sale {
            ...SaleCard_sale
            internalID
            liveStartAt
            endAt
            status
            id
          }
          id
        }
        id
      }
    }
  }
}

fragment SaleCard_sale on Sale {
  href
  name
  liveStartAt
  endAt
  coverImage {
    url
  }
  partner {
    name
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v2 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v5 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = [
  (v6/*: any*/),
  (v0/*: any*/)
],
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": (v2/*: any*/),
  "storageKey": null
},
v11 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Literal",
        "name": "fractionalDigits",
        "value": 0
      }
    ],
    "kind": "ScalarField",
    "name": "displayAmount",
    "storageKey": "displayAmount(fractionalDigits:0)"
  }
],
v12 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v14 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v20 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ConversationConnection"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ConversationEdge"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Conversation"
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "ID"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "InboxTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Inbox_me"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyBids_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "InboxTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": "lot_standings",
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true
              }
            ],
            "concreteType": "LotStanding",
            "kind": "LinkedField",
            "name": "lotStandings",
            "plural": true,
            "selections": [
              {
                "alias": "most_recent_bid",
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "mostRecentBid",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "alias": "sale_artwork",
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "kind": "LinkedField",
                    "name": "saleArtwork",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "artwork",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v3/*: any*/),
                          {
                            "alias": "artist_names",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          (v0/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtworkCounts",
                        "kind": "LinkedField",
                        "name": "counts",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "bidder_positions",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bidderPositions",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": "highest_bid",
                        "args": null,
                        "concreteType": "SaleArtworkHighestBid",
                        "kind": "LinkedField",
                        "name": "highestBid",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "display",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": "lot_label",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lotLabel",
                        "storageKey": null
                      },
                      {
                        "alias": "reserve_status",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "reserveStatus",
                        "storageKey": null
                      },
                      (v0/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "is_leading_bidder",
                "args": null,
                "kind": "ScalarField",
                "name": "isLeadingBidder",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "sale",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "alias": "is_live_open",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isLiveOpen",
                    "storageKey": null
                  },
                  (v0/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "lotStandings(live:true)"
          },
          {
            "alias": "conversations_existence_check",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ConversationConnection",
            "kind": "LinkedField",
            "name": "conversationsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Conversation",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v0/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "conversationsConnection(first:1)"
          },
          {
            "alias": "conversations",
            "args": (v5/*: any*/),
            "concreteType": "ConversationConnection",
            "kind": "LinkedField",
            "name": "conversationsConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "ConversationEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Conversation",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "alias": "last_message",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lastMessage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ConversationResponder",
                        "kind": "LinkedField",
                        "name": "to",
                        "plural": false,
                        "selections": (v7/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lastMessage",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "lastMessageAt",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "unread",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ConversationItem",
                        "kind": "LinkedField",
                        "name": "items",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "item",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "date",
                                    "storageKey": null
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "title",
                                    "storageKey": null
                                  },
                                  (v9/*: any*/),
                                  (v3/*: any*/)
                                ],
                                "type": "Artwork",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Fair",
                                    "kind": "LinkedField",
                                    "name": "fair",
                                    "plural": false,
                                    "selections": (v7/*: any*/),
                                    "storageKey": null
                                  },
                                  (v6/*: any*/),
                                  (v10/*: any*/)
                                ],
                                "type": "Show",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v0/*: any*/)
                                ],
                                "type": "Node",
                                "abstractKey": "__isNode"
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "MessageConnection",
                        "kind": "LinkedField",
                        "name": "messagesConnection",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "totalCount",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v0/*: any*/),
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "totalUnreadCount",
                "storageKey": null
              }
            ],
            "storageKey": "conversationsConnection(after:\"\",first:10)"
          },
          {
            "alias": "conversations",
            "args": (v5/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "Conversations_conversations",
            "kind": "LinkedHandle",
            "name": "conversationsConnection"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 25
              }
            ],
            "concreteType": "AuctionsLotStandingConnection",
            "kind": "LinkedField",
            "name": "auctionsLotStandingConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AuctionsLotStandingEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionsLotStanding",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isHighestBidder",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lotState",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "bidCount",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "reserveStatus",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "soldStatus",
                            "storageKey": null
                          },
                          {
                            "alias": "askingPrice",
                            "args": null,
                            "concreteType": "AuctionsMoney",
                            "kind": "LinkedField",
                            "name": "onlineAskingPrice",
                            "plural": false,
                            "selections": (v11/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": "sellingPrice",
                            "args": null,
                            "concreteType": "AuctionsMoney",
                            "kind": "LinkedField",
                            "name": "floorSellingPrice",
                            "plural": false,
                            "selections": (v11/*: any*/),
                            "storageKey": null
                          },
                          (v0/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleId",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "lotLabel",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v9/*: any*/),
                              (v1/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "medium"
                                      }
                                    ],
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"medium\")"
                                  }
                                ],
                                "storageKey": null
                              },
                              (v0/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "liveStartAt",
                                "storageKey": null
                              },
                              (v0/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "status",
                                "storageKey": null
                              },
                              (v1/*: any*/),
                              (v6/*: any*/),
                              (v10/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Partner",
                                "kind": "LinkedField",
                                "name": "partner",
                                "plural": false,
                                "selections": (v7/*: any*/),
                                "storageKey": null
                              },
                              (v4/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v0/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "position",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v0/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "auctionsLotStandingConnection(first:25)"
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "68cc0c67d78d123177899171d155a57a",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.auctionsLotStandingConnection": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStandingConnection"
        },
        "me.auctionsLotStandingConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AuctionsLotStandingEdge"
        },
        "me.auctionsLotStandingConnection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStanding"
        },
        "me.auctionsLotStandingConnection.edges.node.id": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": (v13/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotState"
        },
        "me.auctionsLotStandingConnection.edges.node.lotState.askingPrice": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsMoney"
        },
        "me.auctionsLotStandingConnection.edges.node.lotState.askingPrice.displayAmount": (v14/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.bidCount": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "me.auctionsLotStandingConnection.edges.node.lotState.id": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.internalID": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.reserveStatus": {
          "enumValues": [
            "NoReserve",
            "ReserveMet",
            "ReserveNotMet"
          ],
          "nullable": false,
          "plural": false,
          "type": "AuctionsReserveStatus"
        },
        "me.auctionsLotStandingConnection.edges.node.lotState.saleId": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.sellingPrice": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionsMoney"
        },
        "me.auctionsLotStandingConnection.edges.node.lotState.sellingPrice.displayAmount": (v14/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.soldStatus": {
          "enumValues": [
            "ForSale",
            "Passed",
            "Sold"
          ],
          "nullable": false,
          "plural": false,
          "type": "AuctionsSoldStatus"
        },
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v15/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v16/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v18/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v18/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v12/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v17/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v17/*: any*/),
        "me.conversations": (v20/*: any*/),
        "me.conversations.edges": (v21/*: any*/),
        "me.conversations.edges.cursor": (v14/*: any*/),
        "me.conversations.edges.node": (v22/*: any*/),
        "me.conversations.edges.node.__typename": (v14/*: any*/),
        "me.conversations.edges.node.id": (v12/*: any*/),
        "me.conversations.edges.node.internalID": (v23/*: any*/),
        "me.conversations.edges.node.items": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ConversationItem"
        },
        "me.conversations.edges.node.items.item": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ConversationItemType"
        },
        "me.conversations.edges.node.items.item.__isNode": (v14/*: any*/),
        "me.conversations.edges.node.items.item.__typename": (v14/*: any*/),
        "me.conversations.edges.node.items.item.artistNames": (v17/*: any*/),
        "me.conversations.edges.node.items.item.coverImage": (v18/*: any*/),
        "me.conversations.edges.node.items.item.coverImage.url": (v17/*: any*/),
        "me.conversations.edges.node.items.item.date": (v17/*: any*/),
        "me.conversations.edges.node.items.item.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "me.conversations.edges.node.items.item.fair.id": (v12/*: any*/),
        "me.conversations.edges.node.items.item.fair.name": (v17/*: any*/),
        "me.conversations.edges.node.items.item.id": (v12/*: any*/),
        "me.conversations.edges.node.items.item.image": (v18/*: any*/),
        "me.conversations.edges.node.items.item.image.url": (v17/*: any*/),
        "me.conversations.edges.node.items.item.name": (v17/*: any*/),
        "me.conversations.edges.node.items.item.title": (v17/*: any*/),
        "me.conversations.edges.node.lastMessage": (v17/*: any*/),
        "me.conversations.edges.node.lastMessageAt": (v17/*: any*/),
        "me.conversations.edges.node.last_message": (v17/*: any*/),
        "me.conversations.edges.node.messagesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MessageConnection"
        },
        "me.conversations.edges.node.messagesConnection.totalCount": (v24/*: any*/),
        "me.conversations.edges.node.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversations.edges.node.to.id": (v12/*: any*/),
        "me.conversations.edges.node.to.name": (v14/*: any*/),
        "me.conversations.edges.node.unread": (v25/*: any*/),
        "me.conversations.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversations.pageInfo.endCursor": (v17/*: any*/),
        "me.conversations.pageInfo.hasNextPage": (v13/*: any*/),
        "me.conversations.totalUnreadCount": (v24/*: any*/),
        "me.conversations_existence_check": (v20/*: any*/),
        "me.conversations_existence_check.edges": (v21/*: any*/),
        "me.conversations_existence_check.edges.node": (v22/*: any*/),
        "me.conversations_existence_check.edges.node.id": (v12/*: any*/),
        "me.conversations_existence_check.edges.node.internalID": (v23/*: any*/),
        "me.id": (v12/*: any*/),
        "me.lot_standings": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "LotStanding"
        },
        "me.lot_standings.is_leading_bidder": (v25/*: any*/),
        "me.lot_standings.most_recent_bid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "BidderPosition"
        },
        "me.lot_standings.most_recent_bid.id": (v12/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork": (v15/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.artwork": (v16/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.artwork.artist_names": (v17/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.artwork.href": (v17/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.artwork.id": (v12/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.artwork.image": (v18/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.artwork.image.url": (v17/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "me.lot_standings.most_recent_bid.sale_artwork.counts.bidder_positions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FormattedNumber"
        },
        "me.lot_standings.most_recent_bid.sale_artwork.highest_bid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkHighestBid"
        },
        "me.lot_standings.most_recent_bid.sale_artwork.highest_bid.display": (v17/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.id": (v12/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.lot_label": (v17/*: any*/),
        "me.lot_standings.most_recent_bid.sale_artwork.reserve_status": (v17/*: any*/),
        "me.lot_standings.sale": (v19/*: any*/),
        "me.lot_standings.sale.href": (v17/*: any*/),
        "me.lot_standings.sale.id": (v12/*: any*/),
        "me.lot_standings.sale.is_live_open": (v25/*: any*/)
      }
    },
    "name": "InboxTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '20475c56a0a3e6e4bfa0eba53001f297';
export default node;
