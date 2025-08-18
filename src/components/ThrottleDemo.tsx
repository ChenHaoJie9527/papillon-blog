"use client";

import { useState, useCallback, useEffect } from "react";
import useThrottle from "../hooks/useThrottle";
import { DemoContainer } from "./ui/DemoContainer";

/**
 * 基础节流演示
 */
export function BasicThrottleDemo() {
	const [inputValue, setInputValue] = useState("");
	const [throttledValue, setThrottledValue] = useState("");
	const [callCount, setCallCount] = useState(0);

	const throttledSetValue = useThrottle((value: string) => {
		setThrottledValue(value);
		setCallCount((prev) => prev + 1);
	}, 1000);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		throttledSetValue(value);
	};

	return (
		<DemoContainer>
			<div className="space-y-4">
				<div>
					<label htmlFor="input" className="block text-sm font-medium mb-2">
						输入内容:
					</label>
					<input
						type="text"
						value={inputValue}
						onChange={handleInputChange}
						placeholder="快速输入内容..."
						className="w-full px-3 py-2 border border-foreground/20 rounded-lg bg-background/50"
					/>
				</div>
				<div>
					<p className="text-sm text-foreground/70">
						节流后的值:{" "}
						<span className="text-accent font-mono">
							{throttledValue || "等待输入..."}
						</span>
					</p>
					<p className="text-sm text-foreground/70">
						实际调用次数: <span className="text-accent">{callCount}</span>
					</p>
				</div>
			</div>
		</DemoContainer>
	);
}

/**
 * 滚动节流演示
 */
export function ScrollThrottleDemo() {
	const [scrollY, setScrollY] = useState(0);
	const [throttledScrollY, setThrottledScrollY] = useState(0);
	const [scrollCount, setScrollCount] = useState(0);

	const throttledSetScroll = useThrottle((y: number) => {
		setThrottledScrollY(y);
		setScrollCount((prev) => prev + 1);
	}, 1000);

	const handleScroll = useCallback(() => {
		const y = window.scrollY;
		setScrollY(y);
		throttledSetScroll(y);
	}, [throttledSetScroll]);

	useEffect(() => {
		window.addEventListener("scroll", handleScroll);
		return () => window.removeEventListener("scroll", handleScroll);
	}, [handleScroll]);

	return (
		<DemoContainer>
			<div className="space-y-4">
				<p className="text-sm">滚动页面来查看节流效果:</p>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-foreground/70">
							实时滚动位置: <span className="text-accent">{scrollY}px</span>
						</p>
					</div>
					<div>
						<p className="text-foreground/70">
							节流后位置:{" "}
							<span className="text-accent">{throttledScrollY}px</span>
						</p>
					</div>
				</div>
				<p className="text-sm text-foreground/70">
					节流后的更新次数: <span className="text-accent">{scrollCount}</span>
				</p>
				<div className="h-20 bg-foreground/10 rounded p-2 text-xs">
					<p>向下滚动查看更多内容...</p>
					<div className="h-40"></div>
					<p>继续滚动...</p>
					<div className="h-40"></div>
					<p>更多内容...</p>
				</div>
			</div>
		</DemoContainer>
	);
}

/**
 * 按钮点击节流演示
 */
export function ButtonClickThrottleDemo() {
	const [clickCount, setClickCount] = useState(0);
	const [throttledClickCount, setThrottledClickCount] = useState(0);

	const throttledIncrement = useThrottle(() => {
		setThrottledClickCount((prev) => prev + 1);
	}, 1000);

	const handleClick = () => {
		setClickCount((prev) => prev + 1);
		throttledIncrement();
	};

	return (
		<DemoContainer>
			<div className="space-y-4">
				<button
					type="button"
					onClick={handleClick}
					className="px-4 py-2 border border-accent rounded-lg transition-colors"
				>
					快速点击我
				</button>
				<div className="space-y-2 text-sm">
					<p className="text-foreground/70">
						实际点击次数: <span className="text-accent">{clickCount}</span>
					</p>
					<p className="text-foreground/70">
						节流后的执行次数:{" "}
						<span className="text-accent">{throttledClickCount}</span>
					</p>
				</div>
			</div>
		</DemoContainer>
	);
}

