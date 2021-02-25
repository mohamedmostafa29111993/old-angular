
  import { ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { NotifyService } from 'abp-ng2-module';

export class CreatedServices {
  isCollapsed = false;
  //allSections: FormDesignerSectionDto[] =  new Array<FormDesignerSectionDto>();
  allSections = new Array<any>();
  mainSections = new Array<any>();
  allSubSections = new Array<any>();
  mainSubSections = new Array<any>();
  updatedSections = new Array<any>();

  formId = 0;
  enumLeftSectionType = LeftSectionType;
  formSectionId: number;
  event: any;
  IsLoadingHtml = false;
  minHeight = null;
  overflow = "hidden";
  panelClicked = false;
  sectionSelected: number;
  subSectionSelected: number;
  checkAll = false;
  isDisabledAddSection = false;
  isDisabledAddSubSection = false;
  isDelete = false;
  anyChanges = false;
  testPreview= true;
  // start coding -By Meska-
  isExpanded: number;
  computedValue: number;
  // end coding -By Meska-

  @ViewChild("namedElement", { static: false }) namedElement: ElementRef;
  @ViewChild("btnAccordion", { static: false }) btnAccordion: ElementRef;
  @Input() sectionData: any;
  @Output() sendSubSections: EventEmitter<{
    isSubsection: boolean;
    sectionId: FormDesignerSubSectionDto;
    isDel: boolean;
  }> = new EventEmitter();

  constructor(
    private _formDesignerService: FormDesignerServiceProxy,
    private route: ActivatedRoute,
    private _modalService: BsModalService,
    public notify: NotifyService,
    public global: GlobalService,
    public formDesignerService: FormDesignerService
  ) { }

  getAllSections() {
    //debugger;
    this._formDesignerService
      .getAllDesignerSections(this.formId)
      .subscribe((res) => {
        this.allSections = (res.formDesignerSectionDto.length > 0) ? res.formDesignerSectionDto.filter(element => element.isDeleted == false).filter(a => a.childern.filter(x => x.isDeleted == false)) : res.mainSections.filter(element => element.isDeleted == false);
        this.mainSections = (res.formDesignerSectionDto.length == 0) ? new Array<any>() : res.mainSections;
        if (res.formDesignerSectionDto.length == 0) {
          // debugger
          this.updatedSections = res.mainSections;
        }

        //this.global.formDesignerObject = this.allSections;
        if (this.mainSections.length == 0 || this.allSections.length == 0) {
          this.isDisabledAddSection = true;
        } else {
          this.isDisabledAddSection = false;
        }
        if (this.allSections.length > 0) {
          this.sectionSelected = this.allSections[0]?.sectionId;

          // start coding -By Meska-
          this.isExpanded = +(sessionStorage.getItem('storedExpandedPanel'));
          this.computedValue = +(sessionStorage.getItem('computedValue'));

          let storedActiveSubSection = +(sessionStorage.getItem('storedSubSection'));
          let subsection = (storedActiveSubSection) ? storedActiveSubSection : this.allSections[0]?.childern[0]?.formSubSectionId;
          // end coding -By Meska-

          // let subsection = (this.allSections[0]?.childern[0]?.formSubSectionId > 0) ? this.allSections[0]?.childern[0]?.formSubSectionId : this.allSections[0]?.childern[0]?.subSectionId;
          this.sendFormSectionId(true, subsection, false, this.isExpanded);
        }
        this.IsLoadingHtml = true;
      });
  }

  sendFormSectionId(isSubsection, formSectionId, isDelete, expandedPanelIndex, subsection?) {
    this.global.subSectionSelected = formSectionId;

    //  let index = this.allSections.indexOf(this.allSections.find(x => x.formSubSectionId == formSectionId ));

    // start coding -By Meska-
    sessionStorage.setItem('storedSubSection', formSectionId);
    sessionStorage.setItem('storedExpandedPanel', expandedPanelIndex);

    if(expandedPanelIndex <= 0) {
      sessionStorage.setItem('computedValue', JSON.stringify(expandedPanelIndex+1));
      this.computedValue = +(sessionStorage.getItem('computedValue'));
    } else {
      sessionStorage.setItem('computedValue', expandedPanelIndex);
    }
    // end coding -By Meska-

    this.subSectionSelected = formSectionId;
    this.sendSubSections.emit({
      isSubsection: isSubsection,
      sectionId: formSectionId,
      isDel: isDelete,
    });
  }

  // start coding -By Meska-
  checkExpandedPanel(panelIndex) {
    if(panelIndex == 0) {
      if((panelIndex + this.computedValue) == this.isExpanded) {
        return true
      } else {
        return false;
      }
    } else {
      if(panelIndex == this.isExpanded) {
        return true;
      } else {
        return false;
      }
    }
  }
  // end coding -By Meska-
}
