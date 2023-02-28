import { createElement } from "preact";
import { useContext, useEffect, useState } from "preact/hooks";
import { ExecuteJavascriptAction } from "@skidtools/message";
import { AppReactContext } from ".";
import { ConsoleLog } from "./types";

export function formatDate(date: Date) {
	return `${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}.${date.getMilliseconds()}`;
}

export function Console({ active }: { active: boolean }) {
	const context = useContext(AppReactContext);
	const logs = context.consoleLogs;
	const forceUpdate = useState({})[1];
	useEffect(() => {
		const listener = (e: ConsoleLog) => {
			// setLogs(context.consoleLogs);
			forceUpdate({});
		};
		context.events.on("console-log", listener);
		return () => {
			context.events.off("console-log", listener);
		};
	});
	return (
		<div className={"console page " + [active && "active"].filter((v) => v).join(" ")}>
			<div className="logs">
				{logs.map((log) => {
					if (log.type === "input-log") {
						return (
							<div className="log input">
								<div className={"type"}>{">"}</div>
								<div className="time">{formatDate(new Date(log.at))}</div>
								<div>{log.value}</div>
							</div>
						);
					} else if (log.type === "input-result") {
						return (
							<div className="log result">
								<div className={"type"}>{"<"}</div>
								<div className="time">{formatDate(new Date(log.at))}</div>
								{log.text}
							</div>
						);
					} else {
						return (
							<div className="log output">
								<div className="type"> </div>
								<div className="time">{formatDate(new Date(log.at))}</div>
								{log.values.map((value) => (
									<div>{value}</div>
								))}
							</div>
						);
					}
				})}
			</div>
			<input
				type="text"
				onKeyDown={async (e) => {
					if (e.key === "Enter") {
						context.consoleLogs.push({
							at: Date.now(),
							type: "input-log",
							value: e.currentTarget.value,
						});
						forceUpdate({});

						const res = await context.runAction(new ExecuteJavascriptAction(e.currentTarget.value));
						context.consoleLogs.push({
							at: Date.now(),
							type: "input-result",
							success: !!res.error,
							text: res.error || String(res.value),
						});
						forceUpdate({});
					}
				}}
			/>
		</div>
	);
}
