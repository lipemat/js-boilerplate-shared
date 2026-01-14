// @ts-ignore
import wpBrowsers from '@wordpress/browserslist-config';
import browserslist from 'browserslist';

/**
 * Get the browserslist from the current project.
 *
 * - If specified using standard browserslist config, we will use that.
 *
 *  @link https://github.com/browserslist/browserslist#config-file
 */
export function getBrowsersList(): readonly string[] {
	const projectBrowsersList = browserslist();
	if ( browserslist( browserslist.defaults ) === projectBrowsersList ) {
		return wpBrowsers;
	}
	return projectBrowsersList;
}
