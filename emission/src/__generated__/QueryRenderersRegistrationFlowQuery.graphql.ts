/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type QueryRenderersRegistrationFlowQueryVariables = {
    saleID: string;
};
export type QueryRenderersRegistrationFlowQueryResponse = {
    readonly sale: {
        readonly name: string | null;
        readonly " $fragmentRefs": FragmentRefs<"RegistrationFlow_sale">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"RegistrationFlow_me">;
    } | null;
};
export type QueryRenderersRegistrationFlowQuery = {
    readonly response: QueryRenderersRegistrationFlowQueryResponse;
    readonly variables: QueryRenderersRegistrationFlowQueryVariables;
};



/*
query QueryRenderersRegistrationFlowQuery(
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

fragment RegistrationFlow_sale on Sale {
  ...Registration_sale
}

fragment RegistrationFlow_me on Me {
  ...Registration_me
}

fragment Registration_me on Me {
  has_credit_cards: hasCreditCards
}

fragment Registration_sale on Sale {
  slug
  end_at: endAt
  is_preview: isPreview
  live_start_at: liveStartAt
  name
  start_at: startAt
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
    "name": "QueryRenderersRegistrationFlowQuery",
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
    "name": "QueryRenderersRegistrationFlowQuery",
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
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersRegistrationFlowQuery",
    "id": "2f122dcbf2ba168b4064dbda946e403c",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'bce11602f08e3a5b15eae2a068725187';
export default node;
