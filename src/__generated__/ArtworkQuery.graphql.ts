/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Artwork_artwork$ref } from "./Artwork_artwork.graphql";
export type ArtworkQueryVariables = {
    readonly artworkID: string;
    readonly excludeArtworkIds?: ReadonlyArray<string> | null;
};
export type ArtworkQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": Artwork_artwork$ref;
    } | null;
};
export type ArtworkQuery = {
    readonly response: ArtworkQueryResponse;
    readonly variables: ArtworkQueryVariables;
};



/*
query ArtworkQuery(
  $artworkID: String!
  $excludeArtworkIds: [String!]
) {
  artwork(id: $artworkID) {
    ...Artwork_artwork
    id
  }
}

fragment Artwork_artwork on Artwork {
  ...ArtworkTombstone_artwork
  ...ArtworkActions_artwork
  ...ArtworkAvailability_artwork
  ...SellerInfo_artwork
  ...OtherWorks_artwork
}

fragment ArtworkTombstone_artwork on Artwork {
  title
  medium
  date
  cultural_maker
  artists {
    name
    href
    ...FollowArtistButton_artist
    id
  }
  dimensions {
    in
    cm
  }
  edition_of
  attribution_class {
    short_description
    id
  }
}

fragment ArtworkActions_artwork on Artwork {
  id
  internalID
  is_saved
}

fragment ArtworkAvailability_artwork on Artwork {
  availability
}

fragment SellerInfo_artwork on Artwork {
  partner {
    name
    id
  }
}

fragment OtherWorks_artwork on Artwork {
  context {
    __typename
    ... on Node {
      id
    }
    ... on ArtworkContextFair {
      id
    }
  }
  ...ArtworkContextArtist_artwork
}

fragment ArtworkContextArtist_artwork on Artwork {
  ...ArtistArtworkGrid_artwork
  ...PartnerArtworkGrid_artwork
  ...RelatedArtworkGrid_artwork
}

fragment ArtistArtworkGrid_artwork on Artwork {
  artist {
    name
    artworks_connection(first: 8, sort: PUBLISHED_AT_DESC, exclude: $excludeArtworkIds) {
      edges {
        node {
          ...GenericGrid_artworks
          id
        }
      }
    }
    id
  }
}

fragment PartnerArtworkGrid_artwork on Artwork {
  partner {
    name
    artworksConnection(first: 8, for_sale: true, sort: PUBLISHED_AT_DESC, exclude: $excludeArtworkIds) {
      edges {
        node {
          ...GenericGrid_artworks
          id
        }
      }
    }
    id
  }
}

fragment RelatedArtworkGrid_artwork on Artwork {
  layer(id: "main") {
    artworksConnection(first: 8) {
      edges {
        node {
          ...GenericGrid_artworks
          id
        }
      }
    }
    id
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  gravityID
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

fragment FollowArtistButton_artist on Artist {
  gravityID
  id
  is_followed
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "excludeArtworkIds",
    "type": "[String!]",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "date",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
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
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "Variable",
  "name": "exclude",
  "variableName": "excludeArtworkIds"
},
v9 = {
  "kind": "Literal",
  "name": "first",
  "value": 8
},
v10 = {
  "kind": "Literal",
  "name": "sort",
  "value": "PUBLISHED_AT_DESC"
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "is_closed",
  "args": null,
  "storageKey": null
},
v12 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v13 = [
  (v4/*: any*/),
  (v7/*: any*/)
],
v14 = [
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
          (v7/*: any*/),
          (v6/*: any*/),
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
                    "value": "large"
                  }
                ],
                "storageKey": "url(version:\"large\")"
              }
            ]
          },
          (v2/*: any*/),
          (v3/*: any*/),
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
              (v11/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "display_timely_at",
                "args": null,
                "storageKey": null
              },
              (v7/*: any*/)
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
                "selections": (v12/*: any*/)
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "current_bid",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkCurrentBid",
                "plural": false,
                "selections": (v12/*: any*/)
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
                  (v11/*: any*/),
                  (v7/*: any*/)
                ]
              },
              (v7/*: any*/)
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
                "value": true
              }
            ],
            "concreteType": "Artist",
            "plural": true,
            "selections": (v13/*: any*/)
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": "Partner",
            "plural": false,
            "selections": (v13/*: any*/)
          },
          (v5/*: any*/)
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Artwork_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "cultural_maker",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artists",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v6/*: any*/),
              (v7/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "is_followed",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "dimensions",
            "storageKey": null,
            "args": null,
            "concreteType": "dimensions",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "in",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "cm",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "edition_of",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "attribution_class",
            "storageKey": null,
            "args": null,
            "concreteType": "AttributionClass",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "short_description",
                "args": null,
                "storageKey": null
              },
              (v7/*: any*/)
            ]
          },
          (v7/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_saved",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "availability",
            "args": null,
            "storageKey": null
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
              (v4/*: any*/),
              (v7/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artworksConnection",
                "storageKey": null,
                "args": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "for_sale",
                    "value": true
                  },
                  (v10/*: any*/)
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": (v14/*: any*/)
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "context",
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
              (v7/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artworks_connection",
                "storageKey": null,
                "args": [
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/)
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": (v14/*: any*/)
              },
              (v7/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "layer",
            "storageKey": "layer(id:\"main\")",
            "args": [
              {
                "kind": "Literal",
                "name": "id",
                "value": "main"
              }
            ],
            "concreteType": "ArtworkLayer",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:8)",
                "args": [
                  (v9/*: any*/)
                ],
                "concreteType": "ArtworkConnection",
                "plural": false,
                "selections": (v14/*: any*/)
              },
              (v7/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ArtworkQuery",
    "id": "fac7c092c9e0ab601ccf55379ea1d734",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8c594e52f5c996aecbaac4b08d7da014';
export default node;
