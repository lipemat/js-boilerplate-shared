/**
 * Require a minimum of the specified properties on a type.
 *
 * @example AtLeast<Post, 'author' | 'post_title'> - post_title and author will be required, the rest optional.
 */
export type AtLeast<T, K extends keyof T> = Partial<T> & Required<Pick<T, K>>;

/**
 * Make specified properties on a type optional.
 *
 * @example `Optional<Post, 'post_title'|'author'>` - `post_title` and `author` will be optional.
 */
export type Optional<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
