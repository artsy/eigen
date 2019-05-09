/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ShowArtworksPreview_show$ref } from "./ShowArtworksPreview_show.graphql";
export type ShowArtworksPreviewTestsQueryVariables = {};
export type ShowArtworksPreviewTestsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": ShowArtworksPreview_show$ref;
    }) | null;
};
export type ShowArtworksPreviewTestsQuery = {
    readonly response: ShowArtworksPreviewTestsQueryResponse;
    readonly variables: ShowArtworksPreviewTestsQueryVariables;
};



/*
query ShowArtworksPreviewTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...ShowArtworksPreview_show
    __id
  }
}

fragment ShowArtworksPreview_show on Show {
  __id
  artworks(size: 6) {
    ...GenericGrid_artworks
    __id
  }
  counts {
    artworks
  }
}

fragment GenericGrid_artworks on Artwork {
  __id
  id
  image {
    aspect_ratio
  }
  ...ArtworkGridItem_artwork
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  sale_message
  is_in_auction
  is_biddable
  is_acquireable
  is_offerable
  id
  sale {
    is_auction
    is_live_open
    is_open
    is_closed
    display_timely_at
    __id
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
      __id
    }
    __id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id
  }
  partner {
    name
    __id
  }
  href
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v3 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v4 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "name",
    "args": null,
    "storageKey": null
  },
  v1
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "ShowArtworksPreviewTestsQuery",
  "id": "4101a8f6e8a7f0be8241c8de42744cf4",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "ShowArtworksPreviewTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ShowArtworksPreview_show",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ShowArtworksPreviewTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          v1,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworks",
            "storageKey": "artworks(size:6)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 6,
                "type": "Int"
              }
            ],
            "concreteType": "Artwork",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_biddable",
                "args": null,
                "storageKey": null
              },
              v1,
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
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
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "display_timely_at",
                    "args": null,
                    "storageKey": null
                  },
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
                    "name": "opening_bid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtworkOpeningBid",
                    "plural": false,
                    "selections": v3
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "current_bid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtworkCurrentBid",
                    "plural": false,
                    "selections": v3
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
                      v2,
                      v1
                    ]
                  },
                  v1
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
                "selections": v4
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "partner",
                "storageKey": null,
                "args": null,
                "concreteType": "Partner",
                "plural": false,
                "selections": v4
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "href",
                "args": null,
                "storageKey": null
              }
            ]
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
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'b02e6f80c5fc819b0ba5608e1a0c30c2';
export default node;
