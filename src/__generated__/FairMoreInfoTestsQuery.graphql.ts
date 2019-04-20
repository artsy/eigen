/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairMoreInfoTestsQueryVariables = {};
export type FairMoreInfoTestsQueryResponse = {
    readonly fair: ({
        readonly links: string | null;
        readonly about: string | null;
        readonly ticketsLink: string | null;
    }) | null;
};
export type FairMoreInfoTestsQuery = {
    readonly response: FairMoreInfoTestsQueryResponse;
    readonly variables: FairMoreInfoTestsQueryVariables;
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
    "value": "sofa-chicago-2018",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "links",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "about",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "ticketsLink",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairMoreInfoTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"sofa-chicago-2018\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "FairMoreInfoTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": "fair(id:\"sofa-chicago-2018\")",
        "args": (v0/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
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
    "name": "FairMoreInfoTestsQuery",
    "id": "2ed3205d94bc196c8fe618fdc3db1933",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2ed3205d94bc196c8fe618fdc3db1933';
export default node;
