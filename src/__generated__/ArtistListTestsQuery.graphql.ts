/* tslint:disable */
/* eslint-disable */
/* @relayHash fea06dcd0af1c7bb5142a88b9b4fd0ad */

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
      name
      href
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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtistListTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "targetSupply",
        "storageKey": null,
        "args": null,
        "concreteType": "TargetSupply",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "ArtistList_targetSupply",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtistListTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "targetSupply",
        "storageKey": null,
        "args": null,
        "concreteType": "TargetSupply",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "microfunnel",
            "storageKey": null,
            "args": null,
            "concreteType": "TargetSupplyMicrofunnelItem",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "artist",
                "storageKey": null,
                "args": null,
                "concreteType": "Artist",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "name",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "href",
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "id",
                    "args": null,
                    "storageKey": null
                  }
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
    "name": "ArtistListTestsQuery",
    "id": "ea7f1a738b1332150cfcbdc7d0582840",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'f92f17f8dc4dd0197cef5a75b01bc506';
export default node;
