/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7085ee295953be39ef806eea15c4be3c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2MoreInfoQueryVariables = {
    id: string;
};
export type Show2MoreInfoQueryResponse = {
    readonly show: {
        readonly " $fragmentRefs": FragmentRefs<"Show2MoreInfo_show">;
    } | null;
};
export type Show2MoreInfoQuery = {
    readonly response: Show2MoreInfoQueryResponse;
    readonly variables: Show2MoreInfoQueryVariables;
};



/*
query Show2MoreInfoQuery(
  $id: String!
) {
  show(id: $id) {
    ...Show2MoreInfo_show
    id
  }
}

fragment Show2MoreInfo_show on Show {
  href
  about: description
  pressRelease(format: MARKDOWN)
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Show2MoreInfoQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Show2MoreInfo_show"
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
    "name": "Show2MoreInfoQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Show",
        "kind": "LinkedField",
        "name": "show",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "href",
            "storageKey": null
          },
          {
            "alias": "about",
            "args": null,
            "kind": "ScalarField",
            "name": "description",
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "format",
                "value": "MARKDOWN"
              }
            ],
            "kind": "ScalarField",
            "name": "pressRelease",
            "storageKey": "pressRelease(format:\"MARKDOWN\")"
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
    ]
  },
  "params": {
    "id": "7085ee295953be39ef806eea15c4be3c",
    "metadata": {},
    "name": "Show2MoreInfoQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '8433502b326dbbb48f8a6b4aaa2e5e30';
export default node;
