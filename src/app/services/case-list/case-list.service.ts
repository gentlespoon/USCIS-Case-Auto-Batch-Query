import { Injectable } from '@angular/core';
import { ViewControllerService } from '@app/services/view-controller/view-controller.service';

@Injectable({
  providedIn: 'root'
})
export class CaseListService {

  private DEV = true;

  constructor(
    private viewControllerSvc: ViewControllerService
  ) { }

  public caseIdList: object = {};

  private tryToAddToList(caseId: string) {
    this.parseCaseId(caseId);
    var targetId = caseId.toUpperCase();
    if (null != this.caseIdList[targetId]) {
      throw `${targetId} is already in the list`;
    }
    this.caseIdList[targetId] = false;
  }

  public addCaseId(caseId: string) {
    if (this.DEV) console.log(`Adding caseId: ${caseId}`);
    this.tryToAddToList(caseId);
    this.saveListToLocalStorage();
  }

  public addCaseIds(caseIds: string[]) {
    var currentCaseId = '';
    try {
      for (var caseId of caseIds) {
        currentCaseId = caseId;
        this.tryToAddToList(caseId);
      }
    } catch (ex) {
      throw `Failed to add case "${currentCaseId}":\n\n${ex}`;
    }
    this.saveListToLocalStorage();
  }


  public clearCaseIdList() {
    if (this.DEV) console.log('Clearing caseIdList');
    this.caseIdList = [];
  }

  public parseCaseId(caseId: string): [string, number] {
    var caseIdParsed: [string, number] = ['', 0];
    var regEx = /^([A-Z]{3})([0-9]{10})$/gi;
    var caseIdParseResult = regEx.exec(caseId);
    if (!caseIdParseResult) {
      throw `Invalid case ID: ${caseId}`;
    }
    caseIdParsed[0] = caseId.substring(0, 3);
    caseIdParsed[1] = parseInt(caseId.substring(3));
    return caseIdParsed;
  }


  public saveListToLocalStorage() {
    if (this.DEV) console.log('Saving cached list');
    localStorage.setItem('cachedCaseIdList', JSON.stringify(Object.keys(this.caseIdList)));
    if (this.DEV) console.log('Saved cached list');
  }

  public loadListFromLocalStorage() {
    if (this.DEV) console.log('Loading cached list');
    var loadedListString = localStorage.getItem('cachedCaseIdList');
    if (loadedListString) {
      var loadedList = JSON.parse(loadedListString);
      this.addCaseIds(loadedList);
    } else {
      this.viewControllerSvc.show['greeting'] = true;
    }
    if (this.DEV) console.log(`Finished loading cached list: ${Object.keys(this.caseIdList).length}`)
  }

}
