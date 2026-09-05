"use client";

import { ClipboardDOMImportExtension } from "@lexical/clipboard";
import { $createCodeNode } from "@lexical/code-core";
import {
	ClearEditorExtension,
	HorizontalRuleExtension,
	TabIndentationExtension,
} from "@lexical/extension";
import { HashtagExtension } from "@lexical/hashtag";
import { HistoryExtension } from "@lexical/history";
import {
	$createListItemNode,
	$createListNode,
	CheckListExtension,
	ListExtension,
} from "@lexical/list";
import {
	CHECK_LIST,
	ELEMENT_TRANSFORMERS,
	MULTILINE_ELEMENT_TRANSFORMERS,
	registerMarkdownShortcuts,
	TEXT_FORMAT_TRANSFORMERS,
	TEXT_MATCH_TRANSFORMERS,
	type Transformer,
} from "@lexical/markdown";
import { LexicalExtensionComposer } from "@lexical/react/LexicalExtensionComposer";
import {
	$createHeadingNode,
	$createQuoteNode,
	RichTextExtension,
} from "@lexical/rich-text";
import { TableExtension } from "@lexical/table";
import {
	$createParagraphNode,
	$createTextNode,
	$getRoot,
	defineExtension,
} from "lexical";
import { useMemo } from "react";
import {
	ActivityBar,
	AutocompleteExtension,
	AutoEmbedPlugin,
	AutoLinkExtension,
	BlockFormatToolbarPlugin,
	BlockInsert,
	BulletedListPickerPlugin,
	CardExtension,
	CardPickerPlugin,
	CheckListPickerPlugin,
	ClearToolbarPlugin,
	CodeExtension,
	CodePickerPlugin,
	CollapsibleExtension,
	CollapsiblePickerPlugin,
	ColorToolbarPlugin,
	ColumnsPickerPlugin,
	ComponentPicker,
	ContentEditable,
	ContextMenuPlugin,
	CountPlugin,
	DateTimeExtension,
	DateTimePickerPlugin,
	DividerPickerPlugin,
	DragDropPasteExtension,
	DraggableBlockPlugin,
	ElementFormatToolbarPlugin,
	EMOJI,
	EmojiExtension,
	EmojiPickerPlugin,
	EquationExtension,
	editorTheme,
	FigmaExtension,
	FloatingToolbarPlugin,
	FontFamilyToolbarPlugin,
	FontSizeToolbarPlugin,
	FormatStateExtension,
	HeadingPickerPlugin,
	HistoryToolbarPlugin,
	HR,
	IMAGE,
	ImageExtension,
	ImagePickerPlugin,
	ImportExportToolbarPlugin,
	IndentToolbarPlugin,
	InsertCodeBlockPlugin,
	InsertColumnsPlugin,
	InsertEmojiPlugin,
	InsertEquationPlugin,
	InsertHorizontalRulePlugin,
	InsertImagePlugin,
	InsertTablePlugin,
	LanguageProvider,
	LanguageSelectorPlugin,
	LayoutExtension,
	LinkEditorPlugin,
	LinkExtension,
	LinkToolbarPlugin,
	MentionExtension,
	MentionPlugin,
	NumberedListPickerPlugin,
	ParagraphPickerPlugin,
	PollExtension,
	PollPickerPlugin,
	PullQuoteExtension,
	PullQuotePickerPlugin,
	QuotePickerPlugin,
	ReactFindReplaceExtension,
	ReactReviewExtension,
	ReadOnlyTogglePlugin,
	ReviewPickerPlugin,
	RubyEditorPlugin,
	RubyExtension,
	RubyToolbarPlugin,
	ShortcutPlugin,
	ShortcutsExtension,
	SpecialTextExtension,
	SpeechToTextExtension,
	SpeechToTextPlugin,
	TABLE,
	TabFocusExtension,
	TableHoverActionsPlugin,
	TablePickerPlugin,
	TextFormatToolbarPlugin,
	Toolbar,
	TwitterExtension,
	useLanguage,
	YouTubeExtension,
} from "@/components/editor";
import { DirectionProvider } from "@/components/ui/direction";

const EDITOR_TRANSFORMERS: Transformer[] = [
	TABLE,
	HR,
	IMAGE,
	EMOJI,
	CHECK_LIST,
	...ELEMENT_TRANSFORMERS,
	...MULTILINE_ELEMENT_TRANSFORMERS,
	...TEXT_FORMAT_TRANSFORMERS,
	...TEXT_MATCH_TRANSFORMERS,
];

