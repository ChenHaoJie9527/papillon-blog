"use client";

import { useState, useEffect } from "react";

export default function UseStateDemo() {
	const [count, setCount] = useState(0);
	const [logs, setLogs] = useState<string[]>([]);

	const addLog = (message: string) => {
		setLogs((prev) => [
			...prev,
			`${new Date().toLocaleTimeString()}: ${message}`,
		]);
	};

	const handleSyncUpdate = () => {
		addLog(`点击前的 count: ${count}`);
		setCount(count + 1);
		addLog(`点击后的 count: ${count}`); // 仍然是旧值 0
	};

	const handleBatchUpdate = () => {
		addLog(`批量更新前的 count: ${count}`);
		setCount(count + 1);
		setCount(count + 1);
		setCount(count + 1);
		addLog(`批量更新后的 count: ${count}`); // 仍然是旧值 0
	};

	const handleFunctionalUpdate = () => {
		addLog(`函数式更新前的 count: ${count}`);
		setCount((prev) => {
			addLog(`函数式更新中，prev: ${prev}`); // 0
			return prev + 1;
		});
		setCount((prev) => {
			addLog(`函数式更新中，prev: ${prev}`); // 1
			return prev + 1;
		});
		setCount((prev) => {
			addLog(`函数式更新中，prev: ${prev}`); // 2
			return prev + 1;
		});
		addLog(`函数式更新后的 count: ${count}`); // 仍然是旧值
	};

	const clearLogs = () => {
		setCount(0);
		setLogs([]);
	};

	// 监听 count 变化
	useEffect(() => {
		setLogs((prev) => [
			...prev,
			`${new Date().toLocaleTimeString()}: useEffect 检测到 count 变化: ${count}`,
		]);
	}, [count]);

	return (
		<div className="my-6 p-4 border border-foreground/20 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm">
			<h3 className="text-lg font-semibold mb-4">useState 同步/异步演示</h3>

			<div className="mb-4">
				<p className="text-sm text-foreground/70 mb-2">
					当前 count 值:{" "}
					<span className="font-mono border border-accent px-2 py-1 rounded">
						{count}
					</span>
				</p>
			</div>

			<div className="flex flex-wrap gap-2 mb-4">
				<button
					type="button"
					onClick={handleSyncUpdate}
					className="px-3 py-1 text-sm text-white rounded  transition-colors"
				>
					同步更新测试
				</button>
				<button
					type="button"
					onClick={handleBatchUpdate}
					className="px-3 py-1 text-sm text-white rounded  transition-colors"
				>
					批量更新测试
				</button>
				<button
					type="button"
					onClick={handleFunctionalUpdate}
					className="px-3 py-1 text-sm text-white rounded  transition-colors"
				>
					函数式更新测试
				</button>
				<button
					type="button"
					onClick={clearLogs}
					className="px-3 py-1 text-sm text-white rounded  transition-colors"
				>
					清空日志
				</button>
			</div>

			<div className="space-y-2">
				<h4 className="font-semibold">执行日志：</h4>
				<div className="border border-accent p-3 rounded max-h-60 overflow-y-auto">
					{logs.length === 0 ? (
						<p className="text-gray-500 text-sm">点击按钮查看执行日志...</p>
					) : (
						logs.map((log, index) => (
							<div
								key={`log-${index}-${log.slice(0, 20)}`}
								className="font-mono text-xs mb-1 text-accent"
							>
								{log}
							</div>
						))
					)}
				</div>
			</div>

			<div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-900/20 border border-yellow-300 dark:border-yellow-700 rounded">
				<h4 className="font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
					关键观察点：
				</h4>
				<ul className="text-sm text-yellow-700 dark:text-yellow-300 space-y-1">
					<li>• 在同一个函数中，setCount 后立即读取 count 仍然是旧值</li>
					<li>• 批量更新只会触发一次重新渲染</li>
					<li>• 函数式更新可以访问到最新的状态值</li>
					<li>• useEffect 会在状态更新后执行</li>
				</ul>
			</div>
		</div>
	);
}
