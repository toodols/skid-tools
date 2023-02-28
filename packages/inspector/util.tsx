export function classNames(...names: (string | false | undefined)[]) {
	return names.filter((v) => v).join(" ");
}
