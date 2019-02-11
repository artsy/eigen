/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Inbox_me$ref } from "./Inbox_me.graphql";
export type InboxRefetchQueryVariables = {};
export type InboxRefetchQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": Inbox_me$ref;
    }) | null;
};
export type InboxRefetchQuery = {
    readonly response: InboxRefetchQueryResponse;
    readonly variables: InboxRefetchQueryVariables;
};



/*
query InboxRefetchQuery {
  me {
    ...Inbox_me
    __id
  }
}

fragment Inbox_me on Me {
  lot_standings(live: true) {
    most_recent_bid {
      __id
    }
  }
  conversations_existence_check: conversations(first: 1) {
    edges {
      node {
        id
        __id
      }
    }
  }
  ...Conversations_me
  ...ActiveBids_me
  __id
}

fragment Conversations_me on Me {
  conversations(first: 10, after: "") {
    pageInfo {
      endCursor
      hasNextPage
    }
    edges {
      node {
        id
        last_message
        ...ConversationSnippet_conversation
        __id
        __typename
      }
      cursor
    }
  }
  __id
}

fragment ActiveBids_me on Me {
  lot_standings(live: true) {
    most_recent_bid {
      __id
    }
    ...ActiveBid_bid
  }
  __id
}

fragment ActiveBid_bid on LotStanding {
  is_leading_bidder
  sale {
    href
    is_live_open
    __id
  }
  most_recent_bid {
    __id
    max_bid {
      display
    }
    sale_artwork {
      artwork {
        href
        image {
          url
        }
        artist_names
        __id
      }
      counts {
        bidder_positions
      }
      highest_bid {
        display
        __id: id
      }
      lot_number
      reserve_status
      __id
    }
  }
}

fragment ConversationSnippet_conversation on Conversation {
  id
  to {
    name
  }
  last_message
  last_message_at
  unread
  items {
    item {
      __typename
      ... on Artwork {
        date
        title
        artist_names
        image {
          url
        }
      }
      ... on Show {
        fair {
          name
          __id
        }
        name
        cover_image {
          url
        }
      }
      ... on Node {
        __id
      }
    }
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v4 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "image",
  "storageKey": null,
  "args": null,
  "concreteType": "Image",
  "plural": false,
  "selections": v3
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artist_names",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "InboxRefetchQuery",
  "id": "20ad4063e6e46bd80f0856f3a45e0e35",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "InboxRefetchQuery",
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
          },
          v0
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "InboxRefetchQuery",
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
            "alias": null,
            "name": "lot_standings",
            "storageKey": "lot_standings(live:true)",
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true,
                "type": "Boolean"
              }
            ],
            "concreteType": "LotStanding",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "most_recent_bid",
                "storageKey": null,
                "args": null,
                "concreteType": "BidderPosition",
                "plural": false,
                "selections": [
                  v0,
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "max_bid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "plural": false,
                    "selections": [
                      v1
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "sale_artwork",
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
                          v2,
                          v4,
                          v5,
                          v0
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
                            "alias": null,
                            "name": "bidder_positions",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "highest_bid",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtworkHighestBid",
                        "plural": false,
                        "selections": [
                          v1,
                          {
                            "kind": "ScalarField",
                            "alias": "__id",
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "lot_number",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "reserve_status",
                        "args": null,
                        "storageKey": null
                      },
                      v0
                    ]
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_leading_bidder",
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
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "is_live_open",
                    "args": null,
                    "storageKey": null
                  },
                  v0
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "conversations_existence_check",
            "name": "conversations",
            "storageKey": "conversations(first:1)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 1,
                "type": "Int"
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
                      v6,
                      v0
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversations",
            "storageKey": "conversations(after:\"\",first:10)",
            "args": [
              {
                "kind": "Literal",
                "name": "after",
                "value": "",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
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
                      v6,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "last_message",
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
                        "selections": [
                          v7
                        ]
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "last_message_at",
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
                              v8,
                              v0,
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
                                  v5,
                                  v4
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
                                    "selections": [
                                      v7,
                                      v0
                                    ]
                                  },
                                  v7,
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "cover_image",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "plural": false,
                                    "selections": v3
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      v0,
                      v8
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
            "alias": null,
            "name": "conversations",
            "args": [
              {
                "kind": "Literal",
                "name": "after",
                "value": "",
                "type": "String"
              },
              {
                "kind": "Literal",
                "name": "first",
                "value": 10,
                "type": "Int"
              }
            ],
            "handle": "connection",
            "key": "Conversations_conversations",
            "filters": null
          },
          v0
        ]
      }
    ]
  }
};
})();
(node as any).hash = '71d6c2e4e70f4a21597ded67b1da105b';
export default node;
