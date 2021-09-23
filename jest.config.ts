export default {
  clearMocks: true,
  collectCoverage: true,
  coverageDirectory: 'coverage',
  coveragePathIgnorePatterns: ['/node_modules/', '/build/', '__test__/helpers'],
  coverageProvider: 'v8',
  setupFiles: ['<rootDir>/__tests__/jestSetup.ts'],
  testMatch: ['**/__tests__/**/*.test.ts'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
  testPathIgnorePatterns: ['/node_modules/', '/build/'],
};
