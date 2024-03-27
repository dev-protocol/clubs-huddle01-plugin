<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Join from './Meeting/Join.vue'
import type { Posts } from '@devprotocol/clubs-plugin-posts'
import type { Meet } from '../types.ts'
import { connection } from '@devprotocol/clubs-core/connection'

const props = defineProps(['slotId', 'feedId'])

const meeting = ref<Element>()
let isMasked = ref<boolean | undefined>(undefined)
const currentPostInfo = ref<any>()
const currentMeet = ref<Meet>()
const address = ref<string | undefined>(undefined)

connection().account.subscribe((_account: string | undefined) => {
	address.value = _account
})

onMounted(async () => {
	if (!meeting.value) {
		return
	}

	currentPost((data: Posts) => {
		currentPostInfo.value = data

		isMasked.value = data.masked
	}, meeting.value)

	if (!currentPostInfo.value) {
		return
	}

	const meetOption = currentPostInfo.value.options.find(
		(option: any) => option.key === '#meet',
	)

	console.log({ meetOption })

	if (!meetOption) {
		return
	}

	currentMeet.value = meetOption.value as Meet
})
const redirectToUrl = (url: string | undefined) => {
	window.open(url, '_blank')
}
</script>
<template>
	<div v-if="isMasked !== true" ref="meeting">
		<div v-if="currentMeet">
			<section>
				<Join
					:redirectToUrl="redirectToUrl"
					:meetingLink="currentMeet.meetingLink"
					:roomType="currentMeet.roomType"
				/>
			</section>
		</div>
	</div>
</template>
