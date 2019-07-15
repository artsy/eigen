/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { MockRelayRendererFixtures_artworkMetadata$ref } from "./MockRelayRendererFixtures_artworkMetadata.graphql";
declare const _MockRelayRendererFixtures_artwork$ref: unique symbol;
export type MockRelayRendererFixtures_artwork$ref = typeof _MockRelayRendererFixtures_artwork$ref;
export type MockRelayRendererFixtures_artwork = {
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly artist: {
        readonly slug: string;
    } | null;
    readonly " $fragmentRefs": MockRelayRendererFixtures_artworkMetadata$ref;
    readonly " $refType": MockRelayRendererFixtures_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "MockRelayRendererFixtures_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artist",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "slug",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "MockRelayRendererFixtures_artworkMetadata",
      "args": null
    }
  ]
};
(node as any).hash = '35b0d2a11cf28fcc477de58eac475015';
export default node;
