import { HistoryExtension } from "@lexical/history";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { useExtensionDependency } from "@lexical/react/useExtensionComponent";
import { useSignalValue } from "@lexical/react/useExtensionSignalValue";
import { useLexicalEditable } from "@lexical/react/useLexicalEditable";
import { REDO_COMMAND, UNDO_COMMAND } from "lexical";

import { Redo2, Undo2 } from "lucide-react";

import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";

export function HistoryToolbarPlugin() {
	const [editor] = useLexicalComposerContext();
	const { t } = useTranslation();
	const { canUndo, canRedo } = useExtensionDependency(HistoryExtension).output;
	const canUndoValue = useSignalValue(canUndo);
	const canRedoValue = useSignalValue(canRedo);
	const isEditable = useLexicalEditable();

	return (
		<ButtonGroup>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-sm"
						aria-label={t.undo}
						disabled={!isEditable || !canUndoValue}
						onClick={() => {
							editor.dispatchCommand(UNDO_COMMAND, undefined);
						}}
					>
						<Undo2 className="rtl:-scale-x-100" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>{t.undo}</TooltipContent>
			</Tooltip>
			<Tooltip>
				<TooltipTrigger asChild>
					<Button
						variant="outline"
						size="icon-sm"
						aria-label={t.redo}
						disabled={!isEditable || !canRedoValue}
						onClick={() => {
							editor.dispatchCommand(REDO_COMMAND, undefined);
						}}
					>
						<Redo2 className="rtl:-scale-x-100" />
					</Button>
				</TooltipTrigger>
				<TooltipContent>{t.redo}</TooltipContent>
			</Tooltip>
		</ButtonGroup>
	);
}
