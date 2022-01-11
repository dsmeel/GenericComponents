import { LightningElement, api } from 'lwc';
import searchRecords from "@salesforce/apex/GenericCustomLookupCtrl.searchRecords";
export default class GenericCustomLookup extends LightningElement {
    recordsList;
    searchKey = "";
    message;
    selectedRecord;
    @api placeHolder = 'Search...';
    @api selectedRecordName;
    @api selectedRecordId;
    @api objectApiName;
    @api iconName;
    @api lookupLabel;
    @api additionalFilters = '';
    @api additionalFields = [];
    @api recordLimit = 5;
    @api isDisabled = false;
    @api hasError = false;
    @api errorMessage = "";


    get formElementClass(){
        return "slds-form-element " + (this.hasError ? "slds-has-error" : "");
    }

    onLeave(event) {
        setTimeout(() => {
            this.searchKey = "";
            this.recordsList = null;
        }, 300);
    }

    onRecordSelection(event) {
        this.selectedRecordId = event.target.dataset.key;
        this.selectedRecordName = event.target.dataset.name;
        this.selectedRecord = this.recordsList[Number(event.target.dataset.index)];
        this.searchKey = "";
        this.onSeletedRecordUpdate();
    }

    handleKeyChange(event) {
        const searchKey = event.target.value;
        this.searchKey = searchKey;
        if(this.searchKey.length > 3){
            this.getLookupResult();
        }
        this.hasError = false;
    }

    removeRecordOnLookup(event) {
        this.searchKey = "";
        this.selectedRecordId = null;
        this.selectedRecordName = null;
        this.selectedRecord = null;
        this.recordsList = null;
        this.onSeletedRecordUpdate();
    }

    getLookupResult() {
        console.log('additional Filter:::::', this.additionalFilters);
        searchRecords({
            searchKey: this.searchKey,
            additionalFields: this.additionalFields,
            objectName: this.objectApiName,
            additionalFilters: this.additionalFilters,
            recordLimit: this.recordLimit
        })
            .then((result) => {
                if (result.length === 0) {
                    this.recordsList = [];
                    this.message = "No Records Found";
                } else {
                    this.recordsList = result;
                    this.message = "";
                }
                this.error = undefined;
            })
            .catch((error) => {
                this.error = error;
                this.recordsList = undefined;
            });
    }

    onSeletedRecordUpdate() {
        const passEventr = new CustomEvent('recordselection', {
            detail: {   selectedRecordId: this.selectedRecordId, 
                        selectedRecordName: this.selectedRecordName,
                        selectedRecord: this.selectedRecord
                    }
        });
        this.dispatchEvent(passEventr);
    }
}