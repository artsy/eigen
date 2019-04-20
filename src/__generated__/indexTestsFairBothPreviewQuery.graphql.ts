/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FairBoothPreview_show$ref } from "./FairBoothPreview_show.graphql";
export type indexTestsFairBothPreviewQueryVariables = {};
export type indexTestsFairBothPreviewQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": FairBoothPreview_show$ref;
    }) | null;
};
export type indexTestsFairBothPreviewQuery = {
    readonly response: indexTestsFairBothPreviewQueryResponse;
    readonly variables: indexTestsFairBothPreviewQueryVariables;
};



/*
query indexTestsFairBothPreviewQuery {
  show(id: "abxy-blk-and-blue") {
    ...FairBoothPreview_show
    id
  }
}

fragment FairBoothPreview_show on Show {
  gravityID
  _id
  name
  is_fair_booth
  counts {
    artworks
  }
  partner {
    __typename
    ... on Partner {
      name
      href
      gravityID
      _id
      id
      profile {
        _id
        is_followed
        id
      }
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  fair {
    name
    id
  }
  cover_image {
    url
  }
  location {
    display
    id
  }
  artworks_connection(first: 4) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  gravityID
  image {
    aspect_ratio
  }
  ...Artwork_artwork
}

fragment Artwork_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  gravityID
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    id
  }
  sale_artwork {
    opening_bid {
      display
    }
    current_bid {
      display
    }
    bidder_positions_count
    sale {
      is_closed
      id
    }
    id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    id
  }
  partner {
    name
    id
  }
  href
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "abxy-blk-and-blue",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "_id",
  "args": null,
  "storageKey": null
},
v6 = [
  (v2/*: any*/),
  (v1/*: any*/)
],
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v9 = [
  (v7/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "indexTestsFairBothPreviewQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"abxy-blk-and-blue\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "FairBoothPreview_show",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "indexTestsFairBothPreviewQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"abxy-blk-and-blue\")",
        "args": (v0/*: any*/),
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/),
              {
                "kind": "InlineFragment",
                "type": "Partner",
                "selections": [
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "profile",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Profile",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_followed",
                        "args": null,
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v4/*: any*/),
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_fair_booth",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "ShowCounts",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "artworks",
                "args": null,
                "storageKey": null
              }
            ]
          },
          (v5/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "fair",
            "storageKey": null,
            "args": null,
            "concreteType": "Fair",
            "plural": false,
            "selections": (v6/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "cover_image",
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
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              (v7/*: any*/),
              (v1/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworks_connection",
            "storageKey": "artworks_connection(first:4)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 4,
                "type": "Int"
              }
            ],
            "concreteType": "ArtworkConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworkEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_biddable",
                        "args": null,
                        "storageKey": null
                      },
                      (v1/*: any*/),
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
                            "name": "aspect_ratio",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large",
                                "type": "[String]"
                              }
                            ],
                            "storageKey": "url(version:\"large\")"
                          }
                        ]
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
                        "name": "date",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "sale_message",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_in_auction",
                        "args": null,
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_acquireable",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "is_offerable",
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_auction",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_live_open",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_open",
                            "args": null,
                            "storageKey": null
                          },
                          (v8/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "display_timely_at",
                            "args": null,
                            "storageKey": null
                          },
                          (v1/*: any*/)
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
                            "name": "opening_bid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkOpeningBid",
                            "plural": false,
                            "selections": (v9/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "current_bid",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "SaleArtworkCurrentBid",
                            "plural": false,
                            "selections": (v9/*: any*/)
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "bidder_positions_count",
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
                              (v8/*: any*/),
                              (v1/*: any*/)
                            ]
                          },
                          (v1/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "artists",
                        "storageKey": "artists(shallow:true)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "shallow",
                            "value": true,
                            "type": "Boolean"
                          }
                        ],
                        "concreteType": "Artist",
                        "plural": true,
                        "selections": (v6/*: any*/)
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": (v6/*: any*/)
                      },
                      (v3/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "indexTestsFairBothPreviewQuery",
    "id": "bc73543ff24fdb5c115822d142772bba",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'bc73543ff24fdb5c115822d142772bba';
export default node;
