import {mkdirSync, unlinkSync, writeFileSync} from 'node:fs';
import {dirname} from 'node:path';

const PARENT_CHECK_INTERVAL = 3_000;

/**
 * SIGHUP fires when the terminal is closed (POSIX and Windows).
 * SIGBREAK fires on Ctrl+Break (Windows).
 */
const EXIT_SIGNALS: NodeJS.Signals[] = [ 'SIGINT', 'SIGTERM', 'SIGHUP', 'SIGBREAK' ];


function isProcessAlive( pid: number ): boolean {
	try {
		process.kill( pid, 0 );
		return true;
	} catch ( error ) {
		return 'EPERM' === ( error as NodeJS.ErrnoException ).code;
	}
}


/**
 * Signals do not emit `exit`, so convert them to a clean exit.
 */
function exit(): void {
	process.exit();
}


/**
 * Create a flag file which only exists while this process is running.
 *
 * Removed when the process exits, receives an exit signal, or its
 * parent process (terminal) is gone.
 *
 * @param {string} flagPath - Path to the flag file.
 * @param {string} contents - Contents to write to the flag file.
 *
 * @return {() => void} Cleanup handler which removes the flag and all listeners.
 */
export function createRunningFlag( flagPath: string, contents: string ): () => void {
	mkdirSync( dirname( flagPath ), {recursive: true} );
	writeFileSync( flagPath, contents );

	// Parent may be killed without forwarding a signal (e.g. terminal force-closed).
	const parentPid = process.ppid;
	const parentWatcher = setInterval( () => {
		if ( ! isProcessAlive( parentPid ) ) {
			exit();
		}
	}, PARENT_CHECK_INTERVAL );
	parentWatcher.unref();

	function cleanup(): void {
		clearInterval( parentWatcher );
		process.off( 'exit', cleanup );
		for ( const signal of EXIT_SIGNALS ) {
			process.off( signal, exit );
		}
		try {
			unlinkSync( flagPath );
		} catch {
			/* ignore if already gone */
		}
	}

	process.once( 'exit', cleanup );
	for ( const signal of EXIT_SIGNALS ) {
		process.once( signal, exit );
	}
	return cleanup;
}
