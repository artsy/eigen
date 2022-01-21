/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ConsignmentAttributionClass = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION" | "%future added value";
export type ArtworkDetails_submission = {
    readonly id: string;
    readonly artist: {
        readonly internalID: string;
        readonly name: string | null;
    } | null;
    readonly locationCity: string | null;
    readonly locationCountry: string | null;
    readonly locationState: string | null;
    readonly year: string | null;
    readonly title: string | null;
    readonly medium: string | null;
    readonly attributionClass: ConsignmentAttributionClass | null;
    readonly editionNumber: string | null;
    readonly editionSize: string | null;
    readonly height: string | null;
    readonly width: string | null;
    readonly depth: string | null;
    readonly dimensionsMetric: string | null;
    readonly provenance: string | null;
    readonly utmMedium: string | null;
    readonly utmSource: string | null;
    readonly utmTerm: string | null;
    readonly " $refType": "ArtworkDetails_submission";
};
export type ArtworkDetails_submission$data = ArtworkDetails_submission;
export type ArtworkDetails_submission$key = {
    readonly " $data"?: ArtworkDetails_submission$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkDetails_submission">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkDetails_submission",
  "selections": [
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "locationCity",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "locationCountry",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "locationState",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "year",
      "storageKey": null
    },
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
      "name": "medium",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "attributionClass",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "editionNumber",
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
      "name": "height",
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
      "name": "depth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dimensionsMetric",
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
      "name": "utmMedium",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "utmSource",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "utmTerm",
      "storageKey": null
    }
  ],
  "type": "ConsignmentSubmission",
  "abstractKey": null
};
(node as any).hash = '0fd6b10415e8f3cad3597d6e417a401b';
export default node;
