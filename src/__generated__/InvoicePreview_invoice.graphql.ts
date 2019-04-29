/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type InvoiceState = "PAID" | "REFUNDED" | "UNPAID" | "VOID" | "%future added value";
declare const _InvoicePreview_invoice$ref: unique symbol;
export type InvoicePreview_invoice$ref = typeof _InvoicePreview_invoice$ref;
export type InvoicePreview_invoice = {
    readonly payment_url: string | null;
    readonly state: InvoiceState | null;
    readonly total: string | null;
    readonly lewitt_invoice_id: string;
    readonly " $refType": InvoicePreview_invoice$ref;
};



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "InvoicePreview_invoice",
  "type": "Invoice",
  "metadata": null,
  "argumentDefinitions": [],
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
    },
    {
      "kind": "ScalarField",
      "alias": "__id",
      "name": "id",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '56513ea1e11975c64fc4c4ee843b52f8';
export default node;
