/* tslint:disable */
/* eslint-disable */
/* @relayHash 21ba1c62782968008bbccef250648b3e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeatureQueryVariables = {
    slug: string;
};
export type FeatureQueryResponse = {
    readonly feature: {
        readonly " $fragmentRefs": FragmentRefs<"Feature_feature">;
    } | null;
};
export type FeatureQuery = {
    readonly response: FeatureQueryResponse;
    readonly variables: FeatureQueryVariables;
};



/*
query FeatureQuery(
  $slug: ID!
) {
  feature(id: $slug) {
    ...Feature_feature
    id
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    id
  }
  saleArtwork {
    currentBid {
      display
    }
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment FeatureFeaturedLink_featuredLink on FeaturedLink {
  href
  title
  subtitle
  description
  image {
    url(version: "wide")
  }
}

fragment FeatureHeader_feature on Feature {
  name
  subheadline
  image {
    url(version: "source")
  }
}

fragment Feature_feature on Feature {
  ...FeatureHeader_feature
  description
  callout
  sets: setsConnection(first: 20) {
    edges {
      node {
        id
        name
        description
        itemType
        orderedItems: orderedItemsConnection(first: 35) {
          edges {
            node {
              __typename
              ... on FeaturedLink {
                id
                href
              }
              ... on Artwork {
                ...GenericGrid_artworks
              }
              ...FeatureFeaturedLink_featuredLink
              ... on Node {
                id
              }
            }
          }
        }
      }
    }
  }
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "slug",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "slug"
  }
],
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
  "name": "description",
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
  "name": "title",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FeatureQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feature",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Feature",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Feature_feature",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FeatureQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "feature",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Feature",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "subheadline",
            "args": null,
            "storageKey": null
          },
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
                    "value": "source"
                  }
                ],
                "storageKey": "url(version:\"source\")"
              }
            ]
          },
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "callout",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": "sets",
            "name": "setsConnection",
            "storageKey": "setsConnection(first:20)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
              }
            ],
            "concreteType": "OrderedSetConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "OrderedSetEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "OrderedSet",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "itemType",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": "orderedItems",
                        "name": "orderedItemsConnection",
                        "storageKey": "orderedItemsConnection(first:35)",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 35
                          }
                        ],
                        "concreteType": "OrderedSetItemConnection",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "edges",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "OrderedSetItemEdge",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "node",
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
                                  (v4/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "type": "FeaturedLink",
                                    "selections": [
                                      (v5/*: any*/),
                                      (v6/*: any*/),
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "subtitle",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      (v3/*: any*/),
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
                                                "value": "wide"
                                              }
                                            ],
                                            "storageKey": "url(version:\"wide\")"
                                          }
                                        ]
                                      }
                                    ]
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "type": "Artwork",
                                    "selections": [
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
                                            "alias": "aspect_ratio",
                                            "name": "aspectRatio",
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
                                          },
                                          {
                                            "kind": "ScalarField",
                                            "alias": null,
                                            "name": "aspectRatio",
                                            "args": null,
                                            "storageKey": null
                                          }
                                        ]
                                      },
                                      (v6/*: any*/),
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
                                        "name": "saleMessage",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "slug",
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
                                      (v5/*: any*/),
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
                                            "name": "isAuction",
                                            "args": null,
                                            "storageKey": null
                                          },
                                          {
                                            "kind": "ScalarField",
                                            "alias": null,
                                            "name": "isClosed",
                                            "args": null,
                                            "storageKey": null
                                          },
                                          {
                                            "kind": "ScalarField",
                                            "alias": null,
                                            "name": "displayTimelyAt",
                                            "args": null,
                                            "storageKey": null
                                          },
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
                                          (v4/*: any*/)
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
                                          (v2/*: any*/),
                                          (v4/*: any*/)
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          (v4/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "FeatureQuery",
    "id": "ed927a1b72f07ff1739da8d16a7555bb",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '49f1aed0ee21d2d0c221f60ed048db84';
export default node;
