enyo.kind({
	name: "SearchListItem",
	classes: "item enyo-border-box",
	style: "padding: 10px;",
	published: {
    	itemId: "",
    	itemName: ""
  	},
	components: [
	 	{name: "itemName", content: ""}
	],
	create: function() {
    	this.inherited(arguments);
    	this.nameChanged();
	},
	setSelected: function(inSelected) {
		this.addRemoveClass("item-selected", inSelected);
		//this.$.remove.applyStyle("display", inSelected ? "inline-block" : "none");
	},
	setItemName:function(data){
		this.itemName = data;
		this.nameChanged();
	},
	nameChanged: function() {
		this.$.itemName.setContent(this.itemName);
	}
});