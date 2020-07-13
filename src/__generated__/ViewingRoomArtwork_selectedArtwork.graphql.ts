/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomArtwork_selectedArtwork = {
    readonly title: string | null;
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly description: string | null;
    readonly saleMessage: string | null;
    readonly href: string | null;
    readonly image: {
        readonly url: string | null;
        readonly aspectRatio: number;
    } | null;
    readonly " $refType": "ViewingRoomArtwork_selectedArtwork";
};
export type ViewingRoomArtwork_selectedArtwork$data = ViewingRoomArtwork_selectedArtwork;
export type ViewingRoomArtwork_selectedArtwork$key = {
    readonly " $data"?: ViewingRoomArtwork_selectedArtwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomArtwork_selectedArtwork">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomArtwork_selectedArtwork",
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
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
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
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
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "larger"
            }
          ],
          "storageKey": "url(version:\"larger\")"
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
(node as any).hash = '5b5a6d650ddd1734b2850b7d9a32f2b8';
export default node;
