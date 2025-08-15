"use client";

import { useEffect, useRef, useState } from "react";

import {
	motion,
	AnimatePresence,
	type HTMLMotionProps,
	type Transition,
} from "motion/react";

import { cn } from "./lib/utils";

type RotatingMotionProps = {
	text: string | string[];
	duration?: number;
	transition?: Transition;
	y?: number;
	containerClassName?: string;
} & HTMLMotionProps<"div">;

const isArray = (value: unknown) => {
	return Object.prototype.toString.call(value) === "[object Array]";
};

export default function RotatingMotion({
	text,
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
	useEffect(() => {
		if (!isArray(text)) {
			return;
		}

		intervalRef.current = setInterval(() => {
			setIndex((s) => (s + 1) % text.length);
		}, duration);

		return () => {
			if (intervalRef.current) {
				clearInterval(intervalRef.current);
			}
		};
	}, [text, duration]);
	const currentText = isArray(text) ? text[index] : text;
	return (
		<div className="p-4 border border-foreground/20 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm">
			<div className={cn("overflow-hidden py-1", containerClassName)}>
				<AnimatePresence mode="wait">
					<motion.div
						key={currentText}
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
						{currentText}
					</motion.div>
				</AnimatePresence>
			</div>
		</div>
	);
}
