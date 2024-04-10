<script setup lang="ts">
import {
	onClickToolbar,
	emitClickToolbar,
} from '@devprotocol/clubs-plugin-posts/plugin-helper'
import { ref } from 'vue'
import { onPostCreated } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import VideoCamera from './Icons/VideoCamera.vue'

const isOpened = ref<boolean>(false)

const onClickImage = () => {
	if (isOpened.value === false) {
		emitClickToolbar('onClickMeetEvent')
		isOpened.value = true
	}
}
onPostCreated((post: any) => {
	isOpened.value = false
})
onClickToolbar('onRemoveMeetEvent', () => {
	isOpened.value = false
})
</script>

<template>
	<button
		class="inline-flex items-center rounded-full text-[#236BFE]"
		:class="[isOpened ? 'cursor-default opacity-50' : 'cursor-pointer']"
		type="button"
		@click="onClickImage"
	>
		<VideoCamera stroke-width="2" class="w-7 h-7" iconType="VIDEO" />
	</button>
</template>
