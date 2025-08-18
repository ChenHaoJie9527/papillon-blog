"use client";

import { useState, useCallback, useEffect } from "react";
import useDebounce from "../hooks/useDebounce";
import { DemoContainer } from "./ui/DemoContainer";

/**
 * 基础防抖演示
 */
export function BasicDebounceDemo() {
	const [inputValue, setInputValue] = useState("");
	const [debouncedValue, setDebouncedValue] = useState("");
	const [callCount, setCallCount] = useState(0);

	const debouncedSetValue = useDebounce((value: string) => {
		setDebouncedValue(value);
		setCallCount((prev) => prev + 1);
	}, 1000);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setInputValue(value);
		debouncedSetValue(value);
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
						防抖后的值:{" "}
						<span className="text-accent font-mono">
							{debouncedValue || "等待输入..."}
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
 * 窗口大小防抖演示
 */
export function WindowResizeDebounceDemo() {
	const [windowSize, setWindowSize] = useState({
		width: typeof window !== "undefined" ? window.innerWidth : 0,
		height: typeof window !== "undefined" ? window.innerHeight : 0,
	});
	const [resizeCount, setResizeCount] = useState(0);

	const debouncedSetWindowSize = useDebounce(
		(width: number, height: number) => {
			setWindowSize({ width, height });
			setResizeCount((prev) => prev + 1);
		},
		1000,
	);

	const handleResize = useCallback(() => {
		debouncedSetWindowSize(window.innerWidth, window.innerHeight);
	}, [debouncedSetWindowSize]);

	useEffect(() => {
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [handleResize]);

	return (
		<DemoContainer>
			<div className="space-y-4">
				<p className="text-sm">调整浏览器窗口大小来查看防抖效果:</p>
				<div className="grid grid-cols-2 gap-4 text-sm">
					<div>
						<p className="text-foreground/70">
							宽度: <span className="text-accent">{windowSize.width}px</span>
						</p>
					</div>
					<div>
						<p className="text-foreground/70">
							高度: <span className="text-accent">{windowSize.height}px</span>
						</p>
					</div>
				</div>
				<p className="text-sm text-foreground/70">
					防抖后的更新次数: <span className="text-accent">{resizeCount}</span>
				</p>
			</div>
		</DemoContainer>
	);
}

/**
 * 按钮点击防抖演示
 */
export function ButtonClickDebounceDemo() {
	const [clickCount, setClickCount] = useState(0);
	const [debouncedClickCount, setDebouncedClickCount] = useState(0);

	// 只有当用户停止点击 1 秒后，才会执行 setDebouncedClickCount 函数
	const debouncedIncrement = useDebounce(() => {
		setDebouncedClickCount((prev) => prev + 1);
	}, 1000);

	const handleClick = () => {
		setClickCount((prev) => prev + 1);
		debouncedIncrement();
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
						防抖后的执行次数:{" "}
						<span className="text-accent">{debouncedClickCount}</span>
					</p>
				</div>
			</div>
		</DemoContainer>
	);
}
