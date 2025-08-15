"use client";

import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@components/lib/utils";
import { LoaderCircle } from "lucide-react";

/**
 * 根据size获取尺寸
 */
const spinnerVariants = cva("animate-spin text-current", {
	variants: {
		size: {
			sm: "size-4",
			md: "size-6",
			lg: "size-8",
		},
	},
	defaultVariants: {
		size: "sm",
	},
});

/**
 * 组件Props类型
 */
export type SpinnerProps = React.ComponentProps<"span"> &
	VariantProps<typeof spinnerVariants> & {
		loading?: boolean;
		asChild?: boolean;
	};

export function Spinner({
	className,
	loading = true,
	size,
	asChild = false,
	...props
}: SpinnerProps) {
	const Comp = asChild ? Slot : "span";

	if (!loading) {
		return null;
	}

	return (
		<Comp {...props} className={cn(spinnerVariants({ size }), className)}>
			<LoaderCircle className="w-full h-full" />
		</Comp>
	);
}
