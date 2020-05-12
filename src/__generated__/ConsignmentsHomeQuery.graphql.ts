/* tslint:disable */
/* eslint-disable */
/* @relayHash 041009e4ae9be4481d00264f2506869c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsHomeQueryVariables = {};
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
query ConsignmentsHomeQuery {
  artists(ids: ["4d8d120c876c697ae1000046", "4dd1584de0091e000100207c", "4d8b926a4eb68a1b2c0000ae", "4d8b92854eb68a1b2c0001b6", "4de3c41f7a22e70001002b13", "4d8b92774eb68a1b2c000138", "4d9e1a143c86c538060000a4", "548c89017261695fe5210500", "4e97537ca200000001002237", "4d8b92904eb68a1b2c00022e", "506b332d4466170002000489", "4e934002e340fa0001005336", "4ed901b755a41e0001000a9f", "4e975df46ba7120001001fe2", "4f5f64c13b555230ac000004", "4d8b92734eb68a1b2c00010c", "4d9b330cff9a375c2f0031a8", "551bcaa77261692b6f181400", "4d8b92bb4eb68a1b2c000452", "4ef3c0ee9f1ce1000100022f"]) {
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
  ...ArtistList_artists
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "ids",
    "value": [
      "4d8d120c876c697ae1000046",
      "4dd1584de0091e000100207c",
      "4d8b926a4eb68a1b2c0000ae",
      "4d8b92854eb68a1b2c0001b6",
      "4de3c41f7a22e70001002b13",
      "4d8b92774eb68a1b2c000138",
      "4d9e1a143c86c538060000a4",
      "548c89017261695fe5210500",
      "4e97537ca200000001002237",
      "4d8b92904eb68a1b2c00022e",
      "506b332d4466170002000489",
      "4e934002e340fa0001005336",
      "4ed901b755a41e0001000a9f",
      "4e975df46ba7120001001fe2",
      "4f5f64c13b555230ac000004",
      "4d8b92734eb68a1b2c00010c",
      "4d9b330cff9a375c2f0031a8",
      "551bcaa77261692b6f181400",
      "4d8b92bb4eb68a1b2c000452",
      "4ef3c0ee9f1ce1000100022f"
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ConsignmentsHomeQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artists",
        "storageKey": "artists(ids:[\"4d8d120c876c697ae1000046\",\"4dd1584de0091e000100207c\",\"4d8b926a4eb68a1b2c0000ae\",\"4d8b92854eb68a1b2c0001b6\",\"4de3c41f7a22e70001002b13\",\"4d8b92774eb68a1b2c000138\",\"4d9e1a143c86c538060000a4\",\"548c89017261695fe5210500\",\"4e97537ca200000001002237\",\"4d8b92904eb68a1b2c00022e\",\"506b332d4466170002000489\",\"4e934002e340fa0001005336\",\"4ed901b755a41e0001000a9f\",\"4e975df46ba7120001001fe2\",\"4f5f64c13b555230ac000004\",\"4d8b92734eb68a1b2c00010c\",\"4d9b330cff9a375c2f0031a8\",\"551bcaa77261692b6f181400\",\"4d8b92bb4eb68a1b2c000452\",\"4ef3c0ee9f1ce1000100022f\"])",
        "args": (v0/*: any*/),
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
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artists",
        "storageKey": "artists(ids:[\"4d8d120c876c697ae1000046\",\"4dd1584de0091e000100207c\",\"4d8b926a4eb68a1b2c0000ae\",\"4d8b92854eb68a1b2c0001b6\",\"4de3c41f7a22e70001002b13\",\"4d8b92774eb68a1b2c000138\",\"4d9e1a143c86c538060000a4\",\"548c89017261695fe5210500\",\"4e97537ca200000001002237\",\"4d8b92904eb68a1b2c00022e\",\"506b332d4466170002000489\",\"4e934002e340fa0001005336\",\"4ed901b755a41e0001000a9f\",\"4e975df46ba7120001001fe2\",\"4f5f64c13b555230ac000004\",\"4d8b92734eb68a1b2c00010c\",\"4d9b330cff9a375c2f0031a8\",\"551bcaa77261692b6f181400\",\"4d8b92bb4eb68a1b2c000452\",\"4ef3c0ee9f1ce1000100022f\"])",
        "args": (v0/*: any*/),
        "concreteType": "Artist",
        "plural": true,
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
  },
  "params": {
    "operationKind": "query",
    "name": "ConsignmentsHomeQuery",
    "id": "7b4d7c817f6947986c4b2d4b5b39e9e0",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '1b08d27e5c1a2e4c76d49cba41b0072e';
export default node;