/**
 * 鼠标移动节流演示
 */
export function MouseMoveThrottleDemo() {
	const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
	const [throttledPosition, setThrottledPosition] = useState({ x: 0, y: 0 });
	const [moveCount, setMoveCount] = useState(0);

	const throttledSetPosition = useThrottle((x: number, y: number) => {
		setThrottledPosition({ x, y });
		setMoveCount((prev) => prev + 1);
	}, 1000);

	const handleMouseMove = useCallback(
		(e: React.MouseEvent) => {
			const rect = e.currentTarget.getBoundingClientRect();
			const x = e.clientX - rect.left;
			const y = e.clientY - rect.top;

			setMousePosition({ x, y });
			throttledSetPosition(x, y);
		},
		[throttledSetPosition],
	);

	return (
		<DemoContainer>
			<div className="space-y-4">
				<p className="text-sm">在下方区域移动鼠标:</p>
				<div
					tabIndex={0}
					onMouseMove={handleMouseMove}
					className="h-32 bg-foreground/10 rounded border-2 border-dashed border-foreground/30 relative"
				>
					<div className=" text-xs ">
						<p>
							实时: ({mousePosition.x}, {mousePosition.y})
						</p>
						<p>
							节流: ({throttledPosition.x}, {throttledPosition.y})
						</p>
					</div>
				</div>
				<p className="text-sm text-foreground/70">
					节流后的更新次数: <span className="text-accent">{moveCount}</span>
				</p>
			</div>
		</DemoContainer>
	);
}

/**
 * 游戏控制节流演示
 */
export function GameControlThrottleDemo() {
	const [playerPosition, setPlayerPosition] = useState(50);
	const [throttledPosition, setThrottledPosition] = useState(50);
	const [keyPressCount, setKeyPressCount] = useState(0);

	const throttledMove = useThrottle((direction: "left" | "right") => {
		setThrottledPosition((prev) => {
			const newPos =
				direction === "left"
					? Math.max(0, prev - 10)
					: Math.min(100, prev + 10);
			return newPos;
		});
		setKeyPressCount((prev) => prev + 1);
	}, 300);

	const handleKeyDown = useCallback(
		(e: KeyboardEvent) => {
			if (e.key === "ArrowLeft") {
				setPlayerPosition((prev) => Math.max(0, prev - 5));
				throttledMove("left");
			} else if (e.key === "ArrowRight") {
				setPlayerPosition((prev) => Math.min(100, prev + 5));
				throttledMove("right");
			}
		},
		[throttledMove],
	);

	useEffect(() => {
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, [handleKeyDown]);

	return (
		<DemoContainer>
			<div className="space-y-4">
				<p className="text-sm">使用左右箭头键控制角色移动:</p>
				<div className="space-y-2">
					<div className="h-8 bg-foreground/10 rounded relative">
						<div
							className="absolute top-1 w-6 h-6 bg-accent rounded transition-all duration-100"
							style={{ left: `${playerPosition}%` }}
						/>
					</div>
					<p className="text-xs text-foreground/70">
						实时位置: {playerPosition}%
					</p>
				</div>
				<div className="space-y-2">
					<div className="h-8 bg-foreground/10 rounded relative">
						<div
							className="absolute top-1 w-6 h-6 bg-green-500 rounded transition-all duration-100"
							style={{ left: `${throttledPosition}%` }}
						/>
					</div>
					<p className="text-xs text-foreground/70">
						节流位置: {throttledPosition}%
					</p>
				</div>
				<p className="text-sm text-foreground/70">
					节流后的移动次数: <span className="text-accent">{keyPressCount}</span>
				</p>
			</div>
		</DemoContainer>
	);
}
