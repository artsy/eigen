/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
import { MockRelayRendererFixtures_artworkMetadata$ref } from "./MockRelayRendererFixtures_artworkMetadata.graphql";
declare const _MockRelayRendererFixtures_artwork$ref: unique symbol;
export type MockRelayRendererFixtures_artwork$ref = typeof _MockRelayRendererFixtures_artwork$ref;
export type MockRelayRendererFixtures_artwork = {
    readonly image: ({
        readonly url: string | null;
    }) | null;
    readonly artist: ({
        readonly gravityID: string;
    }) | null;
    readonly " $fragmentRefs": MockRelayRendererFixtures_artworkMetadata$ref;
    readonly " $refType": MockRelayRendererFixtures_artwork$ref;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
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
          "name": "gravityID",
          "args": null,
          "storageKey": null
        },
        v0
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "MockRelayRendererFixtures_artworkMetadata",
      "args": null
    },
    v0
  ]
};
})();
(node as any).hash = '418d67208237e68e952c6b28bc267e57';
export default node;
