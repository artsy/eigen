/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { InvoicePreview_invoice$ref } from "./InvoicePreview_invoice.graphql";
export type InvoicePreviewRefetchQueryVariables = {
    readonly conversationId: string;
    readonly invoiceId: string;
};
export type InvoicePreviewRefetchQueryResponse = {
    readonly me: {
        readonly invoice: {
            readonly " $fragmentRefs": InvoicePreview_invoice$ref;
        } | null;
    } | null;
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
      id
    }
    id
  }
}

fragment InvoicePreview_invoice on Invoice {
  payment_url: paymentURL
  state
  total
  lewitt_invoice_id: lewittInvoiceID
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
    "variableName": "conversationId"
  },
  {
    "kind": "Variable",
    "name": "invoiceId",
    "variableName": "invoiceId"
  }
],
v2 = {
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
                "alias": "payment_url",
                "name": "paymentURL",
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
                "alias": "lewitt_invoice_id",
                "name": "lewittInvoiceID",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/)
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "InvoicePreviewRefetchQuery",
    "id": "bab08e6fa3ab2f1cb1ebad5f8d147be1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'cffdbe930d7bf0e07f33a435edc608c0';
export default node;
