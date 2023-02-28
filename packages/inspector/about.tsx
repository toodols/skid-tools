import { createElement } from "preact";

export function About({ active }: { active: boolean }) {
	return (
		<div className={"about page " + [active && "active"].filter((v) => v).join(" ")}>
			<h1>SkidTools</h1>
			<p>V1.0</p>
		</div>
	);
}
