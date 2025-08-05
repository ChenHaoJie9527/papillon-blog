import useCopy from "../hooks/useCopy";

const CopyDemo = () => {
	const { copied, copyHandle, resetHandle } = useCopy();

	return (
		<div className="p-4 border border-foreground/20 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm">
			<div className="flex gap-3 items-center">
				<button
					type="button"
					onClick={() => copyHandle("Hello, world!")}
					className="inline-flex text-accent border-3 border-accent/30 border-double py-1.5 px-3 whitespace-nowrap hover:bg-accent/10 rounded-xl transition-colors font-semibold"
				>
					{copied ? "已复制!" : "复制文本"}
				</button>

				{copied && (
					<button
						type="button"
						onClick={resetHandle}
						className="inline-flex text-foreground/70 border-3 border-foreground/20 border-double py-1.5 px-3 whitespace-nowrap hover:bg-foreground/10 rounded-xl transition-colors font-semibold"
					>
						重置
					</button>
				)}
			</div>

			{copied && (
				<div className="mt-3 p-2 rounded text-sm text-accent border-accent/30 bg-accent/10">
					✅ 文本已复制到剪贴板
				</div>
			)}
		</div>
	);
};

export default CopyDemo;
