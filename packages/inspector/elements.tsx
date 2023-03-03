import { createElement } from "preact";
import { useContext } from "preact/hooks";
import { AppReactContext } from ".";
import { classNames } from "./util";
export function Elements({ active }: { active: boolean }) {
	const context = useContext(AppReactContext);
	return (
		<div className={classNames("elements", "page")}>
			<button onClick={() => {}}>Capture Element Screenshot</button>
		</div>
	);
}
