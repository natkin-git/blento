import type { CardDefinition } from '../../types';
import CreateOrcidCardModal from './CreateOrcidCardModal.svelte';
import OrcidCard from './OrcidCard.svelte';

const cardType = 'orcid';

export const OrcidCardDefinition = {
	type: cardType,
	contentComponent: OrcidCard,
	creationModalComponent: CreateOrcidCardModal,
	createNew: (item) => {
		item.cardType = cardType;
		item.cardData = {
			id: '',
			href: ''
		};
		item.w = 4;
		item.h = 2;
		item.mobileW = 8;
		item.mobileH = 2;
	},
	onUrlHandler: (url, item) => {
		const id = getOrcidId(url);
		if (!id) return null;

		item.cardData.id = id;
		item.cardData.href = getOrcidUrl(id);
		item.w = 4;
		item.h = 2;
		item.mobileW = 8;
		item.mobileH = 2;
		return item;
	},
	urlHandlerPriority: 4,
	canChange: (item) => Boolean(getOrcidId(item.cardData.href ?? item.cardData.id)),
	change: (item) => {
		const id = getOrcidId(item.cardData.href ?? item.cardData.id);
		if (!id) return item;

		item.cardData.id = id;
		item.cardData.href = getOrcidUrl(id);
		return item;
	},

	minW: 2,
	minH: 1,

	name: 'ORCID',
	keywords: ['orcid', 'research', 'academic', 'scholar', 'publication'],
	groups: ['Social'],
	icon: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-4"><path d="M12 0a12 12 0 1 0 0 24A12 12 0 0 0 12 0Zm-3.214 5.004h1.545v13.913H8.786V5.004Zm5.458.046c3.041 0 4.916 1.987 4.916 4.812 0 2.947-1.874 4.865-4.962 4.865h-2.297V5.05h2.343Zm-.138 8.296c2.044 0 3.257-1.283 3.257-3.461 0-2.169-1.235-3.452-3.257-3.452h-.658v6.913h.658Zm-5.32-10.804a1.025 1.025 0 1 1 0 2.05 1.025 1.025 0 0 1 0-2.05Z"/></svg>`
} as CardDefinition & { type: typeof cardType };

export function getOrcidId(input: string | undefined): string | undefined {
	if (!input) return;

	const trimmed = input.trim();
	if (!trimmed) return;
	const normalized = trimmed.toUpperCase();

	const directMatch = normalized.match(/^(\d{4}-\d{4}-\d{4}-[\dX]{4})$/);
	if (directMatch) {
		const id = directMatch[1];
		return isValidOrcidId(id) ? id : undefined;
	}

	try {
		const parsed = new URL(trimmed);
		if (!/^(www\.)?orcid\.org$/i.test(parsed.hostname)) return;

		const segments = parsed.pathname.split('/').filter(Boolean);
		if (segments.length !== 1) return;

		const id = segments[0].toUpperCase();
		if (!/^(\d{4}-\d{4}-\d{4}-[\dX]{4})$/.test(id)) return;

		return isValidOrcidId(id) ? id : undefined;
	} catch {
		return;
	}
}

export function getOrcidUrl(id: string): string {
	return `https://orcid.org/${id}`;
}

export function isValidOrcidId(id: string): boolean {
	const digits = id.replaceAll('-', '');
	if (!/^\d{15}[\dX]$/.test(digits)) return false;

	let total = 0;
	for (let i = 0; i < 15; i++) {
		total = (total + Number.parseInt(digits[i], 10)) * 2;
	}

	const remainder = total % 11;
	const result = (12 - remainder) % 11;
	const checksum = result === 10 ? 'X' : String(result);

	return digits[15] === checksum;
}
