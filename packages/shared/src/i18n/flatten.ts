export type MessageTree = { [key: string]: string | MessageTree };

export function flattenMessages(tree: MessageTree, prefix = ""): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const [key, value] of Object.entries(tree)) {
    const name = prefix ? `${prefix}.${key}` : key;
    if (typeof value === "string") flat[name] = value;
    else Object.assign(flat, flattenMessages(value, name));
  }
  return flat;
}

const RESERVED_SEGMENTS = new Set(["__proto__", "constructor", "prototype"]);

/** Splits a dotted message name, rejecting empty and reserved segments (names may come from database rows). */
function nameSegments(name: string): string[] {
  const parts = name.split(".");
  for (const part of parts) {
    if (part === "") throw new Error(`Message name "${name}" has an empty segment`);
    if (RESERVED_SEGMENTS.has(part)) throw new Error(`Message name "${name}" uses the reserved segment "${part}"`);
  }
  return parts;
}

export function unflattenMessages(flat: Readonly<Record<string, string>>): MessageTree {
  const root: MessageTree = {};
  for (const [name, message] of Object.entries(flat)) {
    const parts = nameSegments(name);
    const leaf = parts.pop() as string;
    let node = root;
    for (const [index, part] of parts.entries()) {
      const next = Object.hasOwn(node, part) ? node[part] : undefined;
      if (typeof next === "string") {
        const prefix = parts.slice(0, index + 1).join(".");
        throw new Error(`Message name "${name}" conflicts with the message "${prefix}"`);
      }
      if (next === undefined) {
        const created: MessageTree = {};
        node[part] = created;
        node = created;
      } else {
        node = next;
      }
    }
    if (Object.hasOwn(node, leaf)) {
      throw new Error(`Message name "${name}" is both a message and a prefix of other names`);
    }
    node[leaf] = message;
  }
  return root;
}
