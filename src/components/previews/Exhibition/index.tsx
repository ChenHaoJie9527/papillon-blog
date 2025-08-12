"use client";

import * as React from "react";

import { cn } from "@components/lib/utils";
import { useMediaQuery } from "@hooks/useMediaQuery";

import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@components/ui/dialog";
import {
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "@components/ui/drawer";
import { createCustomContext } from "create-custom-context";

interface BaseProps {
	children: React.ReactNode;
}

interface RootExhibitionProps extends BaseProps {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}

interface ExhibitionProps extends BaseProps {
	className?: React.HTMLAttributes<HTMLDivElement>["className"];
	asChild?: true;
}

const [ExhibitionProvider, useExhibition] = createCustomContext(() => {
	const isDesktop = useMediaQuery("mobile");
	const Comp = isDesktop ? Dialog : Drawer;
	const Trigger = isDesktop ? DialogTrigger : DrawerTrigger;
	return {
		isDesktop,
		Comp,
		Trigger,
		drawerProps: !isDesktop
			? {
					autoFocus: true,
				}
			: {},
	};
});

export function Exhibition({ children, ...props }: RootExhibitionProps) {
	const { Comp, drawerProps } = useExhibition();
	return (
		<ExhibitionProvider>
			<Comp {...props} {...drawerProps}>
				{children}
			</Comp>
		</ExhibitionProvider>
	);
}

export function ExhibitionTrigger({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Trigger } = useExhibition();
	return (
		<Trigger className={cn(className)} {...props}>
			{children}
		</Trigger>
	);
}
