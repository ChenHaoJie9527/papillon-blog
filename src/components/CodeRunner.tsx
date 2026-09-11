"use client";

import { useState } from "react";
import { t } from "../i18n";

interface CodeRunnerProps {
	code: string;
}

export default function CodeRunner({ code }: CodeRunnerProps) {
	const [output, setOutput] = useState<string>("");
	const [error, setError] = useState<string>("");
	const [consoleOutput, setConsoleOutput] = useState<string[]>([]);
	const [running, setRunning] = useState(false);

	const runCode = () => {
		const originalConsoleLog = console.log;
		setRunning(true);
		try {
			setError("");
			setOutput("");
			setConsoleOutput([]);

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

			const result = new Function(code)();
			setConsoleOutput(logs);

			if (result !== undefined) {
				setOutput(JSON.stringify(result, null, 2));
			} else {
				setOutput(t("codeRunner.noReturn"));
			}
		} catch (err) {
			setError(err instanceof Error ? err.message : String(err));
		} finally {
			console.log = originalConsoleLog;
			setRunning(false);
		}
	};

	const clearOutput = () => {
		setOutput("");
		setError("");
		setConsoleOutput([]);
	};

	const hasOutput = output || error || consoleOutput.length > 0;

	return (
		<div className="my-6 p-4 border-2 border-accent/30 rounded-xl bg-background">
			<div className="flex items-center justify-end gap-2 mb-3">
				<button
					type="button"
					onClick={runCode}
					disabled={running}
					className="px-3 py-2 text-sm bg-accent text-background rounded-xl hover:bg-accent/90 disabled:opacity-60"
				>
					{running ? t("codeRunner.running") : t("codeRunner.run")}
				</button>
				<button
					type="button"
					onClick={clearOutput}
					className="px-3 py-2 text-sm border-2 border-accent/40 text-accent rounded-xl hover:bg-accent/10"
				>
					{t("codeRunner.clear")}
				</button>
			</div>

			<div className="bg-foreground/6 text-foreground p-3 rounded-xl font-mono text-sm overflow-x-auto border border-foreground/10">
				<pre className="!bg-transparent !text-foreground !shadow-none !m-0 !p-0 whitespace-pre-wrap">
					{code}
				</pre>
			</div>

			<div className="mt-3" aria-live="polite">
				{hasOutput && (
					<div className="space-y-2">
						<h5 className="font-semibold">{t("codeRunner.output")}</h5>

						{consoleOutput.length > 0 && (
							<div className="bg-blue/10 border border-blue/40 p-3 rounded-xl text-foreground mb-3">
								<div className="font-semibold mb-2">{t("codeRunner.console")}</div>
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

						{error ? (
							<div className="bg-red/10 border border-red/40 p-3 rounded-xl text-red">
								<strong>{t("codeRunner.error")}：</strong> {error}
							</div>
						) : output && output !== t("codeRunner.noReturn") ? (
							<div className="bg-green/10 border border-green/40 p-3 rounded-xl text-foreground">
								<div className="font-semibold mb-2">{t("codeRunner.returnValue")}</div>
								<pre className="whitespace-pre-wrap font-mono text-sm">{output}</pre>
							</div>
						) : output ? (
							<div className="text-foreground/80 text-sm">{output}</div>
						) : null}
					</div>
				)}
			</div>
		</div>
	);
}
