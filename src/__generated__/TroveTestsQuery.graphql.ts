/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d4e51a8d9d6d146eff5256ce3521bc41 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type TroveTestsQueryVariables = {};
export type TroveTestsQueryResponse = {
    readonly homePage: {
        readonly " $fragmentRefs": FragmentRefs<"Trove_trove">;
    } | null;
};
export type TroveTestsQuery = {
    readonly response: TroveTestsQueryResponse;
    readonly variables: TroveTestsQueryVariables;
};



/*
query TroveTestsQuery {
  homePage {
    ...Trove_trove
  }
}

fragment Trove_trove on HomePage {
  heroUnits(platform: MOBILE) {
    title
    subtitle
    creditLine
    href
    backgroundImageURL
    id
  }
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "TroveTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HomePage",
        "kind": "LinkedField",
        "name": "homePage",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Trove_trove"
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
    "name": "TroveTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "HomePage",
        "kind": "LinkedField",
        "name": "homePage",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "platform",
                "value": "MOBILE"
              }
            ],
            "concreteType": "HomePageHeroUnit",
            "kind": "LinkedField",
            "name": "heroUnits",
            "plural": true,
            "selections": [
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
                "name": "subtitle",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "creditLine",
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
                "name": "backgroundImageURL",
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
            "storageKey": "heroUnits(platform:\"MOBILE\")"
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d4e51a8d9d6d146eff5256ce3521bc41",
    "metadata": {},
    "name": "TroveTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'eb76b6abbdb1edc56ebcd9bc003c2527';
export default node;
