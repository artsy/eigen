/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 28834275cd2da1864f1a38c65d7ccd53 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuthenticationProvider = "APPLE" | "FACEBOOK" | "GOOGLE" | "%future added value";
export type apple_LinkAccountMutationVariables = {
    provider: AuthenticationProvider;
    appleUid: string;
    idToken: string;
    email: string;
    name: string;
    oauthToken: string;
};
export type apple_LinkAccountMutationResponse = {
    readonly linkAuthentication: {
        readonly me: {
            readonly " $fragmentRefs": FragmentRefs<"MyAccount_me">;
        };
    } | null;
};
export type apple_LinkAccountMutation = {
    readonly response: apple_LinkAccountMutationResponse;
    readonly variables: apple_LinkAccountMutationVariables;
};



/*
mutation apple_LinkAccountMutation(
  $provider: AuthenticationProvider!
  $appleUid: String!
  $idToken: String!
  $email: String!
  $name: String!
  $oauthToken: String!
) {
  linkAuthentication(input: {provider: $provider, appleUid: $appleUid, idToken: $idToken, email: $email, name: $name, oauthToken: $oauthToken}) {
    me {
      ...MyAccount_me
      id
    }
  }
}

fragment MyAccount_me on Me {
  name
  email
  phone
  paddleNumber
  hasPassword
  authentications {
    provider
    id
  }
  secondFactors(kinds: [sms, app, backup]) {
    __typename
    kind
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "appleUid"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "email"
},
v2 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "idToken"
},
v3 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "name"
},
v4 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "oauthToken"
},
v5 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "provider"
},
v6 = [
  {
    "fields": [
      {
        "kind": "Variable",
        "name": "appleUid",
        "variableName": "appleUid"
      },
      {
        "kind": "Variable",
        "name": "email",
        "variableName": "email"
      },
      {
        "kind": "Variable",
        "name": "idToken",
        "variableName": "idToken"
      },
      {
        "kind": "Variable",
        "name": "name",
        "variableName": "name"
      },
      {
        "kind": "Variable",
        "name": "oauthToken",
        "variableName": "oauthToken"
      },
      {
        "kind": "Variable",
        "name": "provider",
        "variableName": "provider"
      }
    ],
    "kind": "ObjectValue",
    "name": "input"
  }
],
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/),
      (v2/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v5/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "apple_LinkAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "LinkAuthenticationMutationPayload",
        "kind": "LinkedField",
        "name": "linkAuthentication",
        "plural": false,
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
                "name": "MyAccount_me"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v5/*: any*/),
      (v0/*: any*/),
      (v2/*: any*/),
      (v1/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/)
    ],
    "kind": "Operation",
    "name": "apple_LinkAccountMutation",
    "selections": [
      {
        "alias": null,
        "args": (v6/*: any*/),
        "concreteType": "LinkAuthenticationMutationPayload",
        "kind": "LinkedField",
        "name": "linkAuthentication",
        "plural": false,
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
                "kind": "ScalarField",
                "name": "paddleNumber",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasPassword",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "AuthenticationType",
                "kind": "LinkedField",
                "name": "authentications",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "provider",
                    "storageKey": null
                  },
                  (v7/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "kinds",
                    "value": [
                      "sms",
                      "app",
                      "backup"
                    ]
                  }
                ],
                "concreteType": null,
                "kind": "LinkedField",
                "name": "secondFactors",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "__typename",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "kind",
                    "storageKey": null
                  }
                ],
                "storageKey": "secondFactors(kinds:[\"sms\",\"app\",\"backup\"])"
              },
              (v7/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "28834275cd2da1864f1a38c65d7ccd53",
    "metadata": {},
    "name": "apple_LinkAccountMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'f402393ace149e2037e5e9fe2244644b';
export default node;
