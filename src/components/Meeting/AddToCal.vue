<script setup lang="ts">
import { computed } from 'vue'
import { toCompactISOTimeFromISO} from '../../fixtures'

const props = defineProps<{
	redirectToUrl: (calendarLink: string | undefined) => void
	meetingLink: string | undefined
	roomType: string
	startTime: string | undefined
	expiryTime: string | undefined
	description: string | undefined
}>()

const compactStartTime = computed(() => {
	return toCompactISOTimeFromISO(props.startTime as string)
})
const compactExpiryTime = computed(() => {
	return toCompactISOTimeFromISO(props.expiryTime as string)
})

const timeZone = new Intl.DateTimeFormat('en-US', {
		timeZoneName: 'short',
	}).resolvedOptions().timeZone

console.log("starttime", props.startTime)
const calendarLink = computed(() => {
	return `https://calendar.google.com/calendar/r/eventedit?action=TEMPLATE&dates=${compactStartTime.value}%2F${compactExpiryTime.value}&text=${encodeURIComponent(props.description ? props.description : '')}&details=${encodeURIComponent(props.description ? props.description : '')}&location=${encodeURIComponent(props.meetingLink ? props.meetingLink : '')}&stz=${timeZone}&etz=${timeZone}`
})
</script>
<template>
	<button
		class="is-fullwidth w-full gap-4 font-bold border border-black rounded-full text-black hover:bg-[#D9D9D9]"
		@click="
			() => {
				redirectToUrl(calendarLink)
			}
		"
	>
	Add to Calendar 🗓️
	</button>
</template>
