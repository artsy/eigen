/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type GenericGrid_artworks = ReadonlyArray<{
        readonly __id: string;
        readonly id: string;
        readonly image: ({
            readonly aspect_ratio: number | null;
        }) | null;
    }>;



const node: ConcreteFragment = {
  "kind": "Fragment",
  "name": "GenericGrid_artworks",
  "type": "Artwork",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
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
          "name": "aspect_ratio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Artwork_artwork",
      "args": null
    }
  ]
};
(node as any).hash = 'f3d9eb010a87118abf180da5138dd4e9';
export default node;
