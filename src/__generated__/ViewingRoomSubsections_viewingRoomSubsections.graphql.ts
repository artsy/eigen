/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomSubsections_viewingRoomSubsections = {
    readonly subsections: ReadonlyArray<{
        readonly title: string | null;
        readonly body: string | null;
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
          "name": "title",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "body",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
<<<<<<< HEAD:src/__generated__/ViewingRoomSubsections_viewingRoom.graphql.ts
(node as any).hash = '9daf8c0be29094c307827908f5210730';
=======
(node as any).hash = 'c545dee6732225eb462fbec9ae077e83';
>>>>>>> e5e8e8db0... add fragment to artwork rail; move subsections fragment to artwork statement:src/__generated__/ViewingRoomSubsections_viewingRoomSubsections.graphql.ts
export default node;
