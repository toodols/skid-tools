/** Gives this subclass a unique id */
function unique(kind: any){
	kind.subtypes = kind.subtypes || [];
	return function mod(target: any){
		target.id = kind.subtypes.length;
		kind.subtypes.push(target);
		return target;
	}
}


function entry() {
	return function mod(target: any, key: string){
		target.args = target.args || [];
		target.args.push(key);
	};
}

export abstract class Action {
	serialize(){
		// @ts-ignore
		return [this.constructor.id, ...this.constructor.args.map((arg: string) => this[arg])];
	}
	deserialize(value: any[]){
		// @ts-ignore
		const constructor = Action.subtypes[value[0]];
		// @ts-ignore
		return new constructor(...value.slice(1, constructor.args.length));
	}
	abstract action(): any;
};

export abstract class Result {}

export class ExecuteJavascriptResult extends Result {
	@entry()
	value: any;
	@entry()
	error: null | string;
	constructor(value: any, error: null | string) {
		super();
		this.value = value;
		this.error = error;
	}
}

@unique(Action)
export class ExecuteJavascriptAction extends Action {
	async action(): Promise<ExecuteJavascriptResult> {
		try {
			const result = eval.call(window, `${this.code}`);
			// attempt to serialize
			// if it fails, just return a stringified version
			try {
				return new ExecuteJavascriptResult(JSON.stringify(result), null);
			} catch (e) {
				return new ExecuteJavascriptResult(String(result), null);	
			}
		} catch (e) {
			console.log("eval failed");
			//@ts-ignore
			return new ExecuteJavascriptResult(undefined, e.message);
		}
	}
	
	@entry()
	code: string;
	constructor(code: string) {
		super();
		this.code = code;
	}
}