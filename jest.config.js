module.exports = {
    preset: "ts-jest/presets/default-esm",
    testEnvironment: "jsdom",
    setupFilesAfterEnv: ["<rootDir>/src/setupTests.tsx"],
    transform: {
        "^.+\\.(ts|tsx)$": [
            "ts-jest",
            {
                useESM: true,
                tsconfig: {
                    jsx: "react-jsx",
                    jsxImportSource: "@emotion/react",
                    verbatimModuleSyntax: false, // Disable for tests
                },
            },
        ],
    },
    extensionsToTreatAsEsm: [".ts", ".tsx"],
};
