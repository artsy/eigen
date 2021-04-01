/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0508262e82b7c77f9a37d38c6dd9e176 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type InboxTestsQueryVariables = {};
export type InboxTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Inbox_me">;
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
    id
  }
}

fragment ActiveLotStanding_lotStanding on AuctionsLotStanding {
  isHighestBidder
  lot {
    internalID
    bidCount
    reserveStatus
    soldStatus
    askingPrice: onlineAskingPrice {
      display
    }
    sellingPrice {
      display
    }
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    artwork {
      internalID
      href
      slug
      id
    }
    sale {
      liveStartAt
      id
    }
    id
  }
}

fragment ClosedLotStanding_lotStanding on AuctionsLotStanding {
  isHighestBidder
  lot {
    internalID
    saleId
    bidCount
    reserveStatus
    soldStatus
    sellingPrice {
      display
    }
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    artwork {
      internalID
      href
      slug
      id
    }
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
        items {
          item {
            __typename
            ... on Artwork {
              internalID
              partner {
                internalID
                id
              }
            }
            ... on Node {
              __isNode: __typename
              id
            }
          }
        }
        id
        __typename
      }
      cursor
    }
    totalUnreadCount
  }
}

fragment Inbox_me on Me {
  ...Conversations_me
  ...MyBids_me
}

fragment LotStatusListItem_lot on Lot {
  ...WatchedLot_lot
}

fragment LotStatusListItem_lotStanding on AuctionsLotStanding {
  ...ActiveLotStanding_lotStanding
  ...ClosedLotStanding_lotStanding
  lot {
    soldStatus
    id
  }
}

fragment Lot_saleArtwork on SaleArtwork {
  lotLabel
  artwork {
    artistNames
    image {
      url(version: "medium")
    }
    id
  }
}

