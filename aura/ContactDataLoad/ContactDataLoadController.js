({
    doInit : function(component,event,helper){
        //configure column info.
        component.set("v.columns",
                      [
                          {label : 'Name',fieldName : 'Name',type : 'url',sortable: true, typeAttributes:{label:{fieldName:'Name'},target:'_blank'}},
                          {label : 'Email',fieldName : 'email',type : 'text',sortable: true},
                          {label : 'Status',fieldName : 'Status__c',type : 'text'}
                      ]);
        // Call helper to set the data for contact list view
        helper.getContactData(component);
    },
    
    loadMore : function(component,event,helper){
        	if(!(component.get("v.currentCount") >= component.get("v.totalRows"))){
                event.getSource().set("v.isLoading", true); 
                //call loading of more contacts and then set the latest list on UI. since Javascript promise i called,using then  here.
                helper.loadData(component).then(function(data){ 
                    var dataList = component.get("v.data");
                    var updateList = dataList.concat(data);
                    component.set("v.data", updateList);
                    event.getSource().set("v.isLoading", false); 
                });
            }
    },
    
    handleSelectedRow :function (component, event, helper) {
        var selectedRows = event.getParam('selectedRows'); 
        //set the selected rows to a list to be passed to apex controller on click of Update button.
        component.set("v.updateList",selectedRows); 
    },
    
    searchData : function(component,event,helper) {
        var allRecords = component.get("v.data");
        var searchFilter = event.getSource().get("v.value").toUpperCase();
        
        if(searchFilter != '' && searchFilter != undefined)
        {
            var tempArray = [];
            var i;
    		
            //filtering rows based on search text entered.
            for(i=0; i < allRecords.length; i++){
                if((allRecords[i].Name && allRecords[i].Name.toUpperCase().indexOf(searchFilter) != -1) ||
                   (allRecords[i].Status__c && allRecords[i].Status__c.toUpperCase().indexOf(searchFilter) != -1 ) || 
                   (allRecords[i].email && allRecords[i].email.toUpperCase().indexOf(searchFilter) != -1 ) )
                {
                    tempArray.push(allRecords[i]);
                }
            }
            component.set("v.data",tempArray);
            event.getSource().set("v.isLoading", false); 
        }
        else
        {
            helper.getContactData(component);
        }
    },
    
    cancelWindow : function(component,event,helper) {
        component.set("v.displayStatusWindow",false);
    },
    
    updateStatus : function(component,event,helper) {
        helper.updateStatusHelper(component);
    },
    
    changeStatus: function(component,event,helper) {
        component.set("v.displayStatusWindow",true);
    },
    //sort columns based on column header click
    updateColumnSorting: function (component, event, helper) {
        var fieldName = event.getParam('fieldName');
        var sortDirection = event.getParam('sortDirection');
        component.set("v.sortedBy", fieldName);
        component.set("v.sortedDirection", sortDirection);
        helper.sortData(component, fieldName, sortDirection);
    }
})