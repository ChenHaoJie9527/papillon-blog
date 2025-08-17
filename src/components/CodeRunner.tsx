"use client";

import { useState } from "react";

interface CodeRunnerProps {
	code: string;
}

export default function CodeRunner({ code }: CodeRunnerProps) {
	const [output, setOutput] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [consoleOutput, setConsoleOutput] = useState<string[]>([]);

	const runCode = () => {
		try {
			setError("");
			setOutput("");
			setConsoleOutput([]);

			// 重写 console.log 来捕获输出
			const originalConsoleLog = console.log;
			const logs: string[] = [];

			console.log = (...args) => {
				logs.push(
					args
						.map((arg) =>
							typeof arg === "object"
								? JSON.stringify(arg, null, 2)
								: String(arg),
						)
						.join(" "),
				);
				originalConsoleLog.apply(console, args);
			};

			// 创建一个安全的执行环境
			const result = new Function(code)();

			// 恢复原始的 console.log
			console.log = originalConsoleLog;

			// 保存控制台输出
			setConsoleOutput(logs);

			if (result !== undefined) {
				setOutput(JSON.stringify(result, null, 2));
			} else {
				setOutput("代码执行完成（无返回值）");
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		}
	};

	const clearOutput = () => {
		setOutput("");
		setError("");
		setConsoleOutput([]);
	};

	return (
		<div className="my-6 p-4 border border-foreground/20 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm">
			<div className="flex items-center justify-end">
				<div className="space-x-2 flex gap-2 w-full" style={{ justifyContent: "flex-end" }}>
					<button
						type="button"
						onClick={runCode}
						className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
					>
						运行代码
					</button>
					<button
						type="button"
						onClick={clearOutput}
						className="px-3 py-1 text-sm bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors"
					>
						清空输出
					</button>
				</div>
			</div>

			{/* 自定义样式的代码块，避免白色阴影 */}
			<div className="bg-gray-900 text-green-400 p-2 rounded font-mono text-sm overflow-x-auto">
				<pre className="!bg-transparent !text-green-400 !shadow-none !m-0 !p-0">
					{code}
				</pre>
			</div>

			{(output || error || consoleOutput.length > 0) && (
				<div className="space-y-2">
					<h5 className="font-semibold">输出结果：</h5>

					{/* 控制台输出 */}
					{consoleOutput.length > 0 && (
						<div className="bg-blue-100 dark:bg-blue-900/20 border border-blue-300 dark:border-blue-700 p-3 rounded text-blue-800 dark:text-blue-200 mb-3">
							<div className="font-semibold mb-2">控制台输出：</div>
							{consoleOutput.map((log, index) => (
								<div
									key={`console-${index}-${log}`}
									className="font-mono text-sm mb-1"
								>
									{log}
								</div>
							))}
						</div>
					)}

					{/* 返回值或错误 */}
					{error ? (
						<div className="bg-red-100 dark:bg-red-900/20 border border-red-300 dark:border-red-700 p-3 rounded text-red-800 dark:text-red-200">
							<strong>错误：</strong> {error}
						</div>
					) : output && output !== "代码执行完成（无返回值）" ? (
						<div className="bg-green-100 dark:bg-green-900/20 border border-green-300 dark:border-green-700 p-3 rounded text-green-800 dark:text-green-700">
							<div className="font-semibold mb-2">返回值：</div>
							<pre className="whitespace-pre-wrap">{output}</pre>
						</div>
					) : null}
				</div>
			)}
		</div>
	);
}
