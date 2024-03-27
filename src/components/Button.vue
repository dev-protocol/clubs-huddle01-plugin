<script setup lang="ts">
import huddle from '../assets/images/icon-video.svg'
import huddleDisabled from '../assets/images/huddleDisabled.svg'
import {
	onClickToolbar,
	emitClickToolbar,
} from '@devprotocol/clubs-plugin-posts/plugin-helper'
import { ref } from 'vue'
import { onPostCreated } from '@devprotocol/clubs-plugin-posts/plugin-helper'

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
		class="inline-flex items-center rounded-full shadow-sm"
		:class="[isOpened ? 'cursor-default' : 'cursor-pointer']"
		type="button"
		@click="onClickImage"
	>
		<img
			class="w-7"
			:src="isOpened === false ? huddle.src : huddleDisabled.src"
			alt="paper-airplane"
		/>
	</button>
</template>