fragment MyBids_me on Me {
  ...SaleCard_me
  bidders(active: true) {
    sale {
      internalID
      ...SaleCard_sale
      registrationStatus {
        qualifiedForBidding
        id
      }
      liveStartAt
      endAt
      status
      id
    }
    id
  }
  auctionsLotStandingConnection(first: 50) {
    edges {
      node {
        isHighestBidder
        ...LotStatusListItem_lotStanding
        lot {
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
  watchedLotConnection(first: 100) {
    edges {
      node {
        ...LotStatusListItem_lot
        lot {
          internalID
          id
        }
        saleArtwork {
          internalID
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

fragment SaleCard_me on Me {
  identityVerified
  pendingIdentityVerification {
    internalID
    id
  }
}

fragment SaleCard_sale on Sale {
  internalID
  href
  slug
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
  registrationStatus {
    qualifiedForBidding
    id
  }
  requireIdentityVerification
}

fragment WatchedLot_lot on Lot {
  lot {
    internalID
    bidCount
    sellingPrice {
      display
    }
    soldStatus
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    artwork {
      internalID
      href
      slug
      id
    }
    sale {
      liveStartAt
      endAt
      status
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = [
  (v2/*: any*/),
  (v3/*: any*/)
],
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v8 = [
  (v1/*: any*/),
  (v3/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": (v7/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liveStartAt",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": (v4/*: any*/),
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "Bidder",
  "kind": "LinkedField",
  "name": "registrationStatus",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "qualifiedForBidding",
      "storageKey": null
    },
    (v3/*: any*/)
  ],
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requireIdentityVerification",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v20 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v20/*: any*/),
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "Artwork",
  "kind": "LinkedField",
  "name": "artwork",
  "plural": false,
  "selections": [
    (v6/*: any*/),
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
    (v3/*: any*/),
    (v1/*: any*/),
    (v10/*: any*/),
    (v11/*: any*/)
  ],
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v25 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v26 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v29 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v30 = {
  "enumValues": [
    "ForSale",
    "Passed",
    "Sold"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsSoldStatus"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v34 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v35 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v37 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v39 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
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
            "alias": "conversations",
            "args": (v0/*: any*/),
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
                      (v1/*: any*/),
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
                        "selections": (v4/*: any*/),
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
                              (v5/*: any*/),
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
                                  (v6/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "image",
                                    "plural": false,
                                    "selections": (v7/*: any*/),
                                    "storageKey": null
                                  },
                                  (v1/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Partner",
                                    "kind": "LinkedField",
                                    "name": "partner",
                                    "plural": false,
                                    "selections": (v8/*: any*/),
                                    "storageKey": null
                                  }
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
                                    "selections": (v4/*: any*/),
                                    "storageKey": null
                                  },
                                  (v2/*: any*/),
                                  (v9/*: any*/)
                                ],
                                "type": "Show",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v3/*: any*/)
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
                      (v3/*: any*/),
                      (v5/*: any*/)
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
            "args": (v0/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "Conversations_conversations",
            "kind": "LinkedHandle",
            "name": "conversationsConnection"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "identityVerified",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "IdentityVerification",
            "kind": "LinkedField",
            "name": "pendingIdentityVerification",
            "plural": false,
            "selections": (v8/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "active",
                "value": true
              }
            ],
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "bidders",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "sale",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v2/*: any*/),
                  (v12/*: any*/),
                  (v13/*: any*/),
                  (v9/*: any*/),
                  (v14/*: any*/),
                  (v15/*: any*/),
                  (v16/*: any*/),
                  (v17/*: any*/),
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              (v3/*: any*/)
            ],
            "storageKey": "bidders(active:true)"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 50
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
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v18/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "reserveStatus",
                            "storageKey": null
                          },
                          (v19/*: any*/),
                          {
                            "alias": "askingPrice",
                            "args": null,
                            "concreteType": "Money",
                            "kind": "LinkedField",
                            "name": "onlineAskingPrice",
                            "plural": false,
                            "selections": (v20/*: any*/),
                            "storageKey": null
                          },
                          (v21/*: any*/),
                          (v3/*: any*/),
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
                          (v22/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/),
                              (v3/*: any*/),
                              (v13/*: any*/),
                              (v17/*: any*/),
                              (v1/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v2/*: any*/),
                              (v9/*: any*/),
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v24/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "auctionsLotStandingConnection(first:50)"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 100
              }
            ],
            "concreteType": "LotConnection",
            "kind": "LinkedField",
            "name": "watchedLotConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LotEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Lot",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v18/*: any*/),
                          (v21/*: any*/),
                          (v19/*: any*/),
                          (v3/*: any*/)
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
                          (v22/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/),
                              (v13/*: any*/),
                              (v17/*: any*/),
                              (v3/*: any*/),
                              (v1/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/),
                              (v2/*: any*/),
                              (v9/*: any*/),
                              (v14/*: any*/),
                              (v15/*: any*/),
                              (v16/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/),
                          (v1/*: any*/),
                          (v24/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "watchedLotConnection(first:100)"
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0508262e82b7c77f9a37d38c6dd9e176",
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
        "me.auctionsLotStandingConnection.edges.node.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": (v26/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotState"
        },
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice": (v27/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice.display": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.bidCount": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.internalID": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.reserveStatus": {
          "enumValues": [
            "NoReserve",
            "ReserveMet",
            "ReserveNotMet"
          ],
          "nullable": false,
          "plural": false,
          "type": "AuctionsReserveStatus"
        },
        "me.auctionsLotStandingConnection.edges.node.lot.saleId": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice": (v27/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice.display": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.soldStatus": (v30/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.internalID": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.slug": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": (v34/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v35/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.slug": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v28/*: any*/),
        "me.bidders": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Bidder"
        },
        "me.bidders.id": (v25/*: any*/),
        "me.bidders.sale": (v35/*: any*/),
        "me.bidders.sale.coverImage": (v33/*: any*/),
        "me.bidders.sale.coverImage.url": (v28/*: any*/),
        "me.bidders.sale.endAt": (v28/*: any*/),
        "me.bidders.sale.href": (v28/*: any*/),
        "me.bidders.sale.id": (v25/*: any*/),
        "me.bidders.sale.internalID": (v25/*: any*/),
        "me.bidders.sale.liveStartAt": (v28/*: any*/),
        "me.bidders.sale.name": (v28/*: any*/),
        "me.bidders.sale.partner": (v36/*: any*/),
        "me.bidders.sale.partner.id": (v25/*: any*/),
        "me.bidders.sale.partner.name": (v28/*: any*/),
        "me.bidders.sale.registrationStatus": (v37/*: any*/),
        "me.bidders.sale.registrationStatus.id": (v25/*: any*/),
        "me.bidders.sale.registrationStatus.qualifiedForBidding": (v38/*: any*/),
        "me.bidders.sale.requireIdentityVerification": (v38/*: any*/),
        "me.bidders.sale.slug": (v25/*: any*/),
        "me.bidders.sale.status": (v28/*: any*/),
        "me.conversations": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ConversationConnection"
        },
        "me.conversations.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ConversationEdge"
        },
        "me.conversations.edges.cursor": (v39/*: any*/),
        "me.conversations.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Conversation"
        },
        "me.conversations.edges.node.__typename": (v39/*: any*/),
        "me.conversations.edges.node.id": (v25/*: any*/),
        "me.conversations.edges.node.internalID": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
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
        "me.conversations.edges.node.items.item.__isNode": (v39/*: any*/),
        "me.conversations.edges.node.items.item.__typename": (v39/*: any*/),
        "me.conversations.edges.node.items.item.artistNames": (v28/*: any*/),
        "me.conversations.edges.node.items.item.coverImage": (v33/*: any*/),
        "me.conversations.edges.node.items.item.coverImage.url": (v28/*: any*/),
        "me.conversations.edges.node.items.item.date": (v28/*: any*/),
        "me.conversations.edges.node.items.item.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "me.conversations.edges.node.items.item.fair.id": (v25/*: any*/),
        "me.conversations.edges.node.items.item.fair.name": (v28/*: any*/),
        "me.conversations.edges.node.items.item.id": (v25/*: any*/),
        "me.conversations.edges.node.items.item.image": (v33/*: any*/),
        "me.conversations.edges.node.items.item.image.url": (v28/*: any*/),
        "me.conversations.edges.node.items.item.internalID": (v25/*: any*/),
        "me.conversations.edges.node.items.item.name": (v28/*: any*/),
        "me.conversations.edges.node.items.item.partner": (v36/*: any*/),
        "me.conversations.edges.node.items.item.partner.id": (v25/*: any*/),
        "me.conversations.edges.node.items.item.partner.internalID": (v25/*: any*/),
        "me.conversations.edges.node.items.item.title": (v28/*: any*/),
        "me.conversations.edges.node.lastMessage": (v28/*: any*/),
        "me.conversations.edges.node.lastMessageAt": (v28/*: any*/),
        "me.conversations.edges.node.last_message": (v28/*: any*/),
        "me.conversations.edges.node.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversations.edges.node.to.id": (v25/*: any*/),
        "me.conversations.edges.node.to.name": (v39/*: any*/),
        "me.conversations.edges.node.unread": (v38/*: any*/),
        "me.conversations.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversations.pageInfo.endCursor": (v28/*: any*/),
        "me.conversations.pageInfo.hasNextPage": (v26/*: any*/),
        "me.conversations.totalUnreadCount": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "me.id": (v25/*: any*/),
        "me.identityVerified": (v38/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v25/*: any*/),
        "me.pendingIdentityVerification.internalID": (v25/*: any*/),
        "me.watchedLotConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "LotConnection"
        },
        "me.watchedLotConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "LotEdge"
        },
        "me.watchedLotConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Lot"
        },
        "me.watchedLotConnection.edges.node.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.lot": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionsLotState"
        },
        "me.watchedLotConnection.edges.node.lot.bidCount": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.lot.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.lot.internalID": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice": (v27/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice.display": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.lot.soldStatus": (v30/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork": (v31/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artistNames": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.href": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image.url": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.internalID": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.slug": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.internalID": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.lotLabel": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.position": (v34/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale": (v35/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage.url": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.endAt": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.href": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.internalID": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.liveStartAt": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.name": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.name": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus": (v37/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.slug": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.status": (v28/*: any*/)
      }
    },
    "name": "InboxTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '0664d6807c9c2d53864ad6240891c43f';
export default node;
