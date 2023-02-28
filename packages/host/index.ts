import { Inspector } from "@skidtools/inspector";
import { ConsoleLog, InspectorContext, NetworkLog } from "@skidtools/inspector/types";
import { Action } from "@skidtools/message";
import { EventEmitter } from "events";

interface OnFetchHandle {
	completed(response: Response): void;
	failed(reason: any): void;
}

export abstract class HostContext {
	abstract onFetch(...args: any[]): OnFetchHandle;
	onLog(args: any[]){}
	onError(err: ErrorEvent) {}
}

export function bindEvents(ctx: HostContext) {
	const _log = window.console.log;
	window.console.log = (...args: any[]) => {
		ctx.onLog(args);
		_log(...args);
	}
	window.addEventListener("error", ctx.onError.bind(ctx));

	const _fetch = window.fetch;
	//@ts-ignore
	window.fetch = (...args: any[]) => {
		const handle = ctx.onFetch(...args);
		return new Promise((res, rej)=>{
			//@ts-ignore
			_fetch.apply(null, args).then(e=>{
				handle.completed(e);
				res(e);
			}).catch((reason)=>{
				handle.failed(reason);
				rej(reason);
			});
		});
	}
}

export function init(){
	if ("__skidtools__" in window) {
		console.error("SkidTools already initialized");
		return;
	}
	//@ts-ignore
	const api = window.__skidtools__ = {} as {hostCtx: HostContext, inspectorCtx: InspectorContext};

	class Context implements InspectorContext {
		ui = {dockWidth: 500};
		consoleLogs: ConsoleLog[] = [];
		networkLogs: NetworkLog[] = [];
		events = new EventEmitter();
		runAction<T extends Action>(action: T) {
			return action.action();
		}
	}
	const inspectorCtx = api.inspectorCtx = new Context();
	

	bindEvents(api.hostCtx=new class extends HostContext {
		onLog(args: any[]) {
			inspectorCtx.consoleLogs.push({
				type: "console-log",
				at: Date.now(),
				severity: "log",
				id: 0,
				values: JSON.parse(JSON.stringify(args))
			})
			inspectorCtx.events.emit("console-log")
		}
		onFetch(arg0: any, arg1: any): OnFetchHandle {
			const obj: NetworkLog = {} as NetworkLog;
			if (typeof arg0 === "string") {
				obj.request = {
					url: arg0,
					method: arg1 ? arg1.method : "GET",
				}
			} else if (typeof arg0 === "object") {
				obj.request = {
					url: arg0.url,
					method: arg0.method,
				}
			}

			inspectorCtx.networkLogs.push(obj)
			inspectorCtx.events.emit("network-log");
			return {
				failed: async (res) => {
					obj.response = {status: "fail"};
					inspectorCtx.events.emit("network-log", "completed");
				},
				completed: async (res)=> {
					try {
						const json = await res.json();
						obj.response = {status: "success", json};
					} catch(e){
						obj.response = {status:"success", };
					} finally {
						inspectorCtx.events.emit("network-log", "completed");
					}
				},
			}
		}
		onError(err: ErrorEvent) {
			// inspectorCtx.consoleLogs.push({
			// 	type: "output"
			// })
		}	
	});
	const root = document.createElement("div");
	const shadow = root.attachShadow({mode: "open"});
	document.body.appendChild(root);

	new Inspector(shadow, inspectorCtx);
}

init()