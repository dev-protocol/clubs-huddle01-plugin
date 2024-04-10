import axios from 'axios'

export type MeetingRequestJson = Readonly<{
	hostWallets: string[]
	roomType: 'AUDIO' | 'VIDEO'
	description: string
	muteOnEntry: boolean
	videoOnEntry: boolean
	startTime: string
	expiryTime: string
}>

const API_KEY = process.env.HUDDLE_API_KEY

export const meetingHandler = async ({
	request,
}: Readonly<{ request: Request }>) => {
	// eslint-disable-next-line functional/no-expression-statements
	const {
		hostWallets,
		roomType,
		description,
		muteOnEntry,
		videoOnEntry,
		startTime,
		expiryTime,
	} = (await request.json()) as MeetingRequestJson
	// eslint-disable-next-line functional/no-expression-statements
	console.log(
		hostWallets,
		roomType,
		description,
		muteOnEntry,
		videoOnEntry,
		startTime,
		expiryTime,
	)
	const response = await axios.post(
		'https://api.huddle01.com/api/v1/create-iframe-room',
		{
			title: 'Token Gated',
			tokenType: 'ERC721',
			chain: 'POLYGON',
			contractAddress: ['0x89904De861CDEd2567695271A511B3556659FfA2'],
			roomType: roomType,
			description: description,
			muteOnEntry: muteOnEntry,
			videoOnEntry: videoOnEntry,
			hostWallets: hostWallets,
			startTime: startTime,
			expiryTime: expiryTime,
		},
		{
			headers: {
				'Content-Type': 'application/json',
				'x-api-key': API_KEY,
			},
		},
	)

	// Extract only the needed data from the response
	// Extract the nested data
	const { data: responseData } = response
	const { roomId, meetingLink } = responseData.data

	return new Response(
		JSON.stringify({
			message: 'Meeting Created Successfully',
			data: {
				roomId,
				meetingLink,
			},
		}),
		{
			status: 200,
		},
	)
}
