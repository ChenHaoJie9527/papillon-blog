"use client";

import * as React from "react";
import { Slot, Slottable } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@components/lib/utils";

const buttonVariants = cva(
	"inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
	{
		variants: {
			variant: {
				default:
					"bg-primary text-primary-foreground hover:bg-primary/90 border border-accent rounded-md",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},

			effect: {
				expandIcon: "group gap-0 relative",
				ringHover:
					"transition-all duration-300 hover:ring-2 hover:ring-primary/90 hover:ring-offset-2",
				shine:
					"before:animate-shine relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-no-repeat background-position_0s_ease",
				shineHover:
					"relative overflow-hidden before:absolute before:inset-0 before:rounded-[inherit] before:bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.5)_50%,transparent_75%,transparent_100%)] before:bg-[length:250%_250%,100%_100%] before:bg-[position:200%_0,0_0] before:bg-no-repeat before:transition-[background-position_0s_ease] hover:before:bg-[position:-100%_0,0_0] before:duration-1000",
				gooeyRight:
					"relative z-0 overflow-hidden transition-all duration-500 before:absolute before:inset-0 before:z-[-1] before:translate-x-[150%] before:translate-y-[150%] before:scale-[2.5] before:rounded-[100%] before:bg-white/10 before:transition-transform before:duration-1000 hover:before:translate-x-[0%] hover:before:translate-y-[0%]",
				gooeyLeft:
					"relative z-0 overflow-hidden transition-all duration-500 after:absolute after:inset-0 after:-z-10 after:translate-x-[-150%] after:translate-y-[150%] after:scale-[2.5] after:rounded-[100%] after:bg-gradient-to-l from-white/40 after:transition-transform after:duration-1000  hover:after:translate-x-[0%] hover:after:translate-y-[0%]",
				underline:
					"relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-left after:scale-x-100 hover:after:origin-bottom-right hover:after:scale-x-0 after:transition-transform after:ease-in-out after:duration-300",
				hoverUnderline:
					"relative !no-underline after:absolute after:bg-primary after:bottom-2 after:h-[1px] after:w-2/3 after:origin-bottom-right after:scale-x-0 hover:after:origin-bottom-left hover:after:scale-x-100 after:transition-transform after:ease-in-out after:duration-300",
				gradientSlideShow:
					"bg-[size:400%] bg-[linear-gradient(-45deg,var(--gradient-lime),var(--gradient-ocean),var(--gradient-wine),var(--gradient-rust))] animate-gradient-flow",
			},

			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			size: "default",
			variant: "default",
		},
	},
);

type IconProps = {
	// 检索React组件T的类型
	icon?: React.ElementType;
	// 图标位置
	iconPlacement: "left" | "right";
};

type IconRefProps = {
	icon?: never;
	iconPlacement?: undefined;
};

type LoadingProps = {
	loading?: boolean;
	loadingText?: string;
	hideIconOnLoading?: boolean;
	loadingIconPlacement?: "left" | "right";
};

export type ButtonIconProps = IconProps | IconRefProps;

/**
 * ButtonProps 类型定义
 *
 * 组合了以下类型：
 * 1. React.ComponentProps<"button"> - HTML button 元素的所有原生属性
 * 2. VariantProps<typeof buttonVariants> - 按钮变体属性（variant, effect, size）
 * 3. ButtonIconProps - 图标相关属性
 * 4. LoadingProps - 加载状态相关属性
 * 5. asChild - 是否作为子组件渲染
 *
 * @property {string} [variant] - 按钮样式变体
 *   - "default" - 默认样式（主色调背景）
 *   - "destructive" - 危险操作样式（红色背景）
 *   - "outline" - 轮廓样式（边框背景）
 *   - "secondary" - 次要样式（次要色调背景）
 *   - "ghost" - 幽灵样式（透明背景，悬停时显示）
 *   - "link" - 链接样式（文本链接）
 *
 * @property {string} [effect] - 按钮特效
 *   - "expandIcon" - 展开图标效果
 *   - "ringHover" - 悬停时显示环形边框
 *   - "shine" - 闪烁效果
 *   - "shineHover" - 悬停时闪烁
 *   - "gooeyRight" - 悬停时向右移动的粘性效果
 *   - "gooeyLeft" - 悬停时向左移动的粘性效果
 *   - "underline" - 悬停时显示下划线
 *   - "hoverUnderline" - 悬停时下划线向左移动
 *   - "gradientSlideShow" - 渐变滑动展示效果
 *
 * @property {string} [size] - 按钮尺寸
 *   - "default" - 默认尺寸 (h-10 px-4 py-2)
 *   - "sm" - 小尺寸 (h-9 px-3)
 *   - "lg" - 大尺寸 (h-11 px-8)
 *   - "icon" - 图标尺寸 (h-10 w-10)
 *
 * @property {React.ElementType} [icon] - 按钮图标组件
 * @property {"left" | "right"} [iconPlacement] - 图标位置（当 icon 存在时必需）
 *
 * @property {boolean} [loading] - 是否显示加载状态
 * @property {string} [loadingText] - 加载时显示的文本
 * @property {boolean} [hideIconOnLoading] - 加载时是否隐藏图标
 * @property {"left" | "right"} [loadingIconPlacement] - 加载图标位置
 *
 * @property {boolean} [asChild] - 是否作为子组件渲染（使用 Radix UI Slot）
 *
 * @example
 * ```tsx
 * // 基本用法
 * <Button>Click me</Button>
 *
 * // 带图标
 * <Button icon={IconComponent} iconPlacement="left">
 *   With Icon
 * </Button>
 *
 * // 加载状态
 * <Button loading loadingText="Loading...">
 *   Submit
 * </Button>
 *
 * // 特效
 * <Button effect="shineHover" variant="outline">
 *   Shiny Button
 * </Button>
 * ```
 */
export type ButtonProps = React.ComponentProps<"button"> &
	VariantProps<typeof buttonVariants> &
	ButtonIconProps &
	LoadingProps & {
		asChild?: boolean;
	};

function Button({
	className,
	variant,
	effect,
	size,
	icon: Icon,
	iconPlacement,
	loading,
	loadingText,
	children,
	hideIconOnLoading = false,
	loadingIconPlacement = "right",
	asChild = false,
	...props
}: ButtonProps) {
	const Comp = asChild ? Slot : "button";

	return (
		<Comp
			data-slot="button"
			className={cn(buttonVariants({ variant, size, className, effect }))}
			disabled={loading}
			{...props}
		>
			{/* icon */}
			{Icon &&
				iconPlacement === "left" &&
				!(hideIconOnLoading && loading) &&
				(effect === "expandIcon" ? (
					<div className="w-0 translate-x-[-100%] pr-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pr-2 group-hover:opacity-100 overflow-hidden">
						<Icon />
					</div>
				) : (
					<Icon />
				))}

			<Slottable>{children}</Slottable>

			{Icon &&
				iconPlacement === "right" &&
				!(hideIconOnLoading && loading) &&
				(effect === "expandIcon" ? (
					<div className="w-0 translate-x-[100%] pl-0 opacity-0 transition-all duration-200 group-hover:w-5 group-hover:translate-x-0 group-hover:pl-2 group-hover:opacity-100">
						<Icon />
					</div>
				) : (
					<Icon />
				))}
		</Comp>
	);
}

export { Button, buttonVariants };
