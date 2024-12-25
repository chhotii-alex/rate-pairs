<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { pairs } from './data.js';
	import { makeTimePromise, shuffle } from './util.js';
	import Instructions from './Instructions.svelte';
	import PicturePairTrial from './PicturePairTrial.svelte';
	import Fixation from './Fixation.svelte';
	import Loading from './Loading.svelte';
	import GetName from './GetName.svelte';
	import DownloadButton from './DownloadButton.svelte';

	let tryFullScreen = false;
	let isBrowser = typeof window !== 'undefined';

	// parameters
	let countdownSeconds = 30;

	let Chunk = null;
	let state = {};

	// per-task data to save:
	let participantName = '';
	let taskStartTime = null;
	let responses = null;
	let actions = null;
	let reactionTimes = null;

	let allowDownloadNow = false;
	let downloadableData = [];

	function saveData() {
		if (!isBrowser) return;
		let key = `taskdata_${participantName}`;
		let dataToSave = {
			name: participantName,
			when: taskStartTime,
			responses: responses,
			actions: actions,
			reactionTimes: reactionTimes
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
		while (true) {
			downloadableData = getResultList();
			allowDownloadNow = true;
			await runChunk(GetName, { participantName: '' });
			participantName = state.participantName;

			responses = [];
			actions = [];
			reactionTimes = [];
                        shuffle(pairs);

			allowDownloadNow = false;
			taskStartTime = new Date();
			await goFullScreen();
			if (tryFullScreen) {
				await runChunk(Loading, {});
			}

			await runChunk(Instructions, {
				text: `You will see ${pairs.length} pairs of pictures.<br/>
			Each picture shows yellow and blue contour plots.<br/>
			Your job:
			<strong>
			choose the picture whose contours match better.
			</strong><br/>
			You'll have ${countdownSeconds} seconds per pair.<br/>
			For example:`,
				pair: ['A.JPG', 'B.JPG'],
				labels: ['Better', 'Worse'],
				selected: 0,
				buttonText: 'Next'
			});

			await runChunk(Instructions, {
				text: `Consider <strong>all</strong> the contours,
				not just the outermost or innermost one.<br/>
				They won't all be easy; just
				use your best judgement.<br/>
				<br/>
			For example:`,
				pair: ['C.JPG', 'D.JPG'],
				labels: ['Worse', 'Better'],
				selected: 1
			});

			await runChunk(Instructions, {
				text: `<br/><br/><br/><br/>Ready?`,
				pair: null,
				labels: null,
				buttonText: 'Begin!'
			});

			state.totalLength = pairs.length;
			for (let index = 0; index < pairs.length; ++index) {
				await runChunk(Fixation, {});
				let trialEndHow = await runChunk(PicturePairTrial, {
					pair: pairs[index],
					index: index,
					selected: null,
					countdownSeconds: countdownSeconds
				});

				if (state.selected == null) {
					responses[index] = null;
				} else {
					responses[index] = state.pair[state.selected];
				}
				actions[index] = trialEndHow;
				reactionTimes[index] = state.reactionTime;
				saveData();
			}
			await runChunk(Instructions, {
				text: `<strong>Done!</strong><br/>
				   Thank you!`,
				pair: null,
				labels: null,
				buttonText: 'Restart!'
			});

			await cancelFullScreen();
		}
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

	async function goFullScreen() {
		if (!tryFullScreen) return;
		try {
			let elem = document.getElementById('taskfullscreen');
			await elem.requestFullscreen();
		} catch (e) {}
	}

	async function cancelFullScreen() {
		try {
			await document.exitFullscreen();
		} catch (e) {}
	}
</script>

{#if allowDownloadNow}
	{#if isBrowser}
		{#if downloadableData.length > 0}
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

<div id="taskfullscreen">
	{#if Chunk}
		<Chunk {state} />
	{/if}
</div>
