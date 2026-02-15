class EventManager {
	constructor () {
		this._events = {};
	};

	on (eventName, handler) {
		if (!Array.isArray(this._events[eventName])) this._events[eventName] = [];
		this._events[eventName].push(handler);
	};

	clearEvent (eventName) {
		delete this._events[eventName];
	};

	_emit (eventName, ...args) {
		if (!this._events.hasOwnProperty(eventName)) return;
		for (let handler of this._events[eventName]) handler(...args);
	};
};