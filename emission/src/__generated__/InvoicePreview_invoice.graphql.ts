/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type InvoiceState = "PAID" | "REFUNDED" | "UNPAID" | "VOID" | "%future added value";
export type InvoicePreview_invoice = {
    readonly payment_url: string | null;
    readonly state: InvoiceState | null;
    readonly total: string | null;
    readonly lewitt_invoice_id: string;
    readonly " $refType": "InvoicePreview_invoice";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "InvoicePreview_invoice",
  "type": "Invoice",
  "metadata": null,
  "argumentDefinitions": [],
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
    }
  ]
};
(node as any).hash = '2e572e458745d1a8926482b66629d10d';
export default node;
