<script setup lang="ts">
import { ref, onMounted, onUnmounted, computed } from 'vue'
import VideoCamera from '../Icons/VideoCamera.vue'
import { formatISOTimestamp, isFutureTimestamp } from '../../fixtures'

const props = defineProps<{
	redirectToUrl: (meetingLink: string | undefined) => void
	meetingLink: string | undefined
	roomType: string
	startTime: string | undefined
	expiryTime: string | undefined
}>()

const currentTime = ref(new Date())

// Update current time every minute
const updateCurrentTime = () => {
	currentTime.value = new Date()
}
let timer: NodeJS.Timeout | undefined
onMounted(() => {
	timer = setInterval(updateCurrentTime, 15000) // 15 seconds
})
onUnmounted(() => {
	clearInterval(timer)
})

// Computed properties
const startTimeValid = computed(() => {
	return props.startTime && !isNaN(new Date(props.startTime).getTime())
})
const expiryTimeValid = computed(() => {
	return props.expiryTime && !isNaN(new Date(props.expiryTime).getTime())
})

const meetingHasStarted = computed(() => {
	return (
		startTimeValid.value &&
		!isFutureTimestamp(props.startTime as string, currentTime.value)
	)
})
const meetingIsActive = computed(() => {
	return (
		startTimeValid.value &&
		(!expiryTimeValid.value ||
			isFutureTimestamp(props.expiryTime as string, currentTime.value))
	)
})

const roomTypeDescription = computed(() => {
	return `${props.roomType === 'VIDEO' ? 'Video Call' : 'Audio Space'}`
})

const meetingStatusMessage = computed(() => {
	if (!startTimeValid.value) {
		return 'Unknown Start Time'
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
		v-if="meetingHasStarted && meetingIsActive"
		class="hs-button is-fullwidth is-large w-full gap-2 font-bold border border-green-500 rounded-full bg-green-500 outline hover:outline-green-500 outline-2 outline-offset-2 transition-all text-white"
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
		class="hs-button is-fullwidth is-large w-full gap-2 font-bold border rounded-full outline outline-2 outline-offset-2 transition-all text-white"
		:class="{
			'bg-gray-500': !meetingIsActive,
			'border-gray-500': !meetingIsActive,
			'hover:outline-gray-500': !meetingIsActive,
			'bg-[#236BFE]': meetingIsActive,
			'border-[#236BFE]': meetingIsActive,
			'hover:outline-[#236BFE]': meetingIsActive,
		}"
	>
		<VideoCamera :solid="true" :iconType="`${roomType}`" />
		{{ roomTypeDescription }}
		{{ meetingStatusMessage }}
	</div>
</template>
