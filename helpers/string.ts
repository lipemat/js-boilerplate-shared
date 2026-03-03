/**
 * Adds a trailing slash to a URL if it doesn't already have one.
 */
export function addTrailingSlash( url: string ): string {
	const trimmedURL = url.trim();
	if ( '' === trimmedURL ) {
		return url;
	}
	return normalizePath( url.replace( /\/?$/, '/' ) );
}

/**
 * Adds a leading slash to a URL if it doesn't already have one.
 */
export function addLeadingSlash( url: string ): string {
	const trimmedURL = url.trim();
	if ( '' === trimmedURL ) {
		return url;
	}
	return normalizePath( url.replace( /^\/?/, '/' ) );
}

/**
 * Removes a leading slash from a URL if it has one.
 */
export function removeLeadingSlash( url: string ): string {
	const trimmedURL = url.trim();
	if ( '' === trimmedURL ) {
		return url;
	}
	return normalizePath( url.replace( /^\//, '' ) );
}

/**
 * Removes a trailing slash from a URL if it has one.
 *
 */
export function removeTrailingSlash( url: string ): string {
	const trimmedURL = url.trim();
	if ( '' === trimmedURL ) {
		return url;
	}
	return normalizePath( url.replace( /\/$/, '' ) );
}

/**
 * Normalize path separators by replacing backslashes with forward slashes.
 *
 * Replace Windows backslashes with forward slashes.
 */
export function normalizePath( path: string ): string {
	return path.replace( /\\/g, '/' );
}