export default function EditorX() {
	const app = useMemo(
		() =>
			defineExtension({
				name: "@shadcn-editor/editor",
				namespace: "shadcn-editor",
				dependencies: [
					RichTextExtension,
					HistoryExtension,
					TabIndentationExtension,
					ListExtension,
					CheckListExtension,
					HashtagExtension,
					LinkExtension,
					AutoLinkExtension,
					CodeExtension,
					LayoutExtension,
					EmojiExtension,
					EquationExtension,
					TableExtension,
					HorizontalRuleExtension,
					ImageExtension,
					MentionExtension,
					SpecialTextExtension,
					DragDropPasteExtension,
					TabFocusExtension,
					SpeechToTextExtension,
					ShortcutsExtension,
					CardExtension,
					CollapsibleExtension,
					DateTimeExtension,
					PullQuoteExtension,
					ReactReviewExtension,
					PollExtension,
					RubyExtension,
					YouTubeExtension,
					TwitterExtension,
					FigmaExtension,
					FormatStateExtension,
					ReactFindReplaceExtension,
					ClearEditorExtension,
					ClipboardDOMImportExtension,
				],
				$initialEditorState: () => {
					$getRoot().append(
						$createHeadingNode("h1").append($createTextNode("Editor X")),
						$createParagraphNode().append(
							$createTextNode("A "),
							$createTextNode("complete").toggleFormat("bold"),
							$createTextNode(" writing surface: "),
							$createTextNode("rich text").toggleFormat("italic"),
							$createTextNode(", "),
							$createTextNode("markdown shortcuts").toggleFormat("underline"),
							$createTextNode(", and "),
							$createTextNode("blocks").toggleFormat("code"),
							$createTextNode(", all in one place."),
						),
						$createHeadingNode("h2").append(
							$createTextNode("Everything included"),
						),
						$createListNode("bullet").append(
							$createListItemNode().append(
								$createTextNode(
									"Tables, images, equations, and embeds from the toolbar",
								),
							),
							$createListItemNode().append(
								$createTextNode('A slash menu: type "/" to insert any block'),
							),
							$createListItemNode().append(
								$createTextNode(
									"Drag handles, a floating toolbar, mentions, and emoji",
								),
							),
						),
						$createQuoteNode().append(
							$createTextNode(
								"Select any text to format it in place, or grab a drag handle to rearrange the page.",
							),
						),
						$createCodeNode("markdown").append(
							$createTextNode("## Markdown works too, as you type"),
						),
						$createParagraphNode().append(
							$createTextNode(
								'Try it now: press "/" on the empty line below, or explore the toolbar above.',
							),
						),
						$createParagraphNode(),
					);
				},
				register: (editor) =>
					registerMarkdownShortcuts(editor, EDITOR_TRANSFORMERS),
				theme: editorTheme,
			}),
		[],
	);

	return (
		<LanguageProvider>
			<LexicalExtensionComposer extension={app} contentEditable={null}>
				<EditorWrapper>
					<Toolbar>
						<HistoryToolbarPlugin />
						<BlockFormatToolbarPlugin />
						<FontFamilyToolbarPlugin />
						<FontSizeToolbarPlugin />
						<ColorToolbarPlugin />
						<TextFormatToolbarPlugin formats="basic" />
						<ElementFormatToolbarPlugin formats="basic" />
						<IndentToolbarPlugin />
						<BlockInsert>
							<InsertCodeBlockPlugin />
							<InsertColumnsPlugin />
							<InsertEmojiPlugin />
							<InsertEquationPlugin />
							<InsertHorizontalRulePlugin />
							<InsertImagePlugin />
							<InsertTablePlugin />
						</BlockInsert>
						<ClearToolbarPlugin />
						<ImportExportToolbarPlugin transformers={EDITOR_TRANSFORMERS} />
					</Toolbar>
					<div className="relative min-w-0 flex-1 overflow-y-auto">
						<ContentEditable variant="draggable" />
						<DraggableBlockPlugin />
						<FloatingToolbarPlugin>
							<LinkToolbarPlugin />
							<RubyToolbarPlugin />
						</FloatingToolbarPlugin>
						<LinkEditorPlugin />
						<RubyEditorPlugin />
						<TableHoverActionsPlugin />
						<EmojiPickerPlugin />
						<MentionPlugin />
						<AutoEmbedPlugin />
						<ContextMenuPlugin />
						<ComponentPicker>
							<ParagraphPickerPlugin />
							<HeadingPickerPlugin />
							<TablePickerPlugin />
							<NumberedListPickerPlugin />
							<BulletedListPickerPlugin />
							<CheckListPickerPlugin />
							<QuotePickerPlugin />
							<CodePickerPlugin />
							<DividerPickerPlugin />
							<ColumnsPickerPlugin />
							<ImagePickerPlugin />
							<CardPickerPlugin />
							<CollapsiblePickerPlugin />
							<DateTimePickerPlugin />
							<PullQuotePickerPlugin />
							<ReviewPickerPlugin />
							<PollPickerPlugin />
						</ComponentPicker>
					</div>
					<ActivityBar>
						<div className="flex items-center gap-3">
							<CountPlugin />
						</div>
						<div className="ms-auto flex items-center gap-3">
							<SpeechToTextPlugin />
							<ReadOnlyTogglePlugin />
							<ShortcutPlugin />
							<LanguageSelectorPlugin />
						</div>
					</ActivityBar>
				</EditorWrapper>
			</LexicalExtensionComposer>
		</LanguageProvider>
	);
}

function EditorWrapper({ children }: { children: React.ReactNode }) {
	const { language, dir } = useLanguage();
	return (
		<DirectionProvider dir={dir}>
			<div
				dir={dir}
				lang={language}
				className="flex flex-1 flex-col overflow-hidden"
			>
				{children}
			</div>
		</DirectionProvider>
	);
}
