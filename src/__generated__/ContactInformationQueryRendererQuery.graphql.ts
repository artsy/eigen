/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 87c6be549aa9629c508f4a2795e629d9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ContactInformationQueryRendererQueryVariables = {};
export type ContactInformationQueryRendererQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"ContactInformation_me">;
    } | null;
};
export type ContactInformationQueryRendererQuery = {
    readonly response: ContactInformationQueryRendererQueryResponse;
    readonly variables: ContactInformationQueryRendererQueryVariables;
};



/*
query ContactInformationQueryRendererQuery {
  me {
    ...ContactInformation_me
    id
  }
}

fragment ContactInformation_me on Me {
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
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ContactInformationQueryRendererQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ContactInformation_me"
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
    "name": "ContactInformationQueryRendererQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
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
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "phone",
            "storageKey": null
          },
          {
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
    "id": "87c6be549aa9629c508f4a2795e629d9",
    "metadata": {},
    "name": "ContactInformationQueryRendererQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '83984c595cb8ab77921edc3397bb5b5f';
export default node;
