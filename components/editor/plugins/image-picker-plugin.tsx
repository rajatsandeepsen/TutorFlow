import { Image } from "lucide-react";
import { useMemo } from "react";
import {
	type ComponentPickerItem,
	useComponentPickerItems,
} from "@/components/editor/plugins/component-picker-plugin";
import { useTranslation } from "@/components/editor/plugins/i18n-plugin";
import { useImageFilePicker } from "@/components/editor/plugins/insert-image-plugin";

export function ImagePickerPlugin() {
	const { t } = useTranslation();
	const { pick, input } = useImageFilePicker();

	const items = useMemo<ComponentPickerItem[]>(
		() => [
			{
				value: "image",
				label: t.insertImage,
				icon: <Image className="text-muted-foreground" />,
				keywords: ["image", "photo", "picture", "file", "img"],
				onSelect: pick,
			},
		],
		[t, pick],
	);

	useComponentPickerItems(items);

	return input;
}
