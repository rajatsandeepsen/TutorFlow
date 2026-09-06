import type { Language } from "@/components/editor/plugins/i18n-plugin";

export type Locale = {
	typeSomething: string;
	undo: string;
	redo: string;
	blockFormatTrigger: string;
	paragraph: string;
	heading1: string;
	heading2: string;
	heading3: string;
	numberedListBlock: string;
	bulletedListBlock: string;
	checkListBlock: string;
	quote: string;
	fontFamilyPlaceholder: string;
	noMatches: string;
	addBlockBelow: string;
	clearFormatting: string;
	textFormatToolbar: string;
	alignLeft: string;
	alignCenter: string;
	alignRight: string;
	alignJustify: string;
	alignStart: string;
	alignEnd: string;
	outdent: string;
	indent: string;
	bold: string;
	italic: string;
	underline: string;
	strikethrough: string;
	inlineCode: string;
	highlight: string;
	subscript: string;
	superscript: string;
	lowercase: string;
	uppercase: string;
	titleCase: string;
	link: string;
	insertLink: string;
	editLink: string;
	removeLink: string;
	openLink: string;
	linkUrlPlaceholder: string;
	saveLink: string;
	decreaseFontSize: string;
	increaseFontSize: string;
	fontSizeTitle: string;
	textColor: string;
	backgroundColor: string;
	switchToReadOnly: string;
	switchToEditMode: string;
	words: string;
	characters: string;
	speechToText: string;
	autocompleteSwipe: string;
	clearEditor: string;
	clearEditorDialogTitle: string;
	clearEditorDialogDescription: string;
	clear: string;
	cancel: string;
	editorMenu: string;
	menuFile: string;
	menuEdit: string;
	menuInsert: string;
	menuFormat: string;
	menuLayout: string;
	menuHelp: string;
	newDocument: string;
	importFile: string;
	exportFile: string;
	exportAs: string;
	exportLexical: string;
	exportMarkdown: string;
	exportHtml: string;
	exportPdf: string;
	exportPlainText: string;
	printDocument: string;
	deleteAllContent: string;
	cut: string;
	copy: string;
	paste: string;
	pasteAsPlainText: string;
	deleteNode: string;
	clipboardNotAllowed: string;
	selectAll: string;
	findAndReplace: string;
	tableOfContents: string;
	comments: string;
	noComments: string;
	typeComment: string;
	replyToComment: string;
	comment: string;
	delete: string;
	deleteCommentConfirm: string;
	deleteThreadConfirm: string;
	justNow: string;
	deletedComment: string;
	you: string;
	find: string;
	replace: string;
	replaceAll: string;
	previousMatch: string;
	nextMatch: string;
	matchCount: string;
	matchCase: string;
	useRegex: string;
	noResults: string;
	invalidRegex: string;
	closeFindReplace: string;
	addComment: string;
	insertImage: string;
	insertVideo: string;
	insertYoutube: string;
	youtubeUrlPlaceholder: string;
	embedYoutube: string;
	insertTweet: string;
	tweetUrlPlaceholder: string;
	embedTweet: string;
	insertFigma: string;
	figmaUrlPlaceholder: string;
	embedFigma: string;
	autoEmbedDismiss: string;
	insertTable: string;
	addTableRow: string;
	addTableColumn: string;
	deleteTableRow: string;
	deleteTableColumn: string;
	insertCodeBlock: string;
	insertEmoji: string;
	insertSpecialCharacters: string;
	insertDateTime: string;
	dateTimeToday: string;
	dateTimeTomorrow: string;
	dateTimeYesterday: string;
	dateTimeTime: string;
	insertHorizontalRule: string;
	insertCard: string;
	insertCollapsible: string;
	insertPullQuote: string;
	insertReview: string;
	insertPoll: string;
	pollQuestionPlaceholder: string;
	pollOptionPlaceholder: string;
	pollAddOption: string;
	pollRemoveOption: string;
	pollVote: string;
	pollVotes: string;
	insertEquation: string;
	equationPlaceholder: string;
	equationInline: string;
	equationInsert: string;
	insertRuby: string;
	rubyAnnotationPlaceholder: string;
	removeRuby: string;
	askAi: string;
	askAiPlaceholder: string;
	aiImproveWriting: string;
	aiMakeLonger: string;
	aiMakeShorter: string;
	aiFixSpelling: string;
	aiContinueWriting: string;
	aiSummarize: string;
	aiBrainstorm: string;
	aiReplace: string;
	aiInsertBelow: string;
	aiTryAgain: string;
	aiDiscard: string;
	aiInsert: string;
	askAiWritePlaceholder: string;
	aiGenerating: string;
	chatMessage: string;
	chatPlaceholder: string;
	chatSend: string;
	chatStop: string;
	chatThinking: string;
	insertPageBreak: string;
	textAlignment: string;
	lineSpacing: string;
	textCase: string;
	pageSize: string;
	pageSizePageless: string;
	pageSizeA4: string;
	pageSizeLetter: string;
	pageSizeLegal: string;
	pageSizeTabloid: string;
	pageSizeA3: string;
	pageSizeA5: string;
	pageSizeB4: string;
	pageSizeB5: string;
	pageSizeStatement: string;
	pageSizeExecutive: string;
	pageSizeFolio: string;
	orientation: string;
	orientationPortrait: string;
	orientationLandscape: string;
	margins: string;
	marginNarrow: string;
	marginNormal: string;
	marginModerate: string;
	marginWide: string;
	columns: string;
	columnsOne: string;
	columnsTwo: string;
	columnsThree: string;
	documentation: string;
	keyboardShortcuts: string;
	reportIssue: string;
	sendFeedback: string;
	aboutEditor: string;
	shortcutAction: string;
	shortcutKeys: string;
	shortcutsHistory: string;
	shortcutsFormatting: string;
	shortcutsParagraphs: string;
	shortcutsLists: string;
};

