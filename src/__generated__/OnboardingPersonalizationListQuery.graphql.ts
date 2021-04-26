/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9fe0d3e955ba21250b92a3e56dcc92b0 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalizationListQueryVariables = {};
export type OnboardingPersonalizationListQueryResponse = {
    readonly highlights: {
        readonly popularArtists: ReadonlyArray<{
            readonly " $fragmentRefs": FragmentRefs<"OnboardingPersonalization_popularArtists">;
        } | null> | null;
    } | null;
};
export type OnboardingPersonalizationListQuery = {
    readonly response: OnboardingPersonalizationListQueryResponse;
    readonly variables: OnboardingPersonalizationListQueryVariables;
};



/*
query OnboardingPersonalizationListQuery {
  highlights {
    popularArtists(excludeFollowedArtists: true) {
      ...OnboardingPersonalization_popularArtists
      id
    }
  }
}

fragment OnboardingPersonalization_popularArtists on Artist {
  slug
  internalID
  id
  name
  image {
    cropped(width: 100, height: 100) {
      url
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "excludeFollowedArtists",
    "value": true
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OnboardingPersonalizationListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Highlights",
        "kind": "LinkedField",
        "name": "highlights",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "popularArtists",
            "plural": true,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "OnboardingPersonalization_popularArtists"
              }
            ],
            "storageKey": "popularArtists(excludeFollowedArtists:true)"
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
    "name": "OnboardingPersonalizationListQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Highlights",
        "kind": "LinkedField",
        "name": "highlights",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v0/*: any*/),
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "popularArtists",
            "plural": true,
            "selections": [
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
                "kind": "ScalarField",
                "name": "internalID",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "id",
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
                        "value": 100
                      },
                      {
                        "kind": "Literal",
                        "name": "width",
                        "value": 100
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
                      }
                    ],
                    "storageKey": "cropped(height:100,width:100)"
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "popularArtists(excludeFollowedArtists:true)"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "9fe0d3e955ba21250b92a3e56dcc92b0",
    "metadata": {},
    "name": "OnboardingPersonalizationListQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '89276d07dd60d694f9ab269797e12c43';
export default node;
