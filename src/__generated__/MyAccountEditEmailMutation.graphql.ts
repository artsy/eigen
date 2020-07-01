/* tslint:disable */
/* eslint-disable */
/* @relayHash 89bbf18121327caf9f85286d0a75c732 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateMyProfileInput = {
    clientMutationId?: string | null;
    collectorLevel?: number | null;
    email?: string | null;
    location?: EditableLocation | null;
    name?: string | null;
    phone?: string | null;
    priceRangeMax?: number | null;
    priceRangeMin?: number | null;
};
export type EditableLocation = {
    address?: string | null;
    address2?: string | null;
    city?: string | null;
    country?: string | null;
    postalCode?: string | null;
    state?: string | null;
    stateCode?: string | null;
    summary?: string | null;
};
export type MyAccountEditEmailMutationVariables = {
    input: UpdateMyProfileInput;
};
export type MyAccountEditEmailMutationResponse = {
    readonly updateMyUserProfile: {
        readonly me: {
            readonly email: string | null;
        } | null;
    } | null;
};
export type MyAccountEditEmailMutation = {
    readonly response: MyAccountEditEmailMutationResponse;
    readonly variables: MyAccountEditEmailMutationVariables;
};



/*
mutation MyAccountEditEmailMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    me {
      email
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "UpdateMyProfileInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "email",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyAccountEditEmailMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateMyUserProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "plural": false,
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
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyAccountEditEmailMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateMyUserProfile",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateMyProfilePayload",
        "plural": false,
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
              (v2/*: any*/),
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
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyAccountEditEmailMutation",
    "id": "e8cf30c2aadac83ed062172edd1479e7",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cfbfeeda2e15d3d2464ef6f29592f694';
export default node;
