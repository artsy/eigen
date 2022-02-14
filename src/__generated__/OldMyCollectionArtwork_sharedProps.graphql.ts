/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OldMyCollectionArtwork_sharedProps = {
    readonly artist: {
        readonly internalID: string;
        readonly formattedNationalityAndBirthday: string | null;
    } | null;
    readonly artistNames: string | null;
    readonly category: string | null;
    readonly pricePaid: {
        readonly display: string | null;
        readonly minor: number;
        readonly currencyCode: string;
    } | null;
    readonly date: string | null;
    readonly depth: string | null;
    readonly editionSize: string | null;
    readonly editionNumber: string | null;
    readonly height: string | null;
    readonly attributionClass: {
        readonly name: string | null;
    } | null;
    readonly id: string;
    readonly images: ReadonlyArray<{
        readonly isDefault: boolean | null;
        readonly imageURL: string | null;
        readonly width: number | null;
        readonly height: number | null;
        readonly internalID: string | null;
    } | null> | null;
    readonly internalID: string;
    readonly isEdition: boolean | null;
    readonly medium: string | null;
    readonly metric: string | null;
    readonly artworkLocation: string | null;
    readonly provenance: string | null;
    readonly slug: string;
    readonly title: string | null;
    readonly width: string | null;
    readonly consignmentSubmission: {
        readonly inProgress: boolean | null;
    } | null;
    readonly " $refType": "OldMyCollectionArtwork_sharedProps";
};
export type OldMyCollectionArtwork_sharedProps$data = OldMyCollectionArtwork_sharedProps;
export type OldMyCollectionArtwork_sharedProps$key = {
    readonly " $data"?: OldMyCollectionArtwork_sharedProps$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"OldMyCollectionArtwork_sharedProps">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OldMyCollectionArtwork_sharedProps",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artist",
      "plural": false,
      "selections": [
        (v0/*: any*/),
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "formattedNationalityAndBirthday",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artistNames",
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
      "concreteType": "Money",
      "kind": "LinkedField",
      "name": "pricePaid",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "display",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "minor",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "currencyCode",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "date",
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
      "kind": "ScalarField",
      "name": "editionSize",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "editionNumber",
      "storageKey": null
    },
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "AttributionClass",
      "kind": "LinkedField",
      "name": "attributionClass",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "isDefault",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageURL",
          "storageKey": null
        },
        (v2/*: any*/),
        (v1/*: any*/),
        (v0/*: any*/)
      ],
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isEdition",
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
      "name": "metric",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "artworkLocation",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "provenance",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    },
    (v2/*: any*/),
    {
      "alias": null,
      "args": null,
      "concreteType": "ArtworkConsignmentSubmission",
      "kind": "LinkedField",
      "name": "consignmentSubmission",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "inProgress",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = 'f585b39204cdb45e1eecb4c20f14f05f';
export default node;
