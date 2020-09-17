/* tslint:disable */
/* eslint-disable */
/* @relayHash 222ad39909be6cdb8efa259cf49c5712 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleHeaderTestsQueryVariables = {};
export type SaleHeaderTestsQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"SaleHeader_sale">;
    } | null;
};
export type SaleHeaderTestsQuery = {
    readonly response: SaleHeaderTestsQueryResponse;
    readonly variables: SaleHeaderTestsQueryVariables;
};



/*
query SaleHeaderTestsQuery {
  sale(id: "the-sale") {
    ...SaleHeader_sale
    id
  }
}

fragment SaleHeader_sale on Sale {
  name
  internalID
  liveStartAt
  endAt
  startAt
  timeZone
  coverImage {
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "the-sale"
  }
],
v1 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleHeaderTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SaleHeader_sale",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleHeaderTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": "sale(id:\"the-sale\")",
        "args": (v0/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "liveStartAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "endAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "startAt",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "timeZone",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "coverImage",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": null,
                "storageKey": null
              }
            ]
          },
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
  },
  "params": {
    "operationKind": "query",
    "name": "SaleHeaderTestsQuery",
    "id": "108cb9f99476582d09ac4bcc310787c0",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "sale": {
          "type": "Sale",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.id": {
          "type": "ID",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.name": (v1/*: any*/),
        "sale.internalID": {
          "type": "ID",
          "enumValues": null,
          "plural": false,
          "nullable": false
        },
        "sale.liveStartAt": (v1/*: any*/),
        "sale.endAt": (v1/*: any*/),
        "sale.startAt": (v1/*: any*/),
        "sale.timeZone": (v1/*: any*/),
        "sale.coverImage": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "sale.coverImage.url": (v1/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'b9e8153d2ce7a746c081f6450eb14cff';
export default node;
