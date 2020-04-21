({
    getContactData : function(component){
        var action = component.get("c.contactRecords");
        action.setParams({
            "initialRows" : component.get("v.initialRows") 
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var toastReference = $A.get("e.force:showToast");
            if(state == "SUCCESS"){
                
                var response = response.getReturnValue();
                // set the updated response
                component.set("v.data",response);
               
                // display a success message  
                toastReference.setParams({
                    "type" : "Success",
                    "title" : "Success",
                    "message" : "Successfully loaded!",
                    "mode" : "dismissible"
                });
                toastReference.fire();
            }
            else
            {
                toastReference.setParams({
                    "type" : "Error",
                    "title" : "Error",
                    "message" : 'An error occurred during Initialization '+state,
                });
                toastReference.fire();
            }
        });
        $A.enqueueAction(action);
    },
    
    loadData : function(component){
        return new Promise($A.getCallback(function(resolve){
            var limit = component.get("v.initialRows");
            var offset = component.get("v.currentCount");
            var totalRows = component.get("v.totalRows");
            if(limit + offset > totalRows){
                limit = totalRows - offset;
            }
            var action = component.get("c.loadConRecordlist");
            action.setParams({
                "rowLimit" :  limit,
                "rowOffset" : offset
            });
            action.setCallback(this,function(response){
                var state = response.getState();
                var response = response.getReturnValue();
                var currentCount = component.get("v.currentCount");
                currentCount += component.get("v.initialRows");
                // set the current count with number of records loaded 
                component.set("v.currentCount",currentCount);
            });
            $A.enqueueAction(action);
        }));
    },
    updateStatusHelper : function(component){
        var action = component.get("c.updateContactStatus");
        alert(component.get("v.updateList"));
        alert(component.find("selectSingle").get("v.value"));
        action.setParams({
            "updateList" : component.get("v.updateList"),
            "statusVal" : component.find("selectSingle").get("v.value")
        });
        action.setCallback(this,function(response){
            var state = response.getState();
            var toastReference = $A.get("e.force:showToast");
            if(state == "SUCCESS"){
                var response = response.getReturnValue();
                // set the updated response
                component.set("v.data",response);
                component.set("v.displayStatusWindow",false);
                $A.get('e.force:refreshView').fire();
                // display a success message  
                toastReference.setParams({
                    "type" : "Success",
                    "title" : "Success",
                    "message" : "Successfully updated!",
                    "mode" : "dismissible"
                });
                toastReference.fire();
            }
            else
            {
                toastReference.setParams({
                    "type" : "Error",
                    "title" : "Error",
                    "message" : 'An error occurred during Initialization '+state,
                });
                toastReference.fire();
            }
        });
        
        $A.enqueueAction(action);
    },
    
    sortData: function (component, fieldName, sortDirection) {
        var data = component.get("v.data");
        var reverse = sortDirection !== 'asc';
        data.sort(this.sortBy(fieldName, reverse));
        component.set("v.data", data);
    },
    sortBy: function (field, reverse, primer) {
        var key = primer ?
            function(x) {return primer(x[field])} :
            function(x) {return x[field]};
        reverse = !reverse ? 1 : -1;
        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        }
    }
})