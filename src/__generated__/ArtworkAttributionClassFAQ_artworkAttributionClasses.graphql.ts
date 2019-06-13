/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ArtworkAttributionClassFAQ_artworkAttributionClasses$ref: unique symbol;
export type ArtworkAttributionClassFAQ_artworkAttributionClasses$ref = typeof _ArtworkAttributionClassFAQ_artworkAttributionClasses$ref;
export type ArtworkAttributionClassFAQ_artworkAttributionClasses = {
    readonly name: string | null;
    readonly long_description: string | null;
    readonly " $refType": ArtworkAttributionClassFAQ_artworkAttributionClasses$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkAttributionClassFAQ_artworkAttributionClasses",
  "type": "AttributionClass",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "long_description",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'e0f38d9a2dff0d37a8640e6fb4c9392e';
export default node;
