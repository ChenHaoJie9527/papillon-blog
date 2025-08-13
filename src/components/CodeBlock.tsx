"use client";

import { useEffect, useRef } from "react";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-tsx";

interface CodeBlockProps {
	code: string;
	language?: string;
	showLineNumbers?: boolean;
}

export default function CodeBlock({
	code,
	language = "jsx",
	showLineNumbers = false,
}: CodeBlockProps) {
	const codeRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (codeRef.current && code) {
			Prism.highlightElement(codeRef.current);
		}
	}, [code]);

	return (
		<div className="relative">
			<pre
				className={`language-${language} rounded-md !m-0 !bg-background ${showLineNumbers ? "line-numbers" : ""}`}
			>
				<code ref={codeRef} className={`language-${language}`}>
					{code}
				</code>
			</pre>
		</div>
	);
}
