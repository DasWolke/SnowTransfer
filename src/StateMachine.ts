import EventEmitter = require("events");

import type { SMHistory, SMState, SMTransition } from "./Types";

interface StateMachineEvents {
	enter: [string];
}

/**
 * Class used to define states code is expected to be in and transitions to other states and code to run during those transitions and states
 * @since 0.16.0
 */
class StateMachine extends EventEmitter<StateMachineEvents> {
	public readonly states = new Map<string, SMState>();
	private editable = true;
	private readonly deferredTransitionCreators: Array<() => unknown> = [];
	private readonly history: Array<SMHistory> = [];

	/**
	 * Create a new StateMachine
	 * @param currentStateName The state this state machine is currently in. When constructing the StateMachine, this is the entry state.
	 */
	public constructor(public currentStateName: string) {
		super();
		this.deferredTransitionCreators.push(() => {
			if (!this.states.has(currentStateName)) {
				this.defineState(currentStateName);
			}
		});
	}

	/**
	 * Helper function that throws an Error when something tries to edit the state machine after it has been frozen/finalized.
	 * @since 0.16.0
	 */
	public guardEditable() {
		if (!this.editable) throw new Error("tried to edit state machine after machine has been frozen");
	}

	/**
	 * Helper function that throws an Error when something tries to use the state machine before it has been frozen/finalized.
	 * @since 0.16.0
	 */
	public guardNotEditable() {
		if (this.editable) throw new Error("tried to do transition before machine has been frozen");
	}

	/**
	 * Define a state in the state machine.
	 * @since 0.16.0
	 * @param name The name of the state.
	 * @param cbs Callbacks for points during transitions relating to this state as well as transitions to other states.
	 */
	public defineState(name: string, cbs: { onEnter: SMState["onEnter"], onLeave: SMState["onLeave"], transitions: Map<string, SMTransition> } = { onEnter: [], onLeave: [], transitions: new Map() }): this {
		this.guardEditable();
		if (this.states.has(name)) throw new Error(`attempt to redefine state ${name}, please edit it instead`);
		this.states.set(name, {
			onEnter: cbs.onEnter,
			onLeave: cbs.onLeave,
			transitions: cbs.transitions
		});
		return this;
	}

	/**
	 * Define a transition between 2 states in the state machine.
	 * @since 0.16.0
	 * @param from The name of the state this transition would come from.
	 * @param event The event that can trigger this transition.
	 * @param to The name of the state this transition would go to.
	 * @param cb A callback to run when this transition occurs.
	 */
	public defineTransition(from: string, event: string, to: string, cb?: (...args: any[]) => unknown): this {
		this.guardEditable();
		const state = this.states.get(from)!;
		if (state.transitions.has(event)) throw new Error(`attempt to redefine transition ${from} --${event}--> *, please only create transitions once`);
		const onTransition: SMTransition["onTransition"] = [];
		if (cb) onTransition.push(cb);
		state.transitions.set(event, { destination: to, onTransition });
		return this;
	}

	/**
	 * Define a transition from every state to another state in the state machine.
	 * @since 0.16.0
	 * @param event The event that can trigger this transition.
	 * @param to The name of the state this transition would go to.
	 */
	public defineUniversalTransition(event: string, to: string): this {
		this.guardEditable();
		this.deferredTransitionCreators.push(() => {
			for (const [stateName, state] of this.states.entries()) {
				if (!state.transitions.has(event)) {
					this.defineTransition(stateName, event, to);
				}
			}
		});
		return this;
	}

	/**
	 * Finalize the state machine, making its states and transitions now readonly and usable.
	 * @since 0.16.0
	 */
	public freeze() {
		this.guardEditable();

		// Add deferred transitions
		for (const cb of this.deferredTransitionCreators) {
			cb();
		}

		// Check consistency
		const problems: Array<string> = [];
		for (const [stateName, state] of this.states.entries()) {
			for (const [transitionName, transition] of state.transitions.entries()) {
				if (!this.states.has(transition.destination)) {
					problems.push(`transition ${stateName} --${transitionName}--> ${transition.destination} has an invalid destination`);
				}
			}
		}
		if (problems.length) {
			throw new Error(`Consistency problems in state machine: ${problems.join(";")}`);
		}

		this.editable = false;
	}

	/**
	 * Trigger an event to do a transition from the current state to another as defined previously.
	 *
	 * Will throw an Error if there is no transition from the current state to another based off the event.
	 * @since 0.16.0
	 * @param event The event that occured.
	 * @param args Arguments to pass to the callback of the transition's onTransition functions if any.
	 */
	public doTransition(event: string, ...args: any[]): void {
		this.guardNotEditable();
		const from = this.currentStateName;
		const currentState = this.states.get(this.currentStateName)!;
		const transition = currentState.transitions.get(event);
		if (!transition) throw new Error(`undefined transition: ${this.currentStateName} -> ${event} -> ?`);

		this.history.push({ from, event, to: transition.destination, time: Date.now() });
		if (this.history.length > 20) this.history.shift();

		// Leave state
		for (const cb of this.states.get(this.currentStateName)!.onLeave) {
			try {
				cb(event);
			} catch (e) {
				this.debug();
				throw new Error(`onLeave callback for state ${from} (during transition ${from} --${event}--> ${transition.destination})`, {cause: e});
			}
		}

		// Do transition
		this.currentStateName = transition.destination;
		for (const cb of transition.onTransition ?? []) {
			try {
				cb(...args);
			} catch (e) {
				this.debug();
				throw new Error(`onTransition callback during ${from} --${event}--> ${transition.destination}`, {cause: e});
			}
		}

		// Enter state
		this.emit("enter", this.currentStateName);
		for (const cb of this.states.get(this.currentStateName)!.onEnter) {
			try {
				cb(event);
			} catch (e) {
				this.debug();
				throw new Error(`onEnter callback for state ${from} (during transition ${this.currentStateName} --${event}--> ${transition.destination})`, {cause: e});
			}
		}
	}

	/**
	 * Trigger an event to do a transition from the current state to another as defined previously at a later point in time.
	 *
	 * Will throw an Error if there is no transition from the current state to another based off the event.
	 * @since 0.16.0
	 * @param event The event that occured.
	 * @param delayMs The time in milliseconds this transition will run in.
	 * @param args Arguments to pass to the callback of the transition's onTransition functions if any.
	 */
	public doTransitionLater(event: string, delayMs: number, ...args: Array<any>): void {
		this.guardNotEditable();
		const timer = setTimeout(() => {
			this.doTransition(event, ...args);
		}, delayMs);
		this.once("enter", () => {
			clearTimeout(timer);
		});
	}

	/**
	 * Print debug info about this state machine to stdout in the form of a table.
	 * @since 0.16.0
	 */
	public debug(): void {
		console.table(this.history.map(h => ({
			"At": new Date(h.time),
			"From -->": h.from,
			"-- Event -->": h.event,
			"--> To": h.to
		})).concat({
			"At": new Date(),
			"From -->": this.currentStateName,
			"-- Event -->": "(debug)",
			"--> To": ""
		}));
	}
}


export = StateMachine;
