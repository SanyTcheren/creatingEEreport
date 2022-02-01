export interface ILogger {
	logger: unknown;
	log: (...args: unknown[]) => void;
	warn: (...args: unknown[]) => void;
	errror: (...args: unknown[]) => void;
}
