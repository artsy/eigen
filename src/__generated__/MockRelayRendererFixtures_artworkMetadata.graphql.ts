/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _MockRelayRendererFixtures_artworkMetadata$ref: unique symbol;
export type MockRelayRendererFixtures_artworkMetadata$ref = typeof _MockRelayRendererFixtures_artworkMetadata$ref;
export type MockRelayRendererFixtures_artworkMetadata = {
    readonly title: string | null;
    readonly " $refType": MockRelayRendererFixtures_artworkMetadata$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MockRelayRendererFixtures_artworkMetadata",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '36229b903e6398f793878a155df342a7';
export default node;
