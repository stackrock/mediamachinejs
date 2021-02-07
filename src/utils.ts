export function removeUndefinedFromObj(obj: Record<string, unknown>) {
  Object.keys(obj).forEach(key => obj[key] === undefined ? delete obj[key] : {});
  return obj;
}

interface ParsedApiKey {
  key: string;
  name: string;
  isTesting: boolean;
}

export const parseApiKey = (inKey: string): ParsedApiKey => {
  // check the LIVE- / test- prefix
  if (!/^LIVE\-|test\-/.test(inKey)) {
    throw new Error("bad key format");
  }
  // chop off the LIVE- / test- prefix
  const key = inKey.substring(5);
  const matcher = /[a-f0-9]{8}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{4}\-[a-f0-9]{12}$/;
  const results = key.match(matcher);

  if (!results) {
    throw new Error("bad key format");
  }
  if (!results.index) {
    throw new Error("bad key format");
  }
  const retval = {
    key: key.slice(results.index),
    name: key.slice(0, results.index - 1),
    isTesting: inKey.indexOf("LIVE-") === -1,
  };
  return retval;
};