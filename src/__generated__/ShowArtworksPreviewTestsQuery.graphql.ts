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
    __id: id
  }
}

fragment ShowArtworksPreview_show on Show {
  id
  artworks(size: 6) {
    ...GenericGrid_artworks
    __id: id
  }
  counts {
    artworks
  }
  __id: id
}

fragment GenericGrid_artworks on Artwork {
  id
  gravityID
  image {
    aspect_ratio
  }
  ...Artwork_artwork
  __id: id
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
    __id: id
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
      __id: id
    }
    __id: id
  }
  image {
    url(version: "large")
    aspect_ratio
  }
  artists(shallow: true) {
    name
    __id: id
  }
  partner {
    name
    __id: id
  }
  href
  __id: id
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
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v5 = [
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
  "id": null,
  "text": "query ShowArtworksPreviewTestsQuery {\n  show(id: \"anderson-fine-art-gallery-flickinger-collection\") {\n    ...ShowArtworksPreview_show\n    __id: id\n  }\n}\n\nfragment ShowArtworksPreview_show on Show {\n  id\n  artworks(size: 6) {\n    ...GenericGrid_artworks\n    __id: id\n  }\n  counts {\n    artworks\n  }\n  __id: id\n}\n\nfragment GenericGrid_artworks on Artwork {\n  id\n  gravityID\n  image {\n    aspect_ratio\n  }\n  ...Artwork_artwork\n  __id: id\n}\n\nfragment Artwork_artwork on Artwork {\n  title\n  date\n  sale_message\n  is_in_auction\n  is_biddable\n  is_acquireable\n  is_offerable\n  gravityID\n  sale {\n    is_auction\n    is_live_open\n    is_open\n    is_closed\n    display_timely_at\n    __id: id\n  }\n  sale_artwork {\n    opening_bid {\n      display\n    }\n    current_bid {\n      display\n    }\n    bidder_positions_count\n    sale {\n      is_closed\n      __id: id\n    }\n    __id: id\n  }\n  image {\n    url(version: \"large\")\n    aspect_ratio\n  }\n  artists(shallow: true) {\n    name\n    __id: id\n  }\n  partner {\n    name\n    __id: id\n  }\n  href\n  __id: id\n}\n",
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
          v2,
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
                "name": "is_acquireable",
                "args": null,
                "storageKey": null
              },
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
                "name": "is_biddable",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "gravityID",
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
                  v3,
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
                    "selections": v4
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "current_bid",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "SaleArtworkCurrentBid",
                    "plural": false,
                    "selections": v4
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
                      v3,
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
                "selections": v5
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "partner",
                "storageKey": null,
                "args": null,
                "concreteType": "Partner",
                "plural": false,
                "selections": v5
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "href",
                "args": null,
                "storageKey": null
              },
              v1
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
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'b02e6f80c5fc819b0ba5608e1a0c30c2';
export default node;
