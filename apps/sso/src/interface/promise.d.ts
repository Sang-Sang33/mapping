// promise 的相关接口
export = IPromise;
export as namespace IPromise;

type IResolve<T> = (value: T) => void;

declare namespace IPromise {
	type resolve = IResolve;
}
