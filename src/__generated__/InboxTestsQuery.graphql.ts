/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cefa2c2884b877d40378eadc7babb5d7 */

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

fragment ActiveLotStanding_saleArtwork on SaleArtwork {
  ...Lot_saleArtwork
  isHighestBidder
  sale {
    status
    liveStartAt
    endAt
    id
  }
  lotState {
    bidCount
    reserveStatus
    soldStatus
    sellingPrice {
      display
    }
  }
  artwork {
    internalID
    href
    slug
    id
  }
  currentBid {
    display
  }
  estimate
}

fragment ClosedLotStanding_saleArtwork on SaleArtwork {
  ...Lot_saleArtwork
  isHighestBidder
  estimate
  artwork {
    internalID
    href
    slug
    id
  }
  lotState {
    soldStatus
    sellingPrice {
      display
    }
  }
  sale {
    endAt
    status
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

fragment LotStatusListItem_saleArtwork on SaleArtwork {
  ...ClosedLotStanding_saleArtwork
  ...ActiveLotStanding_saleArtwork
  ...WatchedLot_saleArtwork
  isWatching
  lotState {
    soldStatus
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
  myBids {
    active {
      sale {
        ...SaleCard_sale
        internalID
        registrationStatus {
          qualifiedForBidding
          id
        }
        id
      }
      saleArtworks {
        ...LotStatusListItem_saleArtwork
        internalID
        id
      }
    }
    closed {
      sale {
        ...SaleCard_sale
        internalID
        registrationStatus {
          qualifiedForBidding
          id
        }
        id
      }
      saleArtworks {
        ...LotStatusListItem_saleArtwork
        internalID
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

fragment WatchedLot_saleArtwork on SaleArtwork {
  ...Lot_saleArtwork
  lotState {
    bidCount
    sellingPrice {
      display
    }
  }
  artwork {
    internalID
    href
    slug
    id
  }
  currentBid {
    display
  }
  estimate
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
v14 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v15 = [
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
      {
        "alias": null,
        "args": null,
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": (v4/*: any*/),
        "storageKey": null
      },
      {
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
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "requireIdentityVerification",
        "storageKey": null
      },
      (v3/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "SaleArtwork",
    "kind": "LinkedField",
    "name": "saleArtworks",
    "plural": true,
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
        "kind": "ScalarField",
        "name": "estimate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "CausalityLotState",
        "kind": "LinkedField",
        "name": "lotState",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "soldStatus",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Money",
            "kind": "LinkedField",
            "name": "sellingPrice",
            "plural": false,
            "selections": (v14/*: any*/),
            "storageKey": null
          },
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
          }
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
          (v13/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          (v3/*: any*/),
          (v12/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SaleArtworkCurrentBid",
        "kind": "LinkedField",
        "name": "currentBid",
        "plural": false,
        "selections": (v14/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isWatching",
        "storageKey": null
      },
      (v1/*: any*/),
      (v3/*: any*/)
    ],
    "storageKey": null
  }
],
v16 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v17 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v20 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "MyBid"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "SaleArtwork"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "CausalityLotState"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
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
            "args": null,
            "concreteType": "MyBids",
            "kind": "LinkedField",
            "name": "myBids",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "MyBid",
                "kind": "LinkedField",
                "name": "active",
                "plural": true,
                "selections": (v15/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "MyBid",
                "kind": "LinkedField",
                "name": "closed",
                "plural": true,
                "selections": (v15/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "cefa2c2884b877d40378eadc7babb5d7",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
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
        "me.conversations.edges.cursor": (v16/*: any*/),
        "me.conversations.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Conversation"
        },
        "me.conversations.edges.node.__typename": (v16/*: any*/),
        "me.conversations.edges.node.id": (v17/*: any*/),
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
        "me.conversations.edges.node.items.item.__isNode": (v16/*: any*/),
        "me.conversations.edges.node.items.item.__typename": (v16/*: any*/),
        "me.conversations.edges.node.items.item.artistNames": (v18/*: any*/),
        "me.conversations.edges.node.items.item.coverImage": (v19/*: any*/),
        "me.conversations.edges.node.items.item.coverImage.url": (v18/*: any*/),
        "me.conversations.edges.node.items.item.date": (v18/*: any*/),
        "me.conversations.edges.node.items.item.fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "me.conversations.edges.node.items.item.fair.id": (v17/*: any*/),
        "me.conversations.edges.node.items.item.fair.name": (v18/*: any*/),
        "me.conversations.edges.node.items.item.id": (v17/*: any*/),
        "me.conversations.edges.node.items.item.image": (v19/*: any*/),
        "me.conversations.edges.node.items.item.image.url": (v18/*: any*/),
        "me.conversations.edges.node.items.item.internalID": (v17/*: any*/),
        "me.conversations.edges.node.items.item.name": (v18/*: any*/),
        "me.conversations.edges.node.items.item.partner": (v20/*: any*/),
        "me.conversations.edges.node.items.item.partner.id": (v17/*: any*/),
        "me.conversations.edges.node.items.item.partner.internalID": (v17/*: any*/),
        "me.conversations.edges.node.items.item.title": (v18/*: any*/),
        "me.conversations.edges.node.lastMessage": (v18/*: any*/),
        "me.conversations.edges.node.lastMessageAt": (v18/*: any*/),
        "me.conversations.edges.node.last_message": (v18/*: any*/),
        "me.conversations.edges.node.to": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ConversationResponder"
        },
        "me.conversations.edges.node.to.id": (v17/*: any*/),
        "me.conversations.edges.node.to.name": (v16/*: any*/),
        "me.conversations.edges.node.unread": (v21/*: any*/),
        "me.conversations.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.conversations.pageInfo.endCursor": (v18/*: any*/),
        "me.conversations.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.conversations.totalUnreadCount": (v22/*: any*/),
        "me.id": (v17/*: any*/),
        "me.identityVerified": (v21/*: any*/),
        "me.myBids": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MyBids"
        },
        "me.myBids.active": (v23/*: any*/),
        "me.myBids.active.sale": (v24/*: any*/),
        "me.myBids.active.sale.coverImage": (v19/*: any*/),
        "me.myBids.active.sale.coverImage.url": (v18/*: any*/),
        "me.myBids.active.sale.endAt": (v18/*: any*/),
        "me.myBids.active.sale.href": (v18/*: any*/),
        "me.myBids.active.sale.id": (v17/*: any*/),
        "me.myBids.active.sale.internalID": (v17/*: any*/),
        "me.myBids.active.sale.liveStartAt": (v18/*: any*/),
        "me.myBids.active.sale.name": (v18/*: any*/),
        "me.myBids.active.sale.partner": (v20/*: any*/),
        "me.myBids.active.sale.partner.id": (v17/*: any*/),
        "me.myBids.active.sale.partner.name": (v18/*: any*/),
        "me.myBids.active.sale.registrationStatus": (v25/*: any*/),
        "me.myBids.active.sale.registrationStatus.id": (v17/*: any*/),
        "me.myBids.active.sale.registrationStatus.qualifiedForBidding": (v21/*: any*/),
        "me.myBids.active.sale.requireIdentityVerification": (v21/*: any*/),
        "me.myBids.active.sale.slug": (v17/*: any*/),
        "me.myBids.active.saleArtworks": (v26/*: any*/),
        "me.myBids.active.saleArtworks.artwork": (v27/*: any*/),
        "me.myBids.active.saleArtworks.artwork.artistNames": (v18/*: any*/),
        "me.myBids.active.saleArtworks.artwork.href": (v18/*: any*/),
        "me.myBids.active.saleArtworks.artwork.id": (v17/*: any*/),
        "me.myBids.active.saleArtworks.artwork.image": (v19/*: any*/),
        "me.myBids.active.saleArtworks.artwork.image.url": (v18/*: any*/),
        "me.myBids.active.saleArtworks.artwork.internalID": (v17/*: any*/),
        "me.myBids.active.saleArtworks.artwork.slug": (v17/*: any*/),
        "me.myBids.active.saleArtworks.currentBid": (v28/*: any*/),
        "me.myBids.active.saleArtworks.currentBid.display": (v18/*: any*/),
        "me.myBids.active.saleArtworks.estimate": (v18/*: any*/),
        "me.myBids.active.saleArtworks.id": (v17/*: any*/),
        "me.myBids.active.saleArtworks.internalID": (v17/*: any*/),
        "me.myBids.active.saleArtworks.isHighestBidder": (v21/*: any*/),
        "me.myBids.active.saleArtworks.isWatching": (v21/*: any*/),
        "me.myBids.active.saleArtworks.lotLabel": (v18/*: any*/),
        "me.myBids.active.saleArtworks.lotState": (v29/*: any*/),
        "me.myBids.active.saleArtworks.lotState.bidCount": (v22/*: any*/),
        "me.myBids.active.saleArtworks.lotState.reserveStatus": (v18/*: any*/),
        "me.myBids.active.saleArtworks.lotState.sellingPrice": (v30/*: any*/),
        "me.myBids.active.saleArtworks.lotState.sellingPrice.display": (v18/*: any*/),
        "me.myBids.active.saleArtworks.lotState.soldStatus": (v18/*: any*/),
        "me.myBids.active.saleArtworks.sale": (v24/*: any*/),
        "me.myBids.active.saleArtworks.sale.endAt": (v18/*: any*/),
        "me.myBids.active.saleArtworks.sale.id": (v17/*: any*/),
        "me.myBids.active.saleArtworks.sale.liveStartAt": (v18/*: any*/),
        "me.myBids.active.saleArtworks.sale.status": (v18/*: any*/),
        "me.myBids.closed": (v23/*: any*/),
        "me.myBids.closed.sale": (v24/*: any*/),
        "me.myBids.closed.sale.coverImage": (v19/*: any*/),
        "me.myBids.closed.sale.coverImage.url": (v18/*: any*/),
        "me.myBids.closed.sale.endAt": (v18/*: any*/),
        "me.myBids.closed.sale.href": (v18/*: any*/),
        "me.myBids.closed.sale.id": (v17/*: any*/),
        "me.myBids.closed.sale.internalID": (v17/*: any*/),
        "me.myBids.closed.sale.liveStartAt": (v18/*: any*/),
        "me.myBids.closed.sale.name": (v18/*: any*/),
        "me.myBids.closed.sale.partner": (v20/*: any*/),
        "me.myBids.closed.sale.partner.id": (v17/*: any*/),
        "me.myBids.closed.sale.partner.name": (v18/*: any*/),
        "me.myBids.closed.sale.registrationStatus": (v25/*: any*/),
        "me.myBids.closed.sale.registrationStatus.id": (v17/*: any*/),
        "me.myBids.closed.sale.registrationStatus.qualifiedForBidding": (v21/*: any*/),
        "me.myBids.closed.sale.requireIdentityVerification": (v21/*: any*/),
        "me.myBids.closed.sale.slug": (v17/*: any*/),
        "me.myBids.closed.saleArtworks": (v26/*: any*/),
        "me.myBids.closed.saleArtworks.artwork": (v27/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.artistNames": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.href": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.id": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.image": (v19/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.image.url": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.internalID": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.slug": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.currentBid": (v28/*: any*/),
        "me.myBids.closed.saleArtworks.currentBid.display": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.estimate": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.id": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.internalID": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.isHighestBidder": (v21/*: any*/),
        "me.myBids.closed.saleArtworks.isWatching": (v21/*: any*/),
        "me.myBids.closed.saleArtworks.lotLabel": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.lotState": (v29/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.bidCount": (v22/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.reserveStatus": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.sellingPrice": (v30/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.sellingPrice.display": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.soldStatus": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.sale": (v24/*: any*/),
        "me.myBids.closed.saleArtworks.sale.endAt": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.sale.id": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.sale.liveStartAt": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.sale.status": (v18/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v17/*: any*/),
        "me.pendingIdentityVerification.internalID": (v17/*: any*/)
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
