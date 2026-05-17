<script lang="ts">
	import type { ContentComponentProps } from '../../types';
	import { getCanEdit } from '$lib/website/context';
	import { getOrcidId, getOrcidUrl } from '.';

	let { item }: ContentComponentProps = $props();

	const isEditing = getCanEdit();
	const id = $derived(getOrcidId(item.cardData.id ?? item.cardData.href) ?? item.cardData.id ?? '');
	const href = $derived(id ? getOrcidUrl(id) : item.cardData.href || '#');
</script>

<a
	{href}
	target="_blank"
	rel="noopener noreferrer"
	class="hover:bg-accent-100/20 flex h-full w-full items-center justify-between gap-3 rounded-2xl p-4 transition-colors"
	class:pointer-events-none={isEditing()}
>
	<div
		class="text-base-950 inline-flex size-8 shrink-0 items-center justify-center rounded-full bg-[#A6CE39] text-xs font-bold"
	>
		iD
	</div>
	<div class="min-w-0 flex-1">
		<p class="text-base-500 dark:text-base-300 text-xs font-medium tracking-wide uppercase">
			ORCID
		</p>
		<p class="text-base-950 dark:text-base-50 truncate text-base font-semibold">
			{id || 'ORCID iD'}
		</p>
	</div>
	<span class="text-base-500 dark:text-base-300 text-xs">View</span>
</a>
