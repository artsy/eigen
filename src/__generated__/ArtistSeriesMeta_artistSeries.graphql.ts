/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesMeta_artistSeries = {
    readonly internalID: string;
    readonly slug: string;
    readonly title: string;
    readonly description: string | null;
    readonly artists: ReadonlyArray<{
        readonly id: string;
        readonly internalID: string;
        readonly name: string | null;
        readonly slug: string;
        readonly isFollowed: boolean | null;
        readonly image: {
            readonly url: string | null;
        } | null;
    } | null> | null;
    readonly " $refType": "ArtistSeriesMeta_artistSeries";
};
export type ArtistSeriesMeta_artistSeries$data = ArtistSeriesMeta_artistSeries;
export type ArtistSeriesMeta_artistSeries$key = {
    readonly " $data"?: ArtistSeriesMeta_artistSeries$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMeta_artistSeries">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ArtistSeriesMeta_artistSeries",
  "type": "ArtistSeries",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
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
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": "artists(size:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 1
        }
      ],
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "id",
          "args": null,
          "storageKey": null
        },
        (v0/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        (v1/*: any*/),
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "isFollowed",
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
};
})();
(node as any).hash = 'e61b936fe281921625601fbe0f210265';
export default node;
