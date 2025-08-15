import { Button } from "@components/ui/button";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";

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

/**
 * 闪烁效果
 */
export function ShineButton() {
	return <Button effect="shine">Shine</Button>;
}

/**
 * 悬停闪烁效果
 */
export function ShineHoverButton() {
	return <Button effect="shineHover">Shine Hover</Button>;
}

/**
 * 悬停边框效果
 */
export function HoverBorderButton() {
	return <Button effect="ringHover">Hover Border</Button>;
}

/**
 * 悬停下划线效果
 */
export function LinkUnderlineButton() {
	return (
		<Button variant="link" effect="hoverUnderline" className="px-0">
			Link hover underline
		</Button>
	);
}

/**
 * 显示下划线，hover下划线消失
 */
export function LinkNoUnderlineButton() {
	return (
		<Button variant="link" effect="underline" className="px-0">
			Link underline
		</Button>
	);
}

/**
 * 背景渐变色按钮
 */
export function GradientSlideShowButton() {
	return <Button effect="gradientSlideShow">Gradient Button</Button>;
}

/**
 * 左侧loading
 */
export function LeftLoadingButton() {
	return (
		<Button loading loadingIconPlacement="left">
			Loading
		</Button>
	);
}

/**
 * 右侧loading
 */
export function RightLoadingButton() {
	return (
		<Button loading loadingIconPlacement="right" variant="outline">
			Loading
		</Button>
	);
}

export function BaseCopyButton() {
	return (
		<Button copyText="Copy Text" onCopy={() => {}} successText={<Check />}>
			<Copy />
		</Button>
	);
}
