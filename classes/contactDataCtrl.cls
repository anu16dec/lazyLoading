public class contactDataCtrl {
    
    //To return initial account records
    @AuraEnabled
    public static List<Contact> contactRecords(Integer initialRows){
        List<Contact> accountsList = new List<Contact> ();
        try
        {
            accountsList = [SELECT Name,Status__c,email FROM Contact limit :initialRows OFFSET 0];
        }
        catch(Exception e){
        }
        return accountsList;
    }
    
    @AuraEnabled
    public static List<Contact> loadConRecordlist(Integer rowLimit,Integer rowOffset){
        return [SELECT Name,Status__c,email FROM Contact limit :rowLimit OFFSET :rowOffset];
    }
    
    @AuraEnabled
    public static void updateContactStatus(List<Contact> updateList, String statusVal){
        system.debug(updateList+'<<updateList>>');
        system.debug(statusVal+'<<statusVal>>');
        List<Contact> conList = new List<Contact>();
        
        for(Contact c : [Select Id, Status__c from Contact where Id IN:updateList])
        {
            c.Status__c = statusVal;
            conList.add(c);
        }
        
        update conList;
    }
}