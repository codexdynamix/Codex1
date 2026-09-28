import { i as __toESM, t as __commonJSMin } from "../../_runtime.mjs";
import { n as icon, r as parse$1, t as config$1 } from "./fontawesome-svg-core+[...].mjs";
//#region node_modules/react/cjs/react.production.js
/**
* @license React
* react.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_PORTAL_TYPE = Symbol.for("react.portal");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	var REACT_STRICT_MODE_TYPE = Symbol.for("react.strict_mode");
	var REACT_PROFILER_TYPE = Symbol.for("react.profiler");
	var REACT_CONSUMER_TYPE = Symbol.for("react.consumer");
	var REACT_CONTEXT_TYPE = Symbol.for("react.context");
	var REACT_FORWARD_REF_TYPE = Symbol.for("react.forward_ref");
	var REACT_SUSPENSE_TYPE = Symbol.for("react.suspense");
	var REACT_MEMO_TYPE = Symbol.for("react.memo");
	var REACT_LAZY_TYPE = Symbol.for("react.lazy");
	var REACT_ACTIVITY_TYPE = Symbol.for("react.activity");
	var REACT_VIEW_TRANSITION_TYPE = Symbol.for("react.view_transition");
	var MAYBE_ITERATOR_SYMBOL = Symbol.iterator;
	function getIteratorFn(maybeIterable) {
		if (null === maybeIterable || "object" !== typeof maybeIterable) return null;
		maybeIterable = MAYBE_ITERATOR_SYMBOL && maybeIterable[MAYBE_ITERATOR_SYMBOL] || maybeIterable["@@iterator"];
		return "function" === typeof maybeIterable ? maybeIterable : null;
	}
	var ReactNoopUpdateQueue = {
		isMounted: function() {
			return !1;
		},
		enqueueForceUpdate: function() {},
		enqueueReplaceState: function() {},
		enqueueSetState: function() {}
	};
	var assign = Object.assign;
	var emptyObject = {};
	function Component(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	Component.prototype.isReactComponent = {};
	Component.prototype.setState = function(partialState, callback) {
		if ("object" !== typeof partialState && "function" !== typeof partialState && null != partialState) throw Error("takes an object of state variables to update or a function which returns an object of state variables.");
		this.updater.enqueueSetState(this, partialState, callback, "setState");
	};
	Component.prototype.forceUpdate = function(callback) {
		this.updater.enqueueForceUpdate(this, callback, "forceUpdate");
	};
	function ComponentDummy() {}
	ComponentDummy.prototype = Component.prototype;
	function PureComponent(props, context, updater) {
		this.props = props;
		this.context = context;
		this.refs = emptyObject;
		this.updater = updater || ReactNoopUpdateQueue;
	}
	var pureComponentPrototype = PureComponent.prototype = new ComponentDummy();
	pureComponentPrototype.constructor = PureComponent;
	assign(pureComponentPrototype, Component.prototype);
	pureComponentPrototype.isPureReactComponent = !0;
	var isArrayImpl = Array.isArray;
	function noop() {}
	var ReactSharedInternals = {
		H: null,
		A: null,
		T: null,
		S: null
	};
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	function ReactElement(type, key, props) {
		var refProp = props.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== refProp ? refProp : null,
			props
		};
	}
	function cloneAndReplaceKey(oldElement, newKey) {
		return ReactElement(oldElement.type, newKey, oldElement.props);
	}
	function isValidElement(object) {
		return "object" === typeof object && null !== object && object.$$typeof === REACT_ELEMENT_TYPE;
	}
	function escape(key) {
		var escaperLookup = {
			"=": "=0",
			":": "=2"
		};
		return "$" + key.replace(/[=:]/g, function(match) {
			return escaperLookup[match];
		});
	}
	var userProvidedKeyEscapeRegex = /\/+/g;
	function getElementKey(element, index) {
		return "object" === typeof element && null !== element && null != element.key ? escape("" + element.key) : index.toString(36);
	}
	function resolveThenable(thenable) {
		switch (thenable.status) {
			case "fulfilled": return thenable.value;
			case "rejected": throw thenable.reason;
			default: switch ("string" === typeof thenable.status ? thenable.then(noop, noop) : (thenable.status = "pending", thenable.then(function(fulfilledValue) {
				"pending" === thenable.status && (thenable.status = "fulfilled", thenable.value = fulfilledValue);
			}, function(error) {
				"pending" === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			})), thenable.status) {
				case "fulfilled": return thenable.value;
				case "rejected": throw thenable.reason;
			}
		}
		throw thenable;
	}
	function mapIntoArray(children, array, escapedPrefix, nameSoFar, callback) {
		var type = typeof children;
		if ("undefined" === type || "boolean" === type) children = null;
		var invokeCallback = !1;
		if (null === children) invokeCallback = !0;
		else switch (type) {
			case "bigint":
			case "string":
			case "number":
				invokeCallback = !0;
				break;
			case "object": switch (children.$$typeof) {
				case REACT_ELEMENT_TYPE:
				case REACT_PORTAL_TYPE:
					invokeCallback = !0;
					break;
				case REACT_LAZY_TYPE: return invokeCallback = children._init, mapIntoArray(invokeCallback(children._payload), array, escapedPrefix, nameSoFar, callback);
			}
		}
		if (invokeCallback) return callback = callback(children), invokeCallback = "" === nameSoFar ? "." + getElementKey(children, 0) : nameSoFar, isArrayImpl(callback) ? (escapedPrefix = "", null != invokeCallback && (escapedPrefix = invokeCallback.replace(userProvidedKeyEscapeRegex, "$&/") + "/"), mapIntoArray(callback, array, escapedPrefix, "", function(c) {
			return c;
		})) : null != callback && (isValidElement(callback) && (callback = cloneAndReplaceKey(callback, escapedPrefix + (null == callback.key || children && children.key === callback.key ? "" : ("" + callback.key).replace(userProvidedKeyEscapeRegex, "$&/") + "/") + invokeCallback)), array.push(callback)), 1;
		invokeCallback = 0;
		var nextNamePrefix = "" === nameSoFar ? "." : nameSoFar + ":";
		if (isArrayImpl(children)) for (var i = 0; i < children.length; i++) nameSoFar = children[i], type = nextNamePrefix + getElementKey(nameSoFar, i), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if (i = getIteratorFn(children), "function" === typeof i) for (children = i.call(children), i = 0; !(nameSoFar = children.next()).done;) nameSoFar = nameSoFar.value, type = nextNamePrefix + getElementKey(nameSoFar, i++), invokeCallback += mapIntoArray(nameSoFar, array, escapedPrefix, type, callback);
		else if ("object" === type) {
			if ("function" === typeof children.then) return mapIntoArray(resolveThenable(children), array, escapedPrefix, nameSoFar, callback);
			array = String(children);
			throw Error("Objects are not valid as a React child (found: " + ("[object Object]" === array ? "object with keys {" + Object.keys(children).join(", ") + "}" : array) + "). If you meant to render a collection of children, use an array instead.");
		}
		return invokeCallback;
	}
	function mapChildren(children, func, context) {
		if (null == children) return children;
		var result = [], count = 0;
		mapIntoArray(children, result, "", "", function(child) {
			return func.call(context, child, count++);
		});
		return result;
	}
	function lazyInitializer(payload) {
		if (-1 === payload._status) {
			var ctor = payload._result, thenable = ctor();
			thenable.then(function(moduleObject) {
				if (0 === payload._status || -1 === payload._status) payload._status = 1, payload._result = moduleObject, void 0 === thenable.status && (thenable.status = "fulfilled", thenable.value = moduleObject);
			}, function(error) {
				if (0 === payload._status || -1 === payload._status) payload._status = 2, payload._result = error, void 0 === thenable.status && (thenable.status = "rejected", thenable.reason = error);
			});
			-1 === payload._status && (payload._status = 0, payload._result = thenable);
		}
		if (1 === payload._status) return payload._result.default;
		throw payload._result;
	}
	var reportGlobalError = "function" === typeof reportError ? reportError : function(error) {
		if ("object" === typeof window && "function" === typeof window.ErrorEvent) {
			var event = new window.ErrorEvent("error", {
				bubbles: !0,
				cancelable: !0,
				message: "object" === typeof error && null !== error && "string" === typeof error.message ? String(error.message) : String(error),
				error
			});
			if (!window.dispatchEvent(event)) return;
		} else if ("object" === typeof process && "function" === typeof process.emit) {
			process.emit("uncaughtException", error);
			return;
		}
		console.error(error);
	};
	function startTransition(scope) {
		var prevTransition = ReactSharedInternals.T, currentTransition = {};
		currentTransition.types = null !== prevTransition ? prevTransition.types : null;
		ReactSharedInternals.T = currentTransition;
		try {
			var returnValue = scope(), onStartTransitionFinish = ReactSharedInternals.S;
			null !== onStartTransitionFinish && onStartTransitionFinish(currentTransition, returnValue);
			"object" === typeof returnValue && null !== returnValue && "function" === typeof returnValue.then && returnValue.then(noop, reportGlobalError);
		} catch (error) {
			reportGlobalError(error);
		} finally {
			null !== prevTransition && null !== currentTransition.types && (prevTransition.types = currentTransition.types), ReactSharedInternals.T = prevTransition;
		}
	}
	function addTransitionType(type) {
		var transition = ReactSharedInternals.T;
		if (null !== transition) {
			var transitionTypes = transition.types;
			null === transitionTypes ? transition.types = [type] : -1 === transitionTypes.indexOf(type) && transitionTypes.push(type);
		} else startTransition(addTransitionType.bind(null, type));
	}
	var Children = {
		map: mapChildren,
		forEach: function(children, forEachFunc, forEachContext) {
			mapChildren(children, function() {
				forEachFunc.apply(this, arguments);
			}, forEachContext);
		},
		count: function(children) {
			var n = 0;
			mapChildren(children, function() {
				n++;
			});
			return n;
		},
		toArray: function(children) {
			return mapChildren(children, function(child) {
				return child;
			}) || [];
		},
		only: function(children) {
			if (!isValidElement(children)) throw Error("React.Children.only expected to receive a single React element child.");
			return children;
		}
	};
	exports.Activity = REACT_ACTIVITY_TYPE;
	exports.Children = Children;
	exports.Component = Component;
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.Profiler = REACT_PROFILER_TYPE;
	exports.PureComponent = PureComponent;
	exports.StrictMode = REACT_STRICT_MODE_TYPE;
	exports.Suspense = REACT_SUSPENSE_TYPE;
	exports.ViewTransition = REACT_VIEW_TRANSITION_TYPE;
	exports.__CLIENT_INTERNALS_DO_NOT_USE_OR_WARN_USERS_THEY_CANNOT_UPGRADE = ReactSharedInternals;
	exports.__COMPILER_RUNTIME = {
		__proto__: null,
		c: function(size) {
			return ReactSharedInternals.H.useMemoCache(size);
		}
	};
	exports.addTransitionType = addTransitionType;
	exports.cache = function(fn) {
		return function() {
			return fn.apply(null, arguments);
		};
	};
	exports.cacheSignal = function() {
		return null;
	};
	exports.cloneElement = function(element, config, children) {
		if (null === element || void 0 === element) throw Error("The argument must be a React element, but you passed " + element + ".");
		var props = assign({}, element.props), key = element.key;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) !hasOwnProperty.call(config, propName) || "key" === propName || "__self" === propName || "__source" === propName || "ref" === propName && void 0 === config.ref || (props[propName] = config[propName]);
		var propName = arguments.length - 2;
		if (1 === propName) props.children = children;
		else if (1 < propName) {
			for (var childArray = Array(propName), i = 0; i < propName; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		return ReactElement(element.type, key, props);
	};
	exports.createContext = function(defaultValue) {
		defaultValue = {
			$$typeof: REACT_CONTEXT_TYPE,
			_currentValue: defaultValue,
			_currentValue2: defaultValue,
			_threadCount: 0,
			Provider: null,
			Consumer: null
		};
		defaultValue.Provider = defaultValue;
		defaultValue.Consumer = {
			$$typeof: REACT_CONSUMER_TYPE,
			_context: defaultValue
		};
		return defaultValue;
	};
	exports.createElement = function(type, config, children) {
		var propName, props = {}, key = null;
		if (null != config) for (propName in void 0 !== config.key && (key = "" + config.key), config) hasOwnProperty.call(config, propName) && "key" !== propName && "__self" !== propName && "__source" !== propName && (props[propName] = config[propName]);
		var childrenLength = arguments.length - 2;
		if (1 === childrenLength) props.children = children;
		else if (1 < childrenLength) {
			for (var childArray = Array(childrenLength), i = 0; i < childrenLength; i++) childArray[i] = arguments[i + 2];
			props.children = childArray;
		}
		if (type && type.defaultProps) for (propName in childrenLength = type.defaultProps, childrenLength) void 0 === props[propName] && (props[propName] = childrenLength[propName]);
		return ReactElement(type, key, props);
	};
	exports.createRef = function() {
		return { current: null };
	};
	exports.forwardRef = function(render) {
		return {
			$$typeof: REACT_FORWARD_REF_TYPE,
			render
		};
	};
	exports.isValidElement = isValidElement;
	exports.lazy = function(ctor) {
		return {
			$$typeof: REACT_LAZY_TYPE,
			_payload: {
				_status: -1,
				_result: ctor
			},
			_init: lazyInitializer
		};
	};
	exports.memo = function(type, compare) {
		return {
			$$typeof: REACT_MEMO_TYPE,
			type,
			compare: void 0 === compare ? null : compare
		};
	};
	exports.startTransition = startTransition;
	exports.unstable_useCacheRefresh = function() {
		return ReactSharedInternals.H.useCacheRefresh();
	};
	exports.use = function(usable) {
		return ReactSharedInternals.H.use(usable);
	};
	exports.useActionState = function(action, initialState, permalink) {
		return ReactSharedInternals.H.useActionState(action, initialState, permalink);
	};
	exports.useCallback = function(callback, deps) {
		return ReactSharedInternals.H.useCallback(callback, deps);
	};
	exports.useContext = function(Context) {
		return ReactSharedInternals.H.useContext(Context);
	};
	exports.useDebugValue = function() {};
	exports.useDeferredValue = function(value, initialValue) {
		return ReactSharedInternals.H.useDeferredValue(value, initialValue);
	};
	exports.useEffect = function(create, deps) {
		return ReactSharedInternals.H.useEffect(create, deps);
	};
	exports.useEffectEvent = function(callback) {
		return ReactSharedInternals.H.useEffectEvent(callback);
	};
	exports.useId = function() {
		return ReactSharedInternals.H.useId();
	};
	exports.useImperativeHandle = function(ref, create, deps) {
		return ReactSharedInternals.H.useImperativeHandle(ref, create, deps);
	};
	exports.useInsertionEffect = function(create, deps) {
		return ReactSharedInternals.H.useInsertionEffect(create, deps);
	};
	exports.useLayoutEffect = function(create, deps) {
		return ReactSharedInternals.H.useLayoutEffect(create, deps);
	};
	exports.useMemo = function(create, deps) {
		return ReactSharedInternals.H.useMemo(create, deps);
	};
	exports.useOptimistic = function(passthrough, reducer) {
		return ReactSharedInternals.H.useOptimistic(passthrough, reducer);
	};
	exports.useReducer = function(reducer, initialArg, init) {
		return ReactSharedInternals.H.useReducer(reducer, initialArg, init);
	};
	exports.useRef = function(initialValue) {
		return ReactSharedInternals.H.useRef(initialValue);
	};
	exports.useState = function(initialState) {
		return ReactSharedInternals.H.useState(initialState);
	};
	exports.useSyncExternalStore = function(subscribe, getSnapshot, getServerSnapshot) {
		return ReactSharedInternals.H.useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
	};
	exports.useTransition = function() {
		return ReactSharedInternals.H.useTransition();
	};
	exports.version = "19.3.0";
}));
//#endregion
//#region node_modules/react/index.js
var require_react = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_production();
}));
//#endregion
//#region node_modules/react/cjs/react-jsx-runtime.production.js
/**
* @license React
* react-jsx-runtime.production.js
*
* Copyright (c) Meta Platforms, Inc. and affiliates.
*
* This source code is licensed under the MIT license found in the
* LICENSE file in the root directory of this source tree.
*/
var require_react_jsx_runtime_production = /* @__PURE__ */ __commonJSMin(((exports) => {
	var REACT_ELEMENT_TYPE = Symbol.for("react.transitional.element");
	var REACT_FRAGMENT_TYPE = Symbol.for("react.fragment");
	function jsxProd(type, config, maybeKey) {
		var key = null;
		void 0 !== maybeKey && (key = "" + maybeKey);
		void 0 !== config.key && (key = "" + config.key);
		if ("key" in config) {
			maybeKey = {};
			for (var propName in config) "key" !== propName && (maybeKey[propName] = config[propName]);
		} else maybeKey = config;
		config = maybeKey.ref;
		return {
			$$typeof: REACT_ELEMENT_TYPE,
			type,
			key,
			ref: void 0 !== config ? config : null,
			props: maybeKey
		};
	}
	exports.Fragment = REACT_FRAGMENT_TYPE;
	exports.jsx = jsxProd;
	exports.jsxs = jsxProd;
}));
//#endregion
//#region node_modules/react/jsx-runtime.js
var require_jsx_runtime = /* @__PURE__ */ __commonJSMin(((exports, module) => {
	module.exports = require_react_jsx_runtime_production();
}));
//#endregion
//#region node_modules/@fortawesome/react-fontawesome/dist/index.js
var import_react = /* @__PURE__ */ __toESM(require_react(), 1);
require_jsx_runtime();
function _isNumerical(object) {
	object = object - 0;
	return object === object;
}
function camelize(string) {
	if (_isNumerical(string)) return string;
	string = string.replace(/[_-]+(.)?/g, (_, chr) => {
		return chr ? chr.toUpperCase() : "";
	});
	return string.charAt(0).toLowerCase() + string.slice(1);
}
var createGradientStops = (stop, index) => import_react.createElement("stop", {
	key: `${index}-${stop.offset}`,
	offset: stop.offset,
	stopColor: stop.color,
	...stop.opacity !== void 0 && { stopOpacity: stop.opacity }
});
function capitalize(val) {
	return val.charAt(0).toUpperCase() + val.slice(1);
}
var styleCache = /* @__PURE__ */ new Map();
var STYLE_CACHE_LIMIT = 1e3;
function styleToObject(style) {
	if (styleCache.has(style)) return styleCache.get(style);
	const result = {};
	let start = 0;
	const len = style.length;
	while (start < len) {
		const semicolonIndex = style.indexOf(";", start);
		const end = semicolonIndex === -1 ? len : semicolonIndex;
		const pair = style.slice(start, end).trim();
		if (pair) {
			const colonIndex = pair.indexOf(":");
			if (colonIndex > 0) {
				const rawProp = pair.slice(0, colonIndex).trim();
				const value = pair.slice(colonIndex + 1).trim();
				if (rawProp && value) {
					const prop = camelize(rawProp);
					result[prop.startsWith("webkit") ? capitalize(prop) : prop] = value;
				}
			}
		}
		start = end + 1;
	}
	if (styleCache.size === STYLE_CACHE_LIMIT) {
		const oldestKey = styleCache.keys().next().value;
		if (oldestKey) styleCache.delete(oldestKey);
	}
	styleCache.set(style, result);
	return result;
}
function convert(createElement, element, extraProps = {}) {
	if (typeof element === "string") return element;
	const children = (element.children || []).map((child) => {
		let element2 = child;
		if (("fill" in extraProps || extraProps.gradientFill) && child.tag === "path" && "fill" in child.attributes) element2 = {
			...child,
			attributes: {
				...child.attributes,
				fill: void 0
			}
		};
		return convert(createElement, element2);
	});
	const elementAttributes = element.attributes || {};
	const attrs = {};
	for (const [key, val] of Object.entries(elementAttributes)) switch (true) {
		case key === "class":
			attrs.className = val;
			break;
		case key === "style":
			attrs.style = styleToObject(String(val));
			break;
		case key.startsWith("aria-"):
		case key.startsWith("data-"):
			attrs[key.toLowerCase()] = val;
			break;
		default: attrs[camelize(key)] = val;
	}
	const { style: existingStyle, role: existingRole, "aria-label": ariaLabel, gradientFill, ...remaining } = extraProps;
	if (existingStyle) attrs.style = attrs.style ? {
		...attrs.style,
		...existingStyle
	} : existingStyle;
	if (existingRole) attrs.role = existingRole;
	if (ariaLabel) {
		attrs["aria-label"] = ariaLabel;
		attrs["aria-hidden"] = "false";
	}
	if (gradientFill) {
		attrs.fill = `url(#${gradientFill.id})`;
		const { type: gradientType, stops: gradientStops = [], ...gradientProps } = gradientFill;
		children.unshift(createElement(gradientType === "linear" ? "linearGradient" : "radialGradient", {
			...gradientProps,
			id: gradientFill.id
		}, gradientStops.map(createGradientStops)));
	}
	return createElement(element.tag, {
		...attrs,
		...remaining
	}, ...children);
}
var makeReactConverter = convert.bind(null, import_react.createElement);
var useAccessibilityId = (id, hasAccessibleProps) => {
	const generatedId = (0, import_react.useId)();
	return id || (hasAccessibleProps ? generatedId : void 0);
};
var Logger = class {
	constructor(scope = "react-fontawesome") {
		this.enabled = false;
		let IS_DEV = false;
		try {
			IS_DEV = typeof process !== "undefined" && false;
		} catch {}
		this.scope = scope;
		this.enabled = IS_DEV;
	}
	/**
	* Logs messages to the console if not in production.
	* @param args - The message and/or data to log.
	*/
	log(...args) {
		if (!this.enabled) return;
		console.log(`[${this.scope}]`, ...args);
	}
	/**
	* Logs warnings to the console if not in production.
	* @param args - The warning message and/or data to log.
	*/
	warn(...args) {
		if (!this.enabled) return;
		console.warn(`[${this.scope}]`, ...args);
	}
	/**
	* Logs errors to the console if not in production.
	* @param args - The error message and/or data to log.
	*/
	error(...args) {
		if (!this.enabled) return;
		console.error(`[${this.scope}]`, ...args);
	}
};
typeof process !== "undefined" && process.env?.FA_VERSION;
var SVG_CORE_VERSION = "searchPseudoElementsFullScan" in config$1 && typeof config$1.searchPseudoElementsFullScan === "boolean" ? "7.0.0" : "6.0.0";
var IS_VERSION_7_OR_LATER = Number.parseInt(SVG_CORE_VERSION) >= 7;
var getIsVersion7OrLater = () => IS_VERSION_7_OR_LATER;
var DEFAULT_CLASSNAME_PREFIX = "fa";
var ANIMATION_CLASSES = {
	beat: "fa-beat",
	fade: "fa-fade",
	beatFade: "fa-beat-fade",
	bounce: "fa-bounce",
	shake: "fa-shake",
	spin: "fa-spin",
	spinPulse: "fa-spin-pulse",
	spinReverse: "fa-spin-reverse",
	pulse: "fa-pulse",
	flip360: "fa-flip-360",
	buzz: "fa-buzz",
	float: "fa-float",
	jello: "fa-jello",
	spinSnap: "fa-spin-snap",
	spinSnap4: "fa-spin-snap-4",
	spinSnap8: "fa-spin-snap-8",
	swing: "fa-swing",
	wag: "fa-wag"
};
var PULL_CLASSES = {
	left: "fa-pull-left",
	right: "fa-pull-right"
};
var ROTATE_CLASSES = {
	"90": "fa-rotate-90",
	"180": "fa-rotate-180",
	"270": "fa-rotate-270"
};
var SIZE_CLASSES = {
	"2xs": "fa-2xs",
	xs: "fa-xs",
	sm: "fa-sm",
	lg: "fa-lg",
	xl: "fa-xl",
	"2xl": "fa-2xl",
	"1x": "fa-1x",
	"2x": "fa-2x",
	"3x": "fa-3x",
	"4x": "fa-4x",
	"5x": "fa-5x",
	"6x": "fa-6x",
	"7x": "fa-7x",
	"8x": "fa-8x",
	"9x": "fa-9x",
	"10x": "fa-10x"
};
var STYLE_CLASSES = {
	border: "fa-border",
	/** @deprecated */
	fixedWidth: "fa-fw",
	flip: "fa-flip",
	flipHorizontal: "fa-flip-horizontal",
	flipVertical: "fa-flip-vertical",
	inverse: "fa-inverse",
	rotateBy: "fa-rotate-by",
	swapOpacity: "fa-swap-opacity",
	widthAuto: "fa-width-auto",
	canvasSquare: "fa-canvas-square",
	canvasRoomy: "fa-canvas-roomy"
};
var LAYER_CLASSES = { default: "fa-layers" };
function withPrefix(cls) {
	const prefix = config$1.cssPrefix || config$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX;
	return prefix === DEFAULT_CLASSNAME_PREFIX ? cls : cls.replace(new RegExp(String.raw`(?<=^|\s)${DEFAULT_CLASSNAME_PREFIX}-`, "g"), `${prefix}-`);
}
function getClassListFromProps(props) {
	const { beat, fade, beatFade, bounce, shake, spin, spinPulse, spinReverse, pulse, fixedWidth, inverse, border, flip, size, rotation, pull, swapOpacity, rotateBy, widthAuto, canvasSquare, canvasRoomy, flip360, buzz, float, jello, spinSnap, spinSnap4, spinSnap8, swing, wag, className } = props;
	const result = [];
	if (className) result.push(...className.split(" "));
	if (beat) result.push(ANIMATION_CLASSES.beat);
	if (fade) result.push(ANIMATION_CLASSES.fade);
	if (beatFade) result.push(ANIMATION_CLASSES.beatFade);
	if (bounce) result.push(ANIMATION_CLASSES.bounce);
	if (shake) result.push(ANIMATION_CLASSES.shake);
	if (spin) result.push(ANIMATION_CLASSES.spin);
	if (spinReverse) result.push(ANIMATION_CLASSES.spinReverse);
	if (spinPulse) result.push(ANIMATION_CLASSES.spinPulse);
	if (pulse) result.push(ANIMATION_CLASSES.pulse);
	if (fixedWidth) result.push(STYLE_CLASSES.fixedWidth);
	if (inverse) result.push(STYLE_CLASSES.inverse);
	if (border) result.push(STYLE_CLASSES.border);
	if (flip === true) result.push(STYLE_CLASSES.flip);
	if (flip === "horizontal" || flip === "both") result.push(STYLE_CLASSES.flipHorizontal);
	if (flip === "vertical" || flip === "both") result.push(STYLE_CLASSES.flipVertical);
	if (size !== void 0 && size !== null) result.push(SIZE_CLASSES[size]);
	if (rotation !== void 0 && rotation !== null && rotation !== 0) result.push(ROTATE_CLASSES[rotation]);
	if (pull !== void 0 && pull !== null) result.push(PULL_CLASSES[pull]);
	if (swapOpacity) result.push(STYLE_CLASSES.swapOpacity);
	if (!getIsVersion7OrLater()) return result;
	if (rotateBy) result.push(STYLE_CLASSES.rotateBy);
	if (widthAuto) result.push(STYLE_CLASSES.widthAuto);
	if (canvasSquare) result.push(STYLE_CLASSES.canvasSquare);
	if (canvasRoomy) result.push(STYLE_CLASSES.canvasRoomy);
	if (flip360) result.push(ANIMATION_CLASSES.flip360);
	if (buzz) result.push(ANIMATION_CLASSES.buzz);
	if (float) result.push(ANIMATION_CLASSES.float);
	if (jello) result.push(ANIMATION_CLASSES.jello);
	if (spinSnap) result.push(ANIMATION_CLASSES.spinSnap);
	if (spinSnap4) result.push(ANIMATION_CLASSES.spinSnap4);
	if (spinSnap8) result.push(ANIMATION_CLASSES.spinSnap8);
	if (swing) result.push(ANIMATION_CLASSES.swing);
	if (wag) result.push(ANIMATION_CLASSES.wag);
	return (config$1.cssPrefix || config$1.familyPrefix || DEFAULT_CLASSNAME_PREFIX) === DEFAULT_CLASSNAME_PREFIX ? result : result.map(withPrefix);
}
var isIconDefinition = (icon) => typeof icon === "object" && "icon" in icon && !!icon.icon;
function normalizeIconArgs(icon) {
	if (!icon) return;
	if (isIconDefinition(icon)) return icon;
	return parse$1.icon(icon);
}
function typedObjectKeys(obj) {
	return Object.keys(obj);
}
var logger = new Logger("FontAwesomeIcon");
var DEFAULT_PROPS = {
	border: false,
	className: "",
	mask: void 0,
	maskId: void 0,
	fixedWidth: false,
	inverse: false,
	flip: false,
	icon: void 0,
	listItem: false,
	pull: void 0,
	pulse: false,
	rotation: void 0,
	rotateBy: false,
	size: void 0,
	spin: false,
	spinPulse: false,
	spinReverse: false,
	beat: false,
	fade: false,
	beatFade: false,
	bounce: false,
	shake: false,
	symbol: false,
	title: "",
	titleId: void 0,
	transform: void 0,
	swapOpacity: false,
	widthAuto: false,
	canvasSquare: false,
	canvasRoomy: false,
	flip360: false,
	buzz: false,
	float: false,
	jello: false,
	spinSnap: false,
	spinSnap4: false,
	spinSnap8: false,
	swing: false,
	wag: false
};
var DEFAULT_PROP_KEYS = new Set(Object.keys(DEFAULT_PROPS));
var FontAwesomeIcon = import_react.forwardRef((props, ref) => {
	const allProps = {
		...DEFAULT_PROPS,
		...props
	};
	const { icon: iconArgs, mask: maskArgs, symbol, title, titleId: titleIdFromProps, maskId: maskIdFromProps, transform } = allProps;
	const maskId = useAccessibilityId(maskIdFromProps, Boolean(maskArgs));
	const titleId = useAccessibilityId(titleIdFromProps, Boolean(title));
	const iconLookup = normalizeIconArgs(iconArgs);
	if (!iconLookup) {
		logger.error("Icon lookup is undefined", iconArgs);
		return null;
	}
	const classList = getClassListFromProps(allProps);
	const transformProps = typeof transform === "string" ? parse$1.transform(transform) : transform;
	const normalizedMaskArgs = normalizeIconArgs(maskArgs);
	const renderedIcon = icon(iconLookup, {
		...classList.length > 0 && { classes: classList },
		...transformProps && { transform: transformProps },
		...normalizedMaskArgs && { mask: normalizedMaskArgs },
		symbol,
		title,
		titleId,
		maskId
	});
	if (!renderedIcon) {
		logger.error("Could not find icon", iconLookup);
		return null;
	}
	const { abstract } = renderedIcon;
	const extraProps = { ref };
	for (const key of typedObjectKeys(allProps)) {
		if (DEFAULT_PROP_KEYS.has(key)) continue;
		extraProps[key] = allProps[key];
	}
	return makeReactConverter(abstract[0], extraProps);
});
FontAwesomeIcon.displayName = "FontAwesomeIcon";
`${LAYER_CLASSES.default}${STYLE_CLASSES.fixedWidth}`;
//#endregion
export { require_jsx_runtime as n, require_react as r, FontAwesomeIcon as t };
