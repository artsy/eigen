/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 148bd39a2984ef9ef8e2069c0395845b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistListTestsQueryVariables = {};
export type ArtistListTestsQueryResponse = {
    readonly targetSupply: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistList_targetSupply">;
    } | null;
};
export type ArtistListTestsQuery = {
    readonly response: ArtistListTestsQueryResponse;
    readonly variables: ArtistListTestsQueryVariables;
};



/*
query ArtistListTestsQuery {
  targetSupply {
    ...ArtistList_targetSupply
  }
}

fragment ArtistList_targetSupply on TargetSupply {
  microfunnel {
    artist {
      internalID
      name
      href
      slug
      image {
        cropped(width: 76, height: 70) {
          url
          width
          height
        }
      }
      id
    }
  }
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistListTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TargetSupply",
        "kind": "LinkedField",
        "name": "targetSupply",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistList_targetSupply"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtistListTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "TargetSupply",
        "kind": "LinkedField",
        "name": "targetSupply",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "TargetSupplyMicrofunnelItem",
            "kind": "LinkedField",
            "name": "microfunnel",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Artist",
                "kind": "LinkedField",
                "name": "artist",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "internalID",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "name",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "href",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "slug",
                    "storageKey": null
                  },
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
                        "kind": "LinkedField",
                        "name": "cropped",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "width",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "height",
                            "storageKey": null
                          }
                        ],
                        "storageKey": "cropped(height:70,width:76)"
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "id",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "148bd39a2984ef9ef8e2069c0395845b",
    "metadata": {},
    "name": "ArtistListTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'f92f17f8dc4dd0197cef5a75b01bc506';
export default node;
