/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type MockRelayRendererFixtures_artworkMetadata = {
    readonly title: string | null;
    readonly " $refType": "MockRelayRendererFixtures_artworkMetadata";
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
