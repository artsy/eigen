/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d93e97bdd23b4b7aac9cdb5966218de8 */

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
      ...SaleCard_sale
      registrationStatus {
        qualifiedForBidding
        id
      }
      internalID
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
        ...ActiveLot_lotStanding
        ...ClosedLot_lotStanding
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
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  watchedLotConnection(first: 25, after: "") {
    edges {
      node {
        internalID
        ...WatchedLot_lotStanding
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

fragment WatchedLot_lotStanding on Lot {
  internalID
  saleArtwork {
    id
    lotLabel
    artwork {
      href
      artist {
        name
        id
      }
      myLotStanding {
        isHighestBidder
        isLeadingBidder
      }
      id
    }
  }
  lot {
    internalID
    bidCount
    sellingPrice {
      display
    }
    soldStatus
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
v21 = [
  (v0/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  }
],
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isHighestBidder",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v25 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v25/*: any*/),
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v28 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v29 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v30 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v31 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "AuctionsLotState"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v34 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v35 = {
  "enumValues": [
    "ForSale",
    "Passed",
    "Sold"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsSoldStatus"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v37 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v39 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v40 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v41 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v42 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v43 = {
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
              {
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
              (v5/*: any*/)
            ],
            "storageKey": "bidders(active:true)"
          },
          {
            "alias": null,
            "args": (v21/*: any*/),
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
                      (v22/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v3/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "reserveStatus",
                            "storageKey": null
                          },
                          (v24/*: any*/),
                          {
                            "alias": "askingPrice",
                            "args": null,
                            "concreteType": "Money",
                            "kind": "LinkedField",
                            "name": "onlineAskingPrice",
                            "plural": false,
                            "selections": (v25/*: any*/),
                            "storageKey": null
                          },
                          (v26/*: any*/),
                          (v5/*: any*/),
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
                          (v27/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
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
                              (v5/*: any*/),
                              (v3/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/)
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
                              (v15/*: any*/),
                              (v5/*: any*/),
                              (v16/*: any*/),
                              (v20/*: any*/),
                              (v3/*: any*/),
                              (v13/*: any*/),
                              (v14/*: any*/),
                              (v4/*: any*/),
                              (v11/*: any*/),
                              (v17/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v5/*: any*/),
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
            "args": (v21/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyBids_auctionsLotStandingConnection",
            "kind": "LinkedHandle",
            "name": "auctionsLotStandingConnection"
          },
          {
            "alias": null,
            "args": (v21/*: any*/),
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
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          (v5/*: any*/),
                          (v27/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v13/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Artist",
                                "kind": "LinkedField",
                                "name": "artist",
                                "plural": false,
                                "selections": (v6/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "LotStanding",
                                "kind": "LinkedField",
                                "name": "myLotStanding",
                                "plural": true,
                                "selections": [
                                  (v22/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isLeadingBidder",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
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
                          (v3/*: any*/),
                          (v23/*: any*/),
                          (v26/*: any*/),
                          (v24/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "watchedLotConnection(after:\"\",first:25)"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d93e97bdd23b4b7aac9cdb5966218de8",
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
        "me.auctionsLotStandingConnection.edges.cursor": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStanding"
        },
        "me.auctionsLotStandingConnection.edges.node.__typename": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": (v30/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice.display": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.bidCount": (v34/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.internalID": (v29/*: any*/),
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
        "me.auctionsLotStandingConnection.edges.node.lot.saleId": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice.display": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.soldStatus": (v35/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.internalID": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.slug": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v39/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": (v40/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus": (v41/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.slug": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v33/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsPageInfo"
        },
        "me.auctionsLotStandingConnection.pageInfo.endCursor": (v33/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo.hasNextPage": (v30/*: any*/),
        "me.bidders": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Bidder"
        },
        "me.bidders.id": (v29/*: any*/),
        "me.bidders.sale": (v39/*: any*/),
        "me.bidders.sale.coverImage": (v38/*: any*/),
        "me.bidders.sale.coverImage.url": (v33/*: any*/),
        "me.bidders.sale.endAt": (v33/*: any*/),
        "me.bidders.sale.href": (v33/*: any*/),
        "me.bidders.sale.id": (v29/*: any*/),
        "me.bidders.sale.internalID": (v29/*: any*/),
        "me.bidders.sale.liveStartAt": (v33/*: any*/),
        "me.bidders.sale.name": (v33/*: any*/),
        "me.bidders.sale.partner": (v40/*: any*/),
        "me.bidders.sale.partner.id": (v29/*: any*/),
        "me.bidders.sale.partner.name": (v33/*: any*/),
        "me.bidders.sale.registrationStatus": (v41/*: any*/),
        "me.bidders.sale.registrationStatus.id": (v29/*: any*/),
        "me.bidders.sale.registrationStatus.qualifiedForBidding": (v42/*: any*/),
        "me.bidders.sale.requireIdentityVerification": (v42/*: any*/),
        "me.bidders.sale.slug": (v29/*: any*/),
        "me.bidders.sale.status": (v33/*: any*/),
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
        "me.conversations.edges.cursor": (v28/*: any*/),
        "me.conversations.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Conversation"
        },
        "me.conversations.edges.node.__typename": (v28/*: any*/),
        "me.conversations.edges.node.id": (v29/*: any*/),
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
        "me.conversations.edges.node.items.item.__isNode": (v28/*: any*/),
        "me.conversations.edges.node.items.item.__typename": (v28/*: any*/),
        "me.conversations.edges.node.items.item.artistNames": (v33/*: any*/),
        "me.conversations.edges.node.items.item.coverImage": (v38/*: any*/),
        "me.conversations.edges.node.items.item.coverImage.url": (v33/*: any*/),
        "me.conversations.edges.node.items.item.date": (v33/*: any*/),
        "me.conversations.edges.node.items.item.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "me.conversations.edges.node.items.item.fair.id": (v29/*: any*/),
        "me.conversations.edges.node.items.item.fair.name": (v33/*: any*/),
        "me.conversations.edges.node.items.item.id": (v29/*: any*/),
        "me.conversations.edges.node.items.item.image": (v38/*: any*/),
        "me.conversations.edges.node.items.item.image.url": (v33/*: any*/),
        "me.conversations.edges.node.items.item.internalID": (v29/*: any*/),
        "me.conversations.edges.node.items.item.name": (v33/*: any*/),
        "me.conversations.edges.node.items.item.partner": (v40/*: any*/),
        "me.conversations.edges.node.items.item.partner.id": (v29/*: any*/),
        "me.conversations.edges.node.items.item.partner.internalID": (v29/*: any*/),
        "me.conversations.edges.node.items.item.title": (v33/*: any*/),
        "me.conversations.edges.node.lastMessage": (v33/*: any*/),
        "me.conversations.edges.node.lastMessageAt": (v33/*: any*/),
        "me.conversations.edges.node.last_message": (v33/*: any*/),
        "me.conversations.edges.node.messagesConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MessageConnection"
        },
        "me.conversations.edges.node.messagesConnection.totalCount": (v43/*: any*/),
        "me.conversations.edges.node.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversations.edges.node.to.id": (v29/*: any*/),
        "me.conversations.edges.node.to.name": (v28/*: any*/),
        "me.conversations.edges.node.unread": (v42/*: any*/),
        "me.conversations.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversations.pageInfo.endCursor": (v33/*: any*/),
        "me.conversations.pageInfo.hasNextPage": (v30/*: any*/),
        "me.conversations.totalUnreadCount": (v43/*: any*/),
        "me.id": (v29/*: any*/),
        "me.identityVerified": (v42/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v29/*: any*/),
        "me.pendingIdentityVerification.internalID": (v29/*: any*/),
        "me.watchedLotConnection": {
          "enumValues": null,
          "nullable": false,
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
        "me.watchedLotConnection.edges.node.internalID": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.lot": (v31/*: any*/),
        "me.watchedLotConnection.edges.node.lot.bidCount": (v34/*: any*/),
        "me.watchedLotConnection.edges.node.lot.id": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.lot.internalID": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice.display": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.lot.soldStatus": (v35/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork": (v37/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artist.id": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artist.name": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.href": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.id": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.myLotStanding": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "LotStanding"
        },
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.myLotStanding.isHighestBidder": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.myLotStanding.isLeadingBidder": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.id": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.lotLabel": (v33/*: any*/)
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
