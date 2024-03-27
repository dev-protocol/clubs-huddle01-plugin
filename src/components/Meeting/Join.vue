<script setup lang="ts">
// propsを受け取る
const props = defineProps<{
	redirectToUrl: (meetingLink: string | undefined) => void
	meetingLink: string | undefined
	roomType: string
}>()
</script>
<template>
	<button
		class="w-full font-bold border border-blue-500 rounded-xl bg-blue-500 text-white"
		@click="
			() => {
				redirectToUrl(meetingLink)
			}
		"
	>
		Join {{ roomType === 'VIDEO' ? 'Video' : 'Audio' }}
		{{ roomType === 'VIDEO' ? 'Call' : 'Space' }}
	</button>
</template>
