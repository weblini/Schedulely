/** @type {import('jest').Config} */
module.exports = {
  moduleNameMapper: {
    '@/(.*)$': '<rootDir>/src/$1',
  },
  testEnvironment: 'jsdom',
  transform: {
    '^.+\\.(t|j)sx?$': ['@swc/jest'],
  },
  modulePathIgnorePatterns: ['.*.testHelper.ts'],
  setupFilesAfterEnv: [
    './jest.env.js',
    '@testing-library/jest-dom/extend-expect',
  ],
  coverageThreshold: {
    global: {
      branches: 1,
      functions: 1,
      lines: 1,
      statements: 0,
    },
  },
};
