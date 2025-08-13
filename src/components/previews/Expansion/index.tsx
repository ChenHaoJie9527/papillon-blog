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
