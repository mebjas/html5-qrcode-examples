Vue.component('qrcode-scanner', {
	props: {
		qrbox: Number,
		fps: Number,
	},
	template: `<div id="qr-code-full-region"></div>`,
	mounted: function () {
		var config = { fps: this.fps ? this.fps : 10 };
		if (this.qrbox) {
			config['qrbox'] = this.qrbox;
		}

		function onScanSuccess(qrCodeMessage) {
			console.log(qrCodeMessage);
		}
		
		var html5QrcodeScanner = new Html5QrcodeScanner(
			"qr-code-full-region", config);
		html5QrcodeScanner.render(onScanSuccess);
	}
});

var app = new Vue({
	el: '#app',
	data: {
		header: 'Html5-qrcode using vue.js',
	}
});