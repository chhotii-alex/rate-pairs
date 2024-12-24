<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { pairs } from './data.js';
	import { makeTimePromise } from './util.js';
	import Instructions from './Instructions.svelte';
	import PicturePair from './PicturePair.svelte';
	import Fixation from './Fixation.svelte';
	import Done from './Done.svelte';
	import GetName from './GetName.svelte';
	import DownloadButton from './DownloadButton.svelte';

	let isBrowser = typeof window !== 'undefined';

	let Chunk = null;
	let state = {};

	// per-task data to save:
	let participantName = '';
	let taskStartTime = null;
	let responses = [];

	let allowDownloadNow = false;
	let downloadableData = [];

	function saveData() {
		if (!isBrowser) return;
		let key = `taskdata_${participantName}`;
		let dataToSave = {
			name: participantName,
			when: taskStartTime,
			responses: responses
		};
		localStorage.setItem(key, JSON.stringify(dataToSave));
	}

	async function runChunk(componentClass, vars) {
		Object.assign(state, vars);
		Chunk = componentClass;
		await tick();
		let response = await state.promise;
		state.promise = null;
		Chunk = null;
		return response;
	}

	async function runTask() {
		await runChunk(GetName, { participantName: '' });
		participantName = state.participantName;
		allowDownloadNow = false;
		taskStartTime = new Date();
		await runChunk(Instructions, {
			text: `For each pair of pictures, please choose the better one.
	            You will only have up to 5 seconds to decide for each pair, so
		    don't dither.`
		});

		state.totalLength = pairs.length;
		for (let index = 0; index < pairs.length; ++index) {
			await runChunk(Fixation, {});
			let response = await runChunk(PicturePair, {
				pair: pairs[index],
				index: index,
				selectedPicture: null
			});
			responses[index] = response;
			saveData();
		}
		downloadableData = getResultList();
		allowDownloadNow = true;
		await runChunk(Done, {});
	}

	onMount(() => {
		allowDownloadNow = true;
		runTask();
	});

	function getResultList() {
	   let d = [];
		if (isBrowser) {
			for (let i = 0; i < localStorage.length; i++) {
				let key = localStorage.key(i);
				if (key.includes('taskdata_')) {
					let s = localStorage.getItem(key);
					d.push([key, s]);
				}
			}
		}
		return d;
	}
</script>

{#if allowDownloadNow}
	{#if isBrowser}
	    {#if downloadableData.length > 0 }
	      <details>
	        <summary>Data Downloads</summary>
		{#each downloadableData as record}
			{record[0]}
			<DownloadButton data={record[1]} />
			<br />
		{/each}
	      </details>
	   {/if}
	{/if}
{/if}

{#if Chunk}
	<Chunk {state} />
{/if}
