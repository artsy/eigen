/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentsSubmissionFromArtworkForm_artwork = {
    readonly title: string | null;
    readonly category: string | null;
    readonly medium: string | null;
    readonly width: string | null;
    readonly height: string | null;
    readonly depth: string | null;
    readonly artist: {
        readonly internalID: string;
        readonly name: string | null;
        readonly image: {
            readonly url: string | null;
        } | null;
        readonly targetSupply: {
            readonly isTargetSupply: boolean | null;
        } | null;
    } | null;
    readonly " $refType": "ConsignmentsSubmissionFromArtworkForm_artwork";
};
export type ConsignmentsSubmissionFromArtworkForm_artwork$data = ConsignmentsSubmissionFromArtworkForm_artwork;
export type ConsignmentsSubmissionFromArtworkForm_artwork$key = {
    readonly " $data"?: ConsignmentsSubmissionFromArtworkForm_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ConsignmentsSubmissionFromArtworkForm_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ConsignmentsSubmissionFromArtworkForm_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "category",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "medium",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "width",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "height",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "depth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artist",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "Image",
          "kind": "LinkedField",
          "name": "image",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "url",
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "concreteType": "ArtistTargetSupply",
          "kind": "LinkedField",
          "name": "targetSupply",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "isTargetSupply",
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'b6a5f66661ad9a1fa22ed64bc1b68180';
export default node;
