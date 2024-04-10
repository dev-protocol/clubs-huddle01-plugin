<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue'
import axios from 'axios'
import {
	onPostCreated,
	onSetup,
} from '@devprotocol/clubs-plugin-posts/plugin-helper'
import {
	onClickToolbar,
	emitClickToolbar,
} from '@devprotocol/clubs-plugin-posts/plugin-helper'
import { connection } from '@devprotocol/clubs-core/connection'
import { formatUnixTimestampToISO } from '/Users/shubhamkukreti/Documents/devprotocol/clubs-huddle01-plugin/src/fixtures'
import { whenDefined, type UndefinedOr } from '@devprotocol/util-ts'
import type { Meet } from '../../types.ts'

onSetup(async (post) => {
	// optionsのpollにundefinedがある場合はreturnする
	if (
		hostWallets.value.some((option) => option.address === undefined) ||
		isMeetOpen.value !== true
	) {
		return post
	}
	console.log({ isMeetOpen })

	const meetingLink = await axios
		.post(`/api/devprotocol:clubs:huddle:plugin/schedule`, {
			hostWallets: hostWallets.value.map((option) => option.address),
			roomType: roomType.value,
			description: description.value,
			muteOnEntry: muteOnEntry.value,
			videoOnEntry: videoOnEntry.value,
			startTime: startTime.value,
			expiryTime: expiryTime.value,
		})
		.then((res) => res.data.data.meetingLink)

	const meet: Meet = {
		hostWallets: hostWallets.value.map((option) => {
			return {
				id: option.id,
				address: option.address,
			}
		}),
		roomType: roomType.value,
		description: description.value,
		muteOnEntry: muteOnEntry.value,
		videoOnEntry: videoOnEntry.value,
		meetingLink: meetingLink,
		startTime: startTime.value,
		expiryTime: expiryTime.value,
	}

	console.log({ meet })

	const editedPost = {
		...post,
		options: [
			...post.options.filter((option) => option.key !== '#meet'),
			{
				key: '#meet',
				value: meet,
			},
		],
	}
	console.log({ editedPost })

	return editedPost
})

const address = ref<string | undefined>(undefined)
const hostWallets = ref([{ id: 1, address: '' }])
const roomType = ref<'AUDIO' | 'VIDEO'>('VIDEO')
const description = ref<string | undefined>(undefined)
const muteOnEntry = ref<boolean>(true)
const videoOnEntry = ref<boolean>(true)

const minimumStartTime = ref<string>(
	formatUnixTimestampToISO(Date.now() / 1000),
)
const startTimeLocal = ref<string>(minimumStartTime.value)
const startTime = computed(() => {
	if (startTimeLocal === undefined) {
		return undefined
	}
	const start = new Date(startTimeLocal.value)
	return start.toISOString()
})

const expiryTimeLocal = ref<string>('')
const expiryTime = computed(() => {
	if (expiryTimeLocal.value === '') {
		return undefined
	}
	const expiry = new Date(expiryTimeLocal.value)
	return expiry.toISOString()
})

const MAX_OPTIONS = 4

connection().account.subscribe((_account: string) => {
	address.value = _account
	hostWallets.value[0].address = _account
})

const handleClickAddOption = () => {
	if (hostWallets.value.length >= MAX_OPTIONS) {
		return
	}

	hostWallets.value.push({
		id: hostWallets.value.length + 1,
		address: '',
	})
}

const isMeetOpen = ref(false)
const meetOptionsRef = ref(null)

onClickToolbar('onClickMeetEvent', () => {
	isMeetOpen.value = true
})

onPostCreated((post: any) => {
	isMeetOpen.value = false

	roomType.value = 'VIDEO'
	description.value = ''
	muteOnEntry.value = true
	videoOnEntry.value = true
	hostWallets.value = [{ id: 1, address: '' }]
	startTimeLocal.value = minimumStartTime.value
	expiryTimeLocal.value = ''
})

const handleClickRemovePoll = () => {
	isMeetOpen.value = false
	emitClickToolbar('onRemoveMeetEvent')
}

watch(isMeetOpen, (isOpen) => {
	if (isOpen) {
		nextTick(() => {
			if (!meetOptionsRef.value) {
				return
			}

			const firstInput = meetOptionsRef.value as HTMLElement
			if (firstInput) {
				const el = firstInput.querySelector('input')
				if (!el) {
					return
				}
				el.focus()
			}
		})
	}
})

