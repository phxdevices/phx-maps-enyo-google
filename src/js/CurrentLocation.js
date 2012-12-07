enyo.kind({
	name: "CurrentLocation",
	kind: "Component",
	events: {
		onSuccess: "",
		onFailure: "doFailure"
    },
	doFailure: function(error) {
        // error 2 is "POSITION_UNAVAILABLE"; may happen on desktop if wifi is off or n/a
        console.log("Geolocation error #" + error.code + ": " + error.message);
    },
    destroy: function() {
		this.stopTracking();
		this.inherited(arguments);
	},
	stopTracking: function() {
		console.log("Trying to stop tracking...");
		if (this._watchId) {
			console.log("Did stop tracking.");
			navigator.geolocation.clearWatch(this._watchId);
		}
	},
	go: function() {
        if(!!navigator.geolocation) {
            this._watchId = navigator.geolocation.watchPosition(
                enyo.bind(this, "doSuccess"),
                enyo.bind(this, "doFailure"),
                {maximumAge: 600, timeout: 20000});
        } else {
            console.log("Geolocation error: Browser does not support navigator.geolocation!");
        }
    }
});
