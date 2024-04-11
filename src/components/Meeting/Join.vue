<script setup lang="ts">
import VideoCamera from '../Icons/VideoCamera.vue'
import { computed } from 'vue'
import { formatISOTimestamp, isFutureTimestamp } from '../../fixtures'

const props = defineProps<{
	redirectToUrl: (meetingLink: string | undefined) => void
	meetingLink: string | undefined
	roomType: string
	startTime: string | undefined
	expiryTime: string | undefined
}>()

const startTimeValid = computed(
	() => props.startTime && !isNaN(new Date(props.startTime).getTime()),
)
const expiryTimeValid = computed(
	() => props.expiryTime && !isNaN(new Date(props.expiryTime).getTime()),
)

const meetingHasStarted = computed(
	() => startTimeValid.value && !isFutureTimestamp(props.startTime as string),
)
const meetingIsActive = computed(
	() =>
		startTimeValid.value &&
		(!expiryTimeValid.value || isFutureTimestamp(props.expiryTime as string)),
)

const roomTypeDescription = computed(() => {
	return `${props.roomType === 'VIDEO' ? 'Video Call' : 'Audio Space'}`
})

const meetingStatusMessage = computed(() => {
	if (!startTimeValid.value) {
		return 'Unkwown Start Time'
	}

	if (meetingHasStarted.value && !meetingIsActive.value) {
		return 'Expired'
	}

	if (!meetingHasStarted.value) {
		return `Starts @ ${formatISOTimestamp(props.startTime as string)}`
	}

	return `Ends @ ${formatISOTimestamp(props.expiryTime as string)}`
})
</script>
<template>
	<button
		v-if="
			(startTime === undefined || !isFutureTimestamp(startTime)) &&
			(expiryTime === undefined || isFutureTimestamp(expiryTime))
		"
		class="hs-button is-fullwidth is-large w-full gap-2 font-bold border border-blue-500 rounded-full bg-[#236BFE] outline hover:outline-[#236BFE] outline-2 outline-offset-2 transition-all text-white"
		@click="
			() => {
				redirectToUrl(meetingLink)
			}
		"
	>
		<VideoCamera :solid="true" :iconType="roomType" />

		Join {{ roomTypeDescription }}
	</button>
	<div
		v-else
		class="hs-button is-fullwidth is-large w-full gap-2 font-bold border border-blue-500 rounded-full bg-[#236BFE] outline hover:outline-[#236BFE] outline-2 outline-offset-2 transition-all text-white"
	>
		<VideoCamera :solid="true" :iconType="`${roomType}`" />
		{{ roomTypeDescription }}
		{{ meetingStatusMessage }}
	</div>
</template>
