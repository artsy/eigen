/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3829cfedf7697d8003b474016174ad35 */

import { ConcreteRequest } from "relay-runtime";
export type verifyEmailMutationVariables = {};
export type verifyEmailMutationResponse = {
    readonly sendConfirmationEmail: {
        readonly confirmationOrError: {
            readonly unconfirmedEmail?: string | null | undefined;
            readonly mutationError?: {
                readonly error: string | null;
                readonly message: string;
            } | null | undefined;
        } | null;
    } | null;
};
export type verifyEmailMutation = {
    readonly response: verifyEmailMutationResponse;
    readonly variables: verifyEmailMutationVariables;
};



/*
mutation verifyEmailMutation {
  sendConfirmationEmail(input: {}) {
    confirmationOrError {
      __typename
      ... on SendConfirmationEmailMutationSuccess {
        unconfirmedEmail
      }
      ... on SendConfirmationEmailMutationFailure {
        mutationError {
          error
          message
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "input",
    "value": {}
  }
],
v1 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "unconfirmedEmail",
      "storageKey": null
    }
  ],
  "type": "SendConfirmationEmailMutationSuccess",
  "abstractKey": null
},
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "kind": "LinkedField",
      "name": "mutationError",
      "plural": false,
      "selections": [
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
          "name": "message",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "SendConfirmationEmailMutationFailure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "verifyEmailMutation",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "SendConfirmationEmailMutationPayload",
        "kind": "LinkedField",
        "name": "sendConfirmationEmail",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "confirmationOrError",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "sendConfirmationEmail(input:{})"
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "verifyEmailMutation",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "SendConfirmationEmailMutationPayload",
        "kind": "LinkedField",
        "name": "sendConfirmationEmail",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "confirmationOrError",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v1/*: any*/),
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": "sendConfirmationEmail(input:{})"
      }
    ]
  },
  "params": {
    "id": "3829cfedf7697d8003b474016174ad35",
    "metadata": {},
    "name": "verifyEmailMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '69c843183da787e03abf1b3bb8bb5fed';
export default node;
