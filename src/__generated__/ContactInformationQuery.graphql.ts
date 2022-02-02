/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fe305f8dcfc8421471ece05157644a19 */

import { ConcreteRequest } from "relay-runtime";
export type ContactInformationQueryVariables = {};
export type ContactInformationQueryResponse = {
    readonly me: {
        readonly name: string | null;
        readonly email: string | null;
        readonly phone: string | null;
    } | null;
};
export type ContactInformationQuery = {
    readonly response: ContactInformationQueryResponse;
    readonly variables: ContactInformationQueryVariables;
};



/*
query ContactInformationQuery {
  me {
    name
    email
    phone
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "phone",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ContactInformationQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/)
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
    "name": "ContactInformationQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          (v0/*: any*/),
          (v1/*: any*/),
          (v2/*: any*/),
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
    "id": "fe305f8dcfc8421471ece05157644a19",
    "metadata": {},
    "name": "ContactInformationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '9a9e8f0ff472e37d49081dca4761221d';
export default node;
