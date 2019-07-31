/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ActiveBids_me$ref } from "./ActiveBids_me.graphql";
export type ActiveBidsQueryVariables = {};
export type ActiveBidsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": ActiveBids_me$ref;
    } | null;
};
export type ActiveBidsQuery = {
    readonly response: ActiveBidsQueryResponse;
    readonly variables: ActiveBidsQueryVariables;
};



/*
query ActiveBidsQuery {
  me {
    ...ActiveBids_me
    id
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
    max_bid: maxBid {
      display
    }
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
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
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
          }
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
                    "alias": "max_bid",
                    "name": "maxBid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "plural": false,
                    "selections": (v1/*: any*/)
                  },
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
                          (v2/*: any*/),
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
                        "selections": (v1/*: any*/)
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
                  (v2/*: any*/),
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
          (v0/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ActiveBidsQuery",
    "id": "16fa1baef49a1f0c2f60b6c31d15ebf1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '483ea8a9a4515e5f1b1d1adba38c309a';
export default node;
