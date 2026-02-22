const nextJest = require('next/jest');

const createJestConfig = nextJest({
	// Provide the path to your Next.js app to load next.config.js and .env files
	dir: './'
});

// const customJestConfig = {
// 	setupFilesAfterEnv: ['<rootDir>/jest.setup.js'],
// 	testEnvironment: 'jsdom',
// 	moduleDirectories: ['node_modules', '<rootDir>/'],
// 	testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
// 	//for next-intl, ignore everything in node_modules except any file that has next-intl in it
// 	transformIgnorePatterns: ['node_modules/(?!next-intl)/'],
// }

// module.exports = createJestConfig(customJestConfig)
module.exports = async () => ({
	...(await createJestConfig({
		setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
		testEnvironment: 'jsdom',
		moduleDirectories: ['node_modules', '<rootDir>/'],
		testPathIgnorePatterns: ['<rootDir>/.next/', '<rootDir>/node_modules/'],
	})()),
	// for next-intl, ignore everything in node_modules except any file that has next-intl in it
	transformIgnorePatterns: ['node_modules/(?!next-intl|react-hook-form)/']
});
