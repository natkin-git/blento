<script lang="ts">
	import { Button, Input, Subheading } from '@foxui/core';
	import Modal from '$lib/components/modal/Modal.svelte';
	import type { CreationModalComponentProps } from '../../types';
	import { getOrcidId, getOrcidUrl } from '.';

	let { item = $bindable(), oncreate, oncancel }: CreationModalComponentProps = $props();

	let errorMessage = $state('');

	function submit() {
		const id = getOrcidId(item.cardData.id || item.cardData.href);

		if (!id) {
			errorMessage = 'Please enter a valid ORCID iD or ORCID URL';
			return;
		}

		item.cardData.id = id;
		item.cardData.href = getOrcidUrl(id);
		item.w = 4;
		item.h = 2;
		item.mobileW = 8;
		item.mobileH = 2;

		oncreate?.();
	}
</script>

<Modal open={true} closeButton={false}>
	<form
		onsubmit={(event) => {
			event.preventDefault();
			submit();
		}}
		class="flex flex-col gap-2"
	>
		<Subheading>Enter an ORCID iD or ORCID URL</Subheading>
		<Input
			bind:value={item.cardData.id}
			placeholder="0000-0002-1825-0097 or https://orcid.org/0000-0002-1825-0097"
			class="mt-4"
		/>

		{#if errorMessage}
			<p class="mt-2 text-sm text-red-600">{errorMessage}</p>
		{/if}

		<div class="mt-4 flex justify-end gap-2">
			<Button onclick={oncancel} variant="ghost">Cancel</Button>
			<Button type="submit">Create</Button>
		</div>
	</form>
</Modal>
