<script>
	import { onMount, onDestroy, tick } from 'svelte';
	import { pairs } from './data.js';
	import { makeTimePromise, shuffle } from './util.js';
	import Instructions from './Instructions.svelte';
	import PicturePairTrial from './PicturePairTrial.svelte';
	import Fixation from './Fixation.svelte';
	import Loading from './Loading.svelte';
	import GetName from './GetName.svelte';

	let tryFullScreen = false;
	let isBrowser = typeof window !== 'undefined';
	let errorMsg = null;

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

	async function saveData() {
		if (!isBrowser) return;
		let key = `taskdata_${participantName}`;
		let dataToSave = {
			name: participantName,
			when: taskStartTime,
			responses: responses,
			actions: actions,
			reactionTimes: reactionTimes
		};
		let s = JSON.stringify(dataToSave);
		localStorage.setItem(key, s);
		// also save on server
		const response = await fetch('/api/save', {
			method: 'POST',
			body: s,
			headers: {
				'content-type': 'application/json'
			}
		});
		let success = await response.json();
		console.log(success);
		if (!success) {
			throw new Error('Could not save response data!');
		}
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
		try {
			await runTaskImpl();
		} catch (e) {
			errorMsg = e.message;
		}
	}

	async function runTaskImpl() {
		while (true) {
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
				await saveData();
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

{#if errorMsg}
	<p class="errorStyle">
		{errorMsg}
	</p>
{/if}

{#if allowDownloadNow}
	{#if isBrowser}{/if}
{/if}

<div id="taskfullscreen">
	{#if Chunk}
		<Chunk {state} />
	{/if}
</div>

<style>
	.errorStyle {
		color: red;
		font-style: italic;
		font-size: 60px;
	}
</style>
