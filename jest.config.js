module.exports = {
    testEnvironment: 'jsdom',
    setupFilesAfterEnv: ['<rootDir>/src/test-utils/setup.js'],
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
        '\\.(ttf|woff|woff2|eot|svg)$': '<rootDir>/src/test-utils/fileMock.js'
    },
    transform: {
        '^.+\\.(js|jsx)$': 'babel-jest',
    },
    collectCoverageFrom: [
        'src/**/*.{js,jsx}',
        '!src/main.jsx',
        '!src/test-utils/**',
        '!src/**/*.test.{js,jsx}'
    ],
    coverageThreshold: {
        global: {
            branches: 70,
            functions: 70,
            lines: 75,
            statements: 75
        }
    },
    testMatch: [
        '**/__tests__/**/*.[jt]s?(x)',
        '**/?(*.)+(spec|test).[jt]s?(x)'
    ]
};
