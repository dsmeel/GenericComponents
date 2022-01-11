public with sharing class GenericCustomLookupCtrl {
    public GenericCustomLookupCtrl() {}

    @AuraEnabled(cacheable=true)  
    public static List<sobject> searchRecords(  String searchKey,
                                                List<String> additionalFields, 
                                                String objectName,
                                                String additionalFilters,
                                                Integer recordLimit) {  
        string searchText = '\'' + String.escapeSingleQuotes(searchKey) + '%\'';  
        string query =  ' SELECT Id, Name' +
                        (!additionalFields.isEmpty()?', ' + String.join(additionalFields, ','):'') +
                        ' FROM ' + objectName + 
                        ' WHERE Name LIKE ' + searchText +
                        (String.isNotBlank(additionalFilters)?' AND ' + additionalFilters:'')+
                        ' LIMIT ' + recordLimit;  
        
        return Database.query(query);  
    }  
}