/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash be5b942a5a52bc7d8e49bb2dada4ad5f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type RegistrationFlowQueryVariables = {
    saleID: string;
};
export type RegistrationFlowQueryResponse = {
    readonly sale: {
        readonly name: string | null;
        readonly " $fragmentRefs": FragmentRefs<"RegistrationFlow_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"RegistrationFlow_me">;
    } | null;
};
export type RegistrationFlowQuery = {
    readonly response: RegistrationFlowQueryResponse;
    readonly variables: RegistrationFlowQueryVariables;
};



/*
query RegistrationFlowQuery(
  $saleID: String!
) {
  sale(id: $saleID) {
    name
    ...RegistrationFlow_sale
    id
  }
  me {
    ...RegistrationFlow_me
    id
  }
}

fragment RegistrationFlow_me on Me {
  ...Registration_me
}

fragment RegistrationFlow_sale on Sale {
  ...Registration_sale
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
    "name": "RegistrationFlowQuery",
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
            "name": "RegistrationFlow_sale"
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
            "name": "RegistrationFlow_me"
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
    "name": "RegistrationFlowQuery",
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
    "id": "be5b942a5a52bc7d8e49bb2dada4ad5f",
    "metadata": {},
    "name": "RegistrationFlowQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'af83c19448e31ceffd514ab56c5e7b95';
export default node;
