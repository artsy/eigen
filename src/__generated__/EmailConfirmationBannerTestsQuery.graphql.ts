/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b67ac5eb6cc6d0b2cacab1c7a3f0281b */

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
        readonly id: string;
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
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EmailConfirmationBannerTestsQuery",
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
            "name": "EmailConfirmationBanner_me"
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
    "name": "EmailConfirmationBannerTestsQuery",
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
            "name": "canRequestEmailConfirmation",
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
    "id": "b67ac5eb6cc6d0b2cacab1c7a3f0281b",
    "metadata": {},
    "name": "EmailConfirmationBannerTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '9c9ab31576ef9d1a0d9f45c08ae46c3b';
export default node;
