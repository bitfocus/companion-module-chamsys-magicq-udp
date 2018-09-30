var instance_skel = require('../../instance_skel');
var udp           = require('../../udp');
var debug;
var log;

function instance(system, id, config) {
	var self = this;
	// super-constructor
	instance_skel.apply(this, arguments);
	self.actions(); // export actions
	return self;
}

instance.prototype.updateConfig = function(config) {
	var self = this;

	self.config = config;
	self.init_udp();
};
instance.prototype.init_udp = function() {
	var self = this;

	if (self.config.host !== undefined) {
		self.udp = new udp(self.config.host, self.config.port);

		self.udp.on('status_change', function (status, message) {
			self.status(status, message);
		});
	}
};

instance.prototype.init = function() {
	var self = this;
	self.status(self.STATE_OK); // status ok!
	debug = self.debug;
	log = self.log;
	self.init_udp();
};

// Return config fields for web config
instance.prototype.config_fields = function () {
	var self = this;
	return [
		{
			type: 'text',
			id: 'info',
			width: 12,
			label: 'Information',
			value: 'To enable UDP on MagicQ you need to set the mode, and the transmit and/or receive port numbers in Setup, View Settings, Network. Setting a port to 0 disables transmitting/receiving of OSC.'
		},
		{
			type: 'textinput',
			id: 'host',
			label: 'Target IP',
			tooltip: 'The IP of the Chamsys console',
			width: 6,
			regex: self.REGEX_IP
		},
		{
			type: 'textinput',
			id: 'port',
			label: 'Target Port',
			width: 4,
			default: '6553',
			regex: self.REGEX_PORT
		}
	]
};

// When module gets deleted
instance.prototype.destroy = function() {
	var self = this;

	if (self.udp !== undefined) {
		self.udp.destroy();
	}
	debug("destroy", self.id);
};


instance.prototype.actions = function(system) {
	var self = this;
	self.system.emit('instance_actions', self.id, {

		'pb':      {
			label:      'Set the playback fader level',
			options: [
				{
					type:     'textinput',
					label:    'Playback fader (1-202)',
					id:       'pbId',
					default:  '1',
					regex:    self.REGEX_NUMBER
				},
				{
					type:     'textinput',
					label:    'Fader value (0-100 %)',
					id:       'pbVal',
					default:  '',
					regex:    self.REGEX_NUMBER
				}
			]
		},
		'intensityCh':      {
			label:      'Set the Intensity channel level',
			options: [
				{
					type:     'textinput',
					label:    'Intensity Channel (1-32769)',
					id:       'iCh',
					default:  '1',
					regex:    self.REGEX_NUMBER
				},
				{
					type:     'textinput',
					label:    'Intensity value (0-100 %)',
					id:       'iVal',
					default:  '',
					regex:    self.REGEX_NUMBER
				}
			]
		},

		'pbGo':     {
			label:      'Go on Playback',
			options: [
				{
					type:     'textinput',
					label:    'Playback (1-202)',
					id:       'pbId',
					default:  '1',
					regex:    self.REGEX_NUMBER
				}
			]
		},

		'pbActivate':     {
			label:      'Activate Playback',
			options: [
				{
					type:     'textinput',
					label:    'Playback (1-202)',
					id:       'pbId',
					default:  '1',
					regex:    self.REGEX_NUMBER
				}
			]
		},

		'pbPage':     {
			label:     'Playback Page',
			options: [
				{
					type:    'textinput',
					label:   'Page Number',
					id:      'pageId',
					default: '1',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'pbStop':     {
			label:     'Stop Playback',
			options: [
				{
					type:    'textinput',
					label:   'Playback (1-202)',
					id:      'pbId',
					default: '1',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'pbFf':     {
			label:     'Fast Forward Playback',
			options: [
				{
					type:    'textinput',
					label:   'Playback (1-202)',
					id:      'pbId',
					default: '1',
					regex: self.REGEX_NUMBER
				}
			]
		},
		'pbFb':     {
			label:     'Fast Back Playback',
			options: [
				{
					type:    'textinput',
					label:   'Playback (1-202)',
					id:      'pbId',
					default: '1',
					regex: self.REGEX_NUMBER
				}
			]
		},

		'pbRelease':     {
			label:     'Release Playback',
			options: [
				{
					type:    'textinput',
					label:   'Playback (1-202)',
					id:      'pbId',
					default: '1',
					regex:   self.REGEX_NUMBER
				}
			]
		},

		'pbJump':     {
			label:     'Playback Jump to Cue',
			options: [
				{
					type:    'textinput',
					label:   'Playback (1-202)',
					id:      'pbId',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type:    'textinput',
					label:   'Cue Nr',
					id:      'cue',
					default: '1',
					regex:   self.REGEX_NUMBER
				},
				{
					type:    'textinput',
					label:   'Cue Nr Decimal',
					id:      'cueDec',
					default: '0',
					regex:   self.REGEX_NUMBER
				}
			]
		},

		'dbo':     {
			label:     'Desk Black Out DBO',
			options: [
				{
					type:    'dropdown',
					label:   'On / Off',
					id:      'dboId',
					choices: [ { id: '0', label: 'DBO Off' }, { id: '1', label: 'DBO On' } ]
				}
			]
		},
	});
}

instance.prototype.action = function(action) {
	var self = this;
	var cmd
	var opt = action.options


	switch (action.action){

		case 'pb':
			cmd = opt.pbId + ',' + opt.pbVal + 'L';
			debug(cmd);
		break;

		case 'pbGo':
			cmd = opt.pageId + 'G';
			debug(cmd);
		break;

		case 'pbActivate':
			cmd = opt.pageId + 'A';
			debug(cmd);
		break;

		case 'pbPage':
			cmd = opt.pageId + 'P';
			debug(cmd,arg);
		break;

		case 'pbStop':
			cmd = opt.pbId + 'S';
			debug(cmd);
		break;

		case 'pbRelease':
			cmd = opt.pbId + 'R';
			debug(cmd);
		break;

		case 'pbFf':
			cmd = opt.pbId + 'F';
			debug(cmd);
		break;

		case 'pbFb':
			cmd = opt.pbId + 'B';
			debug(cmd);
		break;

		case 'intenityCh':
			cmd = opt.iCh + ',' + opt.iVal + 'I';
			debug(cmd);
		break;


		case 'pbJump':
			cmd = opt.pbId + ',' + opt.cue + ','+ opt.cueDec +'J';
			debug(cmd);

		break;

}
	if (cmd !== undefined) {
		debug("Sending ", cmd, "to", self.config.host);

		if (self.udp !== undefined) {
			self.udp.send(cmd);
		}
	}


};

instance_skel.extendedBy(instance);
exports = module.exports = instance;
