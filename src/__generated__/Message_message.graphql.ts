/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Message_message = {
    readonly body: string | null;
    readonly createdAt: string | null;
    readonly internalID: string;
    readonly isFromUser: boolean | null;
    readonly isFirstMessage: boolean | null;
    readonly from: {
        readonly name: string | null;
        readonly email: string | null;
    } | null;
    readonly attachments: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly contentType: string;
        readonly downloadURL: string;
        readonly fileName: string;
        readonly " $fragmentRefs": FragmentRefs<"ImagePreview_attachment" | "PDFPreview_attachment" | "FileDownload_attachment">;
    } | null> | null;
    readonly " $refType": "Message_message";
};
export type Message_message$data = Message_message;
export type Message_message$key = {
    readonly " $data"?: Message_message$data;
    readonly " $fragmentRefs": FragmentRefs<"Message_message">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
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
      "name": "createdAt",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isFromUser",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isFirstMessage",
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
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "contentType",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "downloadURL",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "fileName",
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
        },
        {
          "kind": "FragmentSpread",
          "name": "FileDownload_attachment",
          "args": null
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'f09de18f951d4543861f0936ed76f501';
export default node;
