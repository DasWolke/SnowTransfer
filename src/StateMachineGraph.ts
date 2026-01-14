import StateMachine = require("./StateMachine");

function graph(stateMachine: StateMachine) {
	stateMachine.guardNotEditable();
	let output = "digraph {\n";
	output += "rankdir=LR\n";
	output += `${stateMachine.currentStateName}\n`;
	for (const [stateName, state] of stateMachine.states.entries()) {
		if (state.onEnter.length) {
			output += `${stateName} [fontcolor=blue]\n`;
		}

		for (const [transitionName, transition] of state.transitions.entries()) {
			output += `${stateName} -> ${transition.destination}`;
			const attrs = [`label="${transitionName}"`];
			if (transition.onTransition?.length) {
				attrs.push("color=blue");
				attrs.push("fontcolor=blue");
			}
			output += `[${attrs.join(" ")}]\n`;
		}
	}
	output += "}";
	return output;
}

export { graph };
