<script setup lang="ts">
import VideoCamera from '../Icons/VideoCamera.vue'

const props = defineProps<{
	redirectToUrl: (meetingLink: string | undefined) => void
	meetingLink: string | undefined
	roomType: string
}>()
</script>
<template>
	<button
		class="hs-button is-fullwidth is-large w-full gap-2 font-bold border border-blue-500 rounded-full bg-[#236BFE] outline hover:outline-[#236BFE] outline-2 outline-offset-2 transition-all text-white"
		@click="
			() => {
				redirectToUrl(meetingLink)
			}
		"
	>
		<VideoCamera :solid="true" />

		Join {{ roomType === 'VIDEO' ? 'Video' : 'Audio' }}
		{{ roomType === 'VIDEO' ? 'Call' : 'Space' }}
	</button>
</template>
