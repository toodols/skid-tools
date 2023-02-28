import { createElement, createContext, render } from "preact";
import { useState } from "preact/hooks";
import style from "./styles/global.sass";
import { Console } from "./console";
import { InspectorContext } from "./types";
import { About } from "./about";
import { Network } from "./network";
import { classNames } from "./util";
import { Dock } from "./dock";

export const AppReactContext = createContext<InspectorContext>(0 as never);

function App({ ctx }: { ctx: InspectorContext }) {
	const [currentTab, setCurrentTab] = useState("console");
	return (
		<AppReactContext.Provider value={ctx}>
			<style>{style.toString()}</style>
			<Dock className={"style-root"} dir="right">
				<nav>
					<button
						className={currentTab === "about" ? "active" : ""}
						onClick={setCurrentTab.bind(null, "about")}
					>
						About
					</button>
					<button
						className={currentTab === "console" ? "active" : ""}
						onClick={setCurrentTab.bind(null, "console")}
					>
						Console
					</button>
					<button
						className={currentTab === "elements" ? "active" : ""}
						onClick={setCurrentTab.bind(null, "elements")}
					>
						Elements
					</button>
					<button
						className={currentTab === "network" ? "active" : ""}
						onClick={setCurrentTab.bind(null, "network")}
					>
						Network
					</button>
					<button style="float: right" onClick={() => {}}>
						Hide
					</button>
				</nav>
				<Console active={currentTab === "console"} />
				<Network active={currentTab === "network"} />
				<About active={currentTab === "about"} />
			</Dock>
		</AppReactContext.Provider>
	);
}

type PreactRoot = Element | Document | ShadowRoot | DocumentFragment;

export class Inspector {
	static standalone(ctx: InspectorContext) {
		return new Inspector(document.body, ctx);
	}
	static local(rootEl: PreactRoot, ctx: InspectorContext) {
		return new Inspector(rootEl, ctx);
	}
	constructor(rootEl: PreactRoot, ctx: InspectorContext) {
		render(<App ctx={ctx} />, rootEl);
	}
}
