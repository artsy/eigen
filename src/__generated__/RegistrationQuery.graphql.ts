/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 37e13791b239143c2214029e30fb2bd9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegistrationQueryVariables = {
    saleID: string;
};
export type RegistrationQueryResponse = {
    readonly sale: {
        readonly name: string | null;
        readonly " $fragmentRefs": FragmentRefs<"Registration_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"Registration_me">;
    } | null;
};
export type RegistrationQuery = {
    readonly response: RegistrationQueryResponse;
    readonly variables: RegistrationQueryVariables;
};



/*
query RegistrationQuery(
  $saleID: String!
) {
  sale(id: $saleID) {
    name
    ...Registration_sale
    id
  }
  me {
    ...Registration_me
    id
  }
}

fragment Registration_me on Me {
  has_credit_cards: hasCreditCards
  identityVerified
}

fragment Registration_sale on Sale {
  slug
  end_at: endAt
  is_preview: isPreview
  live_start_at: liveStartAt
  name
  start_at: startAt
  requireIdentityVerification
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "saleID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v3 = {
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
    "name": "RegistrationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Registration_sale"
          }
        ],
        "storageKey": null
      },
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
            "name": "Registration_me"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "RegistrationQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "kind": "LinkedField",
        "name": "sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "slug",
            "storageKey": null
          },
          {
            "alias": "end_at",
            "args": null,
            "kind": "ScalarField",
            "name": "endAt",
            "storageKey": null
          },
          {
            "alias": "is_preview",
            "args": null,
            "kind": "ScalarField",
            "name": "isPreview",
            "storageKey": null
          },
          {
            "alias": "live_start_at",
            "args": null,
            "kind": "ScalarField",
            "name": "liveStartAt",
            "storageKey": null
          },
          {
            "alias": "start_at",
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "requireIdentityVerification",
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": "has_credit_cards",
            "args": null,
            "kind": "ScalarField",
            "name": "hasCreditCards",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "identityVerified",
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "37e13791b239143c2214029e30fb2bd9",
    "metadata": {},
    "name": "RegistrationQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '36b321282c8221fc0cc8bc7d41dbb764';
export default node;
