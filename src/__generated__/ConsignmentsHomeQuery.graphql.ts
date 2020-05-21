/* tslint:disable */
/* eslint-disable */
/* @relayHash da35d2c34db9a75b77a8526ccc0eed0c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsHomeQueryVariables = {
    artistIDs: Array<string>;
};
export type ConsignmentsHomeQueryResponse = {
    readonly artists: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ConsignmentsHome_artists">;
    } | null> | null;
};
export type ConsignmentsHomeQuery = {
    readonly response: ConsignmentsHomeQueryResponse;
    readonly variables: ConsignmentsHomeQueryVariables;
};



/*
query ConsignmentsHomeQuery(
  $artistIDs: [String!]!
) {
  artists(ids: $artistIDs) {
    ...ConsignmentsHome_artists
    id
  }
}

fragment ArtistList_artists on Artist {
  name
  href
  image {
    cropped(width: 76, height: 70) {
      url
      width
      height
    }
  }
}

fragment ConsignmentsHome_artists on Artist {
  ...RecentlySold_artists
  ...ArtistList_artists
}

fragment RecentlySold_artists on Artist {
  internalID
  targetSupply {
    microfunnel {
      artworksConnection(first: 1) {
        edges {
          node {
            slug
            internalID
            href
            artistNames
            image {
              imageURL
            }
            realizedPrice
            id
          }
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artistIDs",
    "type": "[String!]!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "ids",
    "variableName": "artistIDs"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
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
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConsignmentsHomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artists",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": true,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ConsignmentsHome_artists",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ConsignmentsHomeQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artists",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artist",
        "plural": true,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "targetSupply",
            "storageKey": null,
            "args": null,
            "concreteType": "ArtistTargetSupply",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "microfunnel",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtistTargetSupplyMicrofunnel",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworksConnection",
                    "storageKey": "artworksConnection(first:1)",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 1
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
                                "name": "slug",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/),
                              (v3/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "artistNames",
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
                                    "name": "imageURL",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "realizedPrice",
                                "args": null,
                                "storageKey": null
                              },
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
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
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
                "kind": "LinkedField",
                "alias": null,
                "name": "cropped",
                "storageKey": "cropped(height:70,width:76)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "height",
                    "value": 70
                  },
                  {
                    "kind": "Literal",
                    "name": "width",
                    "value": 76
                  }
                ],
                "concreteType": "CroppedImageUrl",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "url",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "width",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "height",
                    "args": null,
                    "storageKey": null
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
    "name": "ConsignmentsHomeQuery",
    "id": "d02a2bf8d530535082ec19aae6f339db",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'c00d31f6f91b114afe50f7be7883278b';
export default node;
