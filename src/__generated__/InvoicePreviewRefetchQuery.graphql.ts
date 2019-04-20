/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { InvoicePreview_invoice$ref } from "./InvoicePreview_invoice.graphql";
export type InvoicePreviewRefetchQueryVariables = {
    readonly conversationId: string;
    readonly invoiceId: string;
};
export type InvoicePreviewRefetchQueryResponse = {
    readonly me: ({
        readonly invoice: ({
            readonly " $fragmentRefs": InvoicePreview_invoice$ref;
        }) | null;
    }) | null;
};
export type InvoicePreviewRefetchQuery = {
    readonly response: InvoicePreviewRefetchQueryResponse;
    readonly variables: InvoicePreviewRefetchQueryVariables;
};



/*
query InvoicePreviewRefetchQuery(
  $conversationId: String!
  $invoiceId: String!
) {
  me {
    invoice(conversationId: $conversationId, invoiceId: $invoiceId) {
      ...InvoicePreview_invoice
    }
  }
}

fragment InvoicePreview_invoice on Invoice {
  payment_url
  state
  total
  lewitt_invoice_id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "conversationId",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "invoiceId",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "conversationId",
    "variableName": "conversationId",
    "type": "String!"
  },
  {
    "kind": "Variable",
    "name": "invoiceId",
    "variableName": "invoiceId",
    "type": "String!"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "InvoicePreviewRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "invoice",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Invoice",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "InvoicePreview_invoice",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "InvoicePreviewRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
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
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "invoice",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Invoice",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "payment_url",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "state",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "total",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "lewitt_invoice_id",
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
    "operationKind": "query",
    "name": "InvoicePreviewRefetchQuery",
    "id": "cffdbe930d7bf0e07f33a435edc608c0",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cffdbe930d7bf0e07f33a435edc608c0';
export default node;
