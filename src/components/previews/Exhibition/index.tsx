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

// 定义 Context 类型
interface ExhibitionContextType {
	isDesktop: boolean;
	Comp: typeof Dialog | typeof Drawer;
	Trigger: typeof DialogTrigger | typeof DrawerTrigger;
	Close: typeof DialogClose | typeof DrawerClose;
	Content: typeof DialogContent | typeof DrawerContent;
	Header: typeof DialogHeader | typeof DrawerHeader;
	Title: typeof DialogTitle | typeof DrawerTitle;
	Footer: typeof DialogFooter | typeof DrawerFooter;
	Description: typeof DialogDescription | typeof DrawerDescription;
	drawerProps: Record<string, any>;
}

// 创建 Context
const ExhibitionContext = React.createContext<ExhibitionContextType | null>(null);

// 自定义 Hook
function useExhibitionContext() {
	const context = React.useContext(ExhibitionContext);
	if (!context) {
		throw new Error("Exhibition components must be used within Exhibition");
	}
	return context;
}

// 主组件
export function Exhibition({ children, ...props }: RootExhibitionProps) {
	const isDesktop = useMediaQuery("desktop", {
		defaultValue: true, // 在SSR时默认为桌面端
		initializeWithValue: false, // 避免SSR时的水合问题
	});

	const Comp = isDesktop ? Dialog : Drawer;
	const Trigger = isDesktop ? DialogTrigger : DrawerTrigger;
	const Close = isDesktop ? DialogClose : DrawerClose;
	const Content = isDesktop ? DialogContent : DrawerContent;
	const Header = isDesktop ? DialogHeader : DrawerHeader;
	const Title = isDesktop ? DialogTitle : DrawerTitle;
	const Footer = isDesktop ? DialogFooter : DrawerFooter;
	const Description = isDesktop ? DialogDescription : DrawerDescription;

	const contextValue = React.useMemo(() => ({
		isDesktop,
		Comp,
		Trigger,
		Close,
		Content,
		Header,
		Title,
		Footer,
		Description,
		drawerProps: !isDesktop ? { autoFocus: true } : {},
	}), [isDesktop]);

	return (
		<ExhibitionContext.Provider value={contextValue}>
			<Comp {...props} {...contextValue.drawerProps}>
				{children}
			</Comp>
		</ExhibitionContext.Provider>
	);
}

export function ExhibitionTrigger({
	children,
	className,
	...props
}: ExhibitionProps) {
	const { Trigger } = useExhibitionContext();
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
	const { Close } = useExhibitionContext();
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
	const { Content } = useExhibitionContext();
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
	const { Header } = useExhibitionContext();
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
	const { Title } = useExhibitionContext();
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
	const { Description } = useExhibitionContext();
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
	const { Footer } = useExhibitionContext();
	return (
		<Footer className={cn(className)} {...props}>
			{children}
		</Footer>
	);
}

export function ExhibitionDemo() {
	return (
		<Exhibition>
			<ExhibitionTrigger>组件打开弹窗</ExhibitionTrigger>
			<ExhibitionContent>
				<ExhibitionHeader>
					<ExhibitionTitle>组件标题</ExhibitionTitle>
					<ExhibitionDescription>组件描述</ExhibitionDescription>
				</ExhibitionHeader>
				<ExhibitionBody>
					<p>
						This component is built using shadcn/ui&apos;s dialog and drawer
						component, which is built on top of Vaul.
					</p>
				</ExhibitionBody>
				<ExhibitionFooter>
					<ExhibitionClose asChild>
						<button className="btn btn-outline" type="button">
							关闭弹窗
						</button>
					</ExhibitionClose>
				</ExhibitionFooter>
			</ExhibitionContent>
		</Exhibition>
	);
}