watch(startTime, (newValue) => {
	console.log('Start Time changed:', newValue)
})

watch(expiryTime, (newValue) => {
	console.log('Expiry Time changed:', newValue)
})
</script>
<template>
	<div
		v-if="isMeetOpen"
		class="flex flex-col mb-4 border border-gray-400 rounded-lg overflow-hidden"
	>
		<div class="flex flex-col gap-2 py-4 px-4 flex-grow">
			<label
				class="block mb-2 uppercase tracking-wide text-gray-400 text-xs font-bold"
				for="grid-last-name"
			>
				Description
			</label>
			<input
				v-model="description"
				class="appearance-none block py-3 px-4 w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
			/>
		</div>
		<div class="flex">
			<div ref="pollOptionsRef" class="flex flex-col gap-2 py-4 flex-grow">
				<div v-for="(option, index) in hostWallets" class="px-4">
					<label
						class="block mb-2 uppercase tracking-wide text-gray-400 text-xs font-bold"
						for="grid-last-name"
					>
						Host Address {{ option.id }} {{ index > 0 ? '(optional)' : '' }}
					</label>
					<input
						v-model="option.address"
						class="appearance-none block py-3 px-4 w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					/>
				</div>
			</div>
			<div
				v-if="hostWallets.length < MAX_OPTIONS"
				class="flex py-4 content-end items-end w-1/12"
			>
				<button
					class="py-3 px-4"
					style="color: transparent; text-shadow: 0 0 0 #3b82f6"
					@click="handleClickAddOption"
				>
					➕
				</button>
			</div>
		</div>
		<div class="py-4 px-4 border-t border-gray-400 text-gray-400 font-bold">
			<p class="mb-2 mr-4 text-gray-400 font-bold">Room Type</p>
			<label class="mr-4 relative inline-flex items-center cursor-pointer">
				<input
					v-model="roomType"
					type="radio"
					class="sr-only peer"
					value="VIDEO"
				/>
				<span
					class="w-4 h-4 inline-block mr-2 rounded-full border border-blue-500 peer-checked:bg-blue-500"
				></span>
				VIDEO
			</label>
			<label class="relative inline-flex items-center cursor-pointer">
				<input
					v-model="roomType"
					type="radio"
					class="sr-only peer"
					value="AUDIO"
				/>
				<span
					class="w-4 h-4 inline-block mr-2 rounded-full border border-blue-500 peer-checked:bg-blue-500"
				></span>
				AUDIO
			</label>
		</div>
		<div class="flex flex-row gap-4 py-4 px-4">
			<div class="flex flex-col">
				<label
					class="block mb-2 uppercase tracking-wide text-gray-400 text-xs font-bold"
					for="start-time"
				>
					Start Time
				</label>
				<input
					id="start-time"
					v-model="startTimeLocal"
					type="datetime-local"
					class="appearance-none block py-3 px-4 w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
					:min="minimumStartTime"
				/>
			</div>
			<div class="flex flex-col">
				<label
					class="block mb-2 uppercase tracking-wide text-gray-400 text-xs font-bold"
					for="expiry-time"
				>
					Expiry Time
				</label>
				<input
					id="expiry-time"
					v-model="expiryTimeLocal"
					type="datetime-local"
					class="appearance-none block py-3 px-4 w-full text-gray-700 border border-gray-200 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
				/>
			</div>
		</div>
		<div class="py-4 px-4 border-t border-gray-400">
			<p class="mb-2 mr-4 text-gray-400 font-bold">Entry Settings</p>
			<p class="uppercase mb-2 mr-4 text-gray-400 font-bold">Camera</p>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="videoOnEntry" type="checkbox" class="sr-only peer" />
				<span
					class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				></span>
			</label>
			<p class="uppercase mb-2 mr-4 text-gray-400 font-bold">Mute</p>
			<label class="relative inline-flex items-center cursor-pointer">
				<input v-model="muteOnEntry" type="checkbox" class="sr-only peer" />
				<span
					class="w-11 h-6 bg-gray-200 rounded-full peer peer-focus:ring-4 peer-focus:ring-blue-300 dark:peer-focus:ring-blue-800 dark:bg-gray-700 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-blue-600"
				></span>
			</label>
		</div>
		<div class="border-t border-gray-400">
			<button
				class="py-4 w-full border text-red-500"
				@click="handleClickRemovePoll"
			>
				Cancel
			</button>
		</div>
	</div>
</template>
