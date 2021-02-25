import { forEach, indexOf } from "lodash";
import { Component, Input, OnInit, ViewChild } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";

import {
  FormDesignerKPIDto,
  FormDesignerMetaData,
  FormDesignerSectionDto,
  FormDesignerSubSectionDto,
  FormDesignerSubSectionStructureDto,
} from "@shared/service-proxies/service-proxies";
import { FormDesignerServiceProxy } from "@shared/service-proxies/service-proxies";
import { FormDesignerBodyComponent } from "../form-designer-body/form-designer-body.component";
import { FormDesignerSectionComponent } from "../form-designer-section/form-designer-section.component";
import { GlobalService } from "@shared/custom-services/global.service";
import { NotifyService } from "abp-ng2-module";
import { createLessThan } from "typescript";
import { AppConsts } from "@shared/AppConsts";
import { MppingHilightDto } from "@shared/custom-dtos/mapping-hilight-Dto";

@Component({
  selector: "app-form-design",
  templateUrl: "./form-design.component.html",
  styleUrls: ["./form-design.component.css"],
})
export class FormDesignComponent implements OnInit {
  @Input() SubSectionLength: number;
  formDesignerMetaData = new FormDesignerMetaData();
  formId: number;
  innerHeight: any;
  formSectionId: number;
  isActiveFormPreview: boolean;
  @ViewChild(FormDesignerBodyComponent)
  formDesignerBody: FormDesignerBodyComponent;
  @ViewChild(FormDesignerSectionComponent)
  formDesignerSection: FormDesignerSectionComponent;

  mppingHilightDto: MppingHilightDto[] = new Array<MppingHilightDto>();

  selectedSubSection: number;

  isDelete: boolean;
  isLoading: boolean;
  isLoadingSaveData: boolean;
  formStructureSectionList: FormDesignerSectionDto[];
  returnSectionData: any;
  constructor(
    private _formDesignerServiceProxy: FormDesignerServiceProxy,
    private route: ActivatedRoute,
    public global: GlobalService,
    public notify: NotifyService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.selectedSubSection = this.global.subSectionSelected;
    // this.isLoadingSaveData = true;
    this.innerHeight = window.innerHeight / 1.7;
    this.route.paramMap.subscribe((params) => {
      this.formId = +params.get("formId");
      if (this.formId > 0) {
        this.getFormDesignerMetData();
        // this.checkDataLoaded();
      }
    });
    console.log(
      "🚀 ~ file: form-design.component.ts ~ line 58 ~ FormDesignComponent ~ ngOnInit ~ this.isActiveFormPreview",
      this.isActiveFormPreview
    );
  }

  getsubsectionid(sendObj: any): any {
    //debugger
    this.global.isAllLoading = true;
    sendObj.formId = this.formId;
    this.formDesignerBody.getFormDesign(
      sendObj.formId,
      sendObj.isSubsection,
      sendObj.sectionId,
      sendObj.isDel
    );
    this.isActiveFormPreview = this.global.subSectionHasKPI;
  }

  getFormDesignerMetData() {
    this.global.isAllLoading = true;
    this._formDesignerServiceProxy
      .getFormMetaData(this.formId)
      .subscribe((result: FormDesignerMetaData) => {
        this.formDesignerMetaData = result;

      });
  }

  public checkHasData(objData: any): void {
    // debugger
    //this.isLoading = false;
    let hasData: boolean;
    this.returnSectionData = objData;
    if (objData.data.id == this.formDesignerBody.formDesignerStructure.id) {
      if (this.returnSectionData.sectionId > 0) {
        if (this.formDesignerBody.formDesignerStructure.columns.length > 0) {
          hasData = true;
        } else {
          hasData = false;
        }
      } else {
        hasData = false;
      }
    } else {
      if (this.returnSectionData.sectionId > 0) {
        if (this.returnSectionData.data.columns.length > 0) {
          hasData = true;
        } else {
          hasData = false;
        }
      } else {
        hasData = false;
      }
    }

    if (!objData.isSubsection) {
      this.formDesignerSection.responseDeleteSection(
        this.returnSectionData.sectionId,
        hasData
      );
    } else {
      this.formDesignerSection.responseDeleteSubSection(
        this.returnSectionData.sectionId,
        hasData
      );
    }
    console.log("Picked data: ", this.returnSectionData);
  }

  public checkDataLoaded(obj: any) {
    //debugger
    this.isLoadingSaveData = this.formDesignerSection.IsLoadingHtml;
    /* && obj.isLoaded */
  }

  checkSaveForHighlight() {
    debugger
    if (this.formDesignerBody.mppingHilightDto.length > 0) {
      debugger
      this.checkHighlightDialog();
    } else {
      this.saveStructure();
    }
  }

