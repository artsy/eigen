/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 21d8ec4ea76fb5e8b71f3045b76905a0 */

import { ConcreteRequest } from "relay-runtime";
export type FairMoreInfoTestsQueryVariables = {};
export type FairMoreInfoTestsQueryResponse = {
    readonly fair: {
        readonly links: string | null;
        readonly about: string | null;
        readonly ticketsLink: string | null;
    } | null;
};
export type FairMoreInfoTestsQueryRawResponse = {
    readonly fair: ({
        readonly links: string | null;
        readonly about: string | null;
        readonly ticketsLink: string | null;
        readonly id: string;
    }) | null;
};
export type FairMoreInfoTestsQuery = {
    readonly response: FairMoreInfoTestsQueryResponse;
    readonly variables: FairMoreInfoTestsQueryVariables;
    readonly rawResponse: FairMoreInfoTestsQueryRawResponse;
};



/*
query FairMoreInfoTestsQuery {
  fair(id: "sofa-chicago-2018") {
    links
    about
    ticketsLink
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "sofa-chicago-2018"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "links",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "about",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "ticketsLink",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "FairMoreInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": "fair(id:\"sofa-chicago-2018\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "FairMoreInfoTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "fair(id:\"sofa-chicago-2018\")"
      }
    ]
  },
  "params": {
    "id": "21d8ec4ea76fb5e8b71f3045b76905a0",
    "metadata": {},
    "name": "FairMoreInfoTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '45ad79039297fa8a746e34a2075ce76d';
export default node;
