import { execSync } from "child_process";
import fs from 'fs-extra'

/**
 * Build server
 */

fs.existsSync('./dist') && fs.removeSync('./dist')
execSync('yarn tsc --outDir ../../dist/server', {cwd: './modules/bacon-server', stdio: 'inherit'});
execSync(`yarn webpack --mode 'production' --output-path ../../dist/web`, { cwd: './modules/bacon-browser', stdio: 'inherit' })
execSync(`yarn pkg .`, { stdio: 'inherit' })