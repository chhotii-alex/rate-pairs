import { json } from '@sveltejs/kit';
import fs from 'node:fs';
import Path from 'path';
import { writeFile } from 'node:fs/promises';

export async function POST({ request }) {
	try {
		const data = await request.json();
		// make directory for data if needed
		const dirname = Path.resolve('raterdata');
		const doesExist = fs.existsSync(dirname);
		if (!doesExist) {
			fs.mkdirSync(dirname);
		}
		// relative path
		const filename = `${dirname}/taskdata_${data.name}.json`;
		const resolvedPath = Path.resolve(filename);
		console.log(resolvedPath);
		await writeFile(resolvedPath, JSON.stringify(data));
		return json(true);
	} catch (e) {
		console.log(e);
		console.log('Did not save data');
		return json(false);
	}
}
