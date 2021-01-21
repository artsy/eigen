/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0d095e398f7c2763c3b272dc38f983a5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairCollectionsTestsQueryVariables = {
    fairID: string;
};
export type FairCollectionsTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairCollections_fair">;
    } | null;
};
export type FairCollectionsTestsQuery = {
    readonly response: FairCollectionsTestsQueryResponse;
    readonly variables: FairCollectionsTestsQueryVariables;
};



/*
query FairCollectionsTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...FairCollections_fair
    id
  }
}

fragment FairCollections_fair on Fair {
  internalID
  slug
  marketingCollections(size: 5) {
    slug
    title
    category
    artworks: artworksConnection(first: 3) {
      edges {
        node {
          image {
            url(version: "larger")
          }
          id
        }
      }
      id
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fairID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v5 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairCollectionsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FairCollections_fair"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "FairCollectionsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 5
              }
            ],
            "concreteType": "MarketingCollection",
            "kind": "LinkedField",
            "name": "marketingCollections",
            "plural": true,
            "selections": [
              (v2/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "title",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "category",
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
                  }
                ],
                "concreteType": "FilterArtworksConnection",
                "kind": "LinkedField",
                "name": "artworksConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FilterArtworksEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "larger"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": "url(version:\"larger\")"
                              }
                            ],
                            "storageKey": null
                          },
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": "artworksConnection(first:3)"
              },
              (v3/*: any*/)
            ],
            "storageKey": "marketingCollections(size:5)"
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "0d095e398f7c2763c3b272dc38f983a5",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "fair": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Fair"
        },
        "fair.id": (v4/*: any*/),
        "fair.internalID": (v4/*: any*/),
        "fair.marketingCollections": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "MarketingCollection"
        },
        "fair.marketingCollections.artworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "fair.marketingCollections.artworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "FilterArtworksEdge"
        },
        "fair.marketingCollections.artworks.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "fair.marketingCollections.artworks.edges.node.id": (v4/*: any*/),
        "fair.marketingCollections.artworks.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "fair.marketingCollections.artworks.edges.node.image.url": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "fair.marketingCollections.artworks.id": (v4/*: any*/),
        "fair.marketingCollections.category": (v5/*: any*/),
        "fair.marketingCollections.id": (v4/*: any*/),
        "fair.marketingCollections.slug": (v5/*: any*/),
        "fair.marketingCollections.title": (v5/*: any*/),
        "fair.slug": (v4/*: any*/)
      }
    },
    "name": "FairCollectionsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '698cbe5f77b434bb9e2a958e782cc491';
export default node;
