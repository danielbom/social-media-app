import { InitialFlow } from "./InitialFlow.js";
import { recursiveProxy } from "./recursive-proxy.js";

function usage(log) {
    log();
    log('node [program-name] <LOGIN> <PASSWORD> [--help]');
    log('    LOGIN: Login of a user. (Required)');
    log('    PASSWORD: Password of a user. (Required)');
    log('    --help: Show this message. (Optional)');
    log();
}

const args = process.argv.slice(2);

if (args[0] === "--help") {
    usage(console.log);
    process.exit(0);
}

if (args.length !== 2) {
    usage(console.error);
    throw new Error("Invalid number of arguments");
}

try {
    const initialFlow = new InitialFlow({
        username: args[0],
        password: args[1]
    });

    const proxyInitialFlow = recursiveProxy(initialFlow);

    await proxyInitialFlow.execute();
} catch (error) {
    console.log(error.message);
    console.error(error);
}

