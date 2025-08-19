import { DemoContainer } from "./ui/DemoContainer";

// Flexbox 方案
export function FlexBoxDemo() {
	return (
		<DemoContainer>
			<div
				className="flex items-center justify-center border rounded border-accent"
				style={{
					height: "100px",
					width: "200px",
				}}
			>
				<span>Flex Box</span>
			</div>
		</DemoContainer>
	);
}

// css Grid 方案
export function GridDemo() {
	return (
		<DemoContainer>
			<div
				className="grid border rounded border-accent"
				style={{
					height: "100px",
					width: "200px",
					placeItems: "center", // 使用内联样式
				}}
			>
				<span>Grid</span>
			</div>
		</DemoContainer>
	);
}

// 绝对定位方案
export function AbsolutePositionDemo() {
	return (
		<DemoContainer>
			<div
				className="relative border rounded border-accent"
				style={{
					height: "200px",
					width: "300px",
				}}
			>
				<span
					style={{
						position: "absolute",
						left: "50%",
						top: "50%",
						transform: "translate(-50%, -50%)",
						color: "white", // 确保文字可见
					}}
				>
					Absolute
				</span>
			</div>
		</DemoContainer>
	);
}

// 绝对定位 + margin auto
export function AbsolutePositionMarginAutoDemo() {
	return (
		<DemoContainer>
			<div
				className="relative border rounded border-accent"
				style={{
					height: "200px",
					width: "300px",
				}}
			>
				<span
					style={{
						position: "absolute",
						left: 0,
						top: 0,
						right: 0,
						bottom: 0,
						margin: "auto",
						width: "fit-content",
						height: "fit-content",
					}}
				>
					Absolute + margin auto
				</span>
			</div>
		</DemoContainer>
	);
}

// 行内元素方案
export function InlineElementDemo() {
	return (
		<DemoContainer>
			<div
				className="border rounded border-accent"
				style={{
					height: "200px",
					lineHeight: "200px",
					textAlign: "center",
					width: "300px",
				}}
			>
				<span>Inline Element</span>
			</div>
		</DemoContainer>
	);
}
