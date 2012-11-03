enyo.kind({
	name: "Pullout",
	kind: "enyo.Slideable",
	events: {
		onShowTraffic: "",
		onShowTransit: "",
		onMapTypeSelect: "",
		onBookmarkSelect: ""
	},
	components: [
		{name: "shadow", classes: "pullout-shadow"},
		{kind: "onyx.Grabber", classes: "pullout-grabbutton"},
		{kind: "FittableRows", classes: "enyo-fit", components: [
			{name: "client", classes: "pullout-toolbar"},
			{fit: true, style: "position: relative;", components: [
				{name: "info", kind: "Scroller", classes: "enyo-fit", components: [
					{kind: "onyx.Groupbox", classes: "settings", components: [
						{kind: "onyx.GroupboxHeader", content: "Layers"},
						{kind: "LabeledItem", label: "Show Traffic", icon: "images/icon-traffic.png", defaultKind: "onyx.ToggleButton", onChange: "showTrafficChange"},
						{kind: "LabeledItem", label: "Show Transit", icon: "images/icon-transit.png", defaultKind: "onyx.ToggleButton", onChange: "showTransitChange"}
					]},
					{name: "mapType", kind: "Group", classes: "onyx-groupbox settings", highlander: true, onchange: "mapTypeChange", components: [
						{kind: "onyx.GroupboxHeader", content: "Map Type"},
						{kind: "LabeledItem", label: "Road", mapType: "ROADMAP", icon: "images/map-type-road.png", value: true},
						{kind: "LabeledItem", label: "Satellite", mapType: "SATELLITE", icon: "images/map-type-satellite.png"},
						{kind: "LabeledItem", label: "Hybrid", mapType: "HYBRID", icon: "images/map-type-satellite.png"},
						{kind: "LabeledItem", label: "Terrain", mapType: "TERRAIN", icon: "images/map-type-satellite.png"}
					]}
				]},
				{name: "bookmark", kind: "FittableRows", showing: false, classes: "enyo-fit", components: [
					{kind: "onyx.RadioGroup", classes: "bookmark-header", components: [
						{content: "Saved", active: true},
						{content: "Recents"}
					]},
					{fit: true, kind: "Scroller", classes: "bookmark-scroller", components: [
					]}
				]},
				{name: "searchpullout", kind: "FittableRows", showing: false, classes: "enyo-fit", components: [
					{kind: "List", name: "list", fit: true, touch: true, onSetupItem: "setupSearchData", components: [
				        {kind: "SearchListItem", name:"listItem", content: ""}
				    ]}
				]}
			]}
		]}
	],
	max: 320,
	min: 0,
	value: 320,
	unit: "px", 
	toggle: function(inPanelName) {
		var t = this.$[inPanelName];
		if (t.showing && this.isAtMin()) {
			this.animateToMax();
		} else {
			this.animateToMin();
			this.$.info.hide();
			this.$.bookmark.hide();
			this.$.searchpullout.hide();
			t.show();
			t.resized();
		}
	},
	openPullout: function(inPanelName){
			var t = this.$[inPanelName];
			this.animateToMin();
			this.$.info.hide();
			this.$.bookmark.hide();
			this.$.searchpullout.hide();
			t.show();
			t.resized();	
	},
	setSearchData: function(datavar) {
	    console.log("New training data: " + datavar.length);
	    this.results = datavar;
	    this.$.list.setCount(this.results.length);
	    //this.$.list.refresh();
	    this.$.list.reset();
	},
	setupSearchData: function(inSender, inEvent) {
	    var i = inEvent.index;
	    var item = this.results[i];
	    console.log("Search data: " + item.formatted_address);

	    this.$.listItem.setItemName(item.formatted_address);
	    var selected = inSender.isSelected(i);
	    this.$.listItem.setSelected(selected);
	    if(selected){
	      //this.owner.$.middle.setTrainingId(item.id);
	      	map.setCenter(item.geometry.location);
        	map.setZoom(15);
        	var marker = new google.maps.Marker({
                map: map,
                position: item.geometry.location
            });
	    }
	},
	valueChanged: function() {
		this.inherited(arguments);
		this.$.shadow.setShowing(this.value !== this.max);
	},
	showTransitChange: function(inSender) {
		console.log("Transit Toggle Changed: " + inSender.getValue()) ;
		this.doShowTransit({value: inSender.getValue()});	
	},
	showTrafficChange: function(inSender) {
		console.log("Traffic Toggle Changed: " + inSender.getValue());
		this.doShowTraffic({value: inSender.getValue()});
	},	
	mapTypeChange: function(inSender, inEvent) {
		var o = inEvent.originator;
		console.log("Map Type Changed: " + o.parent.mapType);
		this.doMapTypeSelect({mapType: o.parent.mapType});
	},
	itemSelect: function(inSender, inEvent) {
		this.doBookmarkSelect({item: inEvent.item});
	}
});