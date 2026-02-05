// Minimal pub/sub event bus to decouple modules without circular imports.

const listeners = new Map();

export function on(event, cb) {
  if (!listeners.has(event)) listeners.set(event, new Set());
  listeners.get(event).add(cb);
}

export function off(event, cb) {
  listeners.get(event)?.delete(cb);
}

export function emit(event, payload) {
  if (!listeners.has(event)) return;
  for (const cb of listeners.get(event)) cb(payload);
}
