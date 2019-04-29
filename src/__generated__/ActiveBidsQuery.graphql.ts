/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ActiveBids_me$ref } from "./ActiveBids_me.graphql";
export type ActiveBidsQueryVariables = {};
export type ActiveBidsQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": ActiveBids_me$ref;
    }) | null;
};
export type ActiveBidsQuery = {
    readonly response: ActiveBidsQueryResponse;
    readonly variables: ActiveBidsQueryVariables;
};



/*
query ActiveBidsQuery {
  me {
    ...ActiveBids_me
    __id: id
  }
}

fragment ActiveBids_me on Me {
  lot_standings(live: true) {
    most_recent_bid {
      id
      __id: id
    }
    ...ActiveBid_bid
  }
  __id: id
}

fragment ActiveBid_bid on LotStanding {
  is_leading_bidder
  sale {
    href
    is_live_open
    __id: id
  }
  most_recent_bid {
    id
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
        __id: id
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
      __id: id
    }
    __id: id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
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
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ActiveBidsQuery",
  "id": null,
  "text": "query ActiveBidsQuery {\n  me {\n    ...ActiveBids_me\n    __id: id\n  }\n}\n\nfragment ActiveBids_me on Me {\n  lot_standings(live: true) {\n    most_recent_bid {\n      id\n      __id: id\n    }\n    ...ActiveBid_bid\n  }\n  __id: id\n}\n\nfragment ActiveBid_bid on LotStanding {\n  is_leading_bidder\n  sale {\n    href\n    is_live_open\n    __id: id\n  }\n  most_recent_bid {\n    id\n    max_bid {\n      display\n    }\n    sale_artwork {\n      artwork {\n        href\n        image {\n          url\n        }\n        artist_names\n        __id: id\n      }\n      counts {\n        bidder_positions\n      }\n      highest_bid {\n        display\n        __id: id\n      }\n      lot_number\n      reserve_status\n      __id: id\n    }\n    __id: id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ActiveBidsQuery",
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
            "name": "ActiveBids_me",
            "args": null
          },
          v0
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ActiveBidsQuery",
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  },
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
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "url",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "artist_names",
                            "args": null,
                            "storageKey": null
                          },
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
                          v0
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
          v0
        ]
      }
    ]
  }
};
})();
(node as any).hash = '483ea8a9a4515e5f1b1d1adba38c309a';
export default node;
