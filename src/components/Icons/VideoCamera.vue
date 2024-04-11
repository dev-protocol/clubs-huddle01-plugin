<script lang="ts" setup>
import type { prop } from 'ramda'

const props = defineProps<{
	class?: string
	strokeWidth?: number | string
	solid?: boolean
	iconType?: string | undefined
}>()
</script>
<template>
	<svg
		v-if="!props.solid && props.iconType === 'VIDEO'"
		xmlns="http://www.w3.org/2000/svg"
		fill="none"
		viewBox="0 0 24 24"
		:stroke-width="props.strokeWidth ?? 1.5"
		stroke="currentColor"
		:class="props.class ?? 'w-6 h-6'"
	>
		<path
			stroke-linecap="round"
			stroke-linejoin="round"
			d="m15.75 10.5 4.72-4.72a.75.75 0 0 1 1.28.53v11.38a.75.75 0 0 1-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 0 0 2.25-2.25v-9a2.25 2.25 0 0 0-2.25-2.25h-9A2.25 2.25 0 0 0 2.25 7.5v9a2.25 2.25 0 0 0 2.25 2.25Z"
		/>
	</svg>
	<svg
		v-if="props.solid && props.iconType === 'VIDEO'"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 24 24"
		fill="currentColor"
		:class="props.class ?? 'w-6 h-6'"
	>
		<path
			d="M4.5 4.5a3 3 0 0 0-3 3v9a3 3 0 0 0 3 3h8.25a3 3 0 0 0 3-3v-9a3 3 0 0 0-3-3H4.5ZM19.94 18.75l-2.69-2.69V7.94l2.69-2.69c.944-.945 2.56-.276 2.56 1.06v11.38c0 1.336-1.616 2.005-2.56 1.06Z"
		/>
	</svg>
	<svg
		v-if="props.solid && props.iconType === 'AUDIO'"
		xmlns="http://www.w3.org/2000/svg"
		viewBox="0 0 350 517"
		fill="currentColor"
		:class="props.class ?? 'w-7 h-7'"
	>
		<path
			fill="white"
			d="M275.983 102.712V232.254C277.001 274.415 232.025 309.217 175.5 310C118.975 309.217 73.9944 274.415 75.0171 232.254V102.712C74.0212 60.5648 118.993 25.7841 175.5 25C232.007 25.7841 276.979 60.5648 275.983 102.712Z M40.4121 320.112C29.5404 311.602 13.8271 313.516 5.31607 324.389C-3.19526 335.259 -1.28159 350.972 9.59007 359.486L40.4121 320.112Z M340.411 359.486C351.284 350.972 353.198 335.259 344.688 324.389C336.174 313.516 320.461 311.602 309.591 320.112L340.411 359.486Z M200.001 391.666C200.001 377.859 188.808 366.666 175.001 366.666C161.194 366.666 150.001 377.859 150.001 391.666H200.001Z M150.001 491.666C150.001 505.472 161.194 516.666 175.001 516.666C188.808 516.666 200.001 505.472 200.001 491.666H150.001Z M9.59007 359.486C106.748 435.546 243.254 435.546 340.411 359.486L309.591 320.112C230.538 382.002 119.464 382.002 40.4121 320.112L9.59007 359.486Z M150.001 391.666V491.666H200.001V391.666H150.001Z"
		/>
	</svg>
</template>
