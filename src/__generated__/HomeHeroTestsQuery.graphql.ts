/* tslint:disable */
/* eslint-disable */
/* @relayHash 7fad7650d50cc0c1cbb2b18ad49d14f7 */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "HomeHeroTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "HomeHero_homePage",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "HomeHeroTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "homePage",
        "storageKey": null,
        "args": null,
        "concreteType": "HomePage",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "heroUnits",
            "storageKey": "heroUnits(platform:\"MOBILE\")",
            "args": [
              {
                "kind": "Literal",
                "name": "platform",
                "value": "MOBILE"
              }
            ],
            "concreteType": "HomePageHeroUnit",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "title",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "subtitle",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "creditLine",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "linkText",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "backgroundImageURL",
                "args": null,
                "storageKey": null
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
  },
  "params": {
    "operationKind": "query",
    "name": "HomeHeroTestsQuery",
    "id": "ba96e13a2b0672e7b9763c1647dd5c2d",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '63c8573155169d6d07b9835a2b086e98';
export default node;
