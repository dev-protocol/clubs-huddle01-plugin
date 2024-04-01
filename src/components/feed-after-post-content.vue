<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { currentPost } from '@devprotocol/clubs-plugin-posts/plugin-helper'
import Join from './Meeting/Join.vue'
import type { Posts } from '@devprotocol/clubs-plugin-posts'
import type { Meet } from '../types.ts'
import { connection } from '@devprotocol/clubs-core/connection'
import { whenDefined, type UndefinedOr } from '@devprotocol/util-ts'

const props = defineProps(['slotId', 'feedId'])

const meeting = ref<Element>()
const isMasked = computed<boolean | undefined>(() =>
	whenDefined(currentPostInfo.value, (post) => post.masked),
)
const currentPostInfo = ref<Posts>()
const currentMeet = computed(() => {
	return whenDefined(
		currentPostInfo.value,
		(post) =>
			post.options.find((option: any) => option.key === '#meet')
				?.value as UndefinedOr<Meet>,
	)
})
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
	}, meeting.value)
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
