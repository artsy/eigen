/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomSubsections_viewingRoomSubsections = {
    readonly subsections: ReadonlyArray<{
        readonly body: string | null;
        readonly title: string | null;
        readonly caption: string | null;
        readonly imageURL: string | null;
    }> | null;
    readonly " $refType": "ViewingRoomSubsections_viewingRoomSubsections";
};
export type ViewingRoomSubsections_viewingRoomSubsections$data = ViewingRoomSubsections_viewingRoomSubsections;
export type ViewingRoomSubsections_viewingRoomSubsections$key = {
    readonly " $data"?: ViewingRoomSubsections_viewingRoomSubsections$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomSubsections_viewingRoomSubsections">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomSubsections_viewingRoomSubsections",
  "type": "ViewingRoom",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "subsections",
      "storageKey": null,
      "args": null,
      "concreteType": "ViewingRoomSubsection",
      "plural": true,
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
          "name": "title",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "caption",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "imageURL",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'c545dee6732225eb462fbec9ae077e83';
export default node;
