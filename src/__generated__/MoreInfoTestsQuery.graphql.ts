/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MoreInfo_show$ref } from "./MoreInfo_show.graphql";
export type MoreInfoTestsQueryVariables = {};
export type MoreInfoTestsQueryResponse = {
    readonly show: ({
        readonly " $fragmentRefs": MoreInfo_show$ref;
    }) | null;
};
export type MoreInfoTestsQuery = {
    readonly response: MoreInfoTestsQueryResponse;
    readonly variables: MoreInfoTestsQueryVariables;
};



/*
query MoreInfoTestsQuery {
  show(id: "anderson-fine-art-gallery-flickinger-collection") {
    ...MoreInfo_show
    __id
  }
}

fragment MoreInfo_show on Show {
  press_release
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "anderson-fine-art-gallery-flickinger-collection",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "MoreInfoTestsQuery",
  "id": "a71fe63e268713f0acb9b130c5fd3ff9",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "MoreInfoTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MoreInfo_show",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MoreInfoTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "show",
        "storageKey": "show(id:\"anderson-fine-art-gallery-flickinger-collection\")",
        "args": v0,
        "concreteType": "Show",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "press_release",
            "args": null,
            "storageKey": null
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'bc9b5b8df734aa249ca91e119888e47e';
export default node;
