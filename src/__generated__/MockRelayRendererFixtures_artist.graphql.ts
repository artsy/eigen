/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MockRelayRendererFixtures_artist = {
    readonly name: string | null;
    readonly " $refType": "MockRelayRendererFixtures_artist";
};
export type MockRelayRendererFixtures_artist$data = MockRelayRendererFixtures_artist;
export type MockRelayRendererFixtures_artist$key = {
    readonly " $data"?: MockRelayRendererFixtures_artist$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MockRelayRendererFixtures_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MockRelayRendererFixtures_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '00923700fab4960aafc6cd20281ef191';
export default node;
