export function DemoContainer({ children }: { children: React.ReactNode }) {
	return (
		<div className="p-4 border border-foreground/20 rounded-lg bg-background/50 dark:bg-background/30 backdrop-blur-sm">
			{children}
		</div>
	);
}
