import EventEmitter from "events";
import { Action } from "@skidtools/message";

export interface InspectorContext {
	networkLogs: NetworkLog[];
	consoleLogs: ConsoleLog[];
	ui: {
		dockWidth: number
	};
	events: EventEmitter;
	runAction<T extends Action>(action: T): Promise<ReturnType<T["action"]>>;
}

export type NetworkLog = {
	request: {
		url: string;
		method: "POST" | "GET" | "PUT" // ...
	};
	response?: {
		status: "success" | "fail",
		json?: any,
	}
};

export type InputLog = {
	type: "input-log";
	value: string;
	at: number;
};
export type InputResult = {
	type: "input-result",
	success: boolean,
	text: string,
	at: number,
};
export type OutputLog = {
	type: "console-log";
	severity: "log" | "warn" | "error";
	values: any[];
	id: number;
	at: number;
};
export type ConsoleLog = InputLog | OutputLog | InputResult;
