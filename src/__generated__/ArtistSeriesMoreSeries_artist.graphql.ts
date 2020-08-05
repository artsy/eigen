/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesMoreSeries_artist = {
    readonly internalID: string;
    readonly artistSeriesConnection: {
        readonly totalCount: number;
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly slug: string;
                readonly internalID: string;
                readonly title: string;
                readonly forSaleArtworksCount: number;
                readonly image: {
                    readonly url: string | null;
                } | null;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistSeriesMoreSeries_artist";
};
export type ArtistSeriesMoreSeries_artist$data = ArtistSeriesMoreSeries_artist;
export type ArtistSeriesMoreSeries_artist$key = {
    readonly " $data"?: ArtistSeriesMoreSeries_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMoreSeries_artist">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtistSeriesMoreSeries_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artistSeriesConnection",
      "storageKey": "artistSeriesConnection(first:4)",
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 4
        }
      ],
      "concreteType": "ArtistSeriesConnection",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "totalCount",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "ArtistSeriesEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "ArtistSeries",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "slug",
                  "args": null,
                  "storageKey": null
                },
                (v0/*: any*/),
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
                  "name": "forSaleArtworksCount",
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
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
})();
(node as any).hash = '48efbb779aa31a347ca6ed30210370ae';
export default node;
