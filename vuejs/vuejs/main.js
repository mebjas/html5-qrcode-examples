Vue.component('qrcode-scanner', {
	props: {
		qrBox: Number,
	},
	// TODO(mebjas): Could use an anonymous ID here
	template: `
		<div id="qr-code-full-region">
			<div id="qrcode-region">
				<div style="
					border: 1px solid black;
					text-align: center;
					padding: 20 0 20 0">
						QR Code viewfinder comes here
					</div>
			</div>
			<div id="qrcode-options" style="background: black; padding: 5px">
				<div>
					<button id="qrcode-options-request-permissions">
						Request Camera Permission
					</button>
					<select id="qrcode-cameras" disabled></select>
				</div>
				<div>
					<button id="qrcode-options-start" disabled>
						Start Scanning
					</button>
					<button id="qrcode-options-stop" disabled>
						Stop Scanning
					</button>
				</div>
			</div>
			<div 
				id="qrcode-response" 
				style="display:none; padding: 5px; border: 1px solid black;">
			</div>
		</div>`,
	mounted: function () {
		// Component has rendered by now
		var requestPermissionButton
			= document.getElementById('qrcode-options-request-permissions');
		var cameraSelection = document.getElementById('qrcode-cameras');
		var scanButton = document.getElementById('qrcode-options-start');
		var stopButton = document.getElementById('qrcode-options-stop');
		var responseContainer = document.getElementById('qrcode-response');

		var qrBox = document.getElementById('qr-code-full-region')
			.getAttribute('qrBox');

		var html5QrCode = new Html5Qrcode("qrcode-region");

		function displayMessage(message) {
			responseContainer.innerHTML = message;
			responseContainer.style.display = "block";
		}

		var lastMessageFound = undefined;
		var codesFound = 0;
		function qrCodeSuccessCallback(qrCodeMessage) {
			if (lastMessageFound == qrCodeMessage) {
				return;
			}
			++codesFound;
			lastMessageFound = qrCodeMessage;
			displayMessage(`[${codesFound}] New code found: `
				+ `<strong>${qrCodeMessage}</strong>`);
		}

		function qrCodeErrorCallback(ignore) {
			// displayMessage("Scanning");
		}

		function videoErrorCallback(message) {
			setFeedback(`Video Error, error = ${message}`);
		}

		requestPermissionButton.addEventListener('click', function () {
			requestPermissionButton.disabled = true;
			Html5Qrcode.getCameras().then(cameras => {
				for (var i = 0; i < cameras.length; i++) {
					var camera = cameras[i];
					var value = camera.id;
					var name = camera.label == null ? value : camera.label;
					var option = document.createElement('option');
					option.value = value;
					option.innerHTML = name;
					cameraSelection.appendChild(option);
				}

				cameraSelection.disabled = false;
				scanButton.disabled = false;
			}).catch(error => {
				requestPermissionButton.disabled = false;
				displayMessage(`Request permission failed. ${error}`)
			});
		});

		scanButton.addEventListener('click', function () {
			scanButton.disabled = true;
			cameraSelection.disabled = true;

			var cameraId = cameraSelection.value;

			// Start scanning.
			var config = { fps: 10 };
			if (qrBox) {
				config['qrBox'] = qrBox;
			}
			html5QrCode.start(
				cameraId,
				config,
				qrCodeSuccessCallback,
				qrCodeErrorCallback).then(ignore => {
					stopButton.disabled = false;
				}).catch(error => {
					scanButton.disabled = false;
					cameraSelection.disabled = false;
					videoErrorCallback(error);
				});
		});

		stopButton.addEventListener('click', function() {
			stopButton.disabled = true;
			html5QrCode.stop().then(ignore => {
				cameraSelection.disabled = false;
				scanButton.disabled = false;
				displayMessage('Stopped scanning');
				document.getElementById('qrcode-region').innerHTML = `
				<div style="
					border: 1px solid black;
					text-align: center;
					padding: 20 0 20 0">
					QR Code viewfinder comes here
				</div>`;
			}).catch(error => {
				stopButton.disabled = false;
				displayMessage(`Unable to stop scanning - ${error}`);
			});
		});
	}
})

var app = new Vue({
	el: '#app',
	data: {
		header: 'Html5-qrcode using vue.js',
	}
});