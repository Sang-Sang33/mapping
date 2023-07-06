/**
 *
 * @export
 * @interface ResultMessage
 */
interface ResultMessage {
	/**
	 *
	 * @type {StateCode}
	 * @memberof ResultMessage
	 */
	code: StateCode;
	/**
	 *
	 * @type {string}
	 * @memberof ResultMessage
	 */
	msg?: string;
}
/**
 *
 * @export
 * @interface ResultMessageOfStringAllOf
 */
interface ResultMessageOfStringAllOf {
	/**
	 *
	 * @type {string}
	 * @memberof ResultMessageOfStringAllOf
	 */
	data?: string;
}

/**
 * @type ResultMessageOfString
 * @export
 */
type ResultMessageOfString = ResultMessage & ResultMessageOfStringAllOf;
