/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Message_message = {
    readonly body: string | null;
    readonly created_at: string | null;
    readonly is_from_user: boolean | null;
    readonly from: ({
        readonly name: string | null;
        readonly email: string | null;
    }) | null;
    readonly invoice: ({
        readonly payment_url: string | null;
    }) | null;
    readonly attachments: ReadonlyArray<({
            readonly id: string;
            readonly content_type: string;
            readonly download_url: string;
            readonly file_name: string;
        }) | null> | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Message_message",
  "type": "Message",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "body",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "created_at",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_from_user",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "from",
      "storageKey": null,
      "args": null,
      "concreteType": "MessageInitiator",
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
          "name": "email",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "invoice",
      "storageKey": null,
      "args": null,
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
          "kind": "FragmentSpread",
          "name": "InvoicePreview_invoice",
          "args": null
        },
        v0
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "attachments",
      "storageKey": null,
      "args": null,
      "concreteType": "Attachment",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "content_type",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "download_url",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "file_name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "FragmentSpread",
          "name": "ImagePreview_attachment",
          "args": null
        },
        {
          "kind": "FragmentSpread",
          "name": "PDFPreview_attachment",
          "args": null
        }
      ]
    },
    v0
  ]
};
})();
(node as any).hash = '04f6dec99660b3ec89bcebc4d828428f';
export default node;
