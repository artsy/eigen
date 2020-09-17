/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkPreview_artwork = {
    readonly slug: string;
    readonly internalID: string;
    readonly title: string | null;
    readonly artist_names: string | null;
    readonly date: string | null;
    readonly image: {
        readonly url: string | null;
        readonly aspectRatio: number;
    } | null;
    readonly " $refType": "ArtworkPreview_artwork";
};
export type ArtworkPreview_artwork$data = ArtworkPreview_artwork;
export type ArtworkPreview_artwork$key = {
    readonly " $data"?: ArtworkPreview_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkPreview_artwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkPreview_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
      "alias": "artist_names",
      "name": "artistNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
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
          "name": "url",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'b9cf96cdd66d415c421772126d7cc9bf';
export default node;
