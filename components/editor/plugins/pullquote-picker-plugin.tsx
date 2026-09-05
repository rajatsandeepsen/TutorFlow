import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";

import { $getRoot, $getSelection } from "lexical";
import { Quote } from "lucide-react";
import { useMemo } from "react";
import { INSERT_PULLQUOTE_COMMAND } from "@/components/editor/extensions/pullquote";
import {
	type ComponentPickerItem,
	useComponentPickerItems,
} from "@/components/editor/plugins/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";

export function PullQuotePickerPlugin() {
	const [editor] = useLexicalComposerContext();
	const { t } = useTranslation();

	const items = useMemo<ComponentPickerItem[]>(
		() => [
			{
				value: "pullquote",
				label: t.insertPullQuote,
				icon: <Quote className="text-muted-foreground" />,
				keywords: ["pullquote", "pull", "quote", "citation", "blockquote"],
				onSelect: () => {
					editor.update(() => {
						if (!$getSelection()) {
							$getRoot().selectEnd();
						}
					});
					editor.dispatchCommand(INSERT_PULLQUOTE_COMMAND, undefined);
				},
			},
		],
		[editor, t],
	);

	useComponentPickerItems(items);

	return null;
}
