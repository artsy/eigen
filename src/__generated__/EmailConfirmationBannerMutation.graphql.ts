/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 90d2bd62d1af3056963ca33fbff85f72 */

import { ConcreteRequest } from "relay-runtime";
export type EmailConfirmationBannerMutationVariables = {};
export type EmailConfirmationBannerMutationResponse = {
    readonly sendConfirmationEmail: {
        readonly confirmationOrError: {
            readonly unconfirmedEmail?: string | null;
            readonly mutationError?: {
                readonly error: string | null;
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type EmailConfirmationBannerMutation = {
    readonly response: EmailConfirmationBannerMutationResponse;
    readonly variables: EmailConfirmationBannerMutationVariables;
};



/*
mutation EmailConfirmationBannerMutation {
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
    "name": "EmailConfirmationBannerMutation",
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
    "name": "EmailConfirmationBannerMutation",
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
    "id": "90d2bd62d1af3056963ca33fbff85f72",
    "metadata": {},
    "name": "EmailConfirmationBannerMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '8182aba3e36ec68ddd990739d7e718ff';
export default node;
