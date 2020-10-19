/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash ba9c29e5a8a919afab55321318b08233 */

import { ConcreteRequest } from "relay-runtime";
export type CreateBidderInput = {
    clientMutationId?: string | null;
    saleID: string;
};
export type RegistrationCreateBidderMutationVariables = {
    input: CreateBidderInput;
};
export type RegistrationCreateBidderMutationResponse = {
    readonly createBidder: {
        readonly bidder: {
            readonly internalID: string;
            readonly qualified_for_bidding: boolean | null;
            readonly sale: {
                readonly registrationStatus: {
                    readonly qualifiedForBidding: boolean | null;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type RegistrationCreateBidderMutation = {
    readonly response: RegistrationCreateBidderMutationResponse;
    readonly variables: RegistrationCreateBidderMutationVariables;
};



/*
mutation RegistrationCreateBidderMutation(
  $input: CreateBidderInput!
) {
  createBidder(input: $input) {
    bidder {
      internalID
      qualified_for_bidding: qualifiedForBidding
      sale {
        registrationStatus {
          qualifiedForBidding
          id
        }
        id
      }
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": "qualified_for_bidding",
  "args": null,
  "kind": "ScalarField",
  "name": "qualifiedForBidding",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "qualifiedForBidding",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "RegistrationCreateBidderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateBidderPayload",
        "kind": "LinkedField",
        "name": "createBidder",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "bidder",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "sale",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Bidder",
                    "kind": "LinkedField",
                    "name": "registrationStatus",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RegistrationCreateBidderMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateBidderPayload",
        "kind": "LinkedField",
        "name": "createBidder",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "bidder",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "sale",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Bidder",
                    "kind": "LinkedField",
                    "name": "registrationStatus",
                    "plural": false,
                    "selections": [
                      (v4/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": null
              },
              (v5/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "ba9c29e5a8a919afab55321318b08233",
    "metadata": {},
    "name": "RegistrationCreateBidderMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'cd8998226b1b49e2b9a7e9a497ac1ac8';
export default node;
