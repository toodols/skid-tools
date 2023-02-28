import { createElement } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { NetworkLog } from "./types";
import { AppReactContext } from ".";
import { classNames } from "./util";

export function Network({ active }: { active: boolean }) {
	const context = useContext(AppReactContext);
	const logs = context.networkLogs;
	const forceUpdate = useState({})[1];
	useEffect(() => {
		const listener = () => {
			// setLogs(context.networkLogs);
			forceUpdate({});
		};
		context.events.on("network-log", listener);
		return () => {
			context.events.off("network-log", listener);
		};
	});
	return (
		<div className={"network page " + classNames(active && "active")}>
			{logs.map((log) => {
				//@ts-ignore
				if (log.request.url instanceof Promise) {
					console.log("Promise", log);
				}
				return (
					<button className={"log " + classNames(log.response && log.response.status === "fail" && "fail")}>
						<div title={log.request.url}>{log.request.url}</div>
					</button>
				);
			})}
		</div>
	);
}
