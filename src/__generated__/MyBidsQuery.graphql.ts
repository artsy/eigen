/* tslint:disable */
/* eslint-disable */
/* @relayHash 0290e0e3334c0ae2a7bad8c47f25c77f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyBidsQueryVariables = {};
export type MyBidsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
    } | null;
    readonly sales: {
        readonly " $fragmentRefs": FragmentRefs<"MyBids_sales">;
    } | null;
};
export type MyBidsQuery = {
    readonly response: MyBidsQueryResponse;
    readonly variables: MyBidsQueryVariables;
};



/*
query MyBidsQuery {
  me {
    ...MyBids_me
    id
  }
  sales: salesConnection(first: 100, registered: true) {
    ...MyBids_sales
  }
}

fragment MyBids_me on Me {
  lotStandings {
    isHighestBidder
    isLeadingBidder
    sale {
      displayTimelyAt
      liveStartAt
      endAt
      id
    }
    saleArtwork {
      id
      lotLabel
      counts {
        bidderPositions
      }
      currentBid {
        display
      }
      artwork {
        artistNames
        href
        image {
          url(version: "medium")
        }
        id
      }
    }
  }
}

fragment MyBids_sales on SaleConnection {
  edges {
    node {
      saleType
      href
      endAt
      liveStartAt
      displayTimelyAt
      timeZone
      name
      slug
      coverImage {
        url
      }
      partner {
        name
        id
      }
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Literal",
    "name": "registered",
    "value": true
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "displayTimelyAt",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "liveStartAt",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyBidsQuery",
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
            "name": "MyBids_me",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "sales",
        "name": "salesConnection",
        "storageKey": "salesConnection(first:100,registered:true)",
        "args": (v0/*: any*/),
        "concreteType": "SaleConnection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyBids_sales",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyBidsQuery",
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
            "name": "lotStandings",
            "storageKey": null,
            "args": null,
            "concreteType": "LotStanding",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "isHighestBidder",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
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
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "saleArtwork",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtwork",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lotLabel",
                    "args": null,
                    "storageKey": null
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
                        "name": "bidderPositions",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "currentBid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtworkCurrentBid",
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
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artwork",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "artistNames",
                        "args": null,
                        "storageKey": null
                      },
                      (v5/*: any*/),
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
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "medium"
                              }
                            ],
                            "storageKey": "url(version:\"medium\")"
                          }
                        ]
                      },
                      (v4/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v4/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "sales",
        "name": "salesConnection",
        "storageKey": "salesConnection(first:100,registered:true)",
        "args": (v0/*: any*/),
        "concreteType": "SaleConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Sale",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "saleType",
                    "args": null,
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v3/*: any*/),
                  (v2/*: any*/),
                  (v1/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "timeZone",
                    "args": null,
                    "storageKey": null
                  },
                  (v6/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slug",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "coverImage",
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
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "partner",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Partner",
                    "plural": false,
                    "selections": [
                      (v6/*: any*/),
                      (v4/*: any*/)
                    ]
                  },
                  (v4/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyBidsQuery",
    "id": "31404b6e2b8d5bc1e5e6e5cc742ae672",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '37cc2e854a634d2ebc478bff476e0a70';
export default node;
