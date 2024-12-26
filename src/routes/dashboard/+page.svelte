<script>
	import { onMount } from 'svelte';
	import DownloadButton from '../DownloadButton.svelte';

	let isBrowser = typeof window !== 'undefined';
	let promise = null;

	async function getData() {
		let response = await fetch('/api/getdata', { method: 'GET' });
		return await response.json();
	}

	function endpointForFile(filename) {
		return `/api/getfile?file=${filename}`;
	}

	onMount(() => {
		promise = getData();
		downloadableData = getResultList();
	});

	let downloadableData = [];

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

Rater response data on server:

{#if promise}
	{#await promise}
		<p>fetching data file list...</p>
	{:then filelist}
		{#each filelist as filename}
			<p>
				<a href={endpointForFile(filename)} download>
					Download {filename}
				</a>
			</p>
		{/each}
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
{/if}

{#if downloadableData.length > 0}
	<h2>Data in Local Storage Downloads</h2>
	{#each downloadableData as record}
		{record[0]}
		<DownloadButton data={record[1]} />
		<br />
	{/each}
{/if}