  public saveStructure() {
    //debugger

    this.global.isAllLoading = true;
    console.log(this.formDesignerBody.formDesignerStructure.columns);
    console.log(this.global.formDesignerObject);
    console.log(this.formDesignerSection.allSections);
    let structureSection: FormDesignerSectionDto[];
    debugger;
    structureSection = this.prepareSectionObject();
    this._formDesignerServiceProxy
      .createUpdateFormStructureSection(structureSection)
      .subscribe((result: FormDesignerSectionDto[]) => {
        debugger;
        this.formStructureSectionList = result;
        if (result != null) {
          this.formDesignerSection.allSections = result;
          //  this.notify.success('Save Successfully');
          if (this.global.formDesignerObject.id == 0) {
            let savedSection = this.formDesignerSection.allSections.find((a) =>
              a.childern.find(
                (x) => x.subSectionId == this.global.subSectionSelected
              )
            );
            let subsection = savedSection.childern.find(
              (x) => x.subSectionId == this.global.subSectionSelected
            );
            this.formDesignerBody.formDesignerStructure = this.prepareSubSectionToBody(
              subsection,
              this.formDesignerBody.formDesignerStructure
            );
          }

          this.formDesignerBody.saveObject();
          //this.isLoadingSaveData = false;

          //this.checkHighlightDialog()
        }
        console.log(result);
      });

    // this.checkHighlightDialog()
  }
  checkHighlightDialog() {
    abp.message.confirm(
      "Are you sure you want to save with the changes in the Data source?",

      undefined,
      (result: boolean) => {
        if (result) {
          this.formDesignerBody.unmatchedDataSource();
          if (result) {
            this.notify.success("Data source deleted ");
            this.saveStructure();
          } else {
            this.notify.error("Data source deleted  <br /> An error occurred");
          }
        }
      }
    );
  }

  prepareSectionObject(): FormDesignerSectionDto[] {
    // debugger
    let mappedSection = new Array<FormDesignerSectionDto>();
    for (var sec of this.formDesignerSection.allSections) {
      const newSection = new FormDesignerSectionDto();
      newSection.formId = this.formDesignerSection.formId;
      newSection.sectionId = sec.sectionId;
      newSection.formSectionId = sec.formSectionId;
      newSection.sectionTitle = sec.sectionTitle;
      newSection.sectionTypeId = sec.sectionTypeId;
      newSection.parentSectionId = sec.parentSectionId;
      newSection.isLeaf = sec.childern.length > 0 ? false : true;
      newSection.order = this.formDesignerSection.allSections.indexOf(sec) + 1;
      newSection.isDeleted = sec.isDeleted;
      newSection.childern = sec.childern;
      newSection.childern =
        sec.childern.length > 0
          ? this.prepareSubSectionObject(sec.childern)
          : sec.childern;
      mappedSection.push(newSection);
    }
    return mappedSection;
  }

  prepareSubSectionObject(children): FormDesignerSubSectionDto[] {
    // debugger
    let mappedSection = new Array<FormDesignerSubSectionDto>();
    for (var sub of children) {
      const newSubSection = new FormDesignerSubSectionDto();
      newSubSection.formId = this.formDesignerSection.formId;
      newSubSection.subSectionId = sub.subSectionId;
      newSubSection.formSubSectionId = sub.formSubSectionId;
      newSubSection.subSectionTitle = sub.subSectionTitle;
      newSubSection.subSectionTypeId = sub.subSectionTypeId;
      newSubSection.parentSectionId = sub.parentSectionId;
      newSubSection.isLeaf = false;
      newSubSection.order = children.indexOf(sub) + 1;
      newSubSection.isDeleted = sub.isDeleted;
      mappedSection.push(newSubSection);
    }
    return mappedSection;
  }

  prepareSubSectionToBody(
    sub,
    oldStructure
  ): FormDesignerSubSectionStructureDto {
    //debugger
    let newSubSection = new FormDesignerSubSectionStructureDto();
    oldStructure.columns?.forEach((sec) => {
      sec.parentId = sub.formSubSectionId;
    });
    oldStructure.kpis?.forEach((kpi) => {
      kpi.parentId = sub.formSubSectionId;
    });

    newSubSection.structureId = sub.subSectionId;
    newSubSection.id = sub.formSubSectionId;
    newSubSection.title = sub.subSectionTitle;
    newSubSection.structureTypeId = sub.subSectionTypeId;
    newSubSection.parentId = sub.parentSectionId;
    newSubSection.isLeaf = false;
    newSubSection.columns = oldStructure?.columns;
    newSubSection.kpis = oldStructure?.kpis;
    newSubSection.code = oldStructure.code;
    newSubSection.rowTypeId = oldStructure.rowTypeId;
    newSubSection.order = oldStructure.order;
    newSubSection.formDisplayTypeId = oldStructure.formDisplayTypeId;

    return newSubSection;
  }

  goToPreviewForm() {
    this.router.navigate([
      `/app/preview-subsection/${this.formId}/${this.global.subSectionSelected}`,
    ]);
  }
}
