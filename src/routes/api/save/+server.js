import { json } from '@sveltejs/kit';
import fs from 'node:fs';
import { writeFile } from 'node:fs/promises';

export async function POST({ request }) {
	try {
		const data = await request.json();
		// make directory for data if needed
		const dirname = 'raterdata';
		const doesExist = fs.existsSync(dirname);
		if (!doesExist) {
			fs.mkdirSync(dirname);
		}
		// relative path
		const filename = `${dirname}/taskdata_${data.name}.js`;
		await writeFile(filename, JSON.stringify(data));
		return json(true);
	} catch (e) {
		console.log(e);
		console.log('Did not save data');
		return json(false);
	}
}
