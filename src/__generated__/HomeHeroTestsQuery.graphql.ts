/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ba96e13a2b0672e7b9763c1647dd5c2d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type HomeHeroTestsQueryVariables = {};
export type HomeHeroTestsQueryResponse = {
    readonly homePage: {
        readonly " $fragmentRefs": FragmentRefs<"HomeHero_homePage">;
    } | null;
};
export type HomeHeroTestsQuery = {
    readonly response: HomeHeroTestsQueryResponse;
    readonly variables: HomeHeroTestsQueryVariables;
};



/*
query HomeHeroTestsQuery {
  homePage {
    ...HomeHero_homePage
  }
}

fragment HomeHero_homePage on HomePage {
  heroUnits(platform: MOBILE) {
    title
    subtitle
    creditLine
    linkText
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
    "name": "HomeHeroTestsQuery",
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
            "name": "HomeHero_homePage"
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
    "name": "HomeHeroTestsQuery",
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
                "name": "linkText",
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
    "id": "ba96e13a2b0672e7b9763c1647dd5c2d",
    "metadata": {},
    "name": "HomeHeroTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '63c8573155169d6d07b9835a2b086e98';
export default node;
