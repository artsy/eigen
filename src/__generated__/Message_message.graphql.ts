/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
        readonly " $fragmentRefs": FragmentRefs<"PDFPreview_attachment" | "ImagePreview_attachment" | "FileDownload_attachment">;
    } | null> | null;
    readonly __typename: "Message";
    readonly " $refType": "Message_message";
};
export type Message_message$data = Message_message;
export type Message_message$key = {
    readonly " $data"?: Message_message$data;
    readonly " $fragmentRefs": FragmentRefs<"Message_message">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Message_message",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__typename",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "body",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isFromUser",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isFirstMessage",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "MessageInitiator",
      "kind": "LinkedField",
      "name": "from",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "email",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Attachment",
      "kind": "LinkedField",
      "name": "attachments",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "contentType",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "downloadURL",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "fileName",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "PDFPreview_attachment"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ImagePreview_attachment"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "FileDownload_attachment"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Message",
  "abstractKey": null
};
})();
(node as any).hash = '3958db3034e8450a34055b0f6262e05e';
export default node;