export const locales: Record<Language, Locale> = {
	en: {
		typeSomething: "Type something...",
		undo: "Undo",
		redo: "Redo",
		blockFormatTrigger: "Format",
		paragraph: "Paragraph",
		heading1: "Heading 1",
		heading2: "Heading 2",
		heading3: "Heading 3",
		numberedListBlock: "Numbered List",
		bulletedListBlock: "Bulleted List",
		checkListBlock: "Check List",
		quote: "Quote",
		fontFamilyPlaceholder: "Font",
		noMatches: "No matches.",
		addBlockBelow: "Click to add below",
		clearFormatting: "Clear formatting",
		textFormatToolbar: "Text formatting",
		alignLeft: "Align left",
		alignCenter: "Align center",
		alignRight: "Align right",
		alignJustify: "Justify",
		alignStart: "Align start",
		alignEnd: "Align end",
		outdent: "Outdent",
		indent: "Indent",
		bold: "Bold",
		italic: "Italic",
		underline: "Underline",
		strikethrough: "Strikethrough",
		inlineCode: "Inline code",
		highlight: "Highlight",
		subscript: "Subscript",
		superscript: "Superscript",
		lowercase: "Lowercase",
		uppercase: "Uppercase",
		titleCase: "Title case",
		link: "Link",
		insertLink: "Insert link",
		editLink: "Edit link",
		removeLink: "Remove link",
		openLink: "Open link",
		linkUrlPlaceholder: "Enter a URL",
		saveLink: "Save link",
		decreaseFontSize: "Decrease font size",
		increaseFontSize: "Increase font size",
		fontSizeTitle: "Font size",
		textColor: "Text color",
		backgroundColor: "Background color",
		switchToReadOnly: "Switch to read-only mode",
		switchToEditMode: "Switch to edit mode",
		words: "words",
		characters: "characters",
		speechToText: "Speech to text",
		autocompleteSwipe: "SWIPE",
		clearEditor: "Clear editor contents",
		clearEditorDialogTitle: "Clear editor",
		clearEditorDialogDescription: "Are you sure you want to clear the editor?",
		clear: "Clear",
		cancel: "Cancel",
		editorMenu: "Editor menu",
		menuFile: "File",
		menuEdit: "Edit",
		menuInsert: "Insert",
		menuFormat: "Format",
		menuLayout: "Layout",
		menuHelp: "Help",
		newDocument: "New document",
		importFile: "Import",
		exportFile: "Export",
		exportAs: "Export as",
		exportLexical: "Lexical",
		exportMarkdown: "Markdown",
		exportHtml: "HTML",
		exportPdf: "PDF",
		exportPlainText: "Plain text",
		printDocument: "Print",
		deleteAllContent: "Delete all content",
		cut: "Cut",
		copy: "Copy",
		paste: "Paste",
		pasteAsPlainText: "Paste as plain text",
		deleteNode: "Delete node",
		clipboardNotAllowed: "Not allowed to paste from clipboard.",
		selectAll: "Select all",
		findAndReplace: "Find and replace",
		tableOfContents: "Table of contents",
		comments: "Comments",
		noComments: "No comments yet",
		typeComment: "Type a comment…",
		replyToComment: "Reply…",
		comment: "Comment",
		delete: "Delete",
		deleteCommentConfirm: "Delete this comment?",
		deleteThreadConfirm: "Delete this thread?",
		justNow: "Just now",
		deletedComment: "Comment deleted",
		you: "You",
		find: "Find",
		replace: "Replace",
		replaceAll: "Replace all",
		previousMatch: "Previous match",
		nextMatch: "Next match",
		matchCount: "{current} of {total}",
		matchCase: "Match case",
		useRegex: "Use regular expression",
		noResults: "No results",
		invalidRegex: "Invalid pattern",
		closeFindReplace: "Close find and replace",
		addComment: "Add comment",
		insertImage: "Image",
		insertVideo: "Video",
		insertYoutube: "YouTube",
		youtubeUrlPlaceholder: "Paste a YouTube link",
		embedYoutube: "Embed video",
		insertTweet: "X (Twitter)",
		tweetUrlPlaceholder: "Paste an X post link",
		embedTweet: "Embed post",
		insertFigma: "Figma",
		figmaUrlPlaceholder: "Paste a Figma link",
		embedFigma: "Embed design",
		autoEmbedDismiss: "Dismiss",
		insertTable: "Table",
		addTableRow: "Add row",
		addTableColumn: "Add column",
		deleteTableRow: "Delete row",
		deleteTableColumn: "Delete column",
		insertCodeBlock: "Code block",
		insertEmoji: "Emoji",
		insertSpecialCharacters: "Special characters",
		insertDateTime: "Date & time",
		dateTimeToday: "Today",
		dateTimeTomorrow: "Tomorrow",
		dateTimeYesterday: "Yesterday",
		dateTimeTime: "Time",
		insertHorizontalRule: "Horizontal rule",
		insertCard: "Card",
		insertCollapsible: "Collapsible",
		insertPullQuote: "Pull quote",
		insertReview: "Review",
		insertPoll: "Poll",
		pollQuestionPlaceholder: "Poll question",
		pollOptionPlaceholder: "Option",
		pollAddOption: "Add option",
		pollRemoveOption: "Remove option",
		pollVote: "vote",
		pollVotes: "votes",
		insertEquation: "Equation",
		equationPlaceholder: "LaTeX expression",
		equationInline: "Inline",
		equationInsert: "Insert equation",
		insertRuby: "Ruby annotation",
		rubyAnnotationPlaceholder: "Annotation",
		removeRuby: "Remove annotation",
		askAi: "Ask AI",
		askAiPlaceholder: "Ask AI anything...",
		aiImproveWriting: "Improve writing",
		aiMakeLonger: "Make longer",
		aiMakeShorter: "Make shorter",
		aiFixSpelling: "Fix spelling & grammar",
		aiContinueWriting: "Continue writing",
		aiSummarize: "Summarize",
		aiBrainstorm: "Brainstorm ideas",
		aiReplace: "Replace",
		aiInsertBelow: "Insert below",
		aiTryAgain: "Try again",
		aiDiscard: "Discard",
		aiInsert: "Insert",
		askAiWritePlaceholder: "Ask AI to write something...",
		aiGenerating: "Generating…",
		chatMessage: "Message",
		chatPlaceholder: "Write a message…",
		chatSend: "Send message",
		chatStop: "Stop generating",
		chatThinking: "Thinking…",
		insertPageBreak: "Page break",
		textAlignment: "Alignment",
		lineSpacing: "Line spacing",
		textCase: "Text case",
		pageSize: "Page size",
		pageSizePageless: "Pageless",
		pageSizeA4: "A4 (8.27 × 11.69 in)",
		pageSizeLetter: "Letter (8.5 × 11 in)",
		pageSizeLegal: "Legal (8.5 × 14 in)",
		pageSizeTabloid: "Tabloid (11 × 17 in)",
		pageSizeA3: "A3 (11.69 × 16.54 in)",
		pageSizeA5: "A5 (5.83 × 8.27 in)",
		pageSizeB4: "B4 (9.84 × 13.90 in)",
		pageSizeB5: "B5 (6.93 × 9.84 in)",
		pageSizeStatement: "Statement (5.5 × 8.5 in)",
		pageSizeExecutive: "Executive (7.25 × 10.5 in)",
		pageSizeFolio: "Folio (8.5 × 13 in)",
		orientation: "Orientation",
		orientationPortrait: "Portrait",
		orientationLandscape: "Landscape",
		margins: "Margins",
		marginNarrow: "Narrow",
		marginNormal: "Normal",
		marginModerate: "Moderate",
		marginWide: "Wide",
		columns: "Columns",
		columnsOne: "One column",
		columnsTwo: "Two columns",
		columnsThree: "Three columns",
		documentation: "Documentation",
		keyboardShortcuts: "Keyboard shortcuts",
		reportIssue: "Report issue",
		sendFeedback: "Send feedback",
		aboutEditor: "About",
		shortcutAction: "Action",
		shortcutKeys: "Shortcut",
		shortcutsHistory: "History",
		shortcutsFormatting: "Formatting",
		shortcutsParagraphs: "Paragraphs & headings",
		shortcutsLists: "Lists",
	},
};
