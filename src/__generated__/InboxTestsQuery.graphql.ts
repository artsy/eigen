/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 099ba9820f02db1ed8b111dc6e2b920b */

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

fragment ActiveLot_lotStanding on AuctionsLotStanding {
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

fragment ClosedLot_lotStanding on AuctionsLotStanding {
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

fragment LotStatusListItem_lot on LotLike {
  __isLotLike: __typename
  type: __typename
  lot {
    soldStatus
    id
  }
  ...ActiveLot_lotStanding
  ...ClosedLot_lotStanding
  ...WatchedLot_lot
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
  identityVerified
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
  auctionsLotStandingConnection(first: 25, after: "") {
    edges {
      node {
        ...LotStatusListItem_lot
        ...ClosedLot_lotStanding
        __typename
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
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  watchedLotConnection(first: 20, after: "") {
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
  lotState: lot {
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
      href
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
var v0 = {
  "kind": "Literal",
  "name": "after",
  "value": ""
},
v1 = [
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 10
  }
],
v2 = [
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v6 = [
  (v4/*: any*/),
  (v5/*: any*/)
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v9 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "url",
    "storageKey": null
  }
],
v10 = [
  (v3/*: any*/),
  (v5/*: any*/)
],
v11 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": (v9/*: any*/),
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liveStartAt",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": (v6/*: any*/),
  "storageKey": null
},
v18 = {
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
    (v5/*: any*/)
  ],
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requireIdentityVerification",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "concreteType": "Sale",
  "kind": "LinkedField",
  "name": "sale",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v13/*: any*/),
    (v14/*: any*/),
    (v4/*: any*/),
    (v15/*: any*/),
    (v16/*: any*/),
    (v11/*: any*/),
    (v17/*: any*/),
    (v18/*: any*/),
    (v19/*: any*/),
    (v20/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v22 = [
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  }
],
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isHighestBidder",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleId",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reserveStatus",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v28 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v29 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v28/*: any*/),
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v31 = {
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
v32 = {
  "alias": null,
  "args": null,
  "concreteType": "Artwork",
  "kind": "LinkedField",
  "name": "artwork",
  "plural": false,
  "selections": [
    (v8/*: any*/),
    (v31/*: any*/),
    (v5/*: any*/),
    (v3/*: any*/),
    (v13/*: any*/),
    (v14/*: any*/)
  ],
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v34 = {
  "alias": "type",
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v35 = {
  "alias": "askingPrice",
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "onlineAskingPrice",
  "plural": false,
  "selections": (v28/*: any*/),
  "storageKey": null
},
v36 = {
  "alias": "lotState",
  "args": null,
  "concreteType": "AuctionsLotState",
  "kind": "LinkedField",
  "name": "lot",
  "plural": false,
  "selections": [
    (v3/*: any*/),
    (v25/*: any*/),
    (v29/*: any*/),
    (v27/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v37 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v38 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v39 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v40 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "AuctionsLotState"
},
v41 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
},
v42 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v43 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v44 = {
  "enumValues": [
    "NoReserve",
    "ReserveMet",
    "ReserveNotMet"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsReserveStatus"
},
v45 = {
  "enumValues": [
    "ForSale",
    "Passed",
    "Sold"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsSoldStatus"
},
v46 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "SaleArtwork"
},
v47 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v48 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v49 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v50 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v51 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v52 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v53 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v54 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
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
            "args": (v1/*: any*/),
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
                "selections": (v2/*: any*/),
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
                      (v3/*: any*/),
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
                        "selections": (v6/*: any*/),
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
                              (v7/*: any*/),
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
                                  (v8/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "image",
                                    "plural": false,
                                    "selections": (v9/*: any*/),
                                    "storageKey": null
                                  },
                                  (v3/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Partner",
                                    "kind": "LinkedField",
                                    "name": "partner",
                                    "plural": false,
                                    "selections": (v10/*: any*/),
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
                                    "selections": (v6/*: any*/),
                                    "storageKey": null
                                  },
                                  (v4/*: any*/),
                                  (v11/*: any*/)
                                ],
                                "type": "Show",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v5/*: any*/)
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
                      (v5/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v12/*: any*/)
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
            "args": (v1/*: any*/),
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
            "selections": (v10/*: any*/),
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
              (v21/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": "bidders(active:true)"
          },
          {
            "alias": null,
            "args": (v22/*: any*/),
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
                      (v23/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v24/*: any*/),
                          (v25/*: any*/),
                          (v26/*: any*/),
                          (v27/*: any*/),
                          (v29/*: any*/),
                          (v5/*: any*/)
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
                          (v30/*: any*/),
                          (v32/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v16/*: any*/),
                              (v20/*: any*/),
                              (v5/*: any*/),
                              (v3/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v4/*: any*/),
                              (v15/*: any*/),
                              (v11/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/),
                          (v33/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v7/*: any*/),
                      (v5/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v34/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AuctionsLotState",
                                "kind": "LinkedField",
                                "name": "lot",
                                "plural": false,
                                "selections": [
                                  (v35/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "AuctionsLotStanding",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v36/*: any*/)
                            ],
                            "type": "Lot",
                            "abstractKey": null
                          }
                        ],
                        "type": "LotLike",
                        "abstractKey": "__isLotLike"
                      }
                    ],
                    "storageKey": null
                  },
                  (v12/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AuctionsPageInfo",
                "kind": "LinkedField",
                "name": "pageInfo",
                "plural": false,
                "selections": (v2/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": "auctionsLotStandingConnection(after:\"\",first:25)"
          },
          {
            "alias": null,
            "args": (v22/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyBids_auctionsLotStandingConnection",
            "kind": "LinkedHandle",
            "name": "auctionsLotStandingConnection"
          },
          {
            "alias": null,
            "args": [
              (v0/*: any*/),
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
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
                        "selections": (v10/*: any*/),
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
                          (v3/*: any*/),
                          (v33/*: any*/),
                          (v21/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v34/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionsLotState",
                            "kind": "LinkedField",
                            "name": "lot",
                            "plural": false,
                            "selections": [
                              (v27/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v23/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AuctionsLotState",
                                "kind": "LinkedField",
                                "name": "lot",
                                "plural": false,
                                "selections": [
                                  (v25/*: any*/),
                                  (v26/*: any*/),
                                  (v35/*: any*/),
                                  (v29/*: any*/),
                                  (v24/*: any*/)
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
                                  (v30/*: any*/),
                                  (v32/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "AuctionsLotStanding",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v36/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtwork",
                                "kind": "LinkedField",
                                "name": "saleArtwork",
                                "plural": false,
                                "selections": [
                                  (v30/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Artwork",
                                    "kind": "LinkedField",
                                    "name": "artwork",
                                    "plural": false,
                                    "selections": [
                                      (v8/*: any*/),
                                      (v31/*: any*/),
                                      (v5/*: any*/),
                                      (v13/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "Lot",
                            "abstractKey": null
                          }
                        ],
                        "type": "LotLike",
                        "abstractKey": "__isLotLike"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "watchedLotConnection(after:\"\",first:20)"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "099ba9820f02db1ed8b111dc6e2b920b",
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
        "me.auctionsLotStandingConnection.edges.cursor": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStanding"
        },
        "me.auctionsLotStandingConnection.edges.node.__isLotLike": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.__typename": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": (v39/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot": (v40/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice": (v41/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice.display": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.bidCount": (v43/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.internalID": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.reserveStatus": (v44/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.saleId": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice": (v41/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice.display": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.soldStatus": (v45/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState": (v40/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.bidCount": (v43/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.internalID": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.sellingPrice": (v41/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.sellingPrice.display": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.soldStatus": (v45/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v46/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v47/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v48/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.internalID": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.slug": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": (v49/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v50/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v48/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": (v51/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus": (v52/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v53/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v53/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.slug": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.type": (v37/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsPageInfo"
        },
        "me.auctionsLotStandingConnection.pageInfo.endCursor": (v42/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo.hasNextPage": (v39/*: any*/),
        "me.bidders": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Bidder"
        },
        "me.bidders.id": (v38/*: any*/),
        "me.bidders.sale": (v50/*: any*/),
        "me.bidders.sale.coverImage": (v48/*: any*/),
        "me.bidders.sale.coverImage.url": (v42/*: any*/),
        "me.bidders.sale.endAt": (v42/*: any*/),
        "me.bidders.sale.href": (v42/*: any*/),
        "me.bidders.sale.id": (v38/*: any*/),
        "me.bidders.sale.internalID": (v38/*: any*/),
        "me.bidders.sale.liveStartAt": (v42/*: any*/),
        "me.bidders.sale.name": (v42/*: any*/),
        "me.bidders.sale.partner": (v51/*: any*/),
        "me.bidders.sale.partner.id": (v38/*: any*/),
        "me.bidders.sale.partner.name": (v42/*: any*/),
        "me.bidders.sale.registrationStatus": (v52/*: any*/),
        "me.bidders.sale.registrationStatus.id": (v38/*: any*/),
        "me.bidders.sale.registrationStatus.qualifiedForBidding": (v53/*: any*/),
        "me.bidders.sale.requireIdentityVerification": (v53/*: any*/),
        "me.bidders.sale.slug": (v38/*: any*/),
        "me.bidders.sale.status": (v42/*: any*/),
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
        "me.conversations.edges.cursor": (v37/*: any*/),
        "me.conversations.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Conversation"
        },
        "me.conversations.edges.node.__typename": (v37/*: any*/),
        "me.conversations.edges.node.id": (v38/*: any*/),
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
        "me.conversations.edges.node.items.item.__isNode": (v37/*: any*/),
        "me.conversations.edges.node.items.item.__typename": (v37/*: any*/),
        "me.conversations.edges.node.items.item.artistNames": (v42/*: any*/),
        "me.conversations.edges.node.items.item.coverImage": (v48/*: any*/),
        "me.conversations.edges.node.items.item.coverImage.url": (v42/*: any*/),
        "me.conversations.edges.node.items.item.date": (v42/*: any*/),
        "me.conversations.edges.node.items.item.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "me.conversations.edges.node.items.item.fair.id": (v38/*: any*/),
        "me.conversations.edges.node.items.item.fair.name": (v42/*: any*/),
        "me.conversations.edges.node.items.item.id": (v38/*: any*/),
        "me.conversations.edges.node.items.item.image": (v48/*: any*/),
        "me.conversations.edges.node.items.item.image.url": (v42/*: any*/),
        "me.conversations.edges.node.items.item.internalID": (v38/*: any*/),
        "me.conversations.edges.node.items.item.name": (v42/*: any*/),
        "me.conversations.edges.node.items.item.partner": (v51/*: any*/),
        "me.conversations.edges.node.items.item.partner.id": (v38/*: any*/),
        "me.conversations.edges.node.items.item.partner.internalID": (v38/*: any*/),
        "me.conversations.edges.node.items.item.title": (v42/*: any*/),
        "me.conversations.edges.node.lastMessage": (v42/*: any*/),
        "me.conversations.edges.node.lastMessageAt": (v42/*: any*/),
        "me.conversations.edges.node.last_message": (v42/*: any*/),
        "me.conversations.edges.node.messagesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MessageConnection"
        },
        "me.conversations.edges.node.messagesConnection.totalCount": (v54/*: any*/),
        "me.conversations.edges.node.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversations.edges.node.to.id": (v38/*: any*/),
        "me.conversations.edges.node.to.name": (v37/*: any*/),
        "me.conversations.edges.node.unread": (v53/*: any*/),
        "me.conversations.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversations.pageInfo.endCursor": (v42/*: any*/),
        "me.conversations.pageInfo.hasNextPage": (v39/*: any*/),
        "me.conversations.totalUnreadCount": (v54/*: any*/),
        "me.id": (v38/*: any*/),
        "me.identityVerified": (v53/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v38/*: any*/),
        "me.pendingIdentityVerification.internalID": (v38/*: any*/),
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
        "me.watchedLotConnection.edges.node.__isLotLike": (v37/*: any*/),
        "me.watchedLotConnection.edges.node.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.isHighestBidder": (v39/*: any*/),
        "me.watchedLotConnection.edges.node.lot": (v40/*: any*/),
        "me.watchedLotConnection.edges.node.lot.askingPrice": (v41/*: any*/),
        "me.watchedLotConnection.edges.node.lot.askingPrice.display": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.lot.bidCount": (v43/*: any*/),
        "me.watchedLotConnection.edges.node.lot.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.lot.internalID": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.lot.reserveStatus": (v44/*: any*/),
        "me.watchedLotConnection.edges.node.lot.saleId": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice": (v41/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice.display": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.lot.soldStatus": (v45/*: any*/),
        "me.watchedLotConnection.edges.node.lotState": (v40/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.bidCount": (v43/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.internalID": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.sellingPrice": (v41/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.sellingPrice.display": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.soldStatus": (v45/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork": (v46/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork": (v47/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artistNames": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.href": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image": (v48/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image.url": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.internalID": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.slug": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.internalID": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.lotLabel": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.position": (v49/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale": (v50/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage": (v48/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage.url": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.endAt": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.href": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.internalID": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.liveStartAt": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.name": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner": (v51/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.name": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus": (v52/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v53/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v53/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.slug": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.status": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.type": (v37/*: any*/)
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
