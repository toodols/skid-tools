declare module "*.sass" {
	const content: {
		// ???
		i: (modules,media,dedupe,supports,layer)=>unknown,
		toString(): string,
	} & [
		[string, string, string],
	]
	export default content;
}