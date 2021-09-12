import { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
    appId: "io.ionic.starter",
    appName: "FindLobby",
    webDir: "www",
    bundledWebRuntime: false,
    plugins: {
        Keyboard: {
            resize: "body"
        },

    }
};
    export default config;
