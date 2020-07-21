/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesArtworkGrid_connection = {
    readonly pageInfo: {
        readonly hasNextPage: boolean;
        readonly startCursor: string | null;
        readonly endCursor: string | null;
    };
    readonly edges: ReadonlyArray<{
        readonly node: {
            readonly slug: string;
            readonly id: string;
            readonly image: {
                readonly aspectRatio: number;
            } | null;
            readonly " $fragmentRefs": FragmentRefs<"ArtworkGridItem_artwork">;
        } | null;
    } | null> | null;
    readonly " $refType": "ArtistSeriesArtworkGrid_connection";
};
export type ArtistSeriesArtworkGrid_connection$data = ArtistSeriesArtworkGrid_connection;
export type ArtistSeriesArtworkGrid_connection$key = {
    readonly " $data"?: ArtistSeriesArtworkGrid_connection$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesArtworkGrid_connection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistSeriesArtworkGrid_connection",
  "type": "ArtworkConnectionInterface",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "pageInfo",
      "storageKey": null,
      "args": null,
      "concreteType": "PageInfo",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "hasNextPage",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "startCursor",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "endCursor",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "edges",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": true,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "node",
          "storageKey": null,
          "args": null,
          "concreteType": "Artwork",
          "plural": false,
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
                  "name": "aspectRatio",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "FragmentSpread",
              "name": "ArtworkGridItem_artwork",
              "args": null
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '9182565da67dcf5c04f439cd448d76f9';
export default node;
