/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { RegistrationFlow_me$ref } from "./RegistrationFlow_me.graphql";
import { RegistrationFlow_sale$ref } from "./RegistrationFlow_sale.graphql";
export type QueryRenderersRegistrationFlowQueryVariables = {
    readonly saleID: string;
};
export type QueryRenderersRegistrationFlowQueryResponse = {
    readonly sale: ({
        readonly name: string | null;
        readonly " $fragmentRefs": RegistrationFlow_sale$ref;
    }) | null;
    readonly me: ({
        readonly " $fragmentRefs": RegistrationFlow_me$ref;
    }) | null;
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
    __id: id
  }
  me {
    ...RegistrationFlow_me
    __id: id
  }
}

fragment RegistrationFlow_sale on Sale {
  ...Registration_sale
  __id: id
}

fragment RegistrationFlow_me on Me {
  ...Registration_me
  __id: id
}

fragment Registration_me on Me {
  has_credit_cards
  __id: id
}

fragment Registration_sale on Sale {
  gravityID
  end_at
  is_preview
  live_start_at
  name
  start_at
  __id: id
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
    "variableName": "saleID",
    "type": "String!"
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
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersRegistrationFlowQuery",
  "id": null,
  "text": "query QueryRenderersRegistrationFlowQuery(\n  $saleID: String!\n) {\n  sale(id: $saleID) {\n    name\n    ...RegistrationFlow_sale\n    __id: id\n  }\n  me {\n    ...RegistrationFlow_me\n    __id: id\n  }\n}\n\nfragment RegistrationFlow_sale on Sale {\n  ...Registration_sale\n  __id: id\n}\n\nfragment RegistrationFlow_me on Me {\n  ...Registration_me\n  __id: id\n}\n\nfragment Registration_me on Me {\n  has_credit_cards\n  __id: id\n}\n\nfragment Registration_sale on Sale {\n  gravityID\n  end_at\n  is_preview\n  live_start_at\n  name\n  start_at\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersRegistrationFlowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": v1,
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "FragmentSpread",
            "name": "RegistrationFlow_sale",
            "args": null
          },
          v3
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
          },
          v3
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersRegistrationFlowQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": v1,
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          v2,
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "gravityID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "end_at",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "is_preview",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "live_start_at",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "start_at",
            "args": null,
            "storageKey": null
          },
          v3
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
            "alias": null,
            "name": "has_credit_cards",
            "args": null,
            "storageKey": null
          },
          v3
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'bce11602f08e3a5b15eae2a068725187';
export default node;
