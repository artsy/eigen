/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AttachmentList_messageConnection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "MessageEdge",
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "Message",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
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
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "contentType",
                  "storageKey": null
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
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MessageConnection",
  "abstractKey": null
};
(node as any).hash = 'd3a42877c188836cd050e0526e2b47ad';
export default node;
