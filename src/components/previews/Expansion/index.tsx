import { Button } from "@components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

/**
 * 左侧图标按钮
 */
export function LeftIconButton() {
	return (
		<Button icon={ArrowLeft} iconPlacement="left">
			Icon Left
		</Button>
	);
}

/**
 * 左侧图标悬停效果按钮
 */
export function LeftIconEffectButton() {
	return (
		<Button icon={ArrowLeft} iconPlacement="left" effect="expandIcon">
			Left Effect
		</Button>
	);
}

/**
 * 右侧图标按钮
 */
export function RightIconButton() {
	return (
		<Button icon={ArrowRight} iconPlacement="right">
			Icon Right
		</Button>
	);
}

/**
 * 右侧图标悬停效果按钮
 */
export function RightIconEffectButton() {
	return (
		<Button icon={ArrowRight} iconPlacement="right" effect="expandIcon">
			Right Effect
		</Button>
	);
}

/**
 * 粘性从右向左效果
 */
export function GooeyRightButton() {
	return <Button effect="gooeyRight">Gooey Right</Button>;
}

/**
 * 粘性从左向右效果
 */
export function GooeyLeftButton() {
	return <Button effect="gooeyLeft">Gooey Left</Button>;
}
