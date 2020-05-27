/* tslint:disable */
/* eslint-disable */
/* @relayHash afef109dbff4a2546468396237185fb7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EmailConfirmationBannerTestsQueryVariables = {};
export type EmailConfirmationBannerTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"EmailConfirmationBanner_me">;
    } | null;
};
export type EmailConfirmationBannerTestsQueryRawResponse = {
    readonly me: ({
        readonly canRequestEmailConfirmation: boolean;
        readonly id: string | null;
    }) | null;
};
export type EmailConfirmationBannerTestsQuery = {
    readonly response: EmailConfirmationBannerTestsQueryResponse;
    readonly variables: EmailConfirmationBannerTestsQueryVariables;
    readonly rawResponse: EmailConfirmationBannerTestsQueryRawResponse;
};



/*
query EmailConfirmationBannerTestsQuery {
  me {
    ...EmailConfirmationBanner_me
    id
  }
}

fragment EmailConfirmationBanner_me on Me {
  canRequestEmailConfirmation
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "EmailConfirmationBannerTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "EmailConfirmationBanner_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "EmailConfirmationBannerTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "canRequestEmailConfirmation",
            "args": null,
            "storageKey": null
          },
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
    "name": "EmailConfirmationBannerTestsQuery",
    "id": "b67ac5eb6cc6d0b2cacab1c7a3f0281b",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '9c9ab31576ef9d1a0d9f45c08ae46c3b';
export default node;
