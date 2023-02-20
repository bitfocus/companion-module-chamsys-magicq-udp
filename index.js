const { InstanceBase, Regex, runEntrypoint, UDPHelper } = require('@companion-module/base')

class MagicQInstance extends InstanceBase {
	constructor(internal) {
		super(internal)
	}

	async init(config) {
		this.config = config
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
		this.udp = new UDPHelper(this.config.host, this.config.port)
		this.udp.on('error', (err) => {
			this.log('error', 'Network error: ' + err.message)
		})
		this.udp.on('status_change', (status) => {
			this.updateStatus(status)
		})
		this.updateActions()
	}

	async destroy() {
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
		this.log('debug', 'destroy')
	}

	async configUpdated(config) {
		this.config = config
		if (this.udp) {
			this.udp.destroy()
			delete this.udp
		}
		this.udp = new UDPHelper(this.config.host, this.config.port)
		this.udp.on('error', (err) => {
			this.log('error', 'Network error: ' + err.message)
		})
		this.udp.on('status_change', (status, message) => {
			this.status(status, message)
		})
	}

	getConfigFields() {
		return [
			{
				type: 'text',
				id: 'info',
				width: 12,
				label: 'Information',
				value:
					'To enable UDP on MagicQ you need to set the mode, and the transmit and/or receive port numbers in Setup, View Settings, Network. Setting a port to 0 disables transmitting/receiving of OSC.',
			},
			{
				type: 'textinput',
				id: 'host',
				label: 'Target IP',
				tooltip: 'The IP of the Chamsys console',
				width: 6,
				regex: Regex.IP,
			},
			{
				type: 'textinput',
				id: 'port',
				label: 'Target Port',
				width: 4,
				default: '6553',
				regex: Regex.PORT,
			},
		]
	}

	updateActions() {
		const sendUDP = (cmd) => {
			this.log('debug', 'Sending UDP: ' + cmd)
			this.udp.send(cmd)
		}

		this.setActionDefinitions({
			pb: {
				name: 'Set the playback fader level',
				options: [
					{
						type: 'textinput',
						label: 'Playback fader (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
					{
						type: 'textinput',
						label: 'Fader value (0-100 %)',
						id: 'pbVal',
						default: '',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + ',' + action.options.pbVal + 'L')
				},
			},

			intensityCh: {
				name: 'Set the Intensity channel level',
				options: [
					{
						type: 'textinput',
						label: 'Intensity Channel (1-32769)',
						id: 'intensityChId',
						default: '1',
						regex: Regex.NUMBER,
					},
					{
						type: 'textinput',
						label: 'Fader value (0-100 %)',
						id: 'intensityChVal',
						default: '',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.intensityChId + ',' + action.options.intensityChVal + 'I')
				},
			},

			pbGo: {
				name: 'Go on Playback',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + 'G')
				},
			},

			pbActivate: {
				name: 'Activate Playback',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + 'A')
				},
			},

			pbPage: {
				name: 'Playback Page',
				options: [
					{
						type: 'textinput',
						label: 'Page Number',
						id: 'pageId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pageId + 'P')
				},
			},

			pbStop: {
				name: 'Stop Playback',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + 'S')
				},
			},

			pbFf: {
				name: 'Fast Forward Playback',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + 'F')
				},
			},

			pbFb: {
				name: 'Fast Back Playback',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + 'B')
				},
			},

			pbRelease: {
				name: 'Release Playback',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + 'R')
				},
			},

			pbJump: {
				name: 'Playback Jump to Cue',
				options: [
					{
						type: 'textinput',
						label: 'Playback (1-202)',
						id: 'pbId',
						default: '1',
						regex: Regex.NUMBER,
					},
					{
						type: 'textinput',
						label: 'Cue Number',
						id: 'cue',
						default: '1',
						regex: Regex.NUMBER,
					},
					{
						type: 'textinput',
						label: 'Cue Nr Decimal',
						id: 'cueDec',
						default: '0',
						regex: Regex.NUMBER,
					},
				],
				callback: (action) => {
					sendUDP(action.options.pbId + ',' + action.options.cue + ',' + action.options.cueDec + 'J')
				},
			},
		})
	}
}

runEntrypoint(MagicQInstance, [])
