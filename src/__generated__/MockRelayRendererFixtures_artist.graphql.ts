/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _MockRelayRendererFixtures_artist$ref: unique symbol;
export type MockRelayRendererFixtures_artist$ref = typeof _MockRelayRendererFixtures_artist$ref;
export type MockRelayRendererFixtures_artist = {
    readonly name: string | null;
    readonly " $refType": MockRelayRendererFixtures_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MockRelayRendererFixtures_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '00923700fab4960aafc6cd20281ef191';
export default node;
