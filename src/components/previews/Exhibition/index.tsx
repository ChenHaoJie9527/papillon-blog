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
	const Close = isDesktop ? DialogClose : DrawerClose;
	const Content = isDesktop ? DialogContent : DrawerContent;
	const Header = isDesktop ? DialogHeader : DrawerHeader;
	const Title = isDesktop ? DialogTitle : DrawerTitle;
	const Footer = isDesktop ? DialogFooter : DrawerFooter;
	const Description = isDesktop ? DialogDescription : DrawerDescription;
	return {
		isDesktop,
		Comp,
		Trigger,
		Close,
		Content,
		Header,
		Title,
		Footer,
		Description,
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

export function ExhibitionClose({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Close } = useExhibition();
	return (
		<Close className={cn(className)} {...props}>
			{children}
		</Close>
	);
}

export function ExhibitionContent({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Content } = useExhibition();
	return (
		<Content className={cn(className)} {...props}>
			{children}
		</Content>
	);
}

export function ExhibitionHeader({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Header } = useExhibition();
	return (
		<Header className={cn(className)} {...props}>
			{children}
		</Header>
	);
}

export function ExhibitionTitle({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Title } = useExhibition();
	return (
		<Title className={cn(className)} {...props}>
			{children}
		</Title>
	);
}

export function ExhibitionDescription({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Description } = useExhibition();
	return (
		<Description className={cn(className)} {...props}>
			{children}
		</Description>
	);
}

export function ExhibitionBody({
	children,
	className,
	...props
}: ExhibitionProps) {
	return (
		<div className={cn("px-4 md:px-0", className)} {...props}>
			{children}
		</div>
	);
}

export function ExhibitionFooter({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Footer } = useExhibition();
	return (
		<Footer className={cn(className)} {...props}>
			{children}
		</Footer>
	);
}
