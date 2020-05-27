/* tslint:disable */
/* eslint-disable */
/* @relayHash 092603e20300059e1886a2f9cf9a3a3c */

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
  "type": "SendConfirmationEmailMutationSuccess",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "unconfirmedEmail",
      "args": null,
      "storageKey": null
    }
  ]
},
v2 = {
  "kind": "InlineFragment",
  "type": "SendConfirmationEmailMutationFailure",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "mutationError",
      "storageKey": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "error",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "message",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "EmailConfirmationBannerMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sendConfirmationEmail",
        "storageKey": "sendConfirmationEmail(input:{})",
        "args": (v0/*: any*/),
        "concreteType": "SendConfirmationEmailMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "confirmationOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v1/*: any*/),
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "EmailConfirmationBannerMutation",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sendConfirmationEmail",
        "storageKey": "sendConfirmationEmail(input:{})",
        "args": (v0/*: any*/),
        "concreteType": "SendConfirmationEmailMutationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "confirmationOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v1/*: any*/),
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "EmailConfirmationBannerMutation",
    "id": "90d2bd62d1af3056963ca33fbff85f72",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8182aba3e36ec68ddd990739d7e718ff';
export default node;
