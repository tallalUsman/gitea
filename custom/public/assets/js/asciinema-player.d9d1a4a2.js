"use strict";
(self["webpackChunk"] = self["webpackChunk"] || []).push([["asciinema-player"],{

/***/ "./node_modules/asciinema-player/dist/index.js":
/*!*****************************************************!*\
  !*** ./node_modules/asciinema-player/dist/index.js ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
/* harmony export */ __webpack_require__.d(__webpack_exports__, {
/* harmony export */   create: function() { return /* binding */ create; }
/* harmony export */ });
const sharedConfig = {};
function setHydrateContext(context) {
  sharedConfig.context = context;
}

const equalFn = (a, b) => a === b;
const $PROXY = Symbol("solid-proxy");
const $TRACK = Symbol("solid-track");
const signalOptions = {
  equals: equalFn
};
let runEffects = runQueue;
const STALE = 1;
const PENDING = 2;
const UNOWNED = {
  owned: null,
  cleanups: null,
  context: null,
  owner: null
};
var Owner = null;
let Transition = null;
let Listener = null;
let Updates = null;
let Effects = null;
let ExecCount = 0;
function createRoot(fn, detachedOwner) {
  const listener = Listener,
    owner = Owner,
    unowned = fn.length === 0,
    root = unowned ? UNOWNED : {
      owned: null,
      cleanups: null,
      context: null,
      owner: detachedOwner === undefined ? owner : detachedOwner
    },
    updateFn = unowned ? fn : () => fn(() => untrack(() => cleanNode(root)));
  Owner = root;
  Listener = null;
  try {
    return runUpdates(updateFn, true);
  } finally {
    Listener = listener;
    Owner = owner;
  }
}
function createSignal(value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const s = {
    value,
    observers: null,
    observerSlots: null,
    comparator: options.equals || undefined
  };
  const setter = value => {
    if (typeof value === "function") {
      value = value(s.value);
    }
    return writeSignal(s, value);
  };
  return [readSignal.bind(s), setter];
}
function createRenderEffect(fn, value, options) {
  const c = createComputation(fn, value, false, STALE);
  updateComputation(c);
}
function createEffect(fn, value, options) {
  runEffects = runUserEffects;
  const c = createComputation(fn, value, false, STALE);
  c.user = true;
  Effects ? Effects.push(c) : updateComputation(c);
}
function createMemo(fn, value, options) {
  options = options ? Object.assign({}, signalOptions, options) : signalOptions;
  const c = createComputation(fn, value, true, 0);
  c.observers = null;
  c.observerSlots = null;
  c.comparator = options.equals || undefined;
  updateComputation(c);
  return readSignal.bind(c);
}
function batch(fn) {
  return runUpdates(fn, false);
}
function untrack(fn) {
  if (Listener === null) return fn();
  const listener = Listener;
  Listener = null;
  try {
    return fn();
  } finally {
    Listener = listener;
  }
}
function onMount(fn) {
  createEffect(() => untrack(fn));
}
function onCleanup(fn) {
  if (Owner === null) ;else if (Owner.cleanups === null) Owner.cleanups = [fn];else Owner.cleanups.push(fn);
  return fn;
}
function getListener() {
  return Listener;
}
function children(fn) {
  const children = createMemo(fn);
  const memo = createMemo(() => resolveChildren(children()));
  memo.toArray = () => {
    const c = memo();
    return Array.isArray(c) ? c : c != null ? [c] : [];
  };
  return memo;
}
function readSignal() {
  const runningTransition = Transition ;
  if (this.sources && (this.state || runningTransition )) {
    if (this.state === STALE || runningTransition ) updateComputation(this);else {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(this), false);
      Updates = updates;
    }
  }
  if (Listener) {
    const sSlot = this.observers ? this.observers.length : 0;
    if (!Listener.sources) {
      Listener.sources = [this];
      Listener.sourceSlots = [sSlot];
    } else {
      Listener.sources.push(this);
      Listener.sourceSlots.push(sSlot);
    }
    if (!this.observers) {
      this.observers = [Listener];
      this.observerSlots = [Listener.sources.length - 1];
    } else {
      this.observers.push(Listener);
      this.observerSlots.push(Listener.sources.length - 1);
    }
  }
  return this.value;
}
function writeSignal(node, value, isComp) {
  let current = node.value;
  if (!node.comparator || !node.comparator(current, value)) {
    node.value = value;
    if (node.observers && node.observers.length) {
      runUpdates(() => {
        for (let i = 0; i < node.observers.length; i += 1) {
          const o = node.observers[i];
          const TransitionRunning = Transition && Transition.running;
          if (TransitionRunning && Transition.disposed.has(o)) ;
          if (TransitionRunning && !o.tState || !TransitionRunning && !o.state) {
            if (o.pure) Updates.push(o);else Effects.push(o);
            if (o.observers) markDownstream(o);
          }
          if (TransitionRunning) ;else o.state = STALE;
        }
        if (Updates.length > 10e5) {
          Updates = [];
          if (false) {}
          throw new Error();
        }
      }, false);
    }
  }
  return value;
}
function updateComputation(node) {
  if (!node.fn) return;
  cleanNode(node);
  const owner = Owner,
    listener = Listener,
    time = ExecCount;
  Listener = Owner = node;
  runComputation(node, node.value, time);
  Listener = listener;
  Owner = owner;
}
function runComputation(node, value, time) {
  let nextValue;
  try {
    nextValue = node.fn(value);
  } catch (err) {
    if (node.pure) {
      {
        node.state = STALE;
        node.owned && node.owned.forEach(cleanNode);
        node.owned = null;
      }
    }
    handleError(err);
  }
  if (!node.updatedAt || node.updatedAt <= time) {
    if (node.updatedAt != null && "observers" in node) {
      writeSignal(node, nextValue);
    } else node.value = nextValue;
    node.updatedAt = time;
  }
}
function createComputation(fn, init, pure, state = STALE, options) {
  const c = {
    fn,
    state: state,
    updatedAt: null,
    owned: null,
    sources: null,
    sourceSlots: null,
    cleanups: null,
    value: init,
    owner: Owner,
    context: null,
    pure
  };
  if (Owner === null) ;else if (Owner !== UNOWNED) {
    {
      if (!Owner.owned) Owner.owned = [c];else Owner.owned.push(c);
    }
  }
  return c;
}
function runTop(node) {
  const runningTransition = Transition ;
  if (node.state === 0 || runningTransition ) return;
  if (node.state === PENDING || runningTransition ) return lookUpstream(node);
  if (node.suspense && untrack(node.suspense.inFallback)) return node.suspense.effects.push(node);
  const ancestors = [node];
  while ((node = node.owner) && (!node.updatedAt || node.updatedAt < ExecCount)) {
    if (node.state || runningTransition ) ancestors.push(node);
  }
  for (let i = ancestors.length - 1; i >= 0; i--) {
    node = ancestors[i];
    if (node.state === STALE || runningTransition ) {
      updateComputation(node);
    } else if (node.state === PENDING || runningTransition ) {
      const updates = Updates;
      Updates = null;
      runUpdates(() => lookUpstream(node, ancestors[0]), false);
      Updates = updates;
    }
  }
}
function runUpdates(fn, init) {
  if (Updates) return fn();
  let wait = false;
  if (!init) Updates = [];
  if (Effects) wait = true;else Effects = [];
  ExecCount++;
  try {
    const res = fn();
    completeUpdates(wait);
    return res;
  } catch (err) {
    if (!wait) Effects = null;
    Updates = null;
    handleError(err);
  }
}
function completeUpdates(wait) {
  if (Updates) {
    runQueue(Updates);
    Updates = null;
  }
  if (wait) return;
  const e = Effects;
  Effects = null;
  if (e.length) runUpdates(() => runEffects(e), false);
}
function runQueue(queue) {
  for (let i = 0; i < queue.length; i++) runTop(queue[i]);
}
function runUserEffects(queue) {
  let i,
    userLength = 0;
  for (i = 0; i < queue.length; i++) {
    const e = queue[i];
    if (!e.user) runTop(e);else queue[userLength++] = e;
  }
  if (sharedConfig.context) setHydrateContext();
  for (i = 0; i < userLength; i++) runTop(queue[i]);
}
function lookUpstream(node, ignore) {
  const runningTransition = Transition ;
  node.state = 0;
  for (let i = 0; i < node.sources.length; i += 1) {
    const source = node.sources[i];
    if (source.sources) {
      if (source.state === STALE || runningTransition ) {
        if (source !== ignore) runTop(source);
      } else if (source.state === PENDING || runningTransition ) lookUpstream(source, ignore);
    }
  }
}
function markDownstream(node) {
  const runningTransition = Transition ;
  for (let i = 0; i < node.observers.length; i += 1) {
    const o = node.observers[i];
    if (!o.state || runningTransition ) {
      o.state = PENDING;
      if (o.pure) Updates.push(o);else Effects.push(o);
      o.observers && markDownstream(o);
    }
  }
}
function cleanNode(node) {
  let i;
  if (node.sources) {
    while (node.sources.length) {
      const source = node.sources.pop(),
        index = node.sourceSlots.pop(),
        obs = source.observers;
      if (obs && obs.length) {
        const n = obs.pop(),
          s = source.observerSlots.pop();
        if (index < obs.length) {
          n.sourceSlots[s] = index;
          obs[index] = n;
          source.observerSlots[index] = s;
        }
      }
    }
  }
  if (node.owned) {
    for (i = 0; i < node.owned.length; i++) cleanNode(node.owned[i]);
    node.owned = null;
  }
  if (node.cleanups) {
    for (i = 0; i < node.cleanups.length; i++) node.cleanups[i]();
    node.cleanups = null;
  }
  node.state = 0;
  node.context = null;
}
function castError(err) {
  if (err instanceof Error || typeof err === "string") return err;
  return new Error("Unknown error");
}
function handleError(err) {
  err = castError(err);
  throw err;
}
function resolveChildren(children) {
  if (typeof children === "function" && !children.length) return resolveChildren(children());
  if (Array.isArray(children)) {
    const results = [];
    for (let i = 0; i < children.length; i++) {
      const result = resolveChildren(children[i]);
      Array.isArray(result) ? results.push.apply(results, result) : results.push(result);
    }
    return results;
  }
  return children;
}

const FALLBACK = Symbol("fallback");
function dispose(d) {
  for (let i = 0; i < d.length; i++) d[i]();
}
function mapArray(list, mapFn, options = {}) {
  let items = [],
    mapped = [],
    disposers = [],
    len = 0,
    indexes = mapFn.length > 1 ? [] : null;
  onCleanup(() => dispose(disposers));
  return () => {
    let newItems = list() || [],
      i,
      j;
    newItems[$TRACK];
    return untrack(() => {
      let newLen = newItems.length,
        newIndices,
        newIndicesNext,
        temp,
        tempdisposers,
        tempIndexes,
        start,
        end,
        newEnd,
        item;
      if (newLen === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          indexes && (indexes = []);
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
      }
      else if (len === 0) {
        mapped = new Array(newLen);
        for (j = 0; j < newLen; j++) {
          items[j] = newItems[j];
          mapped[j] = createRoot(mapper);
        }
        len = newLen;
      } else {
        temp = new Array(newLen);
        tempdisposers = new Array(newLen);
        indexes && (tempIndexes = new Array(newLen));
        for (start = 0, end = Math.min(len, newLen); start < end && items[start] === newItems[start]; start++);
        for (end = len - 1, newEnd = newLen - 1; end >= start && newEnd >= start && items[end] === newItems[newEnd]; end--, newEnd--) {
          temp[newEnd] = mapped[end];
          tempdisposers[newEnd] = disposers[end];
          indexes && (tempIndexes[newEnd] = indexes[end]);
        }
        newIndices = new Map();
        newIndicesNext = new Array(newEnd + 1);
        for (j = newEnd; j >= start; j--) {
          item = newItems[j];
          i = newIndices.get(item);
          newIndicesNext[j] = i === undefined ? -1 : i;
          newIndices.set(item, j);
        }
        for (i = start; i <= end; i++) {
          item = items[i];
          j = newIndices.get(item);
          if (j !== undefined && j !== -1) {
            temp[j] = mapped[i];
            tempdisposers[j] = disposers[i];
            indexes && (tempIndexes[j] = indexes[i]);
            j = newIndicesNext[j];
            newIndices.set(item, j);
          } else disposers[i]();
        }
        for (j = start; j < newLen; j++) {
          if (j in temp) {
            mapped[j] = temp[j];
            disposers[j] = tempdisposers[j];
            if (indexes) {
              indexes[j] = tempIndexes[j];
              indexes[j](j);
            }
          } else mapped[j] = createRoot(mapper);
        }
        mapped = mapped.slice(0, len = newLen);
        items = newItems.slice(0);
      }
      return mapped;
    });
    function mapper(disposer) {
      disposers[j] = disposer;
      if (indexes) {
        const [s, set] = createSignal(j);
        indexes[j] = set;
        return mapFn(newItems[j], s);
      }
      return mapFn(newItems[j]);
    }
  };
}
function indexArray(list, mapFn, options = {}) {
  let items = [],
    mapped = [],
    disposers = [],
    signals = [],
    len = 0,
    i;
  onCleanup(() => dispose(disposers));
  return () => {
    const newItems = list() || [];
    newItems[$TRACK];
    return untrack(() => {
      if (newItems.length === 0) {
        if (len !== 0) {
          dispose(disposers);
          disposers = [];
          items = [];
          mapped = [];
          len = 0;
          signals = [];
        }
        if (options.fallback) {
          items = [FALLBACK];
          mapped[0] = createRoot(disposer => {
            disposers[0] = disposer;
            return options.fallback();
          });
          len = 1;
        }
        return mapped;
      }
      if (items[0] === FALLBACK) {
        disposers[0]();
        disposers = [];
        items = [];
        mapped = [];
        len = 0;
      }
      for (i = 0; i < newItems.length; i++) {
        if (i < items.length && items[i] !== newItems[i]) {
          signals[i](() => newItems[i]);
        } else if (i >= items.length) {
          mapped[i] = createRoot(mapper);
        }
      }
      for (; i < items.length; i++) {
        disposers[i]();
      }
      len = signals.length = disposers.length = newItems.length;
      items = newItems.slice(0);
      return mapped = mapped.slice(0, len);
    });
    function mapper(disposer) {
      disposers[i] = disposer;
      const [s, set] = createSignal(newItems[i]);
      signals[i] = set;
      return mapFn(s, i);
    }
  };
}
function createComponent(Comp, props) {
  return untrack(() => Comp(props || {}));
}
function trueFn() {
  return true;
}
const propTraps = {
  get(_, property, receiver) {
    if (property === $PROXY) return receiver;
    return _.get(property);
  },
  has(_, property) {
    if (property === $PROXY) return true;
    return _.has(property);
  },
  set: trueFn,
  deleteProperty: trueFn,
  getOwnPropertyDescriptor(_, property) {
    return {
      configurable: true,
      enumerable: true,
      get() {
        return _.get(property);
      },
      set: trueFn,
      deleteProperty: trueFn
    };
  },
  ownKeys(_) {
    return _.keys();
  }
};
function resolveSource(s) {
  return !(s = typeof s === "function" ? s() : s) ? {} : s;
}
function mergeProps(...sources) {
  let proxy = false;
  for (let i = 0; i < sources.length; i++) {
    const s = sources[i];
    proxy = proxy || !!s && $PROXY in s;
    sources[i] = typeof s === "function" ? (proxy = true, createMemo(s)) : s;
  }
  if (proxy) {
    return new Proxy({
      get(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          const v = resolveSource(sources[i])[property];
          if (v !== undefined) return v;
        }
      },
      has(property) {
        for (let i = sources.length - 1; i >= 0; i--) {
          if (property in resolveSource(sources[i])) return true;
        }
        return false;
      },
      keys() {
        const keys = [];
        for (let i = 0; i < sources.length; i++) keys.push(...Object.keys(resolveSource(sources[i])));
        return [...new Set(keys)];
      }
    }, propTraps);
  }
  const target = {};
  for (let i = sources.length - 1; i >= 0; i--) {
    if (sources[i]) {
      const descriptors = Object.getOwnPropertyDescriptors(sources[i]);
      for (const key in descriptors) {
        if (key in target) continue;
        Object.defineProperty(target, key, {
          enumerable: true,
          get() {
            for (let i = sources.length - 1; i >= 0; i--) {
              const v = (sources[i] || {})[key];
              if (v !== undefined) return v;
            }
          }
        });
      }
    }
  }
  return target;
}

function For(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(mapArray(() => props.each, props.children, fallback || undefined));
}
function Index(props) {
  const fallback = "fallback" in props && {
    fallback: () => props.fallback
  };
  return createMemo(indexArray(() => props.each, props.children, fallback || undefined));
}
function Show(props) {
  let strictEqual = false;
  const keyed = props.keyed;
  const condition = createMemo(() => props.when, undefined, {
    equals: (a, b) => strictEqual ? a === b : !a === !b
  });
  return createMemo(() => {
    const c = condition();
    if (c) {
      const child = props.children;
      const fn = typeof child === "function" && child.length > 0;
      strictEqual = keyed || fn;
      return fn ? untrack(() => child(c)) : child;
    }
    return props.fallback;
  }, undefined, undefined);
}
function Switch(props) {
  let strictEqual = false;
  let keyed = false;
  const equals = (a, b) => a[0] === b[0] && (strictEqual ? a[1] === b[1] : !a[1] === !b[1]) && a[2] === b[2];
  const conditions = children(() => props.children),
    evalConditions = createMemo(() => {
      let conds = conditions();
      if (!Array.isArray(conds)) conds = [conds];
      for (let i = 0; i < conds.length; i++) {
        const c = conds[i].when;
        if (c) {
          keyed = !!conds[i].keyed;
          return [i, c, conds[i]];
        }
      }
      return [-1];
    }, undefined, {
      equals
    });
  return createMemo(() => {
    const [index, when, cond] = evalConditions();
    if (index < 0) return props.fallback;
    const c = cond.children;
    const fn = typeof c === "function" && c.length > 0;
    strictEqual = keyed || fn;
    return fn ? untrack(() => c(when)) : c;
  }, undefined, undefined);
}
function Match(props) {
  return props;
}

function reconcileArrays(parentNode, a, b) {
  let bLength = b.length,
    aEnd = a.length,
    bEnd = bLength,
    aStart = 0,
    bStart = 0,
    after = a[aEnd - 1].nextSibling,
    map = null;
  while (aStart < aEnd || bStart < bEnd) {
    if (a[aStart] === b[bStart]) {
      aStart++;
      bStart++;
      continue;
    }
    while (a[aEnd - 1] === b[bEnd - 1]) {
      aEnd--;
      bEnd--;
    }
    if (aEnd === aStart) {
      const node = bEnd < bLength ? bStart ? b[bStart - 1].nextSibling : b[bEnd - bStart] : after;
      while (bStart < bEnd) parentNode.insertBefore(b[bStart++], node);
    } else if (bEnd === bStart) {
      while (aStart < aEnd) {
        if (!map || !map.has(a[aStart])) a[aStart].remove();
        aStart++;
      }
    } else if (a[aStart] === b[bEnd - 1] && b[bStart] === a[aEnd - 1]) {
      const node = a[--aEnd].nextSibling;
      parentNode.insertBefore(b[bStart++], a[aStart++].nextSibling);
      parentNode.insertBefore(b[--bEnd], node);
      a[aEnd] = b[bEnd];
    } else {
      if (!map) {
        map = new Map();
        let i = bStart;
        while (i < bEnd) map.set(b[i], i++);
      }
      const index = map.get(a[aStart]);
      if (index != null) {
        if (bStart < index && index < bEnd) {
          let i = aStart,
            sequence = 1,
            t;
          while (++i < aEnd && i < bEnd) {
            if ((t = map.get(a[i])) == null || t !== index + sequence) break;
            sequence++;
          }
          if (sequence > index - bStart) {
            const node = a[aStart];
            while (bStart < index) parentNode.insertBefore(b[bStart++], node);
          } else parentNode.replaceChild(b[bStart++], a[aStart++]);
        } else aStart++;
      } else a[aStart++].remove();
    }
  }
}

const $$EVENTS = "_$DX_DELEGATE";
function render(code, element, init, options = {}) {
  let disposer;
  createRoot(dispose => {
    disposer = dispose;
    element === document ? code() : insert(element, code(), element.firstChild ? null : undefined, init);
  }, options.owner);
  return () => {
    disposer();
    element.textContent = "";
  };
}
function template(html, check, isSVG) {
  const t = document.createElement("template");
  t.innerHTML = html;
  let node = t.content.firstChild;
  if (isSVG) node = node.firstChild;
  return node;
}
function delegateEvents(eventNames, document = window.document) {
  const e = document[$$EVENTS] || (document[$$EVENTS] = new Set());
  for (let i = 0, l = eventNames.length; i < l; i++) {
    const name = eventNames[i];
    if (!e.has(name)) {
      e.add(name);
      document.addEventListener(name, eventHandler);
    }
  }
}
function setAttribute(node, name, value) {
  if (value == null) node.removeAttribute(name);else node.setAttribute(name, value);
}
function className$1(node, value) {
  if (value == null) node.removeAttribute("class");else node.className = value;
}
function addEventListener(node, name, handler, delegate) {
  if (delegate) {
    if (Array.isArray(handler)) {
      node[`$$${name}`] = handler[0];
      node[`$$${name}Data`] = handler[1];
    } else node[`$$${name}`] = handler;
  } else if (Array.isArray(handler)) {
    const handlerFn = handler[0];
    node.addEventListener(name, handler[0] = e => handlerFn.call(node, handler[1], e));
  } else node.addEventListener(name, handler);
}
function style$1(node, value, prev) {
  if (!value) return prev ? setAttribute(node, "style") : value;
  const nodeStyle = node.style;
  if (typeof value === "string") return nodeStyle.cssText = value;
  typeof prev === "string" && (nodeStyle.cssText = prev = undefined);
  prev || (prev = {});
  value || (value = {});
  let v, s;
  for (s in prev) {
    value[s] == null && nodeStyle.removeProperty(s);
    delete prev[s];
  }
  for (s in value) {
    v = value[s];
    if (v !== prev[s]) {
      nodeStyle.setProperty(s, v);
      prev[s] = v;
    }
  }
  return prev;
}
function use(fn, element, arg) {
  return untrack(() => fn(element, arg));
}
function insert(parent, accessor, marker, initial) {
  if (marker !== undefined && !initial) initial = [];
  if (typeof accessor !== "function") return insertExpression(parent, accessor, initial, marker);
  createRenderEffect(current => insertExpression(parent, accessor(), current, marker), initial);
}
function eventHandler(e) {
  const key = `$$${e.type}`;
  let node = e.composedPath && e.composedPath()[0] || e.target;
  if (e.target !== node) {
    Object.defineProperty(e, "target", {
      configurable: true,
      value: node
    });
  }
  Object.defineProperty(e, "currentTarget", {
    configurable: true,
    get() {
      return node || document;
    }
  });
  if (sharedConfig.registry && !sharedConfig.done) {
    sharedConfig.done = true;
    document.querySelectorAll("[id^=pl-]").forEach(elem => {
      while (elem && elem.nodeType !== 8 && elem.nodeValue !== "pl-" + e) {
        let x = elem.nextSibling;
        elem.remove();
        elem = x;
      }
      elem && elem.remove();
    });
  }
  while (node) {
    const handler = node[key];
    if (handler && !node.disabled) {
      const data = node[`${key}Data`];
      data !== undefined ? handler.call(node, data, e) : handler.call(node, e);
      if (e.cancelBubble) return;
    }
    node = node._$host || node.parentNode || node.host;
  }
}
function insertExpression(parent, value, current, marker, unwrapArray) {
  if (sharedConfig.context && !current) current = [...parent.childNodes];
  while (typeof current === "function") current = current();
  if (value === current) return current;
  const t = typeof value,
    multi = marker !== undefined;
  parent = multi && current[0] && current[0].parentNode || parent;
  if (t === "string" || t === "number") {
    if (sharedConfig.context) return current;
    if (t === "number") value = value.toString();
    if (multi) {
      let node = current[0];
      if (node && node.nodeType === 3) {
        node.data = value;
      } else node = document.createTextNode(value);
      current = cleanChildren(parent, current, marker, node);
    } else {
      if (current !== "" && typeof current === "string") {
        current = parent.firstChild.data = value;
      } else current = parent.textContent = value;
    }
  } else if (value == null || t === "boolean") {
    if (sharedConfig.context) return current;
    current = cleanChildren(parent, current, marker);
  } else if (t === "function") {
    createRenderEffect(() => {
      let v = value();
      while (typeof v === "function") v = v();
      current = insertExpression(parent, v, current, marker);
    });
    return () => current;
  } else if (Array.isArray(value)) {
    const array = [];
    const currentArray = current && Array.isArray(current);
    if (normalizeIncomingArray(array, value, current, unwrapArray)) {
      createRenderEffect(() => current = insertExpression(parent, array, current, marker, true));
      return () => current;
    }
    if (sharedConfig.context) {
      if (!array.length) return current;
      for (let i = 0; i < array.length; i++) {
        if (array[i].parentNode) return current = array;
      }
    }
    if (array.length === 0) {
      current = cleanChildren(parent, current, marker);
      if (multi) return current;
    } else if (currentArray) {
      if (current.length === 0) {
        appendNodes(parent, array, marker);
      } else reconcileArrays(parent, current, array);
    } else {
      current && cleanChildren(parent);
      appendNodes(parent, array);
    }
    current = array;
  } else if (value instanceof Node) {
    if (sharedConfig.context && value.parentNode) return current = multi ? [value] : value;
    if (Array.isArray(current)) {
      if (multi) return current = cleanChildren(parent, current, marker, value);
      cleanChildren(parent, current, null, value);
    } else if (current == null || current === "" || !parent.firstChild) {
      parent.appendChild(value);
    } else parent.replaceChild(value, parent.firstChild);
    current = value;
  } else ;
  return current;
}
function normalizeIncomingArray(normalized, array, current, unwrap) {
  let dynamic = false;
  for (let i = 0, len = array.length; i < len; i++) {
    let item = array[i],
      prev = current && current[i];
    if (item instanceof Node) {
      normalized.push(item);
    } else if (item == null || item === true || item === false) ; else if (Array.isArray(item)) {
      dynamic = normalizeIncomingArray(normalized, item, prev) || dynamic;
    } else if ((typeof item) === "function") {
      if (unwrap) {
        while (typeof item === "function") item = item();
        dynamic = normalizeIncomingArray(normalized, Array.isArray(item) ? item : [item], Array.isArray(prev) ? prev : [prev]) || dynamic;
      } else {
        normalized.push(item);
        dynamic = true;
      }
    } else {
      const value = String(item);
      if (prev && prev.nodeType === 3 && prev.data === value) {
        normalized.push(prev);
      } else normalized.push(document.createTextNode(value));
    }
  }
  return dynamic;
}
function appendNodes(parent, array, marker = null) {
  for (let i = 0, len = array.length; i < len; i++) parent.insertBefore(array[i], marker);
}
function cleanChildren(parent, current, marker, replacement) {
  if (marker === undefined) return parent.textContent = "";
  const node = replacement || document.createTextNode("");
  if (current.length) {
    let inserted = false;
    for (let i = current.length - 1; i >= 0; i--) {
      const el = current[i];
      if (node !== el) {
        const isParent = el.parentNode === parent;
        if (!inserted && !i) isParent ? parent.replaceChild(node, el) : parent.insertBefore(node, marker);else isParent && el.remove();
      } else inserted = true;
    }
  } else parent.insertBefore(node, marker);
  return [node];
}

let wasm;
const heap = new Array(128).fill(undefined);
heap.push(undefined, null, true, false);
function getObject(idx) {
  return heap[idx];
}
let heap_next = heap.length;
function dropObject(idx) {
  if (idx < 132) return;
  heap[idx] = heap_next;
  heap_next = idx;
}
function takeObject(idx) {
  const ret = getObject(idx);
  dropObject(idx);
  return ret;
}
const cachedTextDecoder = new TextDecoder('utf-8', {
  ignoreBOM: true,
  fatal: true
});
cachedTextDecoder.decode();
let cachedUint8Memory0 = null;
function getUint8Memory0() {
  if (cachedUint8Memory0 === null || cachedUint8Memory0.byteLength === 0) {
    cachedUint8Memory0 = new Uint8Array(wasm.memory.buffer);
  }
  return cachedUint8Memory0;
}
function getStringFromWasm0(ptr, len) {
  return cachedTextDecoder.decode(getUint8Memory0().subarray(ptr, ptr + len));
}
function addHeapObject(obj) {
  if (heap_next === heap.length) heap.push(heap.length + 1);
  const idx = heap_next;
  heap_next = heap[idx];
  heap[idx] = obj;
  return idx;
}
function debugString(val) {
  // primitive types
  const type = typeof val;
  if (type == 'number' || type == 'boolean' || val == null) {
    return `${val}`;
  }
  if (type == 'string') {
    return `"${val}"`;
  }
  if (type == 'symbol') {
    const description = val.description;
    if (description == null) {
      return 'Symbol';
    } else {
      return `Symbol(${description})`;
    }
  }
  if (type == 'function') {
    const name = val.name;
    if (typeof name == 'string' && name.length > 0) {
      return `Function(${name})`;
    } else {
      return 'Function';
    }
  }
  // objects
  if (Array.isArray(val)) {
    const length = val.length;
    let debug = '[';
    if (length > 0) {
      debug += debugString(val[0]);
    }
    for (let i = 1; i < length; i++) {
      debug += ', ' + debugString(val[i]);
    }
    debug += ']';
    return debug;
  }
  // Test for built-in
  const builtInMatches = /\[object ([^\]]+)\]/.exec(toString.call(val));
  let className;
  if (builtInMatches.length > 1) {
    className = builtInMatches[1];
  } else {
    // Failed to match the standard '[object ClassName]'
    return toString.call(val);
  }
  if (className == 'Object') {
    // we're a user defined class or Object
    // JSON.stringify avoids problems with cycles, and is generally much
    // easier than looping through ownProperties of `val`.
    try {
      return 'Object(' + JSON.stringify(val) + ')';
    } catch (_) {
      return 'Object';
    }
  }
  // errors
  if (val instanceof Error) {
    return `${val.name}: ${val.message}\n${val.stack}`;
  }
  // TODO we could test for more things here, like `Set`s and `Map`s.
  return className;
}
let WASM_VECTOR_LEN = 0;
const cachedTextEncoder = new TextEncoder('utf-8');
const encodeString = typeof cachedTextEncoder.encodeInto === 'function' ? function (arg, view) {
  return cachedTextEncoder.encodeInto(arg, view);
} : function (arg, view) {
  const buf = cachedTextEncoder.encode(arg);
  view.set(buf);
  return {
    read: arg.length,
    written: buf.length
  };
};
function passStringToWasm0(arg, malloc, realloc) {
  if (realloc === undefined) {
    const buf = cachedTextEncoder.encode(arg);
    const ptr = malloc(buf.length);
    getUint8Memory0().subarray(ptr, ptr + buf.length).set(buf);
    WASM_VECTOR_LEN = buf.length;
    return ptr;
  }
  let len = arg.length;
  let ptr = malloc(len);
  const mem = getUint8Memory0();
  let offset = 0;
  for (; offset < len; offset++) {
    const code = arg.charCodeAt(offset);
    if (code > 0x7F) break;
    mem[ptr + offset] = code;
  }
  if (offset !== len) {
    if (offset !== 0) {
      arg = arg.slice(offset);
    }
    ptr = realloc(ptr, len, len = offset + arg.length * 3);
    const view = getUint8Memory0().subarray(ptr + offset, ptr + len);
    const ret = encodeString(arg, view);
    offset += ret.written;
  }
  WASM_VECTOR_LEN = offset;
  return ptr;
}
let cachedInt32Memory0 = null;
function getInt32Memory0() {
  if (cachedInt32Memory0 === null || cachedInt32Memory0.byteLength === 0) {
    cachedInt32Memory0 = new Int32Array(wasm.memory.buffer);
  }
  return cachedInt32Memory0;
}
/**
* @param {number} cols
* @param {number} rows
* @param {boolean} resizable
* @param {number} scrollback_limit
* @returns {VtWrapper}
*/
function create$1(cols, rows, resizable, scrollback_limit) {
  const ret = wasm.create(cols, rows, resizable, scrollback_limit);
  return VtWrapper.__wrap(ret);
}
let cachedUint32Memory0 = null;
function getUint32Memory0() {
  if (cachedUint32Memory0 === null || cachedUint32Memory0.byteLength === 0) {
    cachedUint32Memory0 = new Uint32Array(wasm.memory.buffer);
  }
  return cachedUint32Memory0;
}
function getArrayU32FromWasm0(ptr, len) {
  return getUint32Memory0().subarray(ptr / 4, ptr / 4 + len);
}
/**
*/
class VtWrapper {
  static __wrap(ptr) {
    const obj = Object.create(VtWrapper.prototype);
    obj.ptr = ptr;
    return obj;
  }
  __destroy_into_raw() {
    const ptr = this.ptr;
    this.ptr = 0;
    return ptr;
  }
  free() {
    const ptr = this.__destroy_into_raw();
    wasm.__wbg_vtwrapper_free(ptr);
  }
  /**
  * @param {string} s
  * @returns {any}
  */
  feed(s) {
    const ptr0 = passStringToWasm0(s, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    const ret = wasm.vtwrapper_feed(this.ptr, ptr0, len0);
    return takeObject(ret);
  }
  /**
  * @returns {string}
  */
  inspect() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vtwrapper_inspect(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      return getStringFromWasm0(r0, r1);
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
      wasm.__wbindgen_free(r0, r1);
    }
  }
  /**
  * @returns {Uint32Array}
  */
  get_size() {
    try {
      const retptr = wasm.__wbindgen_add_to_stack_pointer(-16);
      wasm.vtwrapper_get_size(retptr, this.ptr);
      var r0 = getInt32Memory0()[retptr / 4 + 0];
      var r1 = getInt32Memory0()[retptr / 4 + 1];
      var v0 = getArrayU32FromWasm0(r0, r1).slice();
      wasm.__wbindgen_free(r0, r1 * 4);
      return v0;
    } finally {
      wasm.__wbindgen_add_to_stack_pointer(16);
    }
  }
  /**
  * @param {number} l
  * @returns {any}
  */
  get_line(l) {
    const ret = wasm.vtwrapper_get_line(this.ptr, l);
    return takeObject(ret);
  }
  /**
  * @returns {any}
  */
  get_cursor() {
    const ret = wasm.vtwrapper_get_cursor(this.ptr);
    return takeObject(ret);
  }
}
async function load(module, imports) {
  if (typeof Response === 'function' && module instanceof Response) {
    if (typeof WebAssembly.instantiateStreaming === 'function') {
      try {
        return await WebAssembly.instantiateStreaming(module, imports);
      } catch (e) {
        if (module.headers.get('Content-Type') != 'application/wasm') {
          console.warn("`WebAssembly.instantiateStreaming` failed because your server does not serve wasm with `application/wasm` MIME type. Falling back to `WebAssembly.instantiate` which is slower. Original error:\n", e);
        } else {
          throw e;
        }
      }
    }
    const bytes = await module.arrayBuffer();
    return await WebAssembly.instantiate(bytes, imports);
  } else {
    const instance = await WebAssembly.instantiate(module, imports);
    if (instance instanceof WebAssembly.Instance) {
      return {
        instance,
        module
      };
    } else {
      return instance;
    }
  }
}
function getImports() {
  const imports = {};
  imports.wbg = {};
  imports.wbg.__wbindgen_object_drop_ref = function (arg0) {
    takeObject(arg0);
  };
  imports.wbg.__wbindgen_error_new = function (arg0, arg1) {
    const ret = new Error(getStringFromWasm0(arg0, arg1));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_object_clone_ref = function (arg0) {
    const ret = getObject(arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_number_new = function (arg0) {
    const ret = arg0;
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_bigint_from_u64 = function (arg0) {
    const ret = BigInt.asUintN(64, arg0);
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_string_new = function (arg0, arg1) {
    const ret = getStringFromWasm0(arg0, arg1);
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_set_20cbc34131e76824 = function (arg0, arg1, arg2) {
    getObject(arg0)[takeObject(arg1)] = takeObject(arg2);
  };
  imports.wbg.__wbg_new_b525de17f44a8943 = function () {
    const ret = new Array();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_f841cc6f2098f4b5 = function () {
    const ret = new Map();
    return addHeapObject(ret);
  };
  imports.wbg.__wbg_new_f9876326328f45ed = function () {
    const ret = new Object();
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_is_string = function (arg0) {
    const ret = typeof getObject(arg0) === 'string';
    return ret;
  };
  imports.wbg.__wbg_set_17224bc548dd1d7b = function (arg0, arg1, arg2) {
    getObject(arg0)[arg1 >>> 0] = takeObject(arg2);
  };
  imports.wbg.__wbg_set_388c4c6422704173 = function (arg0, arg1, arg2) {
    const ret = getObject(arg0).set(getObject(arg1), getObject(arg2));
    return addHeapObject(ret);
  };
  imports.wbg.__wbindgen_debug_string = function (arg0, arg1) {
    const ret = debugString(getObject(arg1));
    const ptr0 = passStringToWasm0(ret, wasm.__wbindgen_malloc, wasm.__wbindgen_realloc);
    const len0 = WASM_VECTOR_LEN;
    getInt32Memory0()[arg0 / 4 + 1] = len0;
    getInt32Memory0()[arg0 / 4 + 0] = ptr0;
  };
  imports.wbg.__wbindgen_throw = function (arg0, arg1) {
    throw new Error(getStringFromWasm0(arg0, arg1));
  };
  return imports;
}
function finalizeInit(instance, module) {
  wasm = instance.exports;
  init.__wbindgen_wasm_module = module;
  cachedInt32Memory0 = null;
  cachedUint32Memory0 = null;
  cachedUint8Memory0 = null;
  return wasm;
}
function initSync(module) {
  const imports = getImports();
  if (!(module instanceof WebAssembly.Module)) {
    module = new WebAssembly.Module(module);
  }
  const instance = new WebAssembly.Instance(module, imports);
  return finalizeInit(instance, module);
}
async function init(input) {
  const imports = getImports();
  if (typeof input === 'string' || typeof Request === 'function' && input instanceof Request || typeof URL === 'function' && input instanceof URL) {
    input = fetch(input);
  }
  const {
    instance,
    module
  } = await load(await input, imports);
  return finalizeInit(instance, module);
}

var exports = /*#__PURE__*/Object.freeze({
  __proto__: null,
  VtWrapper: VtWrapper,
  create: create$1,
  default: init,
  initSync: initSync
});

const base64codes = [62,0,0,0,63,52,53,54,55,56,57,58,59,60,61,0,0,0,0,0,0,0,0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23,24,25,0,0,0,0,0,0,26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,51];

        function getBase64Code(charCode) {
            return base64codes[charCode - 43];
        }

        function base64_decode(str) {
            let missingOctets = str.endsWith("==") ? 2 : str.endsWith("=") ? 1 : 0;
            let n = str.length;
            let result = new Uint8Array(3 * (n / 4));
            let buffer;

            for (let i = 0, j = 0; i < n; i += 4, j += 3) {
                buffer =
                    getBase64Code(str.charCodeAt(i)) << 18 |
                    getBase64Code(str.charCodeAt(i + 1)) << 12 |
                    getBase64Code(str.charCodeAt(i + 2)) << 6 |
                    getBase64Code(str.charCodeAt(i + 3));
                result[j] = buffer >> 16;
                result[j + 1] = (buffer >> 8) & 0xFF;
                result[j + 2] = buffer & 0xFF;
            }

            return result.subarray(0, result.length - missingOctets);
        }

        const wasm_code = base64_decode("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wIHBACABQf8fIAFB/x9LGzYCACADIARPDQBBuIHBAEF/NgIACw8LIABBeHFBkP/AAGohAgJ/QZiBwQAoAgAiA0EBIABBA3Z0IgBxRQRAQZiBwQAgACADcjYCACACDAELIAIoAggLIQAgAiABNgIIIAAgATYCDCABIAI2AgwgASAANgIIDwtBqIHBACABNgIAQaCBwQBBoIHBACgCACAAaiIANgIAIAEgAEEBcjYCBCAAIAFqIAA2AgALlgUBC38jAEEwayIDJAAgA0EkaiABNgIAIANBAzoALCADQSA2AhwgA0EANgIoIAMgADYCICADQQA2AhQgA0EANgIMAn8CQAJAAkAgAigCECILRQRAIAJBDGooAgAiAEUNASACKAIIIgEgAEEDdGohBCAAQQFrQf////8BcUEBaiEIIAIoAgAhAANAIABBBGooAgAiBgRAIAMoAiAgACgCACAGIAMoAiQoAgwRAQANBAsgASgCACADQQxqIAFBBGooAgARAAANAyAFQQFqIQUgAEEIaiEAIAQgAUEIaiIBRw0ACwwBCyACQRRqKAIAIgBFDQAgAEEFdCEMIABBAWtB////P3FBAWohCCACKAIIIQYgAigCACEAA0AgAEEEaigCACIBBEAgAygCICAAKAIAIAEgAygCJCgCDBEBAA0DCyADIAUgC2oiAUEQaigCADYCHCADIAFBHGotAAA6ACwgAyABQRhqKAIANgIoIAFBDGooAgAhB0EAIQpBACEEAkACQAJAIAFBCGooAgBBAWsOAgACAQsgBiAHQQN0aiINKAIEQesARw0BIA0oAgAoAgAhBwtBASEECyADIAc2AhAgAyAENgIMIAFBBGooAgAhBAJAAkACQCABKAIAQQFrDgIAAgELIAYgBEEDdGoiBygCBEHrAEcNASAHKAIAKAIAIQQLQQEhCgsgAyAENgIYIAMgCjYCFCAGIAFBFGooAgBBA3RqIgEoAgAgA0EMaiABQQRqKAIAEQAADQIgCUEBaiEJIABBCGohACAMIAVBIGoiBUcNAAsLIAggAigCBE8NASADKAIgIAIoAgAgCEEDdGoiACgCACAAKAIEIAMoAiQoAgwRAQBFDQELQQEMAQtBAAsgA0EwaiQAC90LAg5/AX4jAEFAaiIDJAAgAUEUaigCACEMIAEoAiQhCSABKAIQIQcgA0EwaiENIANB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AiEEDAILIAMgBGoiAEEBaiEEAkAgACACTw0AIAAgAWotAABBCkcNAEEAIQUgBCIDIQAMAwsgAiAETw0ACwtBASEFIAIiACAIIgNGDQILAkAgDC0AAARAIAtBsObAAEEEIAooAgwRAQANAQsgASAIaiEGIAAgCGshB0EAIQkgDCAAIAhHBH8gBiAHakEBay0AAEEKRgVBAAs6AAAgAyEIIAsgBiAHIAooAgwRAQBFDQELC0EBIQ0LIA0L1AYBBX8jAEHAAWsiAiQAIAAoAgAhAyACQQRqIgBBtAFqQZCHwAA2AgAgAkGwAWpBoIvAADYCACAAQaQBakHAi8AANgIAIABBnAFqQbCLwAA2AgAgAEGUAWpBsIvAADYCACACQZABakHQhsAANgIAIAJBiAFqQdCGwAA2AgAgAkGAAWpBoIvAADYCACACQfgAakGgi8AANgIAIABB7ABqQaCLwAA2AgAgAkHoAGpBoIvAADYCACACQeAAakGgi8AANgIAIABB1ABqQZCLwAA2AgAgAkHQAGpB0IbAADYCACACQcgAakGAi8AANgIAIAJBQGtB8IrAADYCACACQThqQeCKwAA2AgAgAkEwakH0hsAANgIAIAJBKGpB0IrAADYCACACQSBqQcCKwAA2AgAgAkEYakHAisAANgIAIAJBEGpB0IbAADYCACACIANBugFqNgKsASACIANB1ABqNgKkASACIANBgAFqNgKcASACIANB7ABqNgKUASACIANBpAFqNgKMASACIANBoAFqNgKEASACIANBuQFqNgJ8IAIgA0G4AWo2AnQgAiADQbcBajYCbCACIANBtgFqNgJkIAIgA0G1AWo2AlwgAiADQcgAajYCVCACIANBnAFqNgJMIAIgA0GoAWo2AkQgAiADQaoBajYCPCACIANB4ABqNgI0IAIgA0FAazYCLCACIANBtAFqNgIkIAIgA0EgajYCHCACIAM2AhQgAiADQZgBajYCDCACQdCGwAA2AgggAiADQZQBajYCBCACIANBuwFqNgK8ASACIAJBvAFqNgK0AUEXIQZBiInAACEEIwBBIGsiAyQAIANBFzYCACADQRc2AgQgASgCFEHQi8AAQQggAUEYaigCACgCDBEBACEFIANBADoADSADIAU6AAwgAyABNgIIAn8DQCADQQhqIAQoAgAgBEEEaigCACAAQdDo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AigCACADRgRAIAIgA0EBEHwLIAIgA0EBaiIDNgIIIAIoAgQgBWoiEiAEKQIANwIAIBJBCGogBEEIaikCADcCACAEIAwQFyAFQRBqIQUgBCgCAEGAgICAeEcNAAsLIAwQngEgBEEQaiQAIAtBCGogDygCADYCACALIAEpAgw3AgALIAFBQGskACAGKAIUQQR0IQMgBigCECEFAkADQCADRQ0BIANBEGshAyAFKAIIIAVBEGohBSAIRg0AC0H0nsAAQTdBrJ/AABCLAQALIAZBIGoiASAGQRRqKAIANgIAIAYgBikCDDcDGCAHEIABIAcoAgAEQCAAKAIMEBULIAcgBikDGDcCACAHQQhqIAEoAgA2AgAgCSAAKAIQIgJLBEAgACAJIAJrIAgQcyAAKAIQIQILQQAhAwJAIA5FDQAgAkEBayIERQ0AIAAoAgxBDGohBUEAIQEDQAJAIAIgA0cEQCADQQFqIQMgDiABIAUtAABFaiIBSw0BDAMLIAIgAkG0nsAAEFkACyAFQRBqIQUgAyAESQ0ACwsCQAJAIAggCksNACADIAIgAiADSRshASAAKAIMIANBBHRqQQxqIQUDQCABIANGDQIgBS0AAEUNASAFQRBqIQUgA0EBaiEDIAogCGsiCiAITw0ACwsgCiAIQQFrIgEgASAKSxshCyADIAkgAmtqIgFBAE4hBCABQQAgBBshByAJQQAgASAEG2shCQwBCyABIAJBpJ7AABBZAAsCQAJAAkACQAJAQX8gCSANRyAJIA1LG0H/AXEOAgIAAQtBACACIAlrIgEgASACSxsiBCANIAlrIgEgASAESxsiA0EAIAcgCUkbIAdqIQcgASAETQ0BIAAgASADayAIEHMMAQsgAEEIaiEEIAkgDWsiAyAJIAdBf3NqIgEgASADSxsiBQRAAkAgAiAFayIBIAQoAggiAksNACAEIAE2AgggASACRg0AIAIgAWshAiAEKAIEIAFBBHRqIQEDQCABKAIABEAgAUEEaigCABAVCyABQRBqIQEgAkEBayICDQALCyAAKAIQIgFFDQIgACgCDCABQQR0akEEa0EAOgAACyAHIANrIAVqIQcLIABBAToAHCAAIA02AhggACAINgIUIBEgBzYCBCARIAs2AgAgBkFAayQADAELQYybwABBK0GUnsAAEIsBAAsgACAQKQMINwJgIABB1ABqIQgCQCAAKAKYASIBIABB3ABqKAIAIgRNBEAgACABNgJcDAELIAggASAEa0EAEE8gACgCmAEhAQsgCEEAIAEQcCAAKAKUASIBIAAoAmxNBEAgACABQQFrNgJsCyAAKAKYASIBIABB8ABqKAIATQRAIAAgAUEBazYCcAsgEEEQaiQAC8QBAQJ/IwBBIGsiBCQAAkAgAiADaiIDIAJJDQAgASgCACICQQF0IgUgAyADIAVJGyIDQQggA0EISxsiA0F/c0EfdiEFAkAgAkUEQCAEQQA2AhgMAQsgBCACNgIcIARBATYCGCAEIAEoAgQ2AhQLIARBCGogBSADIARBFGoQPCAEKAIMIQUgBCgCCARAIARBEGooAgAhAwwBCyABIAM2AgAgASAFNgIEQYGAgIB4IQULIAAgAzYCBCAAIAU2AgAgBEEgaiQAC9oBAQJ/IwBBIGsiAyQAAkACQCABIAEgAmoiAUsNACAAKAIAIgJBAXQiBCABIAEgBEkbIgFBCCABQQhLGyIEQX9zQR92IQECQCACRQRAIANBADYCGAwBCyADIAI2AhwgA0EBNgIYIAMgACgCBDYCFAsgA0EIaiABIAQgA0EUahA9IAMoAgwhASADKAIIRQRAIAAgBDYCACAAIAE2AgQMAgsgAUGBgICAeEYNASABRQ0AIAEgA0EQaigCAEHo/cAAKAIAIgBB1gAgABsRAgAACxCSAQALIANBIGokAAvaAQECfyMAQSBrIgMkAAJAAkAgASABIAJqIgFLDQAgACgCACICQQF0IgQgASABIARJGyIBQQggAUEISxsiBEF/c0EfdiEBAkAgAkUEQCADQQA2AhgMAQsgAyACNgIcIANBATYCGCADIAAoAgQ2AhQLIANBCGogASAEIANBFGoQMiADKAIMIQEgAygCCEUEQCAAIAQ2AgAgACABNgIEDAILIAFBgYCAgHhGDQEgAUUNACABIANBEGooAgBB6P3AACgCACIAQdYAIAAbEQIAAAsQkgEACyADQSBqJAALxwEBAX8jAEEQayIPJAAgACgCFCABIAIgAEEYaigCACgCDBEBACEBIA9BADoADSAPIAE6AAwgDyAANgIIIA9BCGogAyAEIAUgBhAgIAcgCCAJIAoQICALIAwgDSAOECAhAiAPLQAMIQECfyABQQBHIA8tAA1FDQAaQQEgAQ0AGiACKAIAIgAtABxBBHFFBEAgACgCFEG/5sAAQQIgACgCGCgCDBEBAAwBCyAAKAIUQb7mwABBASAAKAIYKAIMEQEACyAPQRBqJAAL1gEBA38jAEHQAGsiACQAIABBMzYCDCAAQfCMwAA2AgggAEEANgIoIABCgICAgBA3AiAgAEHEAGpB1I3AADYCACAAQQM6AEwgAEEgNgI8IABBADYCSCAAQQA2AjQgAEEANgIsIAAgAEEgajYCQCAAQQhqIgEoAgAgASgCBCAAQSxqEOsBBEBB7I3AAEE3IABBEGpBpI7AAEGAj8AAEE4ACyAAQRBqIgFBCGogAEEoaigCACICNgIAIAAgACkCIDcDECAAKAIUIAIQASABELABIABB0ABqJAALrQEBAX8gACIEAn8CQAJ/AkACQCABBEAgAkEASA0BIAMoAgQEQCADQQhqKAIAIgAEQCADKAIAIAAgASACEL8BDAULCyACRQ0CQa39wAAtAAAaIAIgARDJAQwDCyAEQQA2AgQgBEEIaiACNgIADAMLIARBADYCBAwCCyABCyIABEAgBCAANgIEIARBCGogAjYCAEEADAILIAQgATYCBCAEQQhqIAI2AgALQQELNgIAC64BAQF/AkACQCABBEAgAkEASA0BAn8gAygCBARAAkAgA0EIaigCACIERQRADAELIAMoAgAgBCABIAIQvwEMAgsLIAEgAkUNABpBrf3AAC0AABogAiABEMkBCyIDBEAgACADNgIEIABBCGogAjYCACAAQQA2AgAPCyAAIAE2AgQgAEEIaiACNgIADAILIABBADYCBCAAQQhqIAI2AgAMAQsgAEEANgIECyAAQQE2AgALtAEBA38jAEEQayICJAAgAkKAgICAwAA3AgQgAkEANgIMQQAgAUEIayIEIAEgBEkbIgFBA3YgAUEHcUEAR2oiBARAQQghAQNAIAIoAgQgA0YEQCACQQRqIAMQeCACKAIMIQMLIAIoAgggA0ECdGogATYCACACIAIoAgxBAWoiAzYCDCABQQhqIQEgBEEBayIEDQALCyAAIAIpAgQ3AgAgAEEIaiACQQxqKAIANgIAIAJBEGokAAu9AQEBfyMAQRBrIgskACAAKAIUIAEgAiAAQRhqKAIAKAIMEQEAIQEgC0EAOgANIAsgAToADCALIAA2AgggC0EIaiADIAQgBSAGECAgByAI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BigCBCAEQQF0akEAOwEAIAYgBigCCEEBajYCCAwBCyAEQQFrIQUgBARAIAYoAgQgBUEBdGoiBCAELwEAQQpsIAJqQTBrOwEADAELIAVBAEGIpcAAEFkACwwJCyAGQQc6ABggBhBNDAgLIAZBAzoAGCAGEE0MBwsgAyACECYMBgsgBkEAOgAYAkACQAJAAkACQAJAAkACQAJAIAZBFGooAgBFBEAgAkHg//8AcUHAAEYNASACQTdrDgICAwQLIAZBEGooAgAhBCACQTBGDQQgAkE4Rg0FIAQoAgAhBAwHCyADIAJBQGtB/wFxECYMBwsgA0H0AGogAykBqgE3AQAgA0H+AGogAy8BtgE7AQAgA0HwAGogA0HkAGooAgA2AgAgA0H8AGogA0GyAWovAQA7AQAgAyADKAJgIgIgAygClAFBAWsiBCACIARJGzYCbAwGCyADQQA6ALkBIAMgAykCbDcCYCADIANB9ABqKQEANwGqASADQbIBaiADQfwAai8BADsBACADIANB/gBqLwEAOwG2AQwFCyACQeMARw0EIAZBADoAGCMAQeAAayICJAAgAkEIaiADKAKUASIEIAMoApgBIgUgAygCQCADQcQAaigCAEEAEC0gAkEoaiAEIAVBAUEAQQAQLSADQQhqIgUQgAEgAygCCARAIANBDGooAgAQFQsgAyACKQIINwIAIANBGGogAkEIaiIEQRhqKQIANwIAIANBEGogBEEQaikCADcCACAFIARBCGopAgA3AgAgA0EgaiEEIANBKGoiBRCAASAFKAIABEAgA0EsaigCABAVCyAEIAIpAig3AgAgA0EAOgC0ASAEQRhqIAJBKGoiBUEYaikCADcCACAEQRBqIAVBEGopAgA3AgAgBEEIaiAFQQhqKQIANwIAIAJB1ABqIAMoApQBED4gA0HIAGohBCADKAJIBEAgA0HMAGooAgAQFQsgBCACKQJUNwIAIARBCGogAkHUAGoiB0EIaiIEKAIANgIAIANBsgFqQQA7AQAgA0GuAWpBAjoAACADQQI6AKoBIANB6ABqQQE6AAAgA0IANwJgIANBADsBqAEgA0EAOgC5ASADQYCABDYAtQEgA0IANwKcASADQZABakGAgIAINgIAIANBjAFqQQI6AAAgA0GIAWpBAjoAACADQYQBakEANgIAIANB/ABqQoCAgAg3AgAgA0H4AGpBAjoAACADQfQAakECOgAAIANCADcCbCADIAMoApgBIgVBAWs2AqQBIAIgBRBmIARBADYCACACIAIpAwA3AlQgByAFQQEQTyACQdAAaiAEKAIANgIAIAIgAikCVDcDSCADQdQAaiEEIAMoAlQEQCADQdgAaigCABAVCyAEIAIpA0g3AgAgBEEIaiACQdAAaigCADYCACADQQA6ALsBIAJB4ABqJAAMBAsgBCgCACIEQShGDQEMAgsgBCgCACIEQSNHDQEjAEEQayICJAACQAJAIAMoApgBIggEQCADQdgAaigCACEKIANB3ABqKAIAIQQgAygClAEhBwNAIAcEQEEAIQUDQCACQQA7AQwgAkECOgAIIAJBAjoABCACQcUANgIAIAMgBSAJIAIQgQEgByAFQQFqIgVHDQALCyAEIAlGDQIgCSAKakEBOgAAIAggCUEBaiIJRw0ACwsgAkEQaiQADAELIAQgBEHQqcAAEFkACwwCCyADQQE6AKgBDAELAkACQCAEQShrDgIAAQILIANBADoAqAEMAQsgAkEwRgRAIANBAToAqQEMAQsgA0EAOgCpAQsMBQsgBkEGOgAYDAQLIAZBADoAGAwDCyAGQQA6ABgCQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAAkACQAJAIAZBFGooAgBFBEAgAkFAag42AQIDEgQFBiIWBwgJCgsjIwwjIw0OIyMPECMRIyMjIyMiEhMjFBUWFxgjIyMhICMjIyMfHh0cIwsgBkEQaigCACEEAkAgAkHsAGsOBRkjIyMbAAsgAkHoAEYNGQwiCyMAQRBrIgIkACAGKAIEQZilwAAgBigCCBsvAQAhBSADQeQAaigCACEEIAMoAmAhByACQQxqIANBsgFqLwEAOwEAIAJBIDYCACACIAMpAaoBNwIEIAMoAhQgB2shCCADIARBtJzAABB9IAcgBUEBIAVBAUsbIgUgCCAFIAhJGyACEEEgA0HcAGooAgAiBSAETQRAIAQgBUHQqcAAEFkACyADQdgAaigCACAEakEBOgAAIAJBEGokAAwhCyADQQA6ALkBIAMgAygCYCICIAMoApQBQQFrIgQgAiAESRs2AmBBACADKAKgASICIANB5ABqIgQoAgAiBSACSRshAiAEIAIgBSAGKAIEQZilwAAgBigCCBsvAQAiBEEBIARBAUsbayIEIAIgBEobNgIADCALIAMgBhBUDB8LIAMtALkBIQIgA0EAOgC5ASADQQAgAygCYCAGKAIEQZilwAAgBigCCBsvAQAiBEEBIARBAUsbIgRBf3NBACAEayACG2oiAiADKAKUASIEQQFrIAIgBEkbIAJBAEgbNgJgDB4LIANBADoAuQEgA0EANgJgIAMoApgBQQFrIAMoAqQBIgIgA0HkAGoiBCgCACIFIAJLGyECIAQgAiAFIAYoAgRBmKXAACAGKAIIGy8BACIEQQEgBEEBSxtqIgQgAiAESRs2AgAMHQsgA0EAOgC5ASADQQA2AmBBACADKAKgASICIANB5ABqIgQoAgAiBSACSRshAiAEIAIgBSAGKAIEQZilwAAgBigCCBsvAQAiBEEBIARBAUsbayIEIAIgBEobNgIADBwLIwBBEGsiBSQAIAVBCGohCCADKAJgIQogA0HIAGoiBCgCBCECIAIgBCgCCEECdGohCwJ/AkAgBigCBEGYpcAAIAYoAggbLwEAIgRBASAEQQFLGyIJQQFrIgwEQEEBIQkDQCAHQQFqIQcDQCALIAIiBEYNAyAJQQFxBEAgBEEEaiECIAQoAgAgCk0NAQsLIARBBGohAkEAIQkgByAMRw0ACyAEQQRqIQILIAIhBANAIAQgC0YNAQJAIAwEQCACKAIAIQkMAQsgBCgCACEJIARBBGohBCAJIApNDQELC0EBDAELQQALIQIgCCAJNgIEIAggAjYCACAFKAIMIQIgBSgCCCEEIANBADoAuQEgAyACIAMoApQBIgJBAWsiByAEGyIEIAcgAiAESxs2AmAgBUEQaiQADBsLAkACQAJAAkAgBigCBEGYpcAAIAYoAggbLwEADgMAAQIDCyADIAMoAmAgA0HkAGoiAigCAEEBIAMgA0GqAWoQJyADQdQAaiACKAIAIAMoApgBEHAMAgsgAyADKAJgIANB5ABqIgIoAgBBAiADIANBqgFqECcgA0HUAGpBACACKAIAQQFqEHAMAQsgA0EAIAMoAhggA0GqAWoQUyADQdQAakEAIAMoApgBEHALDBoLAkACQAJAAkACQCAGKAIEQZilwAAgBigCCBsvAQAOAwABAgQLIAMoAhQhAiADKAJgIQQgAyADQeQAaigCACIFQYSdwAAQfSIHIAQgAiADQaoBahBIIAdBADoADAwCCyADKAIUIQIgAygCYEEBaiEEIAMgA0HkAGooAgAiBUGUncAAEH1BACAEIAIgAiAESxsgA0GqAWoQSAwBCyADKAIUIQIgAyADQeQAaigCACIFQaSdwAAQfSIEQQAgAiADQaoBahBIIARBADoADAsgA0HcAGooAgAiAiAFSwRAIANB2ABqKAIAIAVqQQE6AAAMAQsgBSACQdCpwAAQWQALDBkLIAMoApgBIAMoAqQBIgJBAWogAiADQeQAaigCACICSRshBCADIAIgBCAGKAIEQZilwAAgBigCCBsvAQAiBUEBIAVBAUsbIANBqgFqEFAgA0HUAGogAiAEEHAMGAsgAygCmAEgAygCpAEiAkEBaiACIANB5ABqKAIAIgJJGyEEIAMgAiAEIAYoAgRBmKXAACAGKAIIGy8BACIFQQEgBUEBSxsgA0GqAWoQISADQdQAaiACIAQQcAwXCyADKAJgIgIgAygClAEiBE8EQCADQQA6ALkBIAMgBEEBayICNgJgCyAGKAIEQZilwAAgBigCCBsvAQAiBEEBIARBAUsbIgQgAygCFCACayIFIAQgBUkbIQUgA0GqAWohCAJAAkAgAyADQeQAaigCACIHQcScwAAQfSIJKAIIIgQgAk8EQCAJKAIEIgogAkEEdGogBCACayAFEKEBIAQgBWshAiAEIAVJDQEgBQRAIAogBEEEdGohBCAKIAJBBHRqIQUgCEEIaiECA0AgBUEgNgIAIAUgCCkAADcABCAFQQxqIAIvAAA7AAAgBCAFQRBqIgVHDQALCwwCCyACIARBiKLAABBYAAsgAiAEQZiiwAAQWAALIAlBADoADCADQdwAaigCACICIAdNBEAgByACQdCpwAAQWQALIANB2ABqKAIAIAdqQQE6AAAMFgsgAyAGKAIEQZilwAAgBigCCBsvAQAiAkEBIAJBAUsbEJ8BDBULIAMgBigCBEGYpcAAIAYoAggbLwEAIgJBASACQQFLGxCgAQwUCwJAAkACQAJAIAYoAgRBmKXAACAGKAIIGy8BAA4GAAMBAwMCAwsgAygCYCICRQ0CIAIgAygClAFPDQIgA0HIAGogAhBRDAILIANByABqIAMoAmAQUgwBCyADQdAAakEANgIACwwTCyADIAMoAmAgA0HkAGoiAigCAEEAIAYoAgRBmKXAACAGKAIIGy8BACIEQQEgBEEBSxsgA0GqAWoQJyADQdwAaigCACIEIAIoAgAiAk0EQCACIARB0KnAABBZAAsgA0HYAGooAgAgAmpBAToAAAwSC0EAIQUjAEEQayILJAAgC0EIaiEMIAMoAmAhECADQcgAaiICKAIEIQcgByACKAIIQQJ0aiECAkACQAJAIAYoAgRBmKXAACAGKAIIGy8BACIEQQEgBEEBSxsiBEEBayIRRQ0AQQEhCgNAIAJBBGshBCAFIghBAWohBQJAA0AgBCICQQRqIAdGDQEgCgRAIAJBBGshBCACKAIAIBBPDQELC0EAIQpBASEJIAUgEUcNAQwCCwsgByECIAggEUcNAQsDQCACIAdGDQEgAkEEayICKAIAIQRBASEKIAkNAiAEIBBPDQALDAELQQAhCgsgDCAENgIEIAwgCjYCACALKAIMIQIgCygCCCEEIANBADoAuQEgAyACQQAgBBsiAiADKAKUASIEQQFrIAIgBEkbNgJgIAtBEGokAAwRCyADQQA6ALkBIANBACADKAJgIAYoAgRBmKXAACAGKAIIGy8BACICQQEgAkEBSxtqIgIgAygClAEiBEEBayACIARJGyACQQBIGzYCYAwQCyADKAJgIgIEQCAGKAIEQZilwAAgBigCCBsvAQAiBEEBIARBAUsbIQUgAkEBayEEIANB5ABqKAIAIQcjAEEQayICJAAgAkEIaiADEIQBAkACQCACKAIMIgggB0sEQCACKAIIIAdBBHRqIgcoAggiCCAETQ0BIAcoAgQgAkEQaiQAIARBBHRqIQIMAgsgByAIQZykwAAQWQALIAQgCEGcpMAAEFkACyACKAIAIQIDQCADIAIQGiAFQQFrIgUNAAsLDA8LIANBADoAuQEgAyADKAJgIgIgAygClAFBAWsiBCACIARJGzYCYCADQeQAaiADKAKgAUEAIAMtALYBIgQbIgIgBigCBEGYpcAAIAYoAggbLwEAIgVBASAFQQFLG2pBAWsiBSACIAIgBUkbIgIgAygCpAEgAygCmAFBAWsgBBsiBCACIARJGzYCAAwOCyADIAYQVAwNCyADQQA6ALkBIANB5ABqIAMoAqABQQAgAy0AtgEiBBsiAiAGKAIEIgVBmKXAACAGKAIIIgcbLwEAIghBASAIQQFLG2pBAWsiCCACIAIgCEkbIgIgAygCpAEgAygCmAFBAWsgBBsiBCACIARJGzYCACADIAVBAmpBmKXAACAHQQFLGy8BACICQQEgAkEBSxtBAWsiBCADKAKUASIFQQFrIgIgBCAFSRsiBCACIAIgBEsbNgJgDAwLAkACQAJAIAYoAgRBmKXAACAGKAIIGy8BAA4EAAICAQILIANByABqIAMoAmAQUgwBCyADQdAAakEANgIACwwLCyAGKAIIIgJFDQogBigCBCEEIAJBAXQhAgNAAkACQCAELwEAIgVBBEcEQCAFQRRGDQEMAgsgA0EBOgC1AQwBCyADQQE6ALgBCyAEQQJqIQQgAkECayICDQALDAoLIAQoAgBBP0cNCSAGKAIIIgIEQCAGKAIEIQUgAkEBdCEEIANBqgFqIQIgA0H0AGohBwNAAkACQCAFLwEAIghBlghNBEACQAJAAkACQCAIQQZrDgIBAgALIAhBGUYNAiAIQS9GDQQMBQsgA0EAOgC5ASADQgA3AmAgA0EAOgC2AQwECyADQQA6ALcBDAMLIANBADoAaAwCCwJAAkAgCEGXCGsOAwIBAAMLIAMQRyADQQA6ALkBIAMgAykCbDcCYCACIAcpAQA3AQAgAkEIaiAHQQhqLwEAOwEAIAMgAy8BfjsBtgEgAxA2DAILIANBADoAuQEgAyADKQJsNwJgIAIgBykBADcBACADIAMvAX47AbYBIAJBCGogB0EIai8BADsBAAwBCyADEEcgAxA2CyAFQQJqIQUgBEECayIEDQALCwwJCyAEKAIAQT9HDQggBigCCCICBEAgBigCBCEEIAJBAXQhBSADQfQAaiEHIANBqgFqIQgDQAJAAkACQCAELwEAIgJBlghNBEACQAJAAkACQCACQQZrDgIBAgALIAJBGUYNAiACQS9GDQQMBgsgA0EBOgC2ASADQQA6ALkBIANBADYCYCADIAMoAqABNgJkDAULIANBAToAtwEMBAsgA0EBOgBoDAMLAkAgAkGXCGsOAwECAAMLIAMgAygCZDYCcCAHIAgpAQA3AQAgAyADLwG2ATsBfiAHQQhqIAhBCGovAQA7AQAgAyADKAJgIgIgAygClAFBAWsiCSACIAlJGzYCbAtBACEJIwBBIGsiAiQAIAMtALQBRQRAIANBAToAtAEDQCADIAlqIgpBgAFqIgsoAgAhDCALIApB7ABqIgooAgA2AgAgCiAMNgIAIAlBBGoiCUEURw0AC0EAIQkDQCADIAlqIgpBIGoiCygCACEMIAsgCigCADYCACAKIAw2AgAgCUEEaiIJQSBHDQALIAIgAygClAEgAygCmAEiCUEBQQAgA0GqAWoQLSADQQhqIgoQgAEgAygCCARAIANBDGooAgAQFQsgAyACKQIANwIAIANBGGogAkEYaikCADcCACADQRBqIAJBEGopAgA3AgAgCiACQQhqKQIANwIAIANB1ABqQQAgCRBwCyACQSBqJAAgAxA2DAELIAMgAygCZDYCcCAHIAgpAQA3AQAgAyADLwG2ATsBfiAHQQhqIAhBCGovAQA7AQAgAyADKAJgIgIgAygClAFBAWsiCSACIAlJGzYCbAsgBEECaiEEIAVBAmsiBQ0ACwsMCAsgBCgCAEEhRw0HIANBADsAtQEgA0ECOgCqASADQQA7AagBIANCADcCnAEgA0IANwJsIANB6ABqQQE6AAAgA0GyAWpBADsBACADQa4BakECOgAAIANB/ABqQYCAgAg2AgAgA0H4AGpBAjoAACADQfQAakECOgAAIAMgAygCmAFBAWs2AqQBDAcLIANBADoAuQEgAyADKQJsNwJgIAMgA0H0AGopAQA3AaoBIANBsgFqIANB/ABqLwEAOwEAIAMgA0H+AGovAQA7AbYBDAYLAkAgAy0AugFFDQAgBigCBCICQZilwAAgBigCCCIEGy8BAEEIRw0AIAJBAmpBmKXAACAEQQFLGy8BACIFIAMoApgBIgkgBRshCiACQQRqQZilwAAgBEECSxsvAQAiBCADKAKUASICIAQbIQgCQAJAAkACQEF/IAIgCEcgAiAISxtB/wFxDgIDAQALIANB0ABqKAIAIgIEQCADQcwAaigCACELIAIhBANAIAsgAkEBdiAHaiICQQJ0aigCACAISSEFIAQgAiAFGyIEIAJBAWogByAFGyIHayECIAQgB0sNAAsLIAMgBzYCUAwBCyADQcgAaiEFQQAgCCACQXhxQQhqIgRrIgIgAiAISxsiAkEDdiACQQdxQQBHaiICBEBBACACayEJIAUoAgghAgNAIAUoAgAgAkYEQCAFIAIQeCAFKAIIIQILIAUoAgQgAkECdGogBDYCACAFIAUoAghBAWoiAjYCCCAEQQhqIQQgCUEBaiIJDQALCyAD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IQggAygCBCEJA0AgBUEIaiACEFwgBSgCCCEKIAUoAgwgCSAHEO8BIQsgACgCAARAIABBBGooAgAQFQsgACAIOgAMIAAgAjYCCCAAIAs2AgQgACAKNgIAIAYgAEEQaiIARw0ACwsgASgCAARAIAEoAgQQFQsgASADKQIANwIAIAFBCGogA0EIaikCADcCAAwBCyADKAIARQ0AIAMoAgQQFQsgBUEQaiQAIARBIGokAA8LIAEgAkHknsAAEFsACyACIABB5J7AABBaAAt8AQJ/IABBADoAuQEgACAAKAJgIgIgACgClAFBAWsiAyACIANJGzYCYCAAKAKYAUEBayAAKAKkASICIAIgAEHkAGoiAigCACIDSRshACACIAAgAyABKAIEQZilwAAgASgCCBsvAQAiAUEBIAFBAUsbaiIBIAAgAUkbNgIAC2sBBX8CQCAAKAIIIgJFDQAgACgCBEEQayEEIAJBBHQhAyACQQFrQf////8AcUEBaiEFAkADQCADIARqEGtFDQEgAUEBaiEBIANBEGsiAw0ACyAFIQELIAFBAWsgAk8NACAAIAIgAWs2AggLC3UBAn8jAEEQayIEJAAgBEEIaiABKAIQIAIgAxDAASAEKAIMIQIgBCgCCCIDRQRAAkAgASgCCEUNACABQQxqKAIAIgVBhAFJDQAgBRAACyABQQE2AgggAUEMaiACNgIACyAAIAM2AgAgACACNgIEIARBEGokAAt2AQF/IwBBMGsiAiQAIAIgATYCBCACIAA2AgAgAkEIaiIAQQxqQgI3AgAgAkEgaiIBQQxqQdUANgIAIAJBAzYCDCACQcjiwAA2AgggAkHVADYCJCACIAE2AhAgAiACQQRqNgIoIAIgAjYCICAAQfyawAAQkwEAC3MBAX8jAEEwayIDJAAgAyAANgIAIAMgATYCBCADQQhqIgBBDGpCAjcCACADQSBqIgFBDGpB1QA2AgAgA0ECNgIMIANBoOnAADYCCCADQdUANgIkIAMgATYCECADIANBBGo2AiggAyADNgIgIAAgAhCTAQALcwEBfyMAQTBrIgMkACADIAE2AgQgAyAANgIAIANBCGoiAEEMakICNwIAIANBIGoiAUEMakHVADYCACADQQI2AgwgA0HU5MAANgIIIANB1QA2AiQgAyABNgIQIAMgAzYCKCADIANBBGo2AiAgACAC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CCEDIARBDGooAgAhAiAEKAIAIQcgBCgCBCEIIAQtABAhBCMAQSBrIgEkACAAIAMgAiAHIAhBABAtIABBIGogAyACQQFBAEEAEC0gASACEGYgAUEUaiIGQQhqIglBADYCACABIAEpAwA3AhQgBiACQQEQTyABQRBqIgYgCSgCADYCACABIAEpAhQ3AwggAEHIAGogAxA+IABBADoAtAEgACACNgKYASAAIAM2ApQBIABBkAFqQYCAgAg2AgAgAEGMAWpBAjoAACAAQYgBakECOgAAIABBhAFqQQA2AgAgAEH8AGpCgICACDcCACAAQfgAakECOgAAIABB9ABqQQI6AAAgAEIANwJsIAAgBzYCQCAAQcQAaiAINgIAIABB6ABqQQE6AAAgAEECOgCqASAAQa4BakECOgAAIABBsgFqQQA7AQAgAEIANwJgIABBADsBqAEgAEGAgAQ2ALUBIABBADoAuQEgAEIANwKcASAAIAJBAWs2AqQBIABBADoAuwEgACAEOgC6ASAAIAEpAwg3AlQgAEHcAGogBigCADYCACABQSBqJABBrf3AAC0AABpB3AFBBBDJASIBRQRAQQRB3AFB6P3AACgCACIAQdYAIAAbEQIAAAsgAUEANgIAIAFBBGogAEHYARDvARogBUHwAWokACABC2ABAX8CQAJAAkAgAUUEQEEBIQIMAQsgAUEASA0BQa39wAAtAAAaIAFBARDJASICRQ0CCyAAIAI2AgQgACABNgIADwsQkgEAC0EBIAFB6P3AACgCACIAQdYAIAAbEQIAAAvpBAEHfyMAQRBrIgYkACAGQQhqIAEgAkECEFYCfyAGKAIIBEBBASECIAYoAgwMAQsjAEEgayIFJAAgASICKAIIIQEgAkEANgIIAn8CQAJAIAEEQCAFIAJBDGooAgAiATYCFCAFQQhqIQkgAigCECEHIwBB0ABrIgQkAAJAIAMtAABFBEAgBCADLQABuBADNgIEIARBADYCACAEKAIEIQMgBCgCACEHDAELIARBIGoiCkEMakIDNwIAIARBzABqQSo2AgAgBEE4aiIIQQxqQSo2AgAgBEEENgIkIARBrJDAADYCICAEIANBA2o2AkggBCADQQJqNgJAIARBKjYCPCAEIANBAWo2AjggBCAINgIoIARBFGoiCCAKEB0gBEEIaiAHIAQoAhggBCgCHBDA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AgwMAQsgBEEQaiEGIAJBBGohAiMAQUBqIgEkACABQTBqIARBHGoQtgECfwJAAkACfwJAIAEoAjAEQCABQSBqIgVBCGogAUE4aigCADYCACABIAEpAjA3AyAgAUEYaiAFIAIQYyABKAIYRQ0BIAEoAhwMAgsgASgCNCECDAILIAFBEGogAUEgaiACQQRqEGMgASgCEEUNAiABKAIUCyECIAEoAiQiBUGEAUkNACAFEAALQQEMAQsgAUEwaiICQQhqIAFBKGooAgA2AgAgASABKQMgNwMwIAFBCGoiBSACKAIENgIEIAVBADYCACABKAIMIQIgASgCCAshBSAGIAI2AgQgBiAFNgIAIAFBQGskACAEKAIQIQEgBCgCFAs2AgQgAyABNgIAIARBIGokACADKAIEIQIgAygCAARAIAMgAjYCFEGwgMAAQSsgA0EUakHcgMAAQcCEwAAQTgALIANBIGokACAAIAAoAgBBAWs2AgAgAg8LEOMBAAsQ5AEAC0UBAX8gAiABayIDIAAoAgAgACgCCCICa0sEQCAAIAIgAxB7IAAoAgghAgsgACgCBCACaiABIAMQ7wEaIAAgAiADajYCCAtGAQN/IAFBEGooAgAiAiABKAIYIgNrIQQgAiADSQRAIAQgAkHEnsAAEFgACyAAIAM2AgQgACABQQxqKAIAIARBBHRqNgIAC0YBA38gAUEQaigCACICIAEoAhgiA2shBCACIANJBEAgBCACQdSewAAQWAALIAAgAzYCBCAAIAFBDGooAgAgBEEEdGo2AgALTwECfyAAKAIEIQIgACgCACEDAkAgACgCCCIALQAARQ0AIANBsObAAEEEIAIoAgwRAQBFDQBBAQ8LIAAgAUEKRjoAACADIAEgAigCEBEAAAtNAQF/IwBBEGsiAiQAIAIgACgCACIAQQxqNgIMIAFBtI/AAEEEQbiPwABBBSAAQcCPwABB0I/AAEEHIAJBDGpB2I/AABA/IAJBEGokAAtCAQF/IAIgACgCACAAKAIIIgNrSwRAIAAgAyACEDggACgCCCEDCyAAKAIEIANqIAEgAhDvARogACACIANqNgIIQQALXwECf0Gt/cAALQAAGiABKAIEIQIgASgCACEDQQhBBBDJASIBRQRAQQRBCEHo/cAAKAIAIgBB1gAgABsRAgAACyABIAI2AgQgASADNgIAIABBiN/AADYCBCAAIAE2AgALQgEBfyACIAAoAgAgACgCCCIDa0sEQCAAIAMgAhA5IAAoAgghAwsgACgCBCADaiABIAIQ7wEaIAAgAiADajYCCEEAC0gBAX8jAEEgayIDJAAgA0EMakIANwIAIANBATYCBCADQYzjwAA2AgggAyABNgIcIAMgADYCGCADIANBGGo2AgAgAyACEJMBAAtJAQF/IwBBEGsiAiQAIAIgADYCDCABQYCAwABBAkGCgMAAQQYgAEG8AWpBiIDAAEGYgMAAQQggAkEMakGggMAAED8gAkEQaiQAC/4BAQJ/IwBBEGsiAyQAIAMgACgCACIAQQRqNgIMIwBBEGsiAiQAIAIgASgCFEGQj8AAQQQgAUEYaigCACgCDBEBADoADCACIAE2AgggAkEAOgANIAJBADYCBCACQQRqIABBlI/AABAqIANBDGpBpI/AABAqIQACfyACLQAMIgFBAEcgACgCACIARQ0AGkEBIAENABogAigCCCEBAkAgAEEBRw0AIAItAA1FDQAgAS0AHEEEcQ0AQQEgASgCFEHE5sAAQQEgAUEYaigCACgCDBEBAA0BGgsgASgCFEHS48AAQQEgAUEYaigCACgCDBEBAAsgAkEQaiQAIANBEGokAAs5AAJAAn8gAkGAgMQARwRAQQEgACACIAEoAhARAAANARoLIAMNAUEACw8LIAAgAyAEIAEoAgwRAQALzAIBA38gACgCACEAIAEoAhwiA0EQcUUEQCADQSBxRQRAIAAzAQAgARAjDwsjAEGAAWsiAyQAIAAvAQAhAkEAIQADQCAAIANqQf8AakEwQTcgAkEPcSIEQQpJGyAEajoAACAAQQFrIQAgAkH//wNxIgRBBHYhAiAEQRBPDQALIABBgAFqIgJBgAFLBEAgAkGAAUHk5sAAEFgACyABQfTmwABBAiAAIANqQYABakEAIABrEBQgA0GAAWokAA8LIwBBgAFrIgMkACAALwEAIQJBACEAA0AgACADakH/AGpBMEHXACACQQ9xIgRBCkkbIARqOgAAIABBAWshACACQf//A3EiBEEEdiECIARBEE8NAAsgAEGAAWoiAkGAAUsEQCACQYABQeTmwAAQWAALIAFB9ObAAEECIAAgA2pBgAFqQQAgAGsQFCADQYABaiQACzcBAX8gACgCACEAIAEoAhwiAkEQcUUEQCACQSBxRQRAIAAgARDXAQ8LIAAgARBFDwsgACABEEILNwEBfyAAKAIAIQAgASgCHCICQRBxRQRAIAJBIHFFBEAgACABENgBDwsgACABEEMPCyAAIAEQRAtAAQF/IwBBIGsiACQAIABBFGpCADcCACAAQQE2AgwgAEGA4cAANgIIIABBsODAADYCECAAQQhqQYjhwAAQkwEAC7YCAQJ/IwBBIGsiAiQAIAJBATsBHCACIAE2AhggAiAANgIUIAJBkOTAADYCECACQYzjwAA2AgwjAEEQayIBJAAgAkEMaiIAKAIIIgJFBEBBoN3AAEErQejewAAQiwEACyABIAAoAgw2AgwgASAANgIIIAEgAjYCBCMAQRBrIgAkACABQQRqIgEoAgAiAkEMaigCACEDAkACfwJAAkAgAigCBA4CAAEDCyADDQJBACECQaDdwAAMAQsgAw0BIAIoAgAiAygCBCECIAMoAgALIQMgACACNgIEIAAgAzYCACAAQZjfwAAgASgCBCIAKAIIIAEoAgggAC0AECAALQAREDQACyAAIAI2AgwgAEGAgICAeDYCACAAQazfwAAgASgCBCIAKAIIIAEoAgggAC0AECAALQAREDQACzABAX8gASgCHCICQRBxRQRAIAJBIHFFBEAgACABENgBDwsgACABEEMPCyAAIAEQRAswAQF/IAEoAhwiAkEQcUUEQCACQSBxRQRAIAAgARDXAQ8LIAAgARBFDwsgACABEEILMwEBfyMAQRBrIgIkACACIAAoAgA2AgwgAUHMkMAAQQ0gAkEMakHckMAAEDMgAkEQaiQACzIAAkAgAEH8////B0sNACAARQRAQQQPC0Gt/cAALQAAGiAAQQQQyQEiAEUNACAADwsACzABAX8jAEEQayICJAAgAiAANgIMIAFB/4HAAEEGIAJBDGpBiILAABAzIAJBEGokAAswAQF/IwBBEGsiAiQAIAIgADYCDCABQfSDwABBBSACQQxqQfyDwAAQMyACQRBqJAALMAEBfyMAQRBrIgIkACACIAA2AgwgAUGchsAAQQQgAkEMakGghsAAEDMgAkEQaiQACzABAX8jAEEQayICJAAgAiAANgIMIAFB1ozAAEEKIAJBDGpB4IzAABAzIAJBEGokAAu/EwIYfwV+IwBBEGsiFCQAIBQgATYCDCAUIAA2AgggFEEIaiEA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AgQQFQsLLwECfyAAIAAoAqABIgIgACgCpAFBAWoiAyABIABBqgFqECEgAEHUAGogAiADEHALLwECfyAAIAAoAqABIgIgACgCpAFBAWoiAyABIABBqgFqEFAgAEHUAGogAiADEHALKwAgASACSQRAQbSnwABBI0GkqMAAEIsBAAsgAiAAIAJBBHRqIAEgAmsQEws1AQF/IAEoAhRBjOTAAEEBIAFBGGooAgAoAgwRAQAhAiAAQQA6AAUgACACOgAEIAAgATYCAAsjAAJAIAFB/P///wdNBEAgACABQQQgAhC/ASIADQELAAsgAAslACAARQRAQeCXwABBMhDiAQALIAAgAiADIAQgBSABKAIQEQgACzMAIAEoAhQgAC0AAEECdCIAQYiFwABqKAIAIABB0ITAAGooAgAgAUEYaigCACgCDBEBAAszACABKAIUIAAtAABBAnQiAEGwjcAAaigCACAAQaSNwABqKAIAIAFBGGooAgAoAgwRAQALMwAgASgCFCAALQAAQQJ0IgBBxJPAAGooAgAgAEG4k8AAaigCACABQRhqKAIAKAIMEQEACyMAIABFBEBB4JfAAEEyEOIBAAsgACACIAMgBCABKAIQEQUACyMAIABFBEBB4JfAAEEyEOIBAAsgACACIAMgBCABKAIQERgACyMAIABFBEBB4JfAAEEyEOIBAAsgACACIAMgBCABKAIQERoACyMAIABFBEBB4JfAAEEyEOIBAAsgACACIAMgBCABKAIQERwACyMAIABFBEBB4JfAAEEyEOIBAAsgACACIAMgBCABKAIQEQwACx8AIAAoAgBBgICAgHhyQYCAgIB4RwRAIAAoAgQQFQsLMQAgASgCFEGdkMAAQZiQwAAgACgCAC0AACIAG0EHQQUgABsgAUEYaigCACgCDBEBAAshACAARQRAQeCXwABBMhDiAQALIAAgAiADIAEoAhARAwALEQAgACgCAARAIAAoAgQQFQsLIgAgAC0AAEUEQCABQeDowABBBRARDwsgAUHl6MAAQQQQEQsuACABKAIUQfuLwABB9IvAACAALQAAIgAbQQlBByAAGyABQRhqKAIAKAIMEQEACx8AIABFBEBB4JfAAEEyEOIBAAsgACACIAEoAhARAAALDwAgABCwASAAQQxqELABCxsAEAchAiAAQQA2AgggACACNgIEIAAgATYCAAsdAQF/EAchAiAAQQA2AgggACACNgIEIAAgATYCAAu5AwICfgZ/QbD9wAAoAgBFBEAjAEEwayIDJAACfwJAIAAEQCAAKAIAIABBADYCAA0BCyADQRBqQZiVwAApAwA3AwAgA0GQlcAAKQMANwMIQQAMAQsgA0EQaiAAQRBqKQIANwMAIAMgACkCCDcDCCAAKAIECyEAQbD9wAApAgAhAUG0/cAAIAA2AgBBsP3AAEEBNgIAIANBGGoiAEEQakHA/cAAKQIANwMAIABBCGoiAEG4/cAAKQIANwMAQbj9wAAgAykDCDcCAEHA/cAAIANBEGopAwA3AgAgAyABNwMYIAGnBEACQCAAKAIEIgZFDQAgACgCDCIHBEAgACgCACIEQQhqIQUgBCkDAEJ/hUKAgYKEiJCgwIB/gyEBA0AgAVAEQANAIARB4ABrIQQgBSkDACAFQQhqIQVCf4VCgIGChIiQoMCAf4MiAVANAAsLIAFCAX0hAiAEIAF6p0EDdkF0bGpBBGsoAgAiCEGEAU8EQCAIEAALIAEgAoMhASAHQQFrIgcNAAsLIAZBAWqtQgx+p0EHakF4cSIEIAZqQXdGDQAgACgCACAEaxAVCwsgA0EwaiQAC0G0/cAACxYAIAAoAgBBgICAgHhHBEAgABCwAQsLHAAgASgCFEHj48AAQQ4gAUEYaigCACgCDBEBAAsUACAAKAIAIgBBhAFPBEAgABAACwuXAQECfyAAKAIAIgAoAgQhAiAAKAIIIQMjAEEQayIAJAAgAEEEaiABEKIBIAMEQCADQQJ0IQEDQCAAIAI2AgwgAEEEaiAAQQxqQdyRwAAQKSACQQRqIQIgAUEEayIBDQALCyAAQQRqIgEtAAQEf0EBBSABKAIAIgEoAhRBxubAAEEBIAFBGGooAgAoAgwRAQALIABBEGokAAuXAQECfyAAKAIAIgAoAgQhAiAAKAIIIQMjAEEQayIAJAAgAEEEaiABEKIBIAMEQCADQQF0IQEDQCAAIAI2AgwgAEEEaiAAQQxqQZyRwAAQKSACQQJqIQIgAUECayIBDQALCyAAQQRqIgEtAAQEf0EBBSABKAIAIgEoAhRBxubAAEEBIAFBGGooAgAoAgwRAQALIABBEGokAAuXAQECfyAAKAIAIgAoAgQhAiAAKAIIIQMjAEEQayIAJAAgAEEEaiABEKIBIAMEQCADQQJ0IQEDQCAAIAI2AgwgAEEEaiAAQQxqQbyRwAAQKSACQQRqIQIgAUEEayIBDQALCyAAQQRqIgEtAAQEf0EBBSABKAIAIgEoAhRBxubAAEEBIAFBGGooAgAoAgwRAQALIABBEGokAAuQAQECfyAAKAIAIgAoAgQhAiAAKAIIIQMjAEEQayIAJAAgAEEEaiABEKIBIAMEQANAIAAgAjYCDCAAQQRqIABBDGpBzJHAABApIAJBAWohAiADQQFrIgMNAAsLIABBBGoiAS0ABAR/QQEFIAEoAgAiASgCFEHG5sAAQQEgAUEYaigCACgCDBEBAAsgAEEQaiQAC8kFAQZ/AkACQAJAAkAgAkEJTwRAIAIgAxAcIgINAUEAIQAMBAtBACECIANBzP97Sw0BQRAgA0ELakF4cSADQQtJGyEEIABBBGsiBigCACIFQXhxIQcCQCAFQQNxRQRAIARBgAJJDQEgByAEQQRySQ0BIAcgBGtBgYAITw0BDAULIABBCGsiCCAHaiEJAkACQAJAAkAgBCAHSwRAIAlBrIHBACgCAEYNBCAJQaiBwQAoAgBGDQIgCSgCBCIBQQJxDQUgAUF4cSIBIAdqIgUgBEkNBSAJIAEQHyAFIARrIgNBEEkNASAGIAQgBigCAEEBcXJBAnI2AgAgBCAIaiICIANBA3I2AgQgBSAIaiIBIAEoAgRBAXI2AgQgAiADEBsMCQsgByAEayICQQ9LDQIMCAsgBiAFIAYoAgBBAXFyQQJyNgIAIAUgCGoiASABKAIEQQFyNgIEDAcLQaCBwQAoAgAgB2oiASAESQ0CAkAgASAEayIDQQ9NBEAgBiAFQQFxIAFyQQJyNgIAIAEgCGoiASABKAIEQQFyNgIEQQAhAwwBCyAGIAQgBUEBcXJBAnI2AgAgBCAIaiICIANBAXI2AgQgASAIaiIBIAM2AgAgASABKAIEQX5xNgIEC0GogcEAIAI2AgBBoIHBACADNgIADAYLIAYgBCAFQQFxckECcjYCACAEIAhqIgEgAkEDcjYCBCAJIAkoAgRBAXI2AgQgASACEBsMBQtBpIHBACgCACAHaiIBIARLDQMLIAMQDyIBRQ0BIAEgACAGKAIAIgFBeHFBfEF4IAFBA3EbaiIBIAMgASADSRsQ7wEgABAVIQAMAwsgAiAAIAEgAyABIANJGxDvARogABAVCyACIQAMAQsgBiAEIAVBAXFyQQJyNgIAIAQgCGoiAiABIARrIgFBAXI2AgRBpIHBACABNgIAQayBwQAgAjYCAAsgAAsUACAAIAIgAxAFNgIEIABBADYCAAsLACABBEAgABAVCwsTACABKAIUIAFBGGooAgAgABAWCxEAIABBCGoiABCAASAAELABCxMAIAAoAgAgASgCACACKAIAEAwLEAAgACABIAEgAmoQgwFBAAsUACAAKAIAIAEgACgCBCgCDBEAAAuSAQECfyAAKAIEIQIgACgCCCEDIwBBEGsiACQAIABBBGogARCiASADBEAgA0EEdCEBA0AgACACNgIMIABBBGogAEEMakGMkcAAECkgAkEQaiECIAFBEGsiAQ0ACwsgAEEEaiIBLQAEBH9BAQUgASgCACIBKAIUQcbmwABBASABQRhqKAIAKAIMEQEACyAAQRBqJAALkgEBAn8gACgCBCECIAAoAgghAyMAQRBrIgAkACAAQQRqIAEQogEgAwRAIANBBHQhAQNAIAAgAjYCDCAAQQRqIABBDGpB7JHAABApIAJBEGohAiABQRBrIgENAAsLIABBBGoiAS0ABAR/QQEFIAEoAgAiASgCFEHG5sAAQQEgAUEYaigCACgCDBEBAAsgAEEQaiQACxkAAn8gAUEJTwRAIAEgABAcDAELIAAQDwsLEQAgACgCBCAAKAIIIAEQ6wELqAIBBn8jAEEQayIFJAACQAJAAkAgASgCCCICIAEoAgBPDQAgBUEIaiEGIwBBIGsiBCQAAkAgASgCACIDIAJPBEACf0GBgICAeCADRQ0AGiABKAIEIQcCQCACRQRAQQEhAyAHEBUMAQtBASAHIANBASACEL8BIgNFDQEaCyABIAI2AgAgASADNgIEQYGAgIB4CyEDIAYgAjYCBCAGIAM2AgAgBEEgaiQADAELIARBFGpCADcCACAEQQE2AgwgBEG8mcAANgIIIARBmJnAADYCECAEQQhqQZCawAAQkwEACyAFKAIIIgJBgYCAgHhGDQAgAkUNASACIAUoAgxB6P3AACgCACIAQdYAIAAbEQIAAAsgBUEQaiQADAELEJIBAAsgACABKQIENwMACw4AIAAgASABIAJqEIMBCyAAIABC5N7HhZDQhd59NwMIIABCwff56MyTstFBNwMACyIAIABCjYSZ6OiU74GjfzcD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c3RkL3NyYy90aHJlYWQvbG9jYWwucnMAKAoQAE8AAAD2AAAAGgAAAP//////////iAoQAEGglcAAC9gVIGNhbid0IGJlIHJlcHJlc2VudGVkIGFzIGEgSmF2YVNjcmlwdCBudW1iZXKIChAAAAAAAKAKEAAsAAAARAAAAC9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby02ZjE3ZDIyYmJhMTUwMDFmL3NlcmRlLXdhc20tYmluZGdlbi0wLjQuNS9zcmMvbGliLnJzAAAA4AoQAGUAAAA1AAAADgAAAFRyaWVkIHRvIHNocmluayB0byBhIGxhcmdlciBjYXBhY2l0eVgLEAAkAAAAL3J1c3RjLzA3ZGNhNDg5YWMyZDkzM2M3OGQzYzUxNThlM2Y0M2JlZWZlYjAyY2UvbGlicmFyeS9hbGxvYy9zcmMvcmF3X3ZlYy5yc4QLEABMAAAAzwEAAAkAAABjbG9zdXJlIGludm9rZWQgcmVjdXJzaXZlbHkgb3IgYWZ0ZXIgYmVpbmcgZHJvcHBlZEpzVmFsdWUoKQASDBAACAAAABoMEAABAAAAbnVsbCBwb2ludGVyIHBhc3NlZCB0byBydXN0cmVjdXJzaXZlIHVzZSBvZiBhbiBvYmplY3QgZGV0ZWN0ZWQgd2hpY2ggd291bGQgbGVhZCB0byB1bnNhZmUgYWxpYXNpbmcgaW4gcnVzdAAAVHJpZWQgdG8gc2hyaW5rIHRvIGEgbGFyZ2VyIGNhcGFjaXR5mAwQACQAAAAvcnVzdGMvMDdkY2E0ODlhYzJkOTMzYzc4ZDNjNTE1OGUzZjQzYmVlZmViMDJjZS9saWJyYXJ5L2FsbG9jL3NyYy9yYXdfdmVjLnJzxAwQAEwAAADPAQAACQAAAC9ydXN0Yy8wN2RjYTQ4OWFjMmQ5MzNjNzhkM2M1MTU4ZTNmNDNiZWVmZWIwMmNlL2xpYnJhcnkvYWxsb2Mvc3JjL3ZlYy9tb2QucnMgDRAATAAAACQIAAAkAAAAIA0QAEwAAADvBQAAFQAAAGNhbGxlZCBgT3B0aW9uOjp1bndyYXAoKWAgb24gYSBgTm9uZWAgdmFsdWUvaG9tZS9ydW5uZXIvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9hdnQtMC4xMC4yL3NyYy9idWZmZXIucnMAAAC3DRAAWgAAAGEAAAANAAAAtw0QAFoAAABlAAAADQAAALcNEABaAAAAagAAAA0AAAC3DRAAWgAAAG8AAAAdAAAAtw0QAFoAAAB8AAAAJQAAALcNEABaAAAAhgAAACUAAAC3DRAAWgAAAI4AAAAVAAAAtw0QAFoAAACYAAAAJQAAALcNEABaAAAAnwAAABUAAAC3DRAAWgAAAKQAAAAlAAAAtw0QAFoAAACvAAAAEQAAALcNEABaAAAAvgAAABEAAAC3DRAAWgAAAMAAAAARAAAAtw0QAFoAAADKAAAADQAAALcNEABaAAAAzgAAABEAAAC3DRAAWgAAANEAAAANAAAAtw0QAFoAAAD7AAAAKwAAALcNEABaAAAAQAEAACwAAAC3DRAAWgAAADkBAAAbAAAAtw0QAFoAAABMAQAAFAAAALcNEABaAAAAXgEAABgAAAC3DRAAWgAAAGMBAAAYAAAAYXNzZXJ0aW9uIGZhaWxlZDogbGluZXMuaXRlcigpLmFsbCh8bHwgbC5sZW4oKSA9PSBjb2xzKQC3DRAAWgAAANIBAAAFAAAAYXNzZXJ0aW9uIGZhaWxlZDogbWlkIDw9IHNlbGYubGVuKCkvcnVzdGMvMDdkY2E0ODlhYzJkOTMzYzc4ZDNjNTE1OGUzZjQzYmVlZmViMDJjZS9saWJyYXJ5L2NvcmUvc3JjL3NsaWNlL21vZC5yc98PEABNAAAAaA0AAAkAAABhc3NlcnRpb24gZmFpbGVkOiBrIDw9IHNlbGYubGVuKCkAAADfDxAATQAAAJMNAAAJAAAAL2hvbWUvcnVubmVyLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYXZ0LTAuMTAuMi9zcmMvbGluZS5yc3AQEABYAAAAFgAAABMAAABwEBAAWAAAABoAAAATAAAAcBAQAFgAAAAeAAAAEwAAAHAQEABYAAAAHwAAABMAAABwEBAAWAAAACMAAAATAAAAcBAQAFgAAAAlAAAAEwAAAHAQEABYAAAAOgAAACUAAAAvaG9tZS9ydW5uZXIvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9hdnQtMC4xMC4yL3NyYy90YWJzLnJzOBEQAFgAAAAXAAAAFAAAAC9ob21lL3J1bm5lci8uY2FyZ28vcmVnaXN0cnkvc3JjL2luZGV4LmNyYXRlcy5pby02ZjE3ZDIyYmJhMTUwMDFmL2F2dC0wLjEwLjIvc3JjL3Rlcm1pbmFsLnJzoBEQAFwAAABwAQAAFQAAAKAREABcAAAApwEAABEAAACgERAAXAAAAOYCAAAjAAAAL2hvbWUvcnVubmVyLy5jYXJnby9yZWdpc3RyeS9zcmMvaW5kZXguY3JhdGVzLmlvLTZmMTdkMjJiYmExNTAwMWYvYXZ0LTAuMTAuMi9zcmMvcGFyc2VyLnJzAAAsEhAAWgAAAIwBAAAnAAAAAAAAAFIAAAAMAAAABAAAAFMAAABUAAAALgAAAGYmAACSJQAACSQAAAwkAAANJAAACiQAALAAAACxAAAAJCQAAAskAAAYJQAAECUAAAwlAAAUJQAAPCUAALojAAC7IwAAACUAALwjAAC9IwAAHCUAACQlAAA0JQAALCUAAAIlAABkIgAAZSIAAMADAABgIgAAowAAAMUiAAAvaG9tZS9ydW5uZXIvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi91bmljb2RlLXdpZHRoLTAuMS4xMS9zcmMvdGFibGVzLnJzMBMQAGQAAAAnAAAAGQAAADATEABkAAAALQAAAB0AAABhc3NlcnRpb24gZmFpbGVkOiBtaWQgPD0gc2VsZi5sZW4oKS9ydXN0Yy8wN2RjYTQ4OWFjMmQ5MzNjNzhkM2M1MTU4ZTNmNDNiZWVmZWIwMmNlL2xpYnJhcnkvY29yZS9zcmMvc2xpY2UvbW9kLnJz1xMQAE0AAABoDQAACQAAAGFzc2VydGlvbiBmYWlsZWQ6IGsgPD0gc2VsZi5sZW4oKQAAANcTEABNAAAAkw0AAAkAAAAvaG9tZS9ydW5uZXIvLmNhcmdvL3JlZ2lzdHJ5L3NyYy9pbmRleC5jcmF0ZXMuaW8tNmYxN2QyMmJiYTE1MDAxZi9hdnQtMC4xMC4yL3NyYy90ZXJtaW5hbC9kaXJ0eV9saW5lcy5yc2gUEABoAAAADAAAAA8AAABoFBAAaAAAABAAAAAPAAAAAAECAwMEBQYHCAkKCwwNDgMDAwMDAwMPAwMDAwMDAw8JCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCQkJCRAJCQkJCQkJERERERERERIREREREREREgBB8avAAAufFAECAwQFBgcGCAYJCgsMDQ4PEAYGBhESExQGFRYXGBkaGxwdHh8gISIjIiQlJicoKSolKywtLi8wMTIzNDU2Nzg5OgY7PAoKBgYGBgY9BgYGBgYGBgYGBgYGBgY+P0BBQgZDBkQGBgZFRkdISUpLTE0GBk4GBgYKBgYGBgYGBgZPUFFSU1RVVldYWQZaBgZbBlxdXl1fYGFiY2RlZmdoBgYGBgYGBgYGBgYGBmlqBgYGBgZrBgEGbAYGbW47OztvcHFyO3M7dHV2dzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozt4eQYGBgYGent8BgYGBn0GBn5/gIGCg4SFhgYGBoc7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzuIBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXTs7Ozs7Ozs7iQYGBgYGBgYGBgYGiosGAXGMBo0GBgYGBgYGjgYGBo8GkAYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGkQYGkgYGBgYGBgYGkwYGBgYGlJUGlpcGmJmam5ydnp+gLgahLKIGBqOkpaYGBqeoqaqrBqwGBgatBgYGrq8GsLGyswYGBgYGtAa1Bra3uAYGBga5ursGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGR7wGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGvb4GBgYGBgYGBgYGBgYGBgYGv8DBOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzvCOzs7Ozs7Ozs7Ozs7Ozs7Ozs7O8PEBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGxTs7OzvGxzs7Ozs7yAYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGyQYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgbKywYGBgYGBgbMzQYGzgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBs/Q0QYGBgYGBgYGBgYGBgYGBgYGBgYGBtIGvwa+BgYGBgbT1AYGBgYGBgbUBgYGBgYGBgYGBgYGBgYG1QbWBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgbXBgbY2drbBtzdBgbe3+Dh4uM75OXm5+g76TvqBgYG6wYGBgbs7Ts7Bu7v8AYGBgYGBgYGBgYGBgYGBgYGBgYGOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O+XxCgYGCgoKCwYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBgYGBl1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXV1dXfIAAAAAAAAAAFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFQAAAAAAAAAAXdd3df/3f/9VdVVVV9VX9V91f1/31X93XVVVVd1V1VVV9dVV/VVX1X9X/131VVVVVfXVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVdXd3d1dVVVVVVVVVVVVVVVVdVVVVXVVVVVVVVVVV1/1dV1X/3VVVVVVVVVVVAEGswMAAC1lVVVVVVVVVVf3////f/19V/f///9//X1VVVVVVVVVVVVVVVVVdVVVV/////////////////////11VVVVVVVVVVVVVVRUAUFVVVVVVVVVVVVVVVVVVVVVVAQBBj8HAAAu0ARBBEFVVVVVVVVVVVVVVVVVVAFBVVQAAQFRVVVVVVVVVVVVVFQAAAAAAVVVVVVRVVVVVVVVVVQUAEAAUBFBVVVVVVVVVFVFVVVVVVVVVAAAAAAAAQFVVVVVVVVVVVVVVVVVVVVVVVVVVVVUFAABUVVVVVVVVVVVVVVVVVRUAAFVVUVVVVVVVBRAAAAEBUFVVVVVVVVVVVVUBVVVVVVVVVVVVVVVVVVBVAABVVVVVVVVVVVVVBQBB0MLAAAvAFUBVVVVVVVVVVVVVVVVVRVQBAFRRAQBVVQVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVAFUVVFVVVVVBVVVVVVVVUVBVVVVVVVVVVVVVVVVVVVUQRUUUFFVVVVVVVVVUFFVVQEQVFFVVVVVBVVVVVVVBQBRVVVVVVVVVVVVVVVVVVUUAVRVUVVBVVUFVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVUVVVRVVVVVVVVVVVVVVVVVFRVVVVVVVVVVVVVVVVVBFQFBFBVQVVVBVVVVVVVVVVVRVVQVVVVVQVVVVVVVVVVUFVVVVVVVVVVVVVVVVUVVAFUVVFVVVVVBVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVVVFVQVEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVEAQFVVFQBAVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUQAAVFVVAEBVVVVVVVVVVVVVVVVVVVVVVVVQVVVVVVVVEVFVVVVVVVVVVVVVVVVVAQAAQAAEVQEAAAEAAAAAAAAAAFRVRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUBBABBQVVVVVVVVVAFVFVVVQFUVVVFQVVRVVVVUVVVVVVVVVVVqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqAAAAAAAAAABVVVVVVVVVAVVVVVVVVVVVVVVVVQVUVVVVVVVVBVVVVVVVVVUFVVVVVVVVVQVVVVVVVVVVVVVVVVVVVVVVEABQVUUBAABVVVFVVVVVVVVVVVVVFQBVVVVVVVVVVVVVVVVVQVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVAFVRVRVUBVVVVVVVVFRRVVVVVVVVVVVVVVVVVVUUAQEQBAFQVAAAUVVVVVVVVVVVVVVVVAAAAAAAAAEBVVVVVVVVVVVVVVVUAVVVVVVVVVVVVVVVVBEBURVVVVVVVVVVVVRUAAFVVVVBVVVVVVVVVBVAQUFVVVVVVVVVVVVVVVVVFUBFQVVVVVVVVVVVVVVVVVVUAAAVVVVVVVVVAAAAABABUUVVUUFVVVRUA139fX3//BUD3XdV1VVVVVVVVVVUABAAAVVdV1f1XVVVVVVVVVVVVV1VVVVVVVVVVAAAAAAAAAABUVVVV1V1dVdV1VVV9ddVVVVVVVVVVVVXVV9V/////Vf//X1VVVV1V//9fVVVVVVVVVV9VVVVVVXVXVVVV1VVVVVVVVffV19VdXXX9193/d1X/VV9VVVdXdVVVVV//9fVVVVVV9fVVVVVdXVVVXVVVVVVV1VVVVVV1VaVVVVVpVVVVVVVVVVVVVVVVVVVVqVaWVVVVVVVVVVVVVVX/////////////////////////////////////////////3///////////Vf///////////1VVVf/////1X1VV3/9fVfX1VV9f9df1X1VVVfVfVdVVVVVpVX1d9VVaVXdVVVVVVVVVVXdVqqqqVVVV399/31VVVZVVVVVVlVVV9VlVpVVVVVXpVfr/7//+///fVe//r/vv+1VZpVVVVVVVVVVWVVVVVV1VVVVmlZpVVVVVVVVV9f//VVVVVVWpVVVVVVVVVlVVlVVVVVVVVZVWVVVVVVVVVVVVVVVVVvlfVVVVVVVVVVVVVVVVVVVVVVVVVVUVUFVVVVVVVVVVVVVVAAAAAAAAAACqqqqqqqqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVVaqqqqqqWlVVVVVVVaqqqqqqqqqqqqqqqqqqCqCqqqpqqaqqqqqqqqqqqqqqqqqqqqqqqqqqaoGqqqqqqqqqqqpVqaqqqqqqqqqqqqqpqqqqqqqqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqlVVlaqqqqqqqqqqqqqqaqqqqqqqqqqqqqr//6qqqqqqqqqqqqqqqqqqqlaqqqqqqqqqqqqqqqqqalVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVQAAAUFVVVVVVVVUFVVVVVVVVVVVVVVVVVVVVVVVVVVVQVVVVRUUVVVVVVVVVQVVUVVVVVVVQVVVVVVVVAAAAAFBVVRVVVVVVVVVVVVUFAFBVVVVVVRUAAFBVVVWqqqqqqqqqVkBVVVVVVVVVVVVVVRUFUFBVVVVVVVVVVVVRVVVVVVVVVVVVVVVVVVVVVQFAQUFVVRVVVVRVVVVVVVVVVVVVVVRVVVVVVVVVVVVVVVUEFFQFUVVVVVVVVVVVVVVQVUVVVVVVVVVVVVVVVVFUUVVVVVWqqqqqqqqqqqpVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVQAAAACqqlpVAAAAAKqqqqqqqqqqaqqqqqpqqlVVVVVVqqqqqqqqqqpWVVVVVVVVVVVVVVVVVVVVqmpVVVVVAV1VVVVVVVVVVVVVVVVVVVVRVVVVVVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVUFQFUBQVUAVVVVVVVVVVVVVUAVVVVVVVVVVVVVQVVVVVVVVVVVVVVVVVVVVQBVVVVVVVVVVVVVVVVVVVVVFVRVVVVVVVVVVVVVVVVVVVVVVVVVAVUFAABUVVVVVVVVVVVVVVUFUFVVVVVVVVVVVVVVVVVVUVVVVVVVVVVVVVVVVVUAAABAVVVVVVVVVVVVVRRUVRVQVVVVVVVVVVVVVVUVQEFRRVVVUVVVVVVVVVVVVVVVVUBVVVVVVVVVVRUAAQBUVVVVVVVVVVVVVVVVVVUVVVVVUFVVVVVVVVVVVVVVVQUAQFVVARRVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVQBFVFVVVVVVVVVRUVAEBVVVVVVVRVVVVVVVVVVQUAVABUVVVVVVVVVVVVVVVVVVVVVQAABURVVVVVVUVVVVVVVVVVVVVVVVVVVVVVVVVVVRUARBUEVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVBVBVEFRVVVVVVVVQVVVVVVVVVVVVVVVVVVVVVVVVVVUVAEARVFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVUVUQAQVVVVVVVVVVVVAQUQAFVVVVVVVVVVVVVVVVVVVVUVAABBVVVVVVVVVVVVVVVVVVVVFUQVVVVVVVVVVVVVVVVVVVVVVVVVVVUABVVUVVVVVVVVVQEAQFVVVVVVVVVVVRUAFEBVFVVVAUABVVVVVVVVVVVVVVUFAABAUFVVVVVVVVVVVVVVVVVVVVVVVVVVVQBAABBVVVVVBQAAAAAABQAEQVVVVVVVVVVVVVVVVVVVAUBFEAAQVVVVVVVVVVVVVVVVVVVVVVVVUBFVVVVVVVVVVVVVVVVVVVVVVVVVVVVVFVRVVVBVVVVVVVVVVVVVVVUFQFVEVVVVVVVVVVVVVVVVVVVVVBUAAABQVVVVVVVVVVVVVVVVVVVVVVVVVVVVVQBUVVVVVVVVVVVVVVVVVVUAQFVVVVVVFVVVVVVVVVVVVVVVVVVVVRVAVVVVVVVVVVVVVVVVVVVVVVVVVapUVVVaVVVVqqqqqqqqqqqqqqqqqqpVVaqqqqqqWlVVVVVVVVVVVVWqqlZVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVqqmqaaqqqqqqqqqqalVVVWVVVVVVVVVVallVVVWqVVWqqqqqqqqqqqqqqqqqqqqqqqqqVVVVVVVVVVVBAFVVVVVVVVUAQZvYwAALRVAAAAAAAEBVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVRVQVRUAAABAAQBVVVVVVVVVBVBVVVVVBVRVVVVVVVVVVVVVVVVVVQBB7djAAAsCQBUAQfvYwAALryRUVVFVVVVUVVVVVRUAAQAAAFVVVVUAQAAAAAAUABAEQFVVVVVVVVVVVVVVVVVVVVVFVVVVVVVVVVVVVVVVVVVVAFVVVVVVVVVVAEBVVVVVVVVVVVVVVQBAVVVVVVVVVVVVVVVVVVVWVVVVVVVVVVVVVVVVVVVVVVWVVVVVVVVVVVVVVVVV//9/Vf////////9f//////////////////9fVf/////////vq6rq/////1dVVVVValVVVaqqqqqqqqqqqqqqVaqqVlVaVVVVqlpVVVVVVVWqqqqqqqqqqlZVVamqmqqqqqqqqqqqqqqqqqqqqqqqpqqqqqqqVVVVqqqqqqqqqqqqqmqVqlVVVaqqqqpWVqqqqqqqqqqqqqqqqqqqqqqqaqaqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqqWqqqqqqqqqqqqqqqqqqqqWlVVlWqqqqqqqqpVVVVVZVVVVVVVVWlVVVVWVVVVVVVVVVVVVVVVVVVVVVVVVVWVqqqqqqpVVVVVVVVVVVVVVVWqWlVWaqlVqlVVlVZVqqpWVVVVVVVVVVWqqqpVVlVVVVVVVaqqqqqqqqqqqqqqaqqqmqqqqqqqqqqqqqqqqqqqVVVVVVVVVVVVVVVVqqqqVqqqVlWqqqqqqqqqqqqqqpqqWlWlqqqqVaqqVlWqqlZVUVVVVVVVVVUAAAAAAAAAAP///////////////////19jYWxsZWQgYE9wdGlvbjo6dW53cmFwKClgIG9uIGEgYE5vbmVgIHZhbHVlAFcAAAAMAAAABAAAAFgAAABZAAAAWgAAAEFjY2Vzc0Vycm9ybWVtb3J5IGFsbG9jYXRpb24gb2YgIGJ5dGVzIGZhaWxlZAAAAO8uEAAVAAAABC8QAA0AAABsaWJyYXJ5L3N0ZC9zcmMvYWxsb2MucnMkLxAAGAAAAGIBAAAJAAAAbGlicmFyeS9zdGQvc3JjL3Bhbmlja2luZy5yc0wvEAAcAAAAhAIAAB4AAABXAAAADAAAAAQAAABbAAAAXAAAAAgAAAAEAAAAXQAAAFwAAAAIAAAABAAAAF4AAABfAAAAYAAAABAAAAAEAAAAYQAAAGIAAABjAAAAAAAAAAEAAABkAAAASGFzaCB0YWJsZSBjYXBhY2l0eSBvdmVyZmxvd9AvEAAcAAAAL3J1c3QvZGVwcy9oYXNoYnJvd24tMC4xNC4zL3NyYy9yYXcvbW9kLnJzAAD0LxAAKgAAAFYAAAAoAAAARXJyb3IAAABlAAAADAAAAAQAAABmAAAAZwAAAGgAAABsaWJyYXJ5L2FsbG9jL3NyYy9yYXdfdmVjLnJzY2FwYWNpdHkgb3ZlcmZsb3cAAABsMBAAEQAAAFAwEAAcAAAAOwIAAAUAAABhIGZvcm1hdHRpbmcgdHJhaXQgaW1wbGVtZW50YXRpb24gcmV0dXJuZWQgYW4gZXJyb3IAaQAAAAAAAAABAAAAagAAAGxpYnJhcnkvYWxsb2Mvc3JjL2ZtdC5yc9wwEAAYAAAAZAIAACAAAAApIHNob3VsZCBiZSA8IGxlbiAoaXMgKWluc2VydGlvbiBpbmRleCAoaXMgKSBzaG91bGQgYmUgPD0gbGVuIChpcyAAABsxEAAUAAAALzEQABcAAAAaMRAAAQAAAHJlbW92YWwgaW5kZXggKGlzIAAAYDEQABIAAAAEMRAAFgAAABoxEAABAAAAbGlicmFyeS9jb3JlL3NyYy9mbXQvbW9kLnJzY2FsbGVkIGBPcHRpb246OnVud3JhcCgpYCBvbiBhIGBOb25lYCB2YWx1ZSkwMTIzNDU2Nzg5YWJjZGVmQm9ycm93TXV0RXJyb3JhbHJlYWR5IGJvcnJvd2VkOiAA8TEQABIAAABbAAAAcAAAAAAAAAABAAAAcQAAAGluZGV4IG91dCBvZiBib3VuZHM6IHRoZSBsZW4gaXMgIGJ1dCB0aGUgaW5kZXggaXMgAAAgMhAAIAAAAEAyEAASAAAAcgAAAAQAAAAEAAAAcwAAAD09IT1tYXRjaGVzYXNzZXJ0aW9uIGBsZWZ0ICByaWdodGAgZmFpbGVkCiAgbGVmdDogCiByaWdodDogAH8yEAAQAAAAjzIQABcAAACmMhAACQAAACByaWdodGAgZmFpbGVkOiAKICBsZWZ0OiAAAAB/MhAAEAAAAMgyEAAQAAAA2DIQAAkAAACmMhAACQAAADogAACMMRAAAAAAAAQzEAACAAAAcgAAAAwAAAAEAAAAdAAAAHUAAAB2AAAAICAgICB7ICwgIHsKLAp9IH0oKAosCl1saWJyYXJ5L2NvcmUvc3JjL2ZtdC9udW0ucnMAAEczEAAbAAAAaQAAABcAAAAweDAwMDEwMjAzMDQwNTA2MDcwODA5MTAxMTEyMTMxNDE1MTYxNzE4MTkyMDIxMjIyMzI0MjUyNjI3MjgyOTMwMzEzMjMzMzQzNTM2MzczODM5NDA0MTQyNDM0NDQ1NDY0NzQ4NDk1MDUxNTI1MzU0NTU1NjU3NTg1OTYwNjE2MjYzNjQ2NTY2Njc2ODY5NzA3MTcyNzM3NDc1NzY3Nzc4Nzk4MDgxODI4Mzg0ODU4Njg3ODg4OTkwOTE5MjkzOTQ5NTk2OTc5ODk5AACMMRAAGwAAAOAHAAAJAAAAcgAAAAgAAAAEAAAAbQAAAGZhbHNldHJ1ZXJhbmdlIHN0YXJ0IGluZGV4ICBvdXQgb2YgcmFuZ2UgZm9yIHNsaWNlIG9mIGxlbmd0aCAAAABpNBAAEgAAAHs0EAAiAAAAcmFuZ2UgZW5kIGluZGV4ILA0EAAQAAAAezQQACIAAABzbGljZSBpbmRleCBzdGFydHMgYXQgIGJ1dCBlbmRzIGF0IADQNBAAFgAAAOY0EAANAAAAbGlicmFyeS9jb3JlL3NyYy91bmljb2RlL3ByaW50YWJsZS5y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AwEeAgMBCwI5AQQFAQIEARQCFgYBAToBAQIBBAgBBwMKAh4BOwEBAQwBCQEoAQMBNwEBAwUDAQQHAgsCHQE6AQIBAgEDAQUCBwILAhwCOQIBAQIECAEJAQoCHQFIAQQBAgMBAQgBUQECBwwIYgECCQsHSQIbAQEBAQE3DgEFAQIFCwEkCQFmBAEGAQICAhkCBAMQBA0BAgIGAQ8BAAMAAx0CHgIeAkACAQcIAQILCQEtAwEBdQIiAXYDBAIJAQYD2wICAToBAQcBAQEBAggGCgIBMB8xBDAHAQEFASgJDAIgBAICAQM4AQECAwEBAzoIAgKYAwENAQcEAQYBAwLGQAABwyEAA40BYCAABmkCAAQBCiACUAIAAQMBBAEZAgUBlwIaEg0BJggZCy4DMAECBAICJwFDBgICAgIMAQgBLwEzAQEDAgIFAgEBKgIIAe4BAgEEAQABABAQEAACAAHiAZUFAAMBAgUEKAMEAaUCAAQAAlADRgsxBHsBNg8pAQICCgMxBAICBwE9AyQFAQg+AQwCNAkKBAIBXwMCAQECBgECAZ0BAwgVAjkCAQEBARYBDgcDBcMIAgMBARcBUQECBgEBAgEBAgEC6wECBAYCAQIbAlUIAgEBAmoBAQECBgEBZQMCBAEFAAkBAvUBCgIBAQQBkAQCAgQBIAooBgIECAEJBgIDLg0BAgAHAQYBAVIWAgcBAgECegYDAQECAQcBAUgCAwEBAQACCwI0BQUBAQEAAQYPAAU7BwABPwRRAQACAC4CFwABAQMEBQgIAgceBJQDADcEMggBDgEWBQEPAAcBEQIHAQIBBWQBoAcAAT0EAAQAB20HAGCA8AB7CXByb2R1Y2VycwIIbGFuZ3VhZ2UBBFJ1c3QADHByb2Nlc3NlZC1ieQMFcnVzdGMdMS43Ni4wICgwN2RjYTQ4OWEgMjAyNC0wMi0wNCkGd2FscnVzBjAuMTkuMAx3YXNtLWJpbmRnZW4SMC4yLjg0IChjZWE4Y2MzZDIpACwPdGFyZ2V0X2ZlYXR1cmVzAisPbXV0YWJsZS1nbG9iYWxzKwhzaWduLWV4dA==");

        var loadVt = async () => {
                await init(wasm_code);
                return exports;
            };

function parseNpt(time) {
  if (typeof time === "number") {
    return time;
  } else if (typeof time === "string") {
    return time.split(":").reverse().map(parseFloat).reduce((sum, n, i) => sum + n * Math.pow(60, i));
  } else {
    return undefined;
  }
}
function debounce(f, delay) {
  let timeout;
  return function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    clearTimeout(timeout);
    timeout = setTimeout(() => f.apply(this, args), delay);
  };
}
function throttle(f, interval) {
  let enableCall = true;
  return function () {
    if (!enableCall) return;
    enableCall = false;
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
      args[_key2] = arguments[_key2];
    }
    f.apply(this, args);
    setTimeout(() => enableCall = true, interval);
  };
}

class Clock {
  constructor() {
    let speed = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1.0;
    this.speed = speed;
    this.startTime = performance.now();
  }
  getTime() {
    return this.speed * (performance.now() - this.startTime) / 1000.0;
  }
  setTime(time) {
    this.startTime = performance.now() - time / this.speed * 1000.0;
  }
}
class NullClock {
  constructor() {}
  getTime(_speed) {}
  setTime(_time) {}
}

const vt = loadVt(); // trigger async loading of wasm

class State {
  constructor(core) {
    this.core = core;
    this.driver = core.driver;
  }
  onEnter(data) {}
  init() {}
  play() {}
  pause() {}
  togglePlay() {}
  seek(where) {
    return false;
  }
  step() {}
  stop() {
    this.driver.stop();
  }
}
class UninitializedState extends State {
  async init() {
    try {
      await this.core.initializeDriver();
      return this.core.setState("stopped");
    } catch (e) {
      this.core.setState("errored");
      throw e;
    }
  }
  async play() {
    this.core.dispatchEvent("play");
    const stoppedState = await this.init();
    return await stoppedState.doPlay();
  }
  togglePlay() {
    return this.play();
  }
  async seek(where) {
    const stoppedState = await this.init();
    return await stoppedState.seek(where);
  }
  async step() {
    const stoppedState = await this.init();
    return await stoppedState.step();
  }
  stop() {}
}
class StoppedState extends State {
  onEnter(_ref) {
    let {
      reason,
      message
    } = _ref;
    this.core.dispatchEvent("stopped", {
      message
    });
    if (reason === "paused") {
      this.core.dispatchEvent("pause");
    } else if (reason === "ended") {
      this.core.dispatchEvent("ended");
    }
  }
  play() {
    this.core.dispatchEvent("play");
    return this.doPlay();
  }
  async doPlay() {
    const stop = await this.driver.play();
    if (stop === true) {
      this.core.setState("playing");
    } else if (typeof stop === "function") {
      this.core.setState("playing");
      this.driver.stop = stop;
    }
  }
  togglePlay() {
    return this.play();
  }
  seek(where) {
    return this.driver.seek(where);
  }
  step() {
    this.driver.step();
  }
}
class PlayingState extends State {
  onEnter() {
    this.core.dispatchEvent("playing");
  }
  pause() {
    if (this.driver.pause() === true) {
      this.core.setState("stopped", {
        reason: "paused"
      });
    }
  }
  togglePlay() {
    return this.pause();
  }
  seek(where) {
    return this.driver.seek(where);
  }
}
class LoadingState extends State {
  onEnter() {
    this.core.dispatchEvent("loading");
  }
}
class OfflineState extends State {
  onEnter() {
    this.core.dispatchEvent("offline");
  }
}
class ErroredState extends State {
  onEnter() {
    this.core.dispatchEvent("errored");
  }
}
class Core {
  // public

  constructor(driverFn, opts) {
    this.logger = opts.logger;
    this.state = new UninitializedState(this);
    this.stateName = "uninitialized";
    this.driver = null;
    this.driverFn = driverFn;
    this.changedLines = new Set();
    this.cursor = undefined;
    this.duration = undefined;
    this.cols = opts.cols;
    this.rows = opts.rows;
    this.speed = opts.speed ?? 1.0;
    this.loop = opts.loop;
    this.idleTimeLimit = opts.idleTimeLimit;
    this.preload = opts.preload;
    this.startAt = parseNpt(opts.startAt);
    this.poster = this.parsePoster(opts.poster);
    this.markers = this.normalizeMarkers(opts.markers);
    this.pauseOnMarkers = opts.pauseOnMarkers;
    this.commandQueue = Promise.resolve();
    this.eventHandlers = new Map([["marker", []], ["ended", []], ["errored", []], ["init", []], ["input", []], ["loading", []], ["offline", []], ["pause", []], ["play", []], ["playing", []], ["reset", []], ["resize", []], ["seeked", []], ["stopped", []], ["terminalUpdate", []]]);
  }
  addEventListener(eventName, handler) {
    this.eventHandlers.get(eventName).push(handler);
  }
  dispatchEvent(eventName) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    for (const h of this.eventHandlers.get(eventName)) {
      h(data);
    }
  }
  async init() {
    this.wasm = await vt;
    const feed = this.feed.bind(this);
    const onInput = data => {
      this.dispatchEvent("input", {
        data
      });
    };
    const onMarker = _ref2 => {
      let {
        index,
        time,
        label
      } = _ref2;
      this.dispatchEvent("marker", {
        index,
        time,
        label
      });
    };
    const now = this.now.bind(this);
    const setTimeout = (f, t) => window.setTimeout(f, t / this.speed);
    const setInterval = (f, t) => window.setInterval(f, t / this.speed);
    const reset = this.resetVt.bind(this);
    const setState = this.setState.bind(this);
    const posterTime = this.poster.type === "npt" ? this.poster.value : undefined;
    this.driver = this.driverFn({
      feed,
      onInput,
      onMarker,
      reset,
      now,
      setTimeout,
      setInterval,
      setState,
      logger: this.logger
    }, {
      cols: this.cols,
      rows: this.rows,
      idleTimeLimit: this.idleTimeLimit,
      startAt: this.startAt,
      loop: this.loop,
      posterTime: posterTime,
      markers: this.markers,
      pauseOnMarkers: this.pauseOnMarkers
    });
    if (typeof this.driver === "function") {
      this.driver = {
        play: this.driver
      };
    }
    if (this.preload || posterTime !== undefined) {
      this.withState(state => state.init());
    }
    const poster = this.poster.type === "text" ? this.renderPoster(this.poster.value) : undefined;
    const config = {
      isPausable: !!this.driver.pause,
      isSeekable: !!this.driver.seek,
      poster
    };
    if (this.driver.init === undefined) {
      this.driver.init = () => {
        return {};
      };
    }
    if (this.driver.pause === undefined) {
      this.driver.pause = () => {};
    }
    if (this.driver.seek === undefined) {
      this.driver.seek = where => false;
    }
    if (this.driver.step === undefined) {
      this.driver.step = () => {};
    }
    if (this.driver.stop === undefined) {
      this.driver.stop = () => {};
    }
    if (this.driver.getCurrentTime === undefined) {
      const play = this.driver.play;
      let clock = new NullClock();
      this.driver.play = () => {
        clock = new Clock(this.speed);
        return play();
      };
      this.driver.getCurrentTime = () => clock.getTime();
    }
    return config;
  }
  play() {
    return this.withState(state => state.play());
  }
  pause() {
    return this.withState(state => state.pause());
  }
  togglePlay() {
    return this.withState(state => state.togglePlay());
  }
  seek(where) {
    return this.withState(async state => {
      if (await state.seek(where)) {
        this.dispatchEvent("seeked");
      }
    });
  }
  step() {
    return this.withState(state => state.step());
  }
  stop() {
    return this.withState(state => state.stop());
  }
  withState(f) {
    return this.enqueueCommand(() => f(this.state));
  }
  enqueueCommand(f) {
    this.commandQueue = this.commandQueue.then(f);
    return this.commandQueue;
  }
  getChangedLines() {
    if (this.changedLines.size > 0) {
      const lines = new Map();
      const rows = this.vt.rows;
      for (const i of this.changedLines) {
        if (i < rows) {
          lines.set(i, {
            id: i,
            segments: this.vt.get_line(i)
          });
        }
      }
      this.changedLines.clear();
      return lines;
    }
  }
  getCursor() {
    if (this.cursor === undefined && this.vt) {
      this.cursor = this.vt.get_cursor() ?? false;
    }
    return this.cursor;
  }
  getCurrentTime() {
    return this.driver.getCurrentTime();
  }
  getRemainingTime() {
    if (typeof this.duration === "number") {
      return this.duration - Math.min(this.getCurrentTime(), this.duration);
    }
  }
  getProgress() {
    if (typeof this.duration === "number") {
      return Math.min(this.getCurrentTime(), this.duration) / this.duration;
    }
  }
  getDuration() {
    return this.duration;
  }

  // private

  setState(newState) {
    let data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    if (this.stateName === newState) return this.state;
    this.stateName = newState;
    if (newState === "playing") {
      this.state = new PlayingState(this);
    } else if (newState === "stopped") {
      this.state = new StoppedState(this);
    } else if (newState === "loading") {
      this.state = new LoadingState(this);
    } else if (newState === "offline") {
      this.state = new OfflineState(this);
    } else if (newState === "errored") {
      this.state = new ErroredState(this);
    } else {
      throw `invalid state: ${newState}`;
    }
    this.state.onEnter(data);
    return this.state;
  }
  feed(data) {
    this.doFeed(data);
    this.dispatchEvent("terminalUpdate");
  }
  doFeed(data) {
    const [affectedLines, resized] = this.vt.feed(data);
    affectedLines.forEach(i => this.changedLines.add(i));
    this.cursor = undefined;
    if (resized) {
      const [cols, rows] = this.vt.get_size();
      this.vt.cols = cols;
      this.vt.rows = rows;
      this.logger.debug(`core: vt resize (${cols}x${rows})`);
      this.dispatchEvent("resize", {
        cols,
        rows
      });
    }
  }
  now() {
    return performance.now() * this.speed;
  }
  async initializeDriver() {
    const meta = await this.driver.init();
    this.cols = this.cols ?? meta.cols ?? 80;
    this.rows = this.rows ?? meta.rows ?? 24;
    this.duration = this.duration ?? meta.duration;
    this.markers = this.normalizeMarkers(meta.markers) ?? this.markers ?? [];
    if (this.cols === 0) {
      this.cols = 80;
    }
    if (this.rows === 0) {
      this.rows = 24;
    }
    this.initializeVt(this.cols, this.rows);
    const poster = meta.poster !== undefined ? this.renderPoster(meta.poster) : undefined;
    this.dispatchEvent("init", {
      cols: this.cols,
      rows: this.rows,
      duration: this.duration,
      markers: this.markers,
      theme: meta.theme,
      poster
    });
  }
  resetVt(cols, rows) {
    let init = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : undefined;
    let theme = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : undefined;
    this.cols = cols;
    this.rows = rows;
    this.cursor = undefined;
    this.initializeVt(cols, rows);
    if (init !== undefined && init !== "") {
      this.doFeed(init);
    }
    this.dispatchEvent("reset", {
      cols,
      rows,
      theme
    });
  }
  initializeVt(cols, rows) {
    this.logger.debug(`core: vt init (${cols}x${rows})`);
    this.vt = this.wasm.create(cols, rows, true, 100);
    this.vt.cols = cols;
    this.vt.rows = rows;
    this.changedLines.clear();
    for (let i = 0; i < rows; i++) {
      this.changedLines.add(i);
    }
  }
  parsePoster(poster) {
    if (typeof poster !== "string") return {};
    if (poster.substring(0, 16) == "data:text/plain,") {
      return {
        type: "text",
        value: [poster.substring(16)]
      };
    } else if (poster.substring(0, 4) == "npt:") {
      return {
        type: "npt",
        value: parseNpt(poster.substring(4))
      };
    }
    return {};
  }
  renderPoster(poster) {
    const cols = this.cols ?? 80;
    const rows = this.rows ?? 24;
    this.logger.debug(`core: poster init (${cols}x${rows})`);
    const vt = this.wasm.create(cols, rows, false, 0);
    poster.forEach(text => vt.feed(text));
    const cursor = vt.get_cursor() ?? false;
    const lines = [];
    for (let i = 0; i < rows; i++) {
      lines.push({
        id: i,
        segments: vt.get_line(i)
      });
    }
    return {
      cursor,
      lines
    };
  }
  normalizeMarkers(markers) {
    if (Array.isArray(markers)) {
      return markers.map(m => typeof m === "number" ? [m, ""] : m);
    }
  }
}

const $RAW = Symbol("store-raw"),
  $NODE = Symbol("store-node"),
  $NAME = Symbol("store-name");
function wrap$1(value, name) {
  let p = value[$PROXY];
  if (!p) {
    Object.defineProperty(value, $PROXY, {
      value: p = new Proxy(value, proxyTraps$1)
    });
    if (!Array.isArray(value)) {
      const keys = Object.keys(value),
        desc = Object.getOwnPropertyDescriptors(value);
      for (let i = 0, l = keys.length; i < l; i++) {
        const prop = keys[i];
        if (desc[prop].get) {
          Object.defineProperty(value, prop, {
            enumerable: desc[prop].enumerable,
            get: desc[prop].get.bind(p)
          });
        }
      }
    }
  }
  return p;
}
function isWrappable(obj) {
  let proto;
  return obj != null && typeof obj === "object" && (obj[$PROXY] || !(proto = Object.getPrototypeOf(obj)) || proto === Object.prototype || Array.isArray(obj));
}
function unwrap(item, set = new Set()) {
  let result, unwrapped, v, prop;
  if (result = item != null && item[$RAW]) return result;
  if (!isWrappable(item) || set.has(item)) return item;
  if (Array.isArray(item)) {
    if (Object.isFrozen(item)) item = item.slice(0);else set.add(item);
    for (let i = 0, l = item.length; i < l; i++) {
      v = item[i];
      if ((unwrapped = unwrap(v, set)) !== v) item[i] = unwrapped;
    }
  } else {
    if (Object.isFrozen(item)) item = Object.assign({}, item);else set.add(item);
    const keys = Object.keys(item),
      desc = Object.getOwnPropertyDescriptors(item);
    for (let i = 0, l = keys.length; i < l; i++) {
      prop = keys[i];
      if (desc[prop].get) continue;
      v = item[prop];
      if ((unwrapped = unwrap(v, set)) !== v) item[prop] = unwrapped;
    }
  }
  return item;
}
function getDataNodes(target) {
  let nodes = target[$NODE];
  if (!nodes) Object.defineProperty(target, $NODE, {
    value: nodes = {}
  });
  return nodes;
}
function getDataNode(nodes, property, value) {
  return nodes[property] || (nodes[property] = createDataNode(value));
}
function proxyDescriptor$1(target, property) {
  const desc = Reflect.getOwnPropertyDescriptor(target, property);
  if (!desc || desc.get || !desc.configurable || property === $PROXY || property === $NODE || property === $NAME) return desc;
  delete desc.value;
  delete desc.writable;
  desc.get = () => target[$PROXY][property];
  return desc;
}
function trackSelf(target) {
  if (getListener()) {
    const nodes = getDataNodes(target);
    (nodes._ || (nodes._ = createDataNode()))();
  }
}
function ownKeys(target) {
  trackSelf(target);
  return Reflect.ownKeys(target);
}
function createDataNode(value) {
  const [s, set] = createSignal(value, {
    equals: false,
    internal: true
  });
  s.$ = set;
  return s;
}
const proxyTraps$1 = {
  get(target, property, receiver) {
    if (property === $RAW) return target;
    if (property === $PROXY) return receiver;
    if (property === $TRACK) {
      trackSelf(target);
      return receiver;
    }
    const nodes = getDataNodes(target);
    const tracked = nodes.hasOwnProperty(property);
    let value = tracked ? nodes[property]() : target[property];
    if (property === $NODE || property === "__proto__") return value;
    if (!tracked) {
      const desc = Object.getOwnPropertyDescriptor(target, property);
      if (getListener() && (typeof value !== "function" || target.hasOwnProperty(property)) && !(desc && desc.get)) value = getDataNode(nodes, property, value)();
    }
    return isWrappable(value) ? wrap$1(value) : value;
  },
  has(target, property) {
    if (property === $RAW || property === $PROXY || property === $TRACK || property === $NODE || property === "__proto__") return true;
    this.get(target, property, target);
    return property in target;
  },
  set() {
    return true;
  },
  deleteProperty() {
    return true;
  },
  ownKeys: ownKeys,
  getOwnPropertyDescriptor: proxyDescriptor$1
};
function setProperty(state, property, value, deleting = false) {
  if (!deleting && state[property] === value) return;
  const prev = state[property],
    len = state.length;
  if (value === undefined) delete state[property];else state[property] = value;
  let nodes = getDataNodes(state),
    node;
  if (node = getDataNode(nodes, property, prev)) node.$(() => value);
  if (Array.isArray(state) && state.length !== len) (node = getDataNode(nodes, "length", len)) && node.$(state.length);
  (node = nodes._) && node.$();
}
function mergeStoreNode(state, value) {
  const keys = Object.keys(value);
  for (let i = 0; i < keys.length; i += 1) {
    const key = keys[i];
    setProperty(state, key, value[key]);
  }
}
function updateArray(current, next) {
  if (typeof next === "function") next = next(current);
  next = unwrap(next);
  if (Array.isArray(next)) {
    if (current === next) return;
    let i = 0,
      len = next.length;
    for (; i < len; i++) {
      const value = next[i];
      if (current[i] !== value) setProperty(current, i, value);
    }
    setProperty(current, "length", len);
  } else mergeStoreNode(current, next);
}
function updatePath(current, path, traversed = []) {
  let part,
    prev = current;
  if (path.length > 1) {
    part = path.shift();
    const partType = typeof part,
      isArray = Array.isArray(current);
    if (Array.isArray(part)) {
      for (let i = 0; i < part.length; i++) {
        updatePath(current, [part[i]].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "function") {
      for (let i = 0; i < current.length; i++) {
        if (part(current[i], i)) updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (isArray && partType === "object") {
      const {
        from = 0,
        to = current.length - 1,
        by = 1
      } = part;
      for (let i = from; i <= to; i += by) {
        updatePath(current, [i].concat(path), traversed);
      }
      return;
    } else if (path.length > 1) {
      updatePath(current[part], path, [part].concat(traversed));
      return;
    }
    prev = current[part];
    traversed = [part].concat(traversed);
  }
  let value = path[0];
  if (typeof value === "function") {
    value = value(prev, traversed);
    if (value === prev) return;
  }
  if (part === undefined && value == undefined) return;
  value = unwrap(value);
  if (part === undefined || isWrappable(prev) && isWrappable(value) && !Array.isArray(value)) {
    mergeStoreNode(prev, value);
  } else setProperty(current, part, value);
}
function createStore(...[store, options]) {
  const unwrappedStore = unwrap(store || {});
  const isArray = Array.isArray(unwrappedStore);
  const wrappedStore = wrap$1(unwrappedStore);
  function setStore(...args) {
    batch(() => {
      isArray && args.length === 1 ? updateArray(unwrappedStore, args[0]) : updatePath(unwrappedStore, args);
    });
  }
  return [wrappedStore, setStore];
}

const $ROOT = Symbol("store-root");
function applyState(target, parent, property, merge, key) {
  const previous = parent[property];
  if (target === previous) return;
  if (!isWrappable(target) || !isWrappable(previous) || key && target[key] !== previous[key]) {
    if (target !== previous) {
      if (property === $ROOT) return target;
      setProperty(parent, property, target);
    }
    return;
  }
  if (Array.isArray(target)) {
    if (target.length && previous.length && (!merge || key && target[0] && target[0][key] != null)) {
      let i, j, start, end, newEnd, item, newIndicesNext, keyVal;
      for (start = 0, end = Math.min(previous.length, target.length); start < end && (previous[start] === target[start] || key && previous[start] && target[start] && previous[start][key] === target[start][key]); start++) {
        applyState(target[start], previous, start, merge, key);
      }
      const temp = new Array(target.length),
        newIndices = new Map();
      for (end = previous.length - 1, newEnd = target.length - 1; end >= start && newEnd >= start && (previous[end] === target[newEnd] || key && previous[start] && target[start] && previous[end][key] === target[newEnd][key]); end--, newEnd--) {
        temp[newEnd] = previous[end];
      }
      if (start > newEnd || start > end) {
        for (j = start; j <= newEnd; j++) setProperty(previous, j, target[j]);
        for (; j < target.length; j++) {
          setProperty(previous, j, temp[j]);
          applyState(target[j], previous, j, merge, key);
        }
        if (previous.length > target.length) setProperty(previous, "length", target.length);
        return;
      }
      newIndicesNext = new Array(newEnd + 1);
      for (j = newEnd; j >= start; j--) {
        item = target[j];
        keyVal = key && item ? item[key] : item;
        i = newIndices.get(keyVal);
        newIndicesNext[j] = i === undefined ? -1 : i;
        newIndices.set(keyVal, j);
      }
      for (i = start; i <= end; i++) {
        item = previous[i];
        keyVal = key && item ? item[key] : item;
        j = newIndices.get(keyVal);
        if (j !== undefined && j !== -1) {
          temp[j] = previous[i];
          j = newIndicesNext[j];
          newIndices.set(keyVal, j);
        }
      }
      for (j = start; j < target.length; j++) {
        if (j in temp) {
          setProperty(previous, j, temp[j]);
          applyState(target[j], previous, j, merge, key);
        } else setProperty(previous, j, target[j]);
      }
    } else {
      for (let i = 0, len = target.length; i < len; i++) {
        applyState(target[i], previous, i, merge, key);
      }
    }
    if (previous.length > target.length) setProperty(previous, "length", target.length);
    return;
  }
  const targetKeys = Object.keys(target);
  for (let i = 0, len = targetKeys.length; i < len; i++) {
    applyState(target[targetKeys[i]], previous, targetKeys[i], merge, key);
  }
  const previousKeys = Object.keys(previous);
  for (let i = 0, len = previousKeys.length; i < len; i++) {
    if (target[previousKeys[i]] === undefined) setProperty(previous, previousKeys[i], undefined);
  }
}
function reconcile(value, options = {}) {
  const {
      merge,
      key = "id"
    } = options,
    v = unwrap(value);
  return state => {
    if (!isWrappable(state) || !isWrappable(v)) return v;
    const res = applyState(v, {
      [$ROOT]: state
    }, $ROOT, merge, key);
    return res === undefined ? state : res;
  };
}

const _tmpl$$8 = /*#__PURE__*/template(`<span></span>`);
var Segment = (props => {
  const codePoint = () => {
    if (props.text.length == 1) {
      const cp = props.text.codePointAt(0);
      if (cp >= 0x2580 && cp <= 0x259f || cp == 0xe0b0 || cp == 0xe0b2) {
        return cp;
      }
    }
  };
  const text = () => codePoint() ? " " : props.text;
  return (() => {
    const _el$ = _tmpl$$8.cloneNode(true);
    insert(_el$, text);
    createRenderEffect(_p$ => {
      const _v$ = className(props.pen, codePoint(), props.extraClass),
        _v$2 = style(props.pen, props.offset, text().length, props.charWidth, props.terminalCols);
      _v$ !== _p$._v$ && className$1(_el$, _p$._v$ = _v$);
      _p$._v$2 = style$1(_el$, _v$2, _p$._v$2);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined
    });
    return _el$;
  })();
});
function className(attrs, codePoint, extraClass) {
  const fgClass = colorClass(attrs.get("fg"), attrs.get("bold"), "fg-");
  const bgClass = colorClass(attrs.get("bg"), attrs.get("blink"), "bg-");
  let cls = extraClass ?? "";
  if (codePoint !== undefined) {
    cls += ` cp-${codePoint.toString(16)}`;
  }
  if (fgClass) {
    cls += " " + fgClass;
  }
  if (bgClass) {
    cls += " " + bgClass;
  }
  if (attrs.has("bold")) {
    cls += " ap-bright";
  }
  if (attrs.has("faint")) {
    cls += " ap-faint";
  }
  if (attrs.has("italic")) {
    cls += " ap-italic";
  }
  if (attrs.has("underline")) {
    cls += " ap-underline";
  }
  if (attrs.has("blink")) {
    cls += " ap-blink";
  }
  if (attrs.get("inverse")) {
    cls += " ap-inverse";
  }
  return cls;
}
function colorClass(color, intense, prefix) {
  if (typeof color === "number") {
    if (intense && color < 8) {
      color += 8;
    }
    return `${prefix}${color}`;
  }
}
function style(attrs, offset, textLen, charWidth, terminalCols) {
  const fg = attrs.get("fg");
  const bg = attrs.get("bg");
  let style = {
    left: `${100 * offset / terminalCols}%`,
    width: `${textLen * charWidth + 0.01}ch`
  };
  if (typeof fg === "string") {
    style["--fg"] = fg;
  }
  if (typeof bg === "string") {
    style["--bg"] = bg;
  }
  return style;
}

const _tmpl$$7 = /*#__PURE__*/template(`<span class="ap-line" role="paragraph"></span>`);
var Line = (props => {
  const segments = () => {
    if (typeof props.cursor === "number") {
      const segs = [];
      let len = 0;
      let i = 0;
      while (i < props.segments.length && len + props.segments[i].text.length - 1 < props.cursor) {
        const seg = props.segments[i];
        segs.push(seg);
        len += seg.text.length;
        i++;
      }
      if (i < props.segments.length) {
        const seg = props.segments[i];
        const pos = props.cursor - len;
        if (pos > 0) {
          segs.push({
            ...seg,
            text: seg.text.substring(0, pos)
          });
        }
        segs.push({
          ...seg,
          text: seg.text[pos],
          offset: seg.offset + pos,
          extraClass: "ap-cursor"
        });
        if (pos < seg.text.length - 1) {
          segs.push({
            ...seg,
            text: seg.text.substring(pos + 1),
            offset: seg.offset + pos + 1
          });
        }
        i++;
        while (i < props.segments.length) {
          const seg = props.segments[i];
          segs.push(seg);
          i++;
        }
      }
      return segs;
    } else {
      return props.segments;
    }
  };
  return (() => {
    const _el$ = _tmpl$$7.cloneNode(true);
    insert(_el$, createComponent(Index, {
      get each() {
        return segments();
      },
      children: s => createComponent(Segment, mergeProps({
        get terminalCols() {
          return props.terminalCols;
        }
      }, s))
    }));
    createRenderEffect(() => _el$.style.setProperty("height", props.height));
    return _el$;
  })();
});

const _tmpl$$6 = /*#__PURE__*/template(`<pre class="ap-terminal" aria-live="polite" tabindex="0"></pre>`);
var Terminal = (props => {
  const lineHeight = () => props.lineHeight ?? 1.3333333333;
  const terminalStyle = createMemo(() => {
    return {
      width: `${props.cols}ch`,
      height: `${lineHeight() * props.rows}em`,
      "font-size": `${(props.scale || 1.0) * 100}%`,
      "font-family": props.fontFamily,
      "line-height": `${lineHeight()}em`,
      "--term-line-height": lineHeight()
    };
  });
  const cursorCol = () => props.cursor?.[0];
  const cursorRow = () => props.cursor?.[1];
  return (() => {
    const _el$ = _tmpl$$6.cloneNode(true);
    const _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, createComponent(For, {
      get each() {
        return props.lines;
      },
      children: (line, i) => createComponent(Line, {
        get segments() {
          return line.segments;
        },
        get cursor() {
          return createMemo(() => i() === cursorRow())() ? cursorCol() : null;
        },
        get height() {
          return `${lineHeight()}em`;
        },
        get terminalCols() {
          return props.cols;
        }
      })
    }));
    createRenderEffect(_p$ => {
      const _v$ = !!(props.blink || props.cursorHold),
        _v$2 = !!props.blink,
        _v$3 = terminalStyle();
      _v$ !== _p$._v$ && _el$.classList.toggle("ap-cursor-on", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && _el$.classList.toggle("ap-blink", _p$._v$2 = _v$2);
      _p$._v$3 = style$1(_el$, _v$3, _p$._v$3);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined
    });
    return _el$;
  })();
});

const _tmpl$$5 = /*#__PURE__*/template(`<svg version="1.1" viewBox="0 0 12 12" class="ap-icon" aria-label="Pause" role="button" tabindex="0"><path d="M1,0 L4,0 L4,12 L1,12 Z"></path><path d="M8,0 L11,0 L11,12 L8,12 Z"></path></svg>`),
  _tmpl$2 = /*#__PURE__*/template(`<svg version="1.1" viewBox="0 0 12 12" class="ap-icon" aria-label="Play" role="button" tabindex="0"><path d="M1,0 L11,6 L1,12 Z"></path></svg>`),
  _tmpl$3 = /*#__PURE__*/template(`<span class="ap-playback-button"></span>`),
  _tmpl$4 = /*#__PURE__*/template(`<span class="ap-progressbar"><span class="ap-bar"><span class="ap-gutter"><span class="ap-gutter-fill"></span></span></span></span>`),
  _tmpl$5 = /*#__PURE__*/template(`<div class="ap-control-bar"><span class="ap-timer" aria-readonly="true" role="textbox" tabindex="0"><span class="ap-time-elapsed"></span><span class="ap-time-remaining"></span></span><span class="ap-fullscreen-button" title="Toggle fullscreen mode" aria-label="Toggle Fullscreen" role="button" tabindex="0"><svg version="1.1" viewBox="0 0 12 12" class="ap-icon"><path d="M12,0 L7,0 L9,2 L7,4 L8,5 L10,3 L12,5 Z"></path><path d="M0,12 L0,7 L2,9 L4,7 L5,8 L3,10 L5,12 Z"></path></svg><svg version="1.1" viewBox="0 0 12 12" class="ap-icon"><path d="M7,5 L7,0 L9,2 L11,0 L12,1 L10,3 L12,5 Z"></path><path d="M5,7 L0,7 L2,9 L0,11 L1,12 L3,10 L5,12 Z"></path></svg></span></div>`),
  _tmpl$6 = /*#__PURE__*/template(`<span class="ap-marker-container"><span class="ap-marker"></span><span class="ap-marker-tooltip"></span></span>`);
function formatTime(seconds) {
  let s = Math.floor(seconds);
  const d = Math.floor(s / 86400);
  s %= 86400;
  const h = Math.floor(s / 3600);
  s %= 3600;
  const m = Math.floor(s / 60);
  s %= 60;
  if (d > 0) {
    return `${zeroPad(d)}:${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
  } else if (h > 0) {
    return `${zeroPad(h)}:${zeroPad(m)}:${zeroPad(s)}`;
  } else {
    return `${zeroPad(m)}:${zeroPad(s)}`;
  }
}
function zeroPad(n) {
  return n < 10 ? `0${n}` : n.toString();
}
var ControlBar = (props => {
  const e = f => {
    return e => {
      e.preventDefault();
      f(e);
    };
  };
  const currentTime = () => typeof props.currentTime === "number" ? formatTime(props.currentTime) : "--:--";
  const remainingTime = () => typeof props.remainingTime === "number" ? "-" + formatTime(props.remainingTime) : currentTime();
  const markers = createMemo(() => typeof props.duration === "number" ? props.markers.filter(m => m[0] < props.duration) : []);
  const markerPosition = m => `${m[0] / props.duration * 100}%`;
  const markerText = m => {
    if (m[1] === "") {
      return formatTime(m[0]);
    } else {
      return `${formatTime(m[0])} - ${m[1]}`;
    }
  };
  const isPastMarker = m => typeof props.currentTime === "number" ? m[0] <= props.currentTime : false;
  const gutterBarStyle = () => {
    return {
      width: "100%",
      transform: `scaleX(${props.progress || 0}`,
      "transform-origin": "left center"
    };
  };
  const calcPosition = e => {
    const barWidth = e.currentTarget.offsetWidth;
    const rect = e.currentTarget.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const pos = Math.max(0, mouseX / barWidth);
    return `${pos * 100}%`;
  };
  const [mouseDown, setMouseDown] = createSignal(false);
  const throttledSeek = throttle(props.onSeekClick, 50);
  const onClick = e => {
    if (e.altKey || e.shiftKey || e.metaKey || e.ctrlKey || e.button !== 0) return;
    setMouseDown(true);
    props.onSeekClick(calcPosition(e));
  };
  const seekToMarker = index => {
    return e(() => {
      props.onSeekClick({
        marker: index
      });
    });
  };
  const onMove = e => {
    if (e.altKey || e.shiftKey || e.metaKey || e.ctrlKey) return;
    if (mouseDown()) {
      throttledSeek(calcPosition(e));
    }
  };
  const onDocumentMouseUp = () => {
    setMouseDown(false);
  };
  const stopPropagation = e(e => {
    e.stopPropagation();
  });
  document.addEventListener("mouseup", onDocumentMouseUp);
  onCleanup(() => {
    document.removeEventListener("mouseup", onDocumentMouseUp);
  });
  return (() => {
    const _el$ = _tmpl$5.cloneNode(true),
      _el$5 = _el$.firstChild,
      _el$6 = _el$5.firstChild,
      _el$7 = _el$6.nextSibling,
      _el$12 = _el$5.nextSibling;
    const _ref$ = props.ref;
    typeof _ref$ === "function" ? use(_ref$, _el$) : props.ref = _el$;
    insert(_el$, createComponent(Show, {
      get when() {
        return props.isPausable;
      },
      get children() {
        const _el$2 = _tmpl$3.cloneNode(true);
        addEventListener(_el$2, "click", e(props.onPlayClick), true);
        insert(_el$2, createComponent(Switch, {
          get children() {
            return [createComponent(Match, {
              get when() {
                return props.isPlaying;
              },
              get children() {
                return _tmpl$$5.cloneNode(true);
              }
            }), createComponent(Match, {
              get when() {
                return !props.isPlaying;
              },
              get children() {
                return _tmpl$2.cloneNode(true);
              }
            })];
          }
        }));
        return _el$2;
      }
    }), _el$5);
    insert(_el$6, currentTime);
    insert(_el$7, remainingTime);
    insert(_el$, createComponent(Show, {
      get when() {
        return typeof props.progress === "number" || props.isSeekable;
      },
      get children() {
        const _el$8 = _tmpl$4.cloneNode(true),
          _el$9 = _el$8.firstChild,
          _el$10 = _el$9.firstChild,
          _el$11 = _el$10.firstChild;
        _el$9.$$mousemove = onMove;
        _el$9.$$mousedown = onClick;
        insert(_el$9, createComponent(For, {
          get each() {
            return markers();
          },
          children: (m, i) => (() => {
            const _el$13 = _tmpl$6.cloneNode(true),
              _el$14 = _el$13.firstChild,
              _el$15 = _el$14.nextSibling;
            addEventListener(_el$13, "mousedown", stopPropagation, true);
            addEventListener(_el$13, "click", seekToMarker(i()), true);
            insert(_el$15, () => markerText(m));
            createRenderEffect(_p$ => {
              const _v$ = markerPosition(m),
                _v$2 = !!isPastMarker(m);
              _v$ !== _p$._v$ && _el$13.style.setProperty("left", _p$._v$ = _v$);
              _v$2 !== _p$._v$2 && _el$14.classList.toggle("ap-marker-past", _p$._v$2 = _v$2);
              return _p$;
            }, {
              _v$: undefined,
              _v$2: undefined
            });
            return _el$13;
          })()
        }), null);
        createRenderEffect(_$p => style$1(_el$11, gutterBarStyle(), _$p));
        return _el$8;
      }
    }), _el$12);
    addEventListener(_el$12, "click", e(props.onFullscreenClick), true);
    createRenderEffect(() => _el$.classList.toggle("ap-seekable", !!props.isSeekable));
    return _el$;
  })();
});
delegateEvents(["click", "mousedown", "mousemove"]);

const _tmpl$$4 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-error"><span>💥</span></div>`);
var ErrorOverlay = (props => {
  return _tmpl$$4.cloneNode(true);
});

const _tmpl$$3 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-loading"><span class="ap-loader"></span></div>`);
var LoaderOverlay = (props => {
  return _tmpl$$3.cloneNode(true);
});

const _tmpl$$2 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-info"><span></span></div>`);
var InfoOverlay = (props => {
  const style = () => {
    return {
      "font-family": props.fontFamily
    };
  };
  return (() => {
    const _el$ = _tmpl$$2.cloneNode(true),
      _el$2 = _el$.firstChild;
    insert(_el$2, () => props.message);
    createRenderEffect(_$p => style$1(_el$2, style(), _$p));
    return _el$;
  })();
});

const _tmpl$$1 = /*#__PURE__*/template(`<div class="ap-overlay ap-overlay-start"><div class="ap-play-button"><div><span><svg version="1.1" viewBox="0 0 1000.0 1000.0" class="ap-icon"><defs><mask id="small-triangle-mask"><rect width="100%" height="100%" fill="white"></rect><polygon points="700.0 500.0, 400.00000000000006 326.7949192431122, 399.9999999999999 673.2050807568877" fill="black"></polygon></mask></defs><polygon points="1000.0 500.0, 250.0000000000001 66.98729810778059, 249.99999999999977 933.0127018922192" mask="url(#small-triangle-mask)" fill="white" class="ap-play-btn-fill"></polygon><polyline points="673.2050807568878 400.0, 326.7949192431123 600.0" stroke="white" stroke-width="90" class="ap-play-btn-stroke"></polyline></svg></span></div></div></div>`);
var StartOverlay = (props => {
  const e = f => {
    return e => {
      e.preventDefault();
      f(e);
    };
  };
  return (() => {
    const _el$ = _tmpl$$1.cloneNode(true);
    addEventListener(_el$, "click", e(props.onClick), true);
    return _el$;
  })();
});
delegateEvents(["click"]);

const _tmpl$ = /*#__PURE__*/template(`<div class="ap-wrapper" tabindex="-1"><div></div></div>`);
const CONTROL_BAR_HEIGHT = 32; // must match height of div.ap-control-bar in CSS

var Player = (props => {
  const logger = props.logger;
  const core = props.core;
  const autoPlay = props.autoPlay;
  const [state, setState] = createStore({
    lines: [],
    cursor: undefined,
    charW: props.charW,
    charH: props.charH,
    bordersW: props.bordersW,
    bordersH: props.bordersH,
    containerW: 0,
    containerH: 0,
    isPausable: true,
    isSeekable: true,
    isFullscreen: false,
    currentTime: null,
    remainingTime: null,
    progress: null,
    blink: true,
    cursorHold: false
  });
  const [isPlaying, setIsPlaying] = createSignal(false);
  const [overlay, setOverlay] = createSignal(!autoPlay ? "start" : null);
  const [infoMessage, setInfoMessage] = createSignal(null);
  const [terminalSize, setTerminalSize] = createSignal({
    cols: props.cols,
    rows: props.rows
  });
  const [duration, setDuration] = createSignal(undefined);
  const [markers, setMarkers] = createStore([]);
  const [userActive, setUserActive] = createSignal(false);
  const [originalTheme, setOriginalTheme] = createSignal(undefined);
  const terminalCols = () => terminalSize().cols || 80;
  const terminalRows = () => terminalSize().rows || 24;
  const controlBarHeight = () => props.controls === false ? 0 : CONTROL_BAR_HEIGHT;
  const controlsVisible = () => props.controls === true || props.controls === "auto" && userActive();
  let frameRequestId;
  let userActivityTimeoutId;
  let timeUpdateIntervalId;
  let blinkIntervalId;
  let wrapperRef;
  let playerRef;
  let terminalRef;
  let controlBarRef;
  let resizeObserver;
  function onPlaying() {
    updateTerminal();
    startBlinking();
    startTimeUpdates();
  }
  function onStopped() {
    stopBlinking();
    stopTimeUpdates();
    updateTime();
  }
  function resize(size_) {
    batch(() => {
      if (size_.rows < terminalSize().rows) {
        setState("lines", state.lines.slice(0, size_.rows));
      }
      setTerminalSize(size_);
    });
  }
  function setPoster(poster) {
    if (poster !== undefined && !autoPlay) {
      setState({
        lines: poster.lines,
        cursor: poster.cursor
      });
    }
  }
  core.addEventListener("init", _ref => {
    let {
      cols,
      rows,
      duration,
      theme,
      poster,
      markers
    } = _ref;
    batch(() => {
      resize({
        cols,
        rows
      });
      setDuration(duration);
      setOriginalTheme(theme);
      setMarkers(markers);
      setPoster(poster);
    });
  });
  core.addEventListener("play", () => {
    setOverlay(null);
  });
  core.addEventListener("playing", () => {
    batch(() => {
      setIsPlaying(true);
      setOverlay(null);
      onPlaying();
    });
  });
  core.addEventListener("stopped", _ref2 => {
    let {
      message
    } = _ref2;
    batch(() => {
      setIsPlaying(false);
      onStopped();
      if (message !== undefined) {
        setInfoMessage(message);
        setOverlay("info");
      }
    });
  });
  core.addEventListener("loading", () => {
    batch(() => {
      setIsPlaying(false);
      onStopped();
      setOverlay("loader");
    });
  });
  core.addEventListener("offline", () => {
    batch(() => {
      setIsPlaying(false);
      onStopped();
      setInfoMessage("Stream offline");
      setOverlay("info");
    });
  });
  core.addEventListener("errored", () => {
    setOverlay("error");
  });
  core.addEventListener("resize", resize);
  core.addEventListener("reset", _ref3 => {
    let {
      cols,
      rows,
      theme
    } = _ref3;
    batch(() => {
      resize({
        cols,
        rows
      });
      setOriginalTheme(theme);
      updateTerminal();
    });
  });
  core.addEventListener("seeked", () => {
    updateTime();
  });
  core.addEventListener("terminalUpdate", () => {
    if (frameRequestId === undefined) {
      frameRequestId = requestAnimationFrame(updateTerminal);
    }
  });
  const setupResizeObserver = () => {
    resizeObserver = new ResizeObserver(debounce(_entries => {
      setState({
        containerW: wrapperRef.offsetWidth,
        containerH: wrapperRef.offsetHeight
      });
      wrapperRef.dispatchEvent(new CustomEvent("resize", {
        detail: {
          el: playerRef
        }
      }));
    }, 10));
    resizeObserver.observe(wrapperRef);
  };
  onMount(async () => {
    logger.info("player mounted");
    logger.debug("font measurements", {
      charW: state.charW,
      charH: state.charH
    });
    setupResizeObserver();
    const {
      isPausable,
      isSeekable,
      poster
    } = await core.init();
    batch(() => {
      setState({
        isPausable,
        isSeekable,
        containerW: wrapperRef.offsetWidth,
        containerH: wrapperRef.offsetHeight
      });
      setPoster(poster);
    });
    if (autoPlay) {
      core.play();
    }
  });
  onCleanup(() => {
    core.stop();
    stopBlinking();
    stopTimeUpdates();
    resizeObserver.disconnect();
  });
  const updateTerminal = () => {
    const changedLines = core.getChangedLines();
    batch(() => {
      if (changedLines) {
        changedLines.forEach((line, i) => {
          setState("lines", i, reconcile(line));
        });
      }
      setState("cursor", reconcile(core.getCursor()));
      setState("cursorHold", true);
    });
    frameRequestId = undefined;
  };
  const terminalElementSize = createMemo(() => {
    logger.debug(`containerW = ${state.containerW}`);
    const terminalW = state.charW * terminalCols() + state.bordersW;
    const terminalH = state.charH * terminalRows() + state.bordersH;
    let fit = props.fit ?? "width";
    if (fit === "both" || state.isFullscreen) {
      const containerRatio = state.containerW / (state.containerH - controlBarHeight());
      const terminalRatio = terminalW / terminalH;
      if (containerRatio > terminalRatio) {
        fit = "height";
      } else {
        fit = "width";
      }
    }
    if (fit === false || fit === "none") {
      return {};
    } else if (fit === "width") {
      const scale = state.containerW / terminalW;
      return {
        scale: scale,
        width: state.containerW,
        height: terminalH * scale + controlBarHeight()
      };
    } else if (fit === "height") {
      const scale = (state.containerH - controlBarHeight()) / terminalH;
      return {
        scale: scale,
        width: terminalW * scale,
        height: state.containerH
      };
    } else {
      throw `unsupported fit mode: ${fit}`;
    }
  });
  const onFullscreenChange = () => {
    setState("isFullscreen", document.fullscreenElement ?? document.webkitFullscreenElement);
  };
  const toggleFullscreen = () => {
    if (state.isFullscreen) {
      (document.exitFullscreen ?? document.webkitExitFullscreen ?? (() => {})).apply(document);
    } else {
      (wrapperRef.requestFullscreen ?? wrapperRef.webkitRequestFullscreen ?? (() => {})).apply(wrapperRef);
    }
  };
  const onKeyPress = e => {
    if (e.altKey || e.metaKey || e.ctrlKey) {
      return;
    }
    if (e.shiftKey) {
      if (e.key == "ArrowLeft") {
        core.seek("<<<");
      } else if (e.key == "ArrowRight") {
        core.seek(">>>");
      } else {
        return;
      }
      e.stopPropagation();
      e.preventDefault();
      return;
    }
    if (e.key == " ") {
      core.togglePlay();
    } else if (e.key == ".") {
      core.step();
      updateTime();
    } else if (e.key == "f") {
      toggleFullscreen();
    } else if (e.key == "ArrowLeft") {
      core.seek("<<");
    } else if (e.key == "ArrowRight") {
      core.seek(">>");
    } else if (e.key == "[") {
      core.seek({
        marker: "prev"
      });
    } else if (e.key == "]") {
      core.seek({
        marker: "next"
      });
    } else if (e.key.charCodeAt(0) >= 48 && e.key.charCodeAt(0) <= 57) {
      const pos = (e.key.charCodeAt(0) - 48) / 10;
      core.seek(`${pos * 100}%`);
    } else {
      return;
    }
    e.stopPropagation();
    e.preventDefault();
  };
  const wrapperOnMouseMove = () => {
    if (state.isFullscreen) {
      onUserActive(true);
    }
  };
  const playerOnMouseLeave = () => {
    if (!state.isFullscreen) {
      onUserActive(false);
    }
  };
  const startTimeUpdates = () => {
    timeUpdateIntervalId = setInterval(updateTime, 100);
  };
  const stopTimeUpdates = () => {
    clearInterval(timeUpdateIntervalId);
  };
  const updateTime = () => {
    const currentTime = core.getCurrentTime();
    const remainingTime = core.getRemainingTime();
    const progress = core.getProgress();
    setState({
      currentTime,
      remainingTime,
      progress
    });
  };
  const startBlinking = () => {
    blinkIntervalId = setInterval(() => {
      setState(state => {
        const changes = {
          blink: !state.blink
        };
        if (changes.blink) {
          changes.cursorHold = false;
        }
        return changes;
      });
    }, 500);
  };
  const stopBlinking = () => {
    clearInterval(blinkIntervalId);
    setState("blink", true);
  };
  const onUserActive = show => {
    clearTimeout(userActivityTimeoutId);
    if (show) {
      userActivityTimeoutId = setTimeout(() => onUserActive(false), 2000);
    }
    setUserActive(show);
  };
  const playerStyle = () => {
    const style = {};
    if ((props.fit === false || props.fit === "none") && props.terminalFontSize !== undefined) {
      if (props.terminalFontSize === "small") {
        style["font-size"] = "12px";
      } else if (props.terminalFontSize === "medium") {
        style["font-size"] = "18px";
      } else if (props.terminalFontSize === "big") {
        style["font-size"] = "24px";
      } else {
        style["font-size"] = props.terminalFontSize;
      }
    }
    const size = terminalElementSize();
    if (size.width !== undefined) {
      style["width"] = `${size.width}px`;
      style["height"] = `${size.height}px`;
    }
    const theme = originalTheme();
    if (theme !== undefined && (props.theme === undefined || props.theme === null)) {
      style["--term-color-foreground"] = theme.foreground;
      style["--term-color-background"] = theme.background;
      theme.palette.forEach((color, i) => {
        style[`--term-color-${i}`] = color;
      });
    }
    return style;
  };
  const playerClass = () => `ap-player asciinema-player-theme-${props.theme ?? "asciinema"}`;
  const terminalScale = () => terminalElementSize()?.scale;
  const el = (() => {
    const _el$ = _tmpl$.cloneNode(true),
      _el$2 = _el$.firstChild;
    const _ref$ = wrapperRef;
    typeof _ref$ === "function" ? use(_ref$, _el$) : wrapperRef = _el$;
    _el$.addEventListener("webkitfullscreenchange", onFullscreenChange);
    _el$.addEventListener("fullscreenchange", onFullscreenChange);
    _el$.$$mousemove = wrapperOnMouseMove;
    _el$.$$keydown = onKeyPress;
    _el$.addEventListener("keypress", onKeyPress);
    const _ref$2 = playerRef;
    typeof _ref$2 === "function" ? use(_ref$2, _el$2) : playerRef = _el$2;
    _el$2.$$mousemove = () => onUserActive(true);
    _el$2.addEventListener("mouseleave", playerOnMouseLeave);
    insert(_el$2, createComponent(Terminal, {
      get cols() {
        return terminalCols();
      },
      get rows() {
        return terminalRows();
      },
      get scale() {
        return terminalScale();
      },
      get blink() {
        return state.blink;
      },
      get lines() {
        return state.lines;
      },
      get cursor() {
        return state.cursor;
      },
      get cursorHold() {
        return state.cursorHold;
      },
      get fontFamily() {
        return props.terminalFontFamily;
      },
      get lineHeight() {
        return props.terminalLineHeight;
      },
      ref(r$) {
        const _ref$3 = terminalRef;
        typeof _ref$3 === "function" ? _ref$3(r$) : terminalRef = r$;
      }
    }), null);
    insert(_el$2, createComponent(Show, {
      get when() {
        return props.controls !== false;
      },
      get children() {
        return createComponent(ControlBar, {
          get duration() {
            return duration();
          },
          get currentTime() {
            return state.currentTime;
          },
          get remainingTime() {
            return state.remainingTime;
          },
          get progress() {
            return state.progress;
          },
          markers: markers,
          get isPlaying() {
            return isPlaying();
          },
          get isPausable() {
            return state.isPausable;
          },
          get isSeekable() {
            return state.isSeekable;
          },
          onPlayClick: () => core.togglePlay(),
          onFullscreenClick: toggleFullscreen,
          onSeekClick: pos => core.seek(pos),
          ref(r$) {
            const _ref$4 = controlBarRef;
            typeof _ref$4 === "function" ? _ref$4(r$) : controlBarRef = r$;
          }
        });
      }
    }), null);
    insert(_el$2, createComponent(Switch, {
      get children() {
        return [createComponent(Match, {
          get when() {
            return overlay() == "start";
          },
          get children() {
            return createComponent(StartOverlay, {
              onClick: () => core.play()
            });
          }
        }), createComponent(Match, {
          get when() {
            return overlay() == "loader";
          },
          get children() {
            return createComponent(LoaderOverlay, {});
          }
        }), createComponent(Match, {
          get when() {
            return overlay() == "info";
          },
          get children() {
            return createComponent(InfoOverlay, {
              get message() {
                return infoMessage();
              },
              get fontFamily() {
                return props.terminalFontFamily;
              }
            });
          }
        }), createComponent(Match, {
          get when() {
            return overlay() == "error";
          },
          get children() {
            return createComponent(ErrorOverlay, {});
          }
        })];
      }
    }), null);
    createRenderEffect(_p$ => {
      const _v$ = !!controlsVisible(),
        _v$2 = playerClass(),
        _v$3 = playerStyle();
      _v$ !== _p$._v$ && _el$.classList.toggle("ap-hud", _p$._v$ = _v$);
      _v$2 !== _p$._v$2 && className$1(_el$2, _p$._v$2 = _v$2);
      _p$._v$3 = style$1(_el$2, _v$3, _p$._v$3);
      return _p$;
    }, {
      _v$: undefined,
      _v$2: undefined,
      _v$3: undefined
    });
    return _el$;
  })();
  return el;
});
delegateEvents(["keydown", "mousemove"]);

class DummyLogger {
  log() {}
  debug() {}
  info() {}
  warn() {}
  error() {}
}
class PrefixedLogger {
  constructor(logger, prefix) {
    this.logger = logger;
    this.prefix = prefix;
  }
  log(message) {
    for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }
    this.logger.log(`${this.prefix}${message}`, ...args);
  }
  debug(message) {
    for (var _len2 = arguments.length, args = new Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
      args[_key2 - 1] = arguments[_key2];
    }
    this.logger.debug(`${this.prefix}${message}`, ...args);
  }
  info(message) {
    for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
      args[_key3 - 1] = arguments[_key3];
    }
    this.logger.info(`${this.prefix}${message}`, ...args);
  }
  warn(message) {
    for (var _len4 = arguments.length, args = new Array(_len4 > 1 ? _len4 - 1 : 0), _key4 = 1; _key4 < _len4; _key4++) {
      args[_key4 - 1] = arguments[_key4];
    }
    this.logger.warn(`${this.prefix}${message}`, ...args);
  }
  error(message) {
    for (var _len5 = arguments.length, args = new Array(_len5 > 1 ? _len5 - 1 : 0), _key5 = 1; _key5 < _len5; _key5++) {
      args[_key5 - 1] = arguments[_key5];
    }
    this.logger.error(`${this.prefix}${message}`, ...args);
  }
}

// Efficient array transformations without intermediate array objects.
// Inspired by Elixir's streams and Rust's iterator adapters.

class Stream {
  constructor(input, xfs) {
    this.input = typeof input.next === "function" ? input : input[Symbol.iterator]();
    this.xfs = xfs ?? [];
  }
  map(f) {
    return this.transform(Map$1(f));
  }
  flatMap(f) {
    return this.transform(FlatMap(f));
  }
  filter(f) {
    return this.transform(Filter(f));
  }
  take(n) {
    return this.transform(Take(n));
  }
  drop(n) {
    return this.transform(Drop(n));
  }
  transform(f) {
    return new Stream(this.input, this.xfs.concat([f]));
  }
  multiplex(other, comparator) {
    return new Stream(new Multiplexer(this[Symbol.iterator](), other[Symbol.iterator](), comparator));
  }
  toArray() {
    return Array.from(this);
  }
  [Symbol.iterator]() {
    let v = 0;
    let values = [];
    let flushed = false;
    const xf = compose(this.xfs, val => values.push(val));
    return {
      next: () => {
        if (v === values.length) {
          values = [];
          v = 0;
        }
        while (values.length === 0) {
          const next = this.input.next();
          if (next.done) {
            break;
          } else {
            xf.step(next.value);
          }
        }
        if (values.length === 0 && !flushed) {
          xf.flush();
          flushed = true;
        }
        if (values.length > 0) {
          return {
            done: false,
            value: values[v++]
          };
        } else {
          return {
            done: true
          };
        }
      }
    };
  }
}
function Map$1(f) {
  return emit => {
    return input => {
      emit(f(input));
    };
  };
}
function FlatMap(f) {
  return emit => {
    return input => {
      f(input).forEach(emit);
    };
  };
}
function Filter(f) {
  return emit => {
    return input => {
      if (f(input)) {
        emit(input);
      }
    };
  };
}
function Take(n) {
  let c = 0;
  return emit => {
    return input => {
      if (c < n) {
        emit(input);
      }
      c += 1;
    };
  };
}
function Drop(n) {
  let c = 0;
  return emit => {
    return input => {
      c += 1;
      if (c > n) {
        emit(input);
      }
    };
  };
}
function compose(xfs, push) {
  return xfs.reverse().reduce((next, curr) => {
    const xf = toXf(curr(next.step));
    return {
      step: xf.step,
      flush: () => {
        xf.flush();
        next.flush();
      }
    };
  }, toXf(push));
}
function toXf(xf) {
  if (typeof xf === "function") {
    return {
      step: xf,
      flush: () => {}
    };
  } else {
    return xf;
  }
}
class Multiplexer {
  constructor(left, right, comparator) {
    this.left = left;
    this.right = right;
    this.comparator = comparator;
  }
  [Symbol.iterator]() {
    let leftItem;
    let rightItem;
    return {
      next: () => {
        if (leftItem === undefined && this.left !== undefined) {
          const result = this.left.next();
          if (result.done) {
            this.left = undefined;
          } else {
            leftItem = result.value;
          }
        }
        if (rightItem === undefined && this.right !== undefined) {
          const result = this.right.next();
          if (result.done) {
            this.right = undefined;
          } else {
            rightItem = result.value;
          }
        }
        if (leftItem === undefined && rightItem === undefined) {
          return {
            done: true
          };
        } else if (leftItem === undefined) {
          const value = rightItem;
          rightItem = undefined;
          return {
            done: false,
            value: value
          };
        } else if (rightItem === undefined) {
          const value = leftItem;
          leftItem = undefined;
          return {
            done: false,
            value: value
          };
        } else if (this.comparator(leftItem, rightItem)) {
          const value = leftItem;
          leftItem = undefined;
          return {
            done: false,
            value: value
          };
        } else {
          const value = rightItem;
          rightItem = undefined;
          return {
            done: false,
            value: value
          };
        }
      }
    };
  }
}

async function parse$2(data) {
  let header;
  let events;
  if (data instanceof Response) {
    const text = await data.text();
    const result = parseJsonl(text);
    if (result !== undefined) {
      header = result.header;
      events = result.events;
    } else {
      header = JSON.parse(text);
    }
  } else if (typeof data === "object" && typeof data.version === "number") {
    header = data;
  } else if (Array.isArray(data)) {
    header = data[0];
    events = data.slice(1, data.length);
  } else {
    throw "invalid data";
  }
  if (header.version === 1) {
    return parseAsciicastV1(header);
  } else if (header.version === 2) {
    return parseAsciicastV2(header, events);
  } else {
    throw `asciicast v${header.version} format not supported`;
  }
}
function parseJsonl(jsonl) {
  const lines = jsonl.split("\n");
  let header;
  try {
    header = JSON.parse(lines[0]);
  } catch (_error) {
    return;
  }
  const events = new Stream(lines).drop(1).filter(l => l[0] === "[").map(JSON.parse).toArray();
  return {
    header,
    events
  };
}
function parseAsciicastV1(data) {
  let time = 0;
  const events = new Stream(data.stdout).map(e => {
    time += e[0];
    return [time, "o", e[1]];
  });
  return {
    cols: data.width,
    rows: data.height,
    events
  };
}
function parseAsciicastV2(header, events) {
  return {
    cols: header.width,
    rows: header.height,
    theme: parseTheme(header.theme),
    events,
    idleTimeLimit: header.idle_time_limit
  };
}
function parseTheme(theme) {
  const colorRegex = /^#[0-9A-Fa-f]{6}$/;
  const paletteRegex = /^(#[0-9A-Fa-f]{6}:){7,}#[0-9A-Fa-f]{6}$/;
  const fg = theme?.fg;
  const bg = theme?.bg;
  const palette = theme?.palette;
  if (colorRegex.test(fg) && colorRegex.test(bg) && paletteRegex.test(palette)) {
    return {
      foreground: fg,
      background: bg,
      palette: palette.split(":")
    };
  }
}
function unparseAsciicastV2(recording) {
  const header = JSON.stringify({
    version: 2,
    width: recording.cols,
    height: recording.rows
  });
  const events = recording.events.map(JSON.stringify).join("\n");
  return `${header}\n${events}\n`;
}

function recording(src, _ref, _ref2) {
  let {
    feed,
    onInput,
    onMarker,
    now,
    setTimeout,
    setState,
    logger
  } = _ref;
  let {
    idleTimeLimit,
    startAt,
    loop,
    posterTime,
    markers: markers_,
    pauseOnMarkers,
    cols: initialCols,
    rows: initialRows
  } = _ref2;
  let cols;
  let rows;
  let events;
  let markers;
  let duration;
  let effectiveStartAt;
  let eventTimeoutId;
  let nextEventIndex = 0;
  let lastEventTime = 0;
  let startTime;
  let pauseElapsedTime;
  let playCount = 0;
  async function init() {
    const {
      parser,
      minFrameTime,
      inputOffset,
      dumpFilename,
      encoding = "utf-8"
    } = src;
    const recording = prepare(await parser(await doFetch(src), {
      encoding
    }), logger, {
      idleTimeLimit,
      startAt,
      minFrameTime,
      inputOffset,
      markers_
    });
    ({
      cols,
      rows,
      events,
      duration,
      effectiveStartAt
    } = recording);
    initialCols = initialCols ?? cols;
    initialRows = initialRows ?? rows;
    if (events.length === 0) {
      throw "recording is missing events";
    }
    if (dumpFilename !== undefined) {
      dump(recording, dumpFilename);
    }
    const poster = posterTime !== undefined ? getPoster(posterTime) : undefined;
    markers = events.filter(e => e[1] === "m").map(e => [e[0], e[2].label]);
    return {
      cols,
      rows,
      duration,
      theme: recording.theme,
      poster,
      markers
    };
  }
  function doFetch(_ref3) {
    let {
      url,
      data,
      fetchOpts = {}
    } = _ref3;
    if (typeof url === "string") {
      return doFetchOne(url, fetchOpts);
    } else if (Array.isArray(url)) {
      return Promise.all(url.map(url => doFetchOne(url, fetchOpts)));
    } else if (data !== undefined) {
      if (typeof data === "function") {
        data = data();
      }
      if (!(data instanceof Promise)) {
        data = Promise.resolve(data);
      }
      return data.then(value => {
        if (typeof value === "string" || value instanceof ArrayBuffer) {
          return new Response(value);
        } else {
          return value;
        }
      });
    } else {
      throw "failed fetching recording file: url/data missing in src";
    }
  }
  async function doFetchOne(url, fetchOpts) {
    const response = await fetch(url, fetchOpts);
    if (!response.ok) {
      throw `failed fetching recording from ${url}: ${response.status} ${response.statusText}`;
    }
    return response;
  }
  function delay(targetTime) {
    let delay = targetTime * 1000 - (now() - startTime);
    if (delay < 0) {
      delay = 0;
    }
    return delay;
  }
  function scheduleNextEvent() {
    const nextEvent = events[nextEventIndex];
    if (nextEvent) {
      eventTimeoutId = setTimeout(runNextEvent, delay(nextEvent[0]));
    } else {
      onEnd();
    }
  }
  function runNextEvent() {
    let event = events[nextEventIndex];
    let elapsedWallTime;
    do {
      lastEventTime = event[0];
      nextEventIndex++;
      const stop = executeEvent(event);
      if (stop) {
        return;
      }
      event = events[nextEventIndex];
      elapsedWallTime = now() - startTime;
    } while (event && elapsedWallTime > event[0] * 1000);
    scheduleNextEvent();
  }
  function cancelNextEvent() {
    clearTimeout(eventTimeoutId);
    eventTimeoutId = null;
  }
  function executeEvent(event) {
    const [time, type, data] = event;
    if (type === "o") {
      feed(data);
    } else if (type === "i") {
      onInput(data);
    } else if (type === "m") {
      onMarker(data);
      if (pauseOnMarkers) {
        pause();
        pauseElapsedTime = time * 1000;
        setState("stopped", {
          reason: "paused"
        });
        return true;
      }
    }
    return false;
  }
  function onEnd() {
    cancelNextEvent();
    playCount++;
    if (loop === true || typeof loop === "number" && playCount < loop) {
      nextEventIndex = 0;
      startTime = now();
      feed("\x1bc"); // reset terminal
      resizeTerminalToInitialSize();
      scheduleNextEvent();
    } else {
      pauseElapsedTime = duration * 1000;
      effectiveStartAt = null;
      setState("stopped", {
        reason: "ended"
      });
    }
  }
  function play() {
    if (eventTimeoutId) return true;
    if (events[nextEventIndex] === undefined) {
      // ended
      effectiveStartAt = 0;
    }
    if (effectiveStartAt !== null) {
      seek(effectiveStartAt);
    }
    resume();
    return true;
  }
  function pause() {
    if (!eventTimeoutId) return true;
    cancelNextEvent();
    pauseElapsedTime = now() - startTime;
    return true;
  }
  function resume() {
    startTime = now() - pauseElapsedTime;
    pauseElapsedTime = null;
    scheduleNextEvent();
  }
  function seek(where) {
    const isPlaying = !!eventTimeoutId;
    pause();
    const currentTime = (pauseElapsedTime ?? 0) / 1000;
    if (typeof where === "string") {
      if (where === "<<") {
        where = currentTime - 5;
      } else if (where === ">>") {
        where = currentTime + 5;
      } else if (where === "<<<") {
        where = currentTime - 0.1 * duration;
      } else if (where === ">>>") {
        where = currentTime + 0.1 * duration;
      } else if (where[where.length - 1] === "%") {
        where = parseFloat(where.substring(0, where.length - 1)) / 100 * duration;
      }
    } else if (typeof where === "object") {
      if (where.marker === "prev") {
        where = findMarkerTimeBefore(currentTime) ?? 0;
        if (isPlaying && currentTime - where < 1) {
          where = findMarkerTimeBefore(where) ?? 0;
        }
      } else if (where.marker === "next") {
        where = findMarkerTimeAfter(currentTime) ?? duration;
      } else if (typeof where.marker === "number") {
        const marker = markers[where.marker];
        if (marker === undefined) {
          throw `invalid marker index: ${where.marker}`;
        } else {
          where = marker[0];
        }
      }
    }
    const targetTime = Math.min(Math.max(where, 0), duration);
    if (targetTime < lastEventTime) {
      feed("\x1bc"); // reset terminal
      resizeTerminalToInitialSize();
      nextEventIndex = 0;
      lastEventTime = 0;
    }
    let event = events[nextEventIndex];
    while (event && event[0] <= targetTime) {
      if (event[1] === "o") {
        executeEvent(event);
      }
      lastEventTime = event[0];
      event = events[++nextEventIndex];
    }
    pauseElapsedTime = targetTime * 1000;
    effectiveStartAt = null;
    if (isPlaying) {
      resume();
    }
    return true;
  }
  function findMarkerTimeBefore(time) {
    if (markers.length == 0) return;
    let i = 0;
    let marker = markers[i];
    let lastMarkerTimeBefore;
    while (marker && marker[0] < time) {
      lastMarkerTimeBefore = marker[0];
      marker = markers[++i];
    }
    return lastMarkerTimeBefore;
  }
  function findMarkerTimeAfter(time) {
    if (markers.length == 0) return;
    let i = markers.length - 1;
    let marker = markers[i];
    let firstMarkerTimeAfter;
    while (marker && marker[0] > time) {
      firstMarkerTimeAfter = marker[0];
      marker = markers[--i];
    }
    return firstMarkerTimeAfter;
  }
  function step() {
    let nextEvent = events[nextEventIndex++];
    while (nextEvent !== undefined && nextEvent[1] !== "o") {
      nextEvent = events[nextEventIndex++];
    }
    if (nextEvent === undefined) return;
    feed(nextEvent[2]);
    const targetTime = nextEvent[0];
    lastEventTime = targetTime;
    pauseElapsedTime = targetTime * 1000;
    effectiveStartAt = null;
  }
  function getPoster(time) {
    return events.filter(e => e[0] < time && e[1] === "o").map(e => e[2]);
  }
  function getCurrentTime() {
    if (eventTimeoutId) {
      return (now() - startTime) / 1000;
    } else {
      return (pauseElapsedTime ?? 0) / 1000;
    }
  }
  function resizeTerminalToInitialSize() {
    feed(`\x1b[8;${initialRows};${initialCols};t`);
  }
  return {
    init,
    play,
    pause,
    seek,
    step,
    stop: pause,
    getCurrentTime
  };
}
function batcher(logger) {
  let minFrameTime = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1.0 / 60;
  let prevEvent;
  return emit => {
    let ic = 0;
    let oc = 0;
    return {
      step: event => {
        ic++;
        if (prevEvent === undefined) {
          prevEvent = event;
          return;
        }
        if (event[1] === prevEvent[1] && event[0] - prevEvent[0] < minFrameTime) {
          if (event[1] === "m" && event[2] !== "") {
            prevEvent[2] = event[2];
          } else {
            prevEvent[2] += event[2];
          }
        } else {
          emit(prevEvent);
          prevEvent = event;
          oc++;
        }
      },
      flush: () => {
        if (prevEvent !== undefined) {
          emit(prevEvent);
          oc++;
        }
        logger.debug(`batched ${ic} frames to ${oc} frames`);
      }
    };
  };
}
function prepare(recording, logger, _ref4) {
  let {
    startAt = 0,
    idleTimeLimit,
    minFrameTime,
    inputOffset,
    markers_
  } = _ref4;
  let {
    events
  } = recording;
  if (events === undefined) {
    events = buildEvents(recording);
  }
  if (!(events instanceof Stream)) {
    events = new Stream(events);
  }
  idleTimeLimit = idleTimeLimit ?? recording.idleTimeLimit ?? Infinity;
  const limiterOutput = {
    offset: 0
  };
  events = events.map(convertResizeEvent).transform(batcher(logger, minFrameTime)).map(timeLimiter(idleTimeLimit, startAt, limiterOutput)).map(markerWrapper());
  if (markers_ !== undefined) {
    markers_ = new Stream(markers_).map(normalizeMarker);
    events = events.filter(e => e[1] !== "m").multiplex(markers_, (a, b) => a[0] < b[0]).map(markerWrapper());
  }
  events = events.toArray();
  if (inputOffset !== undefined) {
    events = events.map(e => e[1] === "i" ? [e[0] + inputOffset, e[1], e[2]] : e);
    events.sort((a, b) => a[0] - b[0]);
  }
  const duration = events[events.length - 1][0];
  const effectiveStartAt = startAt - limiterOutput.offset;
  return {
    ...recording,
    events,
    duration,
    effectiveStartAt
  };
}
function buildEvents(_ref5) {
  let {
    output = [],
    input = [],
    markers = []
  } = _ref5;
  const o = new Stream(output).map(e => [e[0], "o", e[1]]);
  const i = new Stream(input).map(e => [e[0], "i", e[1]]);
  const m = new Stream(markers).map(normalizeMarker);
  return o.multiplex(i, (a, b) => a[0] < b[0]).multiplex(m, (a, b) => a[0] < b[0]);
}
function convertResizeEvent(e) {
  if (e[1] === "r") {
    const [cols, rows] = e[2].split("x");
    return [e[0], "o", `\x1b[8;${rows};${cols};t`];
  } else {
    return e;
  }
}
function normalizeMarker(m) {
  return typeof m === "number" ? [m, "m", ""] : [m[0], "m", m[1]];
}
function timeLimiter(idleTimeLimit, startAt, output) {
  let prevT = 0;
  let shift = 0;
  return function (e) {
    const delay = e[0] - prevT;
    const delta = delay - idleTimeLimit;
    prevT = e[0];
    if (delta > 0) {
      shift += delta;
      if (e[0] < startAt) {
        output.offset += delta;
      }
    }
    return [e[0] - shift, e[1], e[2]];
  };
}
function markerWrapper() {
  let i = 0;
  return function (e) {
    if (e[1] === "m") {
      return [e[0], e[1], {
        index: i++,
        time: e[0],
        label: e[2]
      }];
    } else {
      return e;
    }
  };
}
function dump(recording, filename) {
  const link = document.createElement("a");
  const events = recording.events.map(e => e[1] === "m" ? [e[0], e[1], e[2].label] : e);
  const asciicast = unparseAsciicastV2({
    ...recording,
    events
  });
  link.href = URL.createObjectURL(new Blob([asciicast], {
    type: "text/plain"
  }));
  link.download = filename;
  link.click();
}

function clock(_ref, _ref2, _ref3) {
  let {
    hourColor = 3,
    minuteColor = 4,
    separatorColor = 9
  } = _ref;
  let {
    feed
  } = _ref2;
  let {
    cols = 5,
    rows = 1
  } = _ref3;
  const middleRow = Math.floor(rows / 2);
  const leftPad = Math.floor(cols / 2) - 2;
  const setupCursor = `\x1b[?25l\x1b[1m\x1b[${middleRow}B`;
  let intervalId;
  const getCurrentTime = () => {
    const d = new Date();
    const h = d.getHours();
    const m = d.getMinutes();
    const seqs = [];
    seqs.push("\r");
    for (let i = 0; i < leftPad; i++) {
      seqs.push(" ");
    }
    seqs.push(`\x1b[3${hourColor}m`);
    if (h < 10) {
      seqs.push("0");
    }
    seqs.push(`${h}`);
    seqs.push(`\x1b[3${separatorColor};5m:\x1b[25m`);
    seqs.push(`\x1b[3${minuteColor}m`);
    if (m < 10) {
      seqs.push("0");
    }
    seqs.push(`${m}`);
    return seqs;
  };
  const updateTime = () => {
    getCurrentTime().forEach(feed);
  };
  return {
    init: () => {
      const duration = 24 * 60;
      const poster = [setupCursor].concat(getCurrentTime());
      return {
        cols,
        rows,
        duration,
        poster
      };
    },
    play: () => {
      feed(setupCursor);
      updateTime();
      intervalId = setInterval(updateTime, 1000);
      return true;
    },
    stop: () => {
      clearInterval(intervalId);
    },
    getCurrentTime: () => {
      const d = new Date();
      return d.getHours() * 60 + d.getMinutes();
    }
  };
}

function random(src, _ref) {
  let {
    feed,
    setTimeout
  } = _ref;
  const base = " ".charCodeAt(0);
  const range = "~".charCodeAt(0) - base;
  let timeoutId;
  const schedule = () => {
    const t = Math.pow(5, Math.random() * 4);
    timeoutId = setTimeout(print, t);
  };
  const print = () => {
    schedule();
    const char = String.fromCharCode(base + Math.floor(Math.random() * range));
    feed(char);
  };
  return () => {
    schedule();
    return () => clearInterval(timeoutId);
  };
}

function benchmark(_ref, _ref2) {
  let {
    url,
    iterations = 10
  } = _ref;
  let {
    feed,
    setState,
    now
  } = _ref2;
  let data;
  let byteCount = 0;
  return {
    async init() {
      const recording = await parse$2(await fetch(url));
      const {
        cols,
        rows,
        events
      } = recording;
      data = Array.from(events).filter(_ref3 => {
        let [_time, type, _text] = _ref3;
        return type === "o";
      }).map(_ref4 => {
        let [time, _type, text] = _ref4;
        return [time, text];
      });
      const duration = data[data.length - 1][0];
      for (const [_, text] of data) {
        byteCount += new Blob([text]).size;
      }
      return {
        cols,
        rows,
        duration
      };
    },
    play() {
      const startTime = now();
      for (let i = 0; i < iterations; i++) {
        for (const [_, text] of data) {
          feed(text);
        }
        feed("\x1bc"); // reset terminal
      }

      const endTime = now();
      const duration = (endTime - startTime) / 1000;
      const throughput = byteCount * iterations / duration;
      const throughputMbs = byteCount / (1024 * 1024) * iterations / duration;
      console.info("benchmark: result", {
        byteCount,
        iterations,
        duration,
        throughput,
        throughputMbs
      });
      setTimeout(() => {
        setState("stopped", {
          reason: "ended"
        });
      }, 0);
      return true;
    }
  };
}

class Queue {
  constructor() {
    this.items = [];
    this.onPush = undefined;
  }
  push(item) {
    this.items.push(item);
    if (this.onPush !== undefined) {
      this.onPush(this.popAll());
      this.onPush = undefined;
    }
  }
  popAll() {
    if (this.items.length > 0) {
      const items = this.items;
      this.items = [];
      return items;
    } else {
      const thiz = this;
      return new Promise(resolve => {
        thiz.onPush = resolve;
      });
    }
  }
}

function getBuffer(bufferTime, feed, setTime, baseStreamTime, minFrameTime, logger) {
  if (bufferTime === 0) {
    logger.debug("using no buffer");
    return nullBuffer(feed);
  } else {
    let getBufferTime;
    if (typeof bufferTime === "number") {
      logger.debug(`using fixed time buffer (${bufferTime} ms)`);
      getBufferTime = _latency => bufferTime;
    } else {
      logger.debug("using adaptive buffer");
      getBufferTime = adaptiveBufferTimeProvider(logger);
    }
    return buffer(getBufferTime, feed, setTime, logger, baseStreamTime ?? 0.0, minFrameTime);
  }
}
function nullBuffer(feed) {
  return {
    pushEvent(event) {
      if (event[1] === "o") {
        feed(event[2]);
      }
    },
    pushText(text) {
      feed(text);
    },
    stop() {}
  };
}
function buffer(getBufferTime, feed, setTime, logger, baseStreamTime) {
  let minFrameTime = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 1.0 / 60;
  let epoch = performance.now() - baseStreamTime * 1000;
  let bufferTime = getBufferTime(0);
  const queue = new Queue();
  minFrameTime *= 1000;
  let prevElapsedStreamTime = -minFrameTime;
  let stop = false;
  function elapsedWallTime() {
    return performance.now() - epoch;
  }
  setTimeout(async () => {
    while (!stop) {
      const events = await queue.popAll();
      if (stop) return;
      for (const event of events) {
        const elapsedStreamTime = event[0] * 1000 + bufferTime;
        if (elapsedStreamTime - prevElapsedStreamTime < minFrameTime) {
          feed(event[2]);
          continue;
        }
        const delay = elapsedStreamTime - elapsedWallTime();
        if (delay > 0) {
          await sleep(delay);
          if (stop) return;
        }
        setTime(event[0]);
        feed(event[2]);
        prevElapsedStreamTime = elapsedStreamTime;
      }
    }
  }, 0);
  return {
    pushEvent(event) {
      let latency = elapsedWallTime() - event[0] * 1000;
      if (latency < 0) {
        logger.debug(`correcting epoch by ${latency} ms`);
        epoch += latency;
        latency = 0;
      }
      bufferTime = getBufferTime(latency);
      if (event[1] === "o") {
        queue.push(event);
      } else if (event[1] === "r") {
        const [cols, rows] = event[2].split("x");
        queue.push([event[0], "o", `\x1b[8;${rows};${cols};t`]);
      }
    },
    pushText(text) {
      queue.push([elapsedWallTime(), "o", text]);
    },
    stop() {
      stop = true;
      queue.push(undefined);
    }
  };
}
function sleep(t) {
  return new Promise(resolve => {
    setTimeout(resolve, t);
  });
}
const BUFFER_TIME_MULTIPLIER = 1.5;
const INITIAL_BUFFER_TIME = 10;
const MAX_BUFFER_LEVEL = 12;
const LATENCY_WINDOW_SIZE = 10;
function adaptiveBufferTimeProvider(logger) {
  let bufferTime = INITIAL_BUFFER_TIME;
  let bufferLevel = 0;
  let latencies = [];
  return latency => {
    latencies.push(latency);
    if (latencies.length > LATENCY_WINDOW_SIZE) {
      latencies = latencies.slice(-LATENCY_WINDOW_SIZE);
      const avgLatency = avg(latencies);
      if (bufferLevel < MAX_BUFFER_LEVEL && avgLatency > bufferTime) {
        bufferTime = calcBufferTime(bufferLevel += 1);
        logger.debug(`latency increased, raising bufferTime to ${bufferTime} ms`);
      } else if (bufferLevel == 1 && avgLatency < calcBufferTime(bufferLevel - 1) || bufferLevel > 1 && avgLatency < calcBufferTime(bufferLevel - 2)) {
        bufferTime = calcBufferTime(bufferLevel -= 1);
        logger.debug(`latency decreased, lowering bufferTime to ${bufferTime} ms`);
      }
    }
    return bufferTime;
  };
}
function avg(numbers) {
  return numbers.reduce((prev, cur) => prev + cur, 0) / numbers.length;
}
function calcBufferTime(level) {
  return INITIAL_BUFFER_TIME * BUFFER_TIME_MULTIPLIER ** level;
}

function exponentialDelay(attempt) {
  return Math.min(500 * Math.pow(2, attempt), 5000);
}
function websocket(_ref, _ref2) {
  let {
    url,
    bufferTime,
    reconnectDelay = exponentialDelay,
    minFrameTime
  } = _ref;
  let {
    feed,
    reset,
    setState,
    logger
  } = _ref2;
  logger = new PrefixedLogger(logger, "websocket: ");
  const utfDecoder = new TextDecoder();
  let socket;
  let buf;
  let clock = new NullClock();
  let reconnectAttempt = 0;
  let successfulConnectionTimeout;
  let stop = false;
  function initBuffer(baseStreamTime) {
    if (buf !== undefined) buf.stop();
    buf = getBuffer(bufferTime, feed, t => clock.setTime(t), baseStreamTime, minFrameTime, logger);
  }
  function detectProtocol(event) {
    if (typeof event.data === "string") {
      logger.info("activating asciicast-compatible handler");
      initBuffer();
      socket.onmessage = handleJsonMessage;
      handleJsonMessage(event);
    } else {
      const arr = new Uint8Array(event.data);
      if (arr[0] == 0x41 && arr[1] == 0x4c && arr[2] == 0x69 && arr[3] == 0x53) {
        // 'ALiS'
        if (arr[4] == 1) {
          logger.info("activating ALiS v1 handler");
          socket.onmessage = handleStreamMessage;
        } else {
          logger.warn(`unsupported ALiS version (${arr[4]})`);
          socket.close();
        }
      } else {
        logger.info("activating raw text handler");
        initBuffer();
        const text = utfDecoder.decode(arr);
        const size = sizeFromResizeSeq(text) ?? sizeFromScriptStartMessage(text);
        if (size !== undefined) {
          const [cols, rows] = size;
          handleResetMessage(cols, rows, 0, undefined);
        }
        socket.onmessage = handleRawTextMessage;
        handleRawTextMessage(event);
      }
    }
  }
  function sizeFromResizeSeq(text) {
    const match = text.match(/\x1b\[8;(\d+);(\d+)t/);
    if (match !== null) {
      return [parseInt(match[2], 10), parseInt(match[1], 10)];
    }
  }
  function sizeFromScriptStartMessage(text) {
    const match = text.match(/\[.*COLUMNS="(\d{1,3})" LINES="(\d{1,3})".*\]/);
    if (match !== null) {
      return [parseInt(match[1], 10), parseInt(match[2], 10)];
    }
  }
  function handleJsonMessage(event) {
    const e = JSON.parse(event.data);
    if (Array.isArray(e)) {
      buf.pushEvent(e);
    } else if (e.cols !== undefined || e.width !== undefined) {
      handleResetMessage(e.cols ?? e.width, e.rows ?? e.height, e.time, e.init ?? undefined);
    } else if (e.status === "offline") {
      handleOfflineMessage();
    }
  }
  const THEME_LEN = 54; // (2 + 16) * 3

  function handleStreamMessage(event) {
    const buffer = event.data;
    const view = new DataView(buffer);
    const type = view.getUint8(0);
    let offset = 1;
    if (type === 0x01) {
      // reset
      const cols = view.getUint16(offset, true);
      offset += 2;
      const rows = view.getUint16(offset, true);
      offset += 2;
      const time = view.getFloat32(offset, true);
      offset += 4;
      const themeFormat = view.getUint8(offset);
      offset += 1;
      let theme;
      if (themeFormat === 1) {
        theme = parseTheme(new Uint8Array(buffer, offset, THEME_LEN));
        offset += THEME_LEN;
      }
      const initLen = view.getUint32(offset, true);
      offset += 4;
      let init;
      if (initLen > 0) {
        init = utfDecoder.decode(new Uint8Array(buffer, offset, initLen));
        offset += initLen;
      }
      handleResetMessage(cols, rows, time, init, theme);
    } else if (type === 0x6f) {
      // 'o' - output
      const time = view.getFloat32(1, true);
      const len = view.getUint32(5, true);
      const text = utfDecoder.decode(new Uint8Array(buffer, 9, len));
      buf.pushEvent([time, "o", text]);
    } else if (type === 0x72) {
      // 'r' - resize
      const time = view.getFloat32(1, true);
      const cols = view.getUint16(5, true);
      const rows = view.getUint16(7, true);
      buf.pushEvent([time, "r", `${cols}x${rows}`]);
    } else if (type === 0x04) {
      // offline (EOT)
      handleOfflineMessage();
    } else {
      logger.debug(`unknown frame type: ${type}`);
    }
  }
  function parseTheme(arr) {
    const foreground = hexColor(arr[0], arr[1], arr[2]);
    const background = hexColor(arr[3], arr[4], arr[5]);
    const palette = [];
    for (let i = 0; i < 16; i++) {
      palette.push(hexColor(arr[i * 3 + 6], arr[i * 3 + 7], arr[i * 3 + 8]));
    }
    return {
      foreground,
      background,
      palette
    };
  }
  function hexColor(r, g, b) {
    return `#${byteToHex(r)}${byteToHex(g)}${byteToHex(b)}`;
  }
  function byteToHex(value) {
    return value.toString(16).padStart(2, "0");
  }
  function handleRawTextMessage(event) {
    buf.pushText(utfDecoder.decode(event.data));
  }
  function handleResetMessage(cols, rows, time, init, theme) {
    logger.debug(`stream reset (${cols}x${rows} @${time})`);
    setState("playing");
    initBuffer(time);
    reset(cols, rows, init, theme);
    clock = new Clock();
    if (typeof time === "number") {
      clock.setTime(time);
    }
  }
  function handleOfflineMessage() {
    logger.info("stream offline");
    setState("offline");
    clock = new NullClock();
  }
  function connect() {
    socket = new WebSocket(url);
    socket.binaryType = "arraybuffer";
    socket.onopen = () => {
      logger.info("opened");
      successfulConnectionTimeout = setTimeout(() => {
        reconnectAttempt = 0;
      }, 1000);
    };
    socket.onmessage = detectProtocol;
    socket.onclose = event => {
      if (stop || event.code === 1000 || event.code === 1005) {
        logger.info("closed");
        setState("stopped", {
          reason: "ended",
          message: "Stream ended"
        });
      } else {
        clearTimeout(successfulConnectionTimeout);
        const delay = reconnectDelay(reconnectAttempt++);
        logger.info(`unclean close, reconnecting in ${delay}...`);
        setState("loading");
        setTimeout(connect, delay);
      }
    };
  }
  return {
    play: () => {
      connect();
    },
    stop: () => {
      stop = true;
      if (buf !== undefined) buf.stop();
      if (socket !== undefined) socket.close();
    },
    getCurrentTime: () => clock.getTime()
  };
}

function eventsource(_ref, _ref2) {
  let {
    url,
    bufferTime,
    minFrameTime
  } = _ref;
  let {
    feed,
    reset,
    setState,
    logger
  } = _ref2;
  logger = new PrefixedLogger(logger, "eventsource: ");
  let es;
  let buf;
  let clock = new NullClock();
  function initBuffer(baseStreamTime) {
    if (buf !== undefined) buf.stop();
    buf = getBuffer(bufferTime, feed, t => clock.setTime(t), baseStreamTime, minFrameTime, logger);
  }
  return {
    play: () => {
      es = new EventSource(url);
      es.addEventListener("open", () => {
        logger.info("opened");
        initBuffer();
      });
      es.addEventListener("error", e => {
        logger.info("errored");
        logger.debug({
          e
        });
        setState("loading");
      });
      es.addEventListener("message", event => {
        const e = JSON.parse(event.data);
        if (Array.isArray(e)) {
          buf.pushEvent(e);
        } else if (e.cols !== undefined || e.width !== undefined) {
          const cols = e.cols ?? e.width;
          const rows = e.rows ?? e.height;
          logger.debug(`vt reset (${cols}x${rows})`);
          setState("playing");
          initBuffer(e.time);
          reset(cols, rows, e.init ?? undefined);
          clock = new Clock();
          if (typeof e.time === "number") {
            clock.setTime(e.time);
          }
        } else if (e.state === "offline") {
          logger.info("stream offline");
          setState("offline");
          clock = new NullClock();
        }
      });
      es.addEventListener("done", () => {
        logger.info("closed");
        es.close();
        setState("stopped", {
          reason: "ended"
        });
      });
    },
    stop: () => {
      if (buf !== undefined) buf.stop();
      if (es !== undefined) es.close();
    },
    getCurrentTime: () => clock.getTime()
  };
}

async function parse$1(responses, _ref) {
  let {
    encoding
  } = _ref;
  const textDecoder = new TextDecoder(encoding);
  let cols;
  let rows;
  let timing = (await responses[0].text()).split("\n").filter(line => line.length > 0).map(line => line.split(" "));
  if (timing[0].length < 3) {
    timing = timing.map(entry => ["O", entry[0], entry[1]]);
  }
  const buffer = await responses[1].arrayBuffer();
  const array = new Uint8Array(buffer);
  const dataOffset = array.findIndex(byte => byte == 0x0a) + 1;
  const header = textDecoder.decode(array.subarray(0, dataOffset));
  const sizeMatch = header.match(/COLUMNS="(\d+)" LINES="(\d+)"/);
  if (sizeMatch !== null) {
    cols = parseInt(sizeMatch[1], 10);
    rows = parseInt(sizeMatch[2], 10);
  }
  const stdout = {
    array,
    cursor: dataOffset
  };
  let stdin = stdout;
  if (responses[2] !== undefined) {
    const buffer = await responses[2].arrayBuffer();
    const array = new Uint8Array(buffer);
    stdin = {
      array,
      cursor: dataOffset
    };
  }
  const events = [];
  let time = 0;
  for (const entry of timing) {
    time += parseFloat(entry[1]);
    if (entry[0] === "O") {
      const count = parseInt(entry[2], 10);
      const bytes = stdout.array.subarray(stdout.cursor, stdout.cursor + count);
      const text = textDecoder.decode(bytes);
      events.push([time, "o", text]);
      stdout.cursor += count;
    } else if (entry[0] === "I") {
      const count = parseInt(entry[2], 10);
      const bytes = stdin.array.subarray(stdin.cursor, stdin.cursor + count);
      const text = textDecoder.decode(bytes);
      events.push([time, "i", text]);
      stdin.cursor += count;
    } else if (entry[0] === "S" && entry[2] === "SIGWINCH") {
      const cols = parseInt(entry[4].slice(5), 10);
      const rows = parseInt(entry[3].slice(5), 10);
      events.push([time, "r", `${cols}x${rows}`]);
    } else if (entry[0] === "H" && entry[2] === "COLUMNS") {
      cols = parseInt(entry[3], 10);
    } else if (entry[0] === "H" && entry[2] === "LINES") {
      rows = parseInt(entry[3], 10);
    }
  }
  cols = cols ?? 80;
  rows = rows ?? 24;
  return {
    cols,
    rows,
    events
  };
}

async function parse(response, _ref) {
  let {
    encoding
  } = _ref;
  const textDecoder = new TextDecoder(encoding);
  const buffer = await response.arrayBuffer();
  const array = new Uint8Array(buffer);
  const firstFrame = parseFrame(array);
  const baseTime = firstFrame.time;
  const firstFrameText = textDecoder.decode(firstFrame.data);
  const sizeMatch = firstFrameText.match(/\x1b\[8;(\d+);(\d+)t/);
  const events = [];
  let cols = 80;
  let rows = 24;
  if (sizeMatch !== null) {
    cols = parseInt(sizeMatch[2], 10);
    rows = parseInt(sizeMatch[1], 10);
  }
  let cursor = 0;
  let frame = parseFrame(array);
  while (frame !== undefined) {
    const time = frame.time - baseTime;
    const text = textDecoder.decode(frame.data);
    events.push([time, "o", text]);
    cursor += frame.len;
    frame = parseFrame(array.subarray(cursor));
  }
  return {
    cols,
    rows,
    events
  };
}
function parseFrame(array) {
  if (array.length < 13) return;
  const time = parseTimestamp(array.subarray(0, 8));
  const len = parseNumber(array.subarray(8, 12));
  const data = array.subarray(12, 12 + len);
  return {
    time,
    data,
    len: len + 12
  };
}
function parseNumber(array) {
  return array[0] + array[1] * 256 + array[2] * 256 * 256 + array[3] * 256 * 256 * 256;
}
function parseTimestamp(array) {
  const sec = parseNumber(array.subarray(0, 4));
  const usec = parseNumber(array.subarray(4, 8));
  return sec + usec / 1000000;
}

const drivers = new Map([["benchmark", benchmark], ["clock", clock], ["eventsource", eventsource], ["random", random], ["recording", recording], ["websocket", websocket]]);
const parsers = new Map([["asciicast", parse$2], ["typescript", parse$1], ["ttyrec", parse]]);
function create(src, elem) {
  let opts = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  const logger = opts.logger ?? new DummyLogger();
  const core = new Core(getDriver(src), {
    logger: logger,
    cols: opts.cols,
    rows: opts.rows,
    loop: opts.loop,
    speed: opts.speed,
    preload: opts.preload,
    startAt: opts.startAt,
    poster: opts.poster,
    markers: opts.markers,
    pauseOnMarkers: opts.pauseOnMarkers,
    idleTimeLimit: opts.idleTimeLimit
  });
  const metrics = measureTerminal(opts.terminalFontFamily, opts.terminalLineHeight);
  const props = {
    logger: logger,
    core: core,
    cols: opts.cols,
    rows: opts.rows,
    fit: opts.fit,
    controls: opts.controls ?? "auto",
    autoPlay: opts.autoPlay ?? opts.autoplay,
    terminalFontSize: opts.terminalFontSize,
    terminalFontFamily: opts.terminalFontFamily,
    terminalLineHeight: opts.terminalLineHeight,
    theme: opts.theme,
    ...metrics
  };
  let el;
  const dispose = render(() => {
    el = createComponent(Player, props);
    return el;
  }, elem);
  const player = {
    el: el,
    dispose: dispose,
    getCurrentTime: () => core.getCurrentTime(),
    getDuration: () => core.getDuration(),
    play: () => core.play(),
    pause: () => core.pause(),
    seek: pos => core.seek(pos)
  };
  player.addEventListener = (name, callback) => {
    return core.addEventListener(name, callback.bind(player));
  };
  return player;
}
function getDriver(src) {
  if (typeof src === "function") return src;
  if (typeof src === "string") {
    if (src.substring(0, 5) == "ws://" || src.substring(0, 6) == "wss://") {
      src = {
        driver: "websocket",
        url: src
      };
    } else if (src.substring(0, 6) == "clock:") {
      src = {
        driver: "clock"
      };
    } else if (src.substring(0, 7) == "random:") {
      src = {
        driver: "random"
      };
    } else if (src.substring(0, 10) == "benchmark:") {
      src = {
        driver: "benchmark",
        url: src.substring(10)
      };
    } else {
      src = {
        driver: "recording",
        url: src
      };
    }
  }
  if (src.driver === undefined) {
    src.driver = "recording";
  }
  if (src.driver == "recording") {
    if (src.parser === undefined) {
      src.parser = "asciicast";
    }
    if (typeof src.parser === "string") {
      if (parsers.has(src.parser)) {
        src.parser = parsers.get(src.parser);
      } else {
        throw `unknown parser: ${src.parser}`;
      }
    }
  }
  if (drivers.has(src.driver)) {
    const driver = drivers.get(src.driver);
    return (callbacks, opts) => driver(src, callbacks, opts);
  } else {
    throw `unsupported driver: ${JSON.stringify(src)}`;
  }
}
function measureTerminal(fontFamily, lineHeight) {
  const cols = 80;
  const rows = 24;
  const div = document.createElement("div");
  div.style.height = "0px";
  div.style.overflow = "hidden";
  div.style.fontSize = "15px"; // must match font-size of div.asciinema-player in CSS
  document.body.appendChild(div);
  let el;
  const dispose = render(() => {
    el = createComponent(Terminal, {
      cols: cols,
      rows: rows,
      lineHeight: lineHeight,
      fontFamily: fontFamily,
      lines: []
    });
    return el;
  }, div);
  const metrics = {
    charW: el.clientWidth / cols,
    charH: el.clientHeight / rows,
    bordersW: el.offsetWidth - el.clientWidth,
    bordersH: el.offsetHeight - el.clientHeight
  };
  dispose();
  document.body.removeChild(div);
  return metrics;
}




/***/ }),

/***/ "./node_modules/asciinema-player/dist/bundle/asciinema-player.css":
/*!************************************************************************!*\
  !*** ./node_modules/asciinema-player/dist/bundle/asciinema-player.css ***!
  \************************************************************************/
/***/ (function(__unused_webpack_module, __webpack_exports__, __webpack_require__) {

__webpack_require__.r(__webpack_exports__);
// extracted by mini-css-extract-plugin


/***/ })

}]);
//# sourceMappingURL=asciinema-player.d9d1a4a2.js.ad5d7715.map