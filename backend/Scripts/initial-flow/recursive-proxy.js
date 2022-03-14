
export function recursiveProxy(obj) {
    return new Proxy(obj, {
        get: (target, prop) => {
            const value = target[prop];
            if (typeof value === "function") {
                const propAsName = prop
                    .replace(/([A-Z])/g, (x) => ' ' + x)
                    .replace(/(.)/, (x) => x.toUpperCase());
                return async (...args) => {
                    console.log(`Start : ${propAsName}`);
                    const result = await value.apply(recursiveProxy(target), args);
                    console.log(`Done  : ${propAsName}`);
                    return result;
                }
            }
            return value;
        }
    })
}
