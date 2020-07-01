/* tslint:disable */
/* eslint-disable */
/* @relayHash 297fcbe20bac7714aff275c369365606 */

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
export type MyAccountEditNameMutationVariables = {
    input: UpdateMyProfileInput;
};
export type MyAccountEditNameMutationResponse = {
    readonly updateMyUserProfile: {
        readonly me: {
            readonly name: string | null;
        } | null;
    } | null;
};
export type MyAccountEditNameMutation = {
    readonly response: MyAccountEditNameMutationResponse;
    readonly variables: MyAccountEditNameMutationVariables;
};



/*
mutation MyAccountEditNameMutation(
  $input: UpdateMyProfileInput!
) {
  updateMyUserProfile(input: $input) {
    me {
      name
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
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyAccountEditNameMutation",
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
    "name": "MyAccountEditNameMutation",
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
    "name": "MyAccountEditNameMutation",
    "id": "b99469e968494237bf38bf37a8fefddb",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '71c7a28845e97a2a9d9ab8c52864db9f';
export default node;
