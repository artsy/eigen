/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomSubsections_viewingRoom = {
    readonly subsections: ReadonlyArray<{
        readonly body: string | null;
        readonly title: string | null;
        readonly caption: string | null;
        readonly image: {
            readonly width: number | null;
            readonly height: number | null;
            readonly imageURLs: {
                readonly normalized: string | null;
            } | null;
        } | null;
    }>;
    readonly " $refType": "ViewingRoomSubsections_viewingRoom";
};
export type ViewingRoomSubsections_viewingRoom$data = ViewingRoomSubsections_viewingRoom;
export type ViewingRoomSubsections_viewingRoom$key = {
    readonly " $data"?: ViewingRoomSubsections_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomSubsections_viewingRoom">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ViewingRoomSubsections_viewingRoom",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "ViewingRoomSubsection",
      "kind": "LinkedField",
      "name": "subsections",
      "plural": true,
      "selections": [
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
          "name": "title",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "caption",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ARImage",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "width",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "height",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "ImageURLs",
              "kind": "LinkedField",
              "name": "imageURLs",
              "plural": false,
              "selections": [
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "normalized",
                  "storageKey": null
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
  "type": "ViewingRoom",
  "abstractKey": null
};
(node as any).hash = '4e54fe628a7263b72de4f5f1f2017e3a';
export default node;
