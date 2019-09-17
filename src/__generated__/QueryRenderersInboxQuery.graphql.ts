/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Inbox_me$ref } from "./Inbox_me.graphql";
export type QueryRenderersInboxQueryVariables = {};
export type QueryRenderersInboxQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": Inbox_me$ref;
    } | null;
};
export type QueryRenderersInboxQuery = {
    readonly response: QueryRenderersInboxQueryResponse;
    readonly variables: QueryRenderersInboxQueryVariables;
};



/*
query QueryRenderersInboxQuery {
  me {
    ...Inbox_me
    id
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
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v3 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": (v2/*: any*/)
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v7 = [
  (v6/*: any*/),
  (v0/*: any*/)
],
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersInboxQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Inbox_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersInboxQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "lot_standings",
            "name": "lotStandings",
            "storageKey": "lotStandings(live:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true
              }
            ],
            "concreteType": "LotStanding",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": "most_recent_bid",
                "name": "mostRecentBid",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": "sale_artwork",
                    "name": "saleArtwork",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v3/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": "artist_names",
                            "name": "artistNames",
                            "args": null,
                            "storageKey": null
                          },
                          (v0/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "counts",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtworkCounts",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "bidder_positions",
                            "name": "bidderPositions",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "highest_bid",
                        "name": "highestBid",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtworkHighestBid",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "display",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "lot_label",
                        "name": "lotLabel",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": "reserve_status",
                        "name": "reserveStatus",
                        "args": null,
                        "storageKey": null
                      },
                      (v0/*: any*/)
                    ]
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": "is_leading_bidder",
                "name": "isLeadingBidder",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "sale",
                "storageKey": null,
                "args": null,
                "concreteType": "Sale",
                "plural": false,
                "selections": [
                  (v1/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": "is_live_open",
                    "name": "isLiveOpen",
                    "args": null,
                    "storageKey": null
                  },
                  (v0/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "conversations_existence_check",
            "name": "conversationsConnection",
            "storageKey": "conversationsConnection(first:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1
              }
            ],
            "concreteType": "ConversationConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Conversation",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v0/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "conversations",
            "name": "conversationsConnection",
            "storageKey": "conversationsConnection(after:\"\",first:10)",
            "args": (v5/*: any*/),
            "concreteType": "ConversationConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endCursor",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "hasNextPage",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Conversation",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": "last_message",
                        "name": "lastMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "to",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ConversationResponder",
                        "plural": false,
                        "selections": (v7/*: any*/)
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lastMessage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lastMessageAt",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "unread",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "items",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ConversationItem",
                        "plural": true,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "item",
                            "storageKey": null,
                            "args": null,
                            "concreteType": null,
                            "plural": false,
                            "selections": [
                              (v8/*: any*/),
                              (v0/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Artwork",
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "date",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "title",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "artistNames",
                                    "args": null,
                                    "storageKey": null
                                  },
                                  (v3/*: any*/)
                                ]
                              },
                              {
                                "kind": "InlineFragment",
                                "type": "Show",
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "fair",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Fair",
                                    "plural": false,
                                    "selections": (v7/*: any*/)
                                  },
                                  (v6/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "coverImage",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "plural": false,
                                    "selections": (v2/*: any*/)
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v0/*: any*/),
                      (v8/*: any*/)
                    ]
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cursor",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "conversations",
            "name": "conversationsConnection",
            "args": (v5/*: any*/),
            "handle": "connection",
            "key": "Conversations_conversations",
            "filters": null
          },
          (v0/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersInboxQuery",
    "id": "6218c716f78e0e6159caac8e0906f62d",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'ce5f976e5f8f2b9a1c45e7241a60c8a0';
export default node;
