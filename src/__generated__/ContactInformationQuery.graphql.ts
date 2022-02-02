/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fbf1691f12192e12e2d59c5bf230aee7 */

import { ConcreteRequest } from "relay-runtime";
export type PhoneNumberErrors = "INVALID_COUNTRY_CODE" | "INVALID_NUMBER" | "TOO_LONG" | "TOO_SHORT" | "%future added value";
export type ContactInformationQueryVariables = {};
export type ContactInformationQueryResponse = {
    readonly me: {
        readonly name: string | null;
        readonly email: string | null;
        readonly phone: string | null;
        readonly phoneNumber: {
            readonly countryCode: string | null;
            readonly display: string | null;
            readonly error: PhoneNumberErrors | null;
            readonly isValid: boolean | null;
            readonly originalNumber: string | null;
            readonly regionCode: string | null;
        } | null;
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
    phoneNumber {
      countryCode
      display
      error
      isValid
      originalNumber
      regionCode
    }
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
},
v3 = {
  "alias": null,
  "args": null,
  "concreteType": "PhoneNumberType",
  "kind": "LinkedField",
  "name": "phoneNumber",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "countryCode",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "error",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isValid",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "originalNumber",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "regionCode",
      "storageKey": null
    }
  ],
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
          (v2/*: any*/),
          (v3/*: any*/)
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
          (v3/*: any*/),
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
    "id": "fbf1691f12192e12e2d59c5bf230aee7",
    "metadata": {},
    "name": "ContactInformationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '9b33e36b9e816cefc13f4a9ca09361c7';
export default node;
