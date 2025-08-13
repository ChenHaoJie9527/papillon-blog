"use client";

interface ComponentPreviewProps {
	children: React.ReactNode;
}
export default function ComponentPreview({ children }: ComponentPreviewProps) {
	return (
		<div className="flex items-center justify-center p-4 min-h-[120px] w-full flex-wrap">
			{children}
		</div>
	);
}
