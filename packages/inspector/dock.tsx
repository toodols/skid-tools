import { createElement, ComponentChildren } from "preact";
import { classNames } from "./util";
import { useContext } from "preact/hooks";
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
	return (
		<div className={classNames(className, "dock", dir)} style={{ "--width": `${width}px` }}>
			<div
				className="resize"
				onMouseDown={(event) => {
					console.log(event);
					const target = event.target! as HTMLDivElement;
					target.addEventListener("mousemove", (event) => {
						Context.ui.dockWidth = event.clientX;
					});
				}}
			/>
			{children}
		</div>
	);
}
