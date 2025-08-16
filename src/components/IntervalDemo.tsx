"use client";

import { useState } from "react";
import useInterval from "../hooks/useInterval";
import { DemoContainer } from "./ui/DemoContainer";

/**
 * 基础定时器
 */
export function BaseIntervalDemo() {
	const [count, setCount] = useState(0);

	useInterval(() => {
		setCount((c) => c + 1);
	}, 1000);

	return (
		<DemoContainer>
			<p>Count: {count}</p>
		</DemoContainer>
	);
}

/**
 * 立即执行定时器
 */
export function ImmediateIntervalDemo() {
	const [count, setCount] = useState(0);

	useInterval(
		() => {
			setCount((c) => c + 1);
		},
		1000,
		{
			immediate: true,
		},
	);

	return (
		<DemoContainer>
			<p>Count: {count}</p>
		</DemoContainer>
	);
}

/**
 * 动态控制定时器
 */
export function DynamicControlIntervalDemo() {
	const [count, setCount] = useState(0);
	const [isRunning, setIsRunning] = useState(true);

	const clearInterval = useInterval(
		() => {
			setCount((c) => c + 1);
		},
		isRunning ? 1000 : null, // 如果 isRunning 为 true，则每秒递增计数器
	);

	return (
		<DemoContainer>
			<p>Count: {count}</p>
			<div className="flex gap-2">
				<button onClick={() => setIsRunning(!isRunning)} type="button">
					{isRunning ? "暂停" : "开始"}
				</button>
			</div>
		</DemoContainer>
	);
}

/**
 * 动态更新间隔时间
 */
export function DynamicUpdateIntervalDemo() {
	const [count, setCount] = useState(0);
	const [interval, setInterval] = useState(1000);

	useInterval(() => {
		setCount((c) => c + 1);
	}, interval);

	return (
		<DemoContainer>
			<p>Count: {count}</p>
			<button type="button" onClick={() => setInterval(interval + 1000)}>
				增加间隔时间
			</button>
		</DemoContainer>
	);
}

/**
 * 清除定时器
 */
export function ClearIntervalDemo() {
	const [count, setCount] = useState(0);

	const clearInterval = useInterval(() => {
		setCount((c) => c + 1);
	}, 1000);

	return (
		<DemoContainer>
			<p>Count: {count}</p>
			<button type="button" onClick={() => clearInterval()}>
				清除定时器
			</button>
		</DemoContainer>
	);
}
