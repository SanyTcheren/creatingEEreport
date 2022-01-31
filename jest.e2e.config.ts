import type { Config } from '@jest/types';

const config: Config.InitialOptions = {
	verbose: true, //для детального отображения output
	preset: 'ts-jest', //для использования ts-jest
	testRegex: '.e2e-spec.ts$', //Патерн для поиска файлов с тестами
};

export default config;
