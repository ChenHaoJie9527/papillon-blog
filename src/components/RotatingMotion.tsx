"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { Apple, Star } from "lucide-react";

import {
	motion,
	AnimatePresence,
	type HTMLMotionProps,
	type Transition,
} from "motion/react";

import { cn } from "./lib/utils";

type RotatingItem = {
	content: ReactNode;
	key?: string | number;
	duration?: number;
};

type RotatingMotionProps = {
	// text: string | string[];
	items: RotatingItem[] | ReactNode[];
	duration?: number;
	transition?: Transition;
	y?: number;
	containerClassName?: string;
} & HTMLMotionProps<"div">;

const isArray = (value: unknown) => {
	return Object.prototype.toString.call(value) === "[object Array]";
};

export default function RotatingMotion({
	// text,
	items,
	y = -50,
	duration = 2000,
	containerClassName,
	transition = {
		duration: 0.3,
		ease: "easeOut",
	},
	...props
}: RotatingMotionProps) {
	const [index, setIndex] = useState(0);
	const intervalRef = useRef<any>(null);

	// 将 items 转换为数组
	const itemsArray = isArray(items) ? items : [items];

	// 判断 items 是否为 RotatingItem 数组
	const isRotatingItemArray =
		itemsArray.length > 0 &&
		typeof itemsArray[0] === "object" &&
		"content" in itemsArray[0]!;

	// 获取当前项
	const currentItem = itemsArray[index];

	// 获取当前项的内容
	const currentContent = isRotatingItemArray
		? (currentItem as RotatingItem).content
		: currentItem;

	// 获取当前项的 key
	const currentKey = isRotatingItemArray
		? (currentItem as RotatingItem).key || index
		: index;

	// 获取当前项的持续时间
	const currentDuration = isRotatingItemArray
		? (currentItem as RotatingItem).duration || duration
		: duration;

	useEffect(() => {
		if (itemsArray.length <= 1) {
			return;
		}

		intervalRef.current = setInterval(() => {
			setIndex((s) => (s + 1) % itemsArray.length);
		}, currentDuration);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [itemsArray, currentDuration]);

	return (
		<div className="p-4 border border-foreground/20 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm">
			<div className={cn("overflow-hidden py-1", containerClassName)}>
				<AnimatePresence mode="wait">
					<motion.div
						key={currentKey}
						transition={transition}
						initial={{
							opacity: 0,
							y: -y,
						}}
						animate={{
							opacity: 1,
							y: 0,
						}}
						exit={{
							opacity: 0,
							y: y,
						}}
						{...props}
					>
						{currentContent}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}

/**
 * 自定义配置轮播
 */
export function RotatingMotionDemo() {
	// 在组件内部定义所有内容，不接收 props
	const items = [
		{ content: "Hello", key: "hello", duration: 1000 },
		{ content: <span>Apple</span>, key: "apple", duration: 2000 },
		{
			content: <Apple className="w-6 h-6" />,
			key: "apple-icon",
			duration: 1500,
		},
		{
			content: <Star className="w-6 h-6 text-yellow-500" />,
			key: "star",
			duration: 1800,
		},
	];

	return <RotatingMotion items={items} />;
}
