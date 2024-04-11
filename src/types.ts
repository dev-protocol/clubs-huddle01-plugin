export type Option =
	| Readonly<{ key: 'slug'; value?: string }>
	| Readonly<{ key: 'rpc'; value?: string }>
	| Readonly<{ key: 'maxpage'; value?: number }>

export type TokenURIWithId = Readonly<{
	id: number
	image: string
}>

export interface HostOption {
	id: number
	address: string | undefined
}

export interface Meet {
	hostWallets: HostOption[]
	roomType: 'AUDIO' | 'VIDEO'
	description: string | undefined
	muteOnEntry: boolean
	videoOnEntry: boolean
	meetingLink: string | undefined
	startTime: string | undefined
	expiryTime: string | undefined
}
