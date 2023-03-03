import { createElement, ComponentChildren } from "preact";
import { classNames } from "./util";
import { useContext, useState } from "preact/hooks";
import { AppReactContext } from ".";

export function Dock({
	dir,
	children,
	className,
}: {
	className: string;
	dir: "left" | "right" | "float";
	children: ComponentChildren;
}) {
	const Context = useContext(AppReactContext);
	const width = Context.ui.dockWidth;
	const forceUpdate = useState({})[1];
	const [isDragging, setIsDragging] = useState(false);

	return (
		<div
			className={classNames(className, "dock", dir, isDragging && "dragging")}
			style={{ "--width": `${width}px` }}
		>
			<div
				className="resize"
				onMouseDown={(event) => {
					setIsDragging(true);
					// const target = event.target! as HTMLDivElement;
					const currentWidth = Context.ui.dockWidth;
					const clientX = event.clientX;
					const mouseUpListener = () => {
						document.removeEventListener("mouseup", mouseUpListener);
						document.removeEventListener("mousemove", mouseMoveListener);
						setIsDragging(false);
					};
					const mouseMoveListener = (event: MouseEvent) => {
						const rel = clientX - event.clientX;
						Context.ui.dockWidth = currentWidth + rel;
						forceUpdate({});
					};
					document.addEventListener("mouseup", mouseUpListener);
					document.addEventListener("mousemove", mouseMoveListener);
				}}
			/>
			{children}
		</div>
	);
}
