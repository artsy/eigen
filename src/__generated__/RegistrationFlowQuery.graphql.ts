/* tslint:disable */
/* eslint-disable */
/* @relayHash 14d571d1d761fe430b63403e7a8fe087 */

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
    "kind": "LocalArgument",
    "name": "saleID",
    "type": "String!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "RegistrationFlowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "FragmentSpread",
            "name": "RegistrationFlow_sale",
            "args": null
          }
        ]
      },
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
            "name": "RegistrationFlow_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "RegistrationFlowQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "slug",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "end_at",
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_preview",
            "name": "isPreview",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "live_start_at",
            "name": "liveStartAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "start_at",
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "requireIdentityVerification",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/)
        ]
      },
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
            "alias": "has_credit_cards",
            "name": "hasCreditCards",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "identityVerified",
            "args": null,
            "storageKey": null
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "RegistrationFlowQuery",
    "id": "be5b942a5a52bc7d8e49bb2dada4ad5f",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'af83c19448e31ceffd514ab56c5e7b95';
export default node;
