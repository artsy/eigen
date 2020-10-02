/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AttachmentList_messageConnection = {
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly attachments: ReadonlyArray<{
                readonly id: string;
                readonly contentType: string;
                readonly " $fragmentRefs": FragmentRefs<"FileDownload_attachment">;
            } | null> | null;
        } | null;
    } | null> | null;
    readonly " $refType": "AttachmentList_messageConnection";
};
export type AttachmentList_messageConnection$data = AttachmentList_messageConnection;
export type AttachmentList_messageConnection$key = {
    readonly " $data"?: AttachmentList_messageConnection$data;
    readonly " $fragmentRefs": FragmentRefs<"AttachmentList_messageConnection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "AttachmentList_messageConnection",
  "type": "MessageConnection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": "MessageEdge",
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "Message",
          "plural": false,
          "selections": [
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
                  "name": "contentType",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "FileDownload_attachment",
                  "args": null
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = 'd3a42877c188836cd050e0526e2b47ad';
export default node;
