import type { Config } from "@markdoc/markdoc";
import { Callout } from "./Callout.jsx";
import { SyntaxHighlight } from "./SyntaxHighlight.jsx";

/**
 * The components that render custom tags
 */
export const components = {
	Callout,
	SyntaxHighlight,
};

export const markdocConfig: Config = {
	nodes: {
		fence: {
			render: "SyntaxHighlight",
			attributes: {
				language: {
					type: "String",
				},
				content: {
					type: "String",
				},
			},
		},
	},
	/**
	 * Custom tags for MarkDoc.
	 *
	 * See https://markdoc.dev/docs/tags.
	 */
	tags: {
		Callout: {
			attributes: {
				title: { type: "String" },
				variant: {
					type: "String",
					matches: ["success", "info", "warning", "danger"],
					errorLevel: "error",
				},
			},
			render: "Callout",
		},
	},
};