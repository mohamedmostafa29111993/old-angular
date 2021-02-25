import { FormStructurePercentageDto, ReferenceDimensionSumDto } from './../../../shared/service-proxies/service-proxies';
import { KPIReferenceTypeEnum } from '../../../shared/enums/kpi-refrence-type';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NotifyService } from "abp-ng2-module";
import { Component, OnInit, Input, OnDestroy, Output, EventEmitter } from '@angular/core';
import { FormDesignerDimensionDataDto, FormDesignerKPIDto, FormDesignerReferenceServiceProxy, FormDesignerSubSectionStructureDto, FormListDto, FormServiceProxy, FromStructureReferenceDto, GetReferenceSubSectionInput, KPIDto, StructureReferenceDto, SubSectionWithSectionNameDto } from '@shared/service-proxies/service-proxies';
import { Subscription } from 'rxjs';
import { FormDesignerService } from '../form-designer.service';

@Component({
  selector: 'copy-sum-kpis',
  templateUrl: './copy-kpis-dialog.component.html',
  styleUrls: ['./copy-kpis-dialog.component.css']
})
export class CopyKpisComponent implements OnInit, OnDestroy {
  @Input() isSum = false;
  @Input() type;
  @Input() parentId;
  @Output() CopySumRes: EventEmitter<FormDesignerKPIDto[] | FormDesignerDimensionDataDto[]> = new EventEmitter<FormDesignerKPIDto[] | FormDesignerDimensionDataDto[]>();
  copyKpisForm: FormGroup;
  FormStructure: FormDesignerSubSectionStructureDto = new FormDesignerSubSectionStructureDto();
  title: string;
  isloaded = false;
  showSubSection: boolean;
  showDimensions: boolean;
  showKPIS: boolean;
  subscription: Subscription = new Subscription();
  percentages: FormStructurePercentageDto[];
  forms: FormListDto[] = [];
  isFormsLoaded: boolean;
  isSubSectionsLoaded: boolean;
  isKPISLoaded: boolean;
  subSections: SubSectionWithSectionNameDto[] = [];
  KPIS: KPIDto[] = [];
  fromStructureReference: FromStructureReferenceDto[] = [];
  targetSubSection: SubSectionWithSectionNameDto;
  targetKPIS: KPIDto[] = [];
  targetFormId;
  formSubmitted: boolean;
  lastSelectedKpis: number[] = [];
  Dimensions: ReferenceDimensionSumDto[] = [];
  isDimensionsLoaded: boolean;
  constructor(
    public ModalRef: BsModalRef,
    public notify: NotifyService,
    protected formBuilder: FormBuilder,
    protected _formervice: FormServiceProxy,
    protected _formDesignerService: FormDesignerReferenceServiceProxy,
    protected formDesignerService: FormDesignerService

  ) {
  }

  ngOnInit(): void {
    this.createCopyKPIForm();
    this.loadForms();
    this.onFormsChange();
    this.onSubSectionsChange();
    this.onKPISChange();
  }
  // create form
  createCopyKPIForm() {
    this.copyKpisForm = this.formBuilder.group({
      forms: ['', Validators.required],
      SubSections: ['', Validators.required],
      KPIS: ['', Validators.required]
    });
  }
  loadForms() {
    this.isFormsLoaded = false;
    this._formervice.getPublishedForms().subscribe((result: FormListDto[]) => {
      if (result.length) {
        this.forms = result;
      } else {
        this.forms = [];
      }
      this.isFormsLoaded = true;
    });
  }
  loadSubsection(form) {
    const id = form?.formId ? form.formId : form;
    this.copyKpisForm.get('SubSections').reset();
    this.targetFormId = null;
    this.isSubSectionsLoaded = false;
    this.showSubSection = true;
    if (id && this.FormStructure?.columns) {
      debugger;
      this.targetFormId = id;
      let body = new GetReferenceSubSectionInput();
      body.formId = id;
      body.referenceType = this.type == 'CopyAsKPI' ? KPIReferenceTypeEnum.CopyAsKPI : this.type == 'CopyAsDimension' ? KPIReferenceTypeEnum.CopyAsDimension : KPIReferenceTypeEnum.Sum;
      body.columns = this.FormStructure.columns;
      if (this.type == 'CopyAsDimension') {
        body.kpiColumnPercentages = this.percentages;
      }
      this._formDesignerService.getSubSectionWithSectionName(body).subscribe((res: SubSectionWithSectionNameDto[]) => {
        debugger;
        if (res) {
          this.subSections = this.subSections.concat(res);
          if (this.FormStructure.id) {
            res.map((item, index) => item.subSectionId == this.FormStructure.id ? this.subSections.splice(index, 1) : null)
          }
          this.isSubSectionsLoaded = true;
        }

      });

    }

  }
  loadKPIS(subsectionId) {
    this.copyKpisForm.get('KPIS').reset();
    this.showKPIS = true;
    this.isKPISLoaded = false;
    if (subsectionId) {

    } else {
      this.KPIS = [];
    }
    this.isKPISLoaded = true;
  }

  // dropdowns change subscription
  // forms
  onFormsChange() {
    this.subscription.add(
      this.copyKpisForm.get('forms').valueChanges.subscribe((value: any[]) => {
        debugger;
        if (value.length) {
          // if (value[value.length - 1] == this.targetFormId) {
          // } else {
          // }
          this.loadSubsection(value[value.length - 1]);
          if (!this.fromStructureReference.find(f => f.formId == value[value.length - 1])) {
            this.fromStructureReference.push(new FromStructureReferenceDto({ formId: value[value.length - 1], subSection: null }))
          }
          if (value.length < this.fromStructureReference.length) {
            for (let i = 0; i < this.fromStructureReference.length; i++) {
              const res = value.find((v) => v === this.fromStructureReference[i].formId)
              if (!res) {
                const res = this.fromStructureReference.findIndex((v) => v.formId === this.fromStructureReference[i].formId)
                this.fromStructureReference.splice(res, 1);
                i--;
              }
            }
          }
          this.showSubSection = true;
        } else {
          this.showSubSection = false;
          this.showKPIS = false;
          this.isDimensionsLoaded = false;
          this.copyKpisForm.get('SubSections')?.setValue('');
          this.copyKpisForm.get('KPIS')?.setValue('');
          this.copyKpisForm.get('dimensions')?.setValue('');
          this.fromStructureReference = [];
          this.subSections = [];
          this.KPIS = [];
          this.Dimensions = [];
        }
      })
    );
  }
  // SubSections
  onSubSectionsChange() {
    debugger;
    this.subscription.add(
      this.copyKpisForm.get('SubSections').valueChanges.subscribe((id) => {
        debugger;
        this.targetSubSection = new SubSectionWithSectionNameDto();
        this.copyKpisForm.get('KPIS').reset();
        if (this.copyKpisForm.get('dimensions')) {
          this.copyKpisForm.get('dimensions').reset();
          this.showDimensions = false;
        }
        if (id) {
          this.targetSubSection = this.subSections.find(s => s.subSectionId == id);
          // filter existing kpis
          if (this.FormStructure.kpis) {
            let formStructureKpis = this.FormStructure.kpis;
            if (formStructureKpis.length) {
              formStructureKpis.forEach((formStructureKpi) => {
                this.lastSelectedKpis.push(formStructureKpi.referenceId);
              });
            }
          }


          if (this.lastSelectedKpis.length) {
            this.lastSelectedKpis.forEach((selectedKpisItem) => {
              this.targetSubSection.kpIs = this.targetSubSection.kpIs.filter((kpi) => {
                return kpi.kpiId != selectedKpisItem;
              });
            });
          }

          this.fromStructureReference?.forEach((f, i) => {
            if (f.formId === this.targetSubSection.formId) {
              this.fromStructureReference[i].subSection = new SubSectionWithSectionNameDto({
                formId: this.targetSubSection.formId,
                subSectionId: this.targetSubSection.subSectionId,
                subSectionTitle: this.targetSubSection.subSectionTitle,
                kpIs: []
              });
            }
          });
          // let result;
          // const KPIS = this.getKpis(id);
          // if (this.type === 'CopyAsDimension') {
          //   const kpis = this.FormStructure.kpis.find(kpi => kpi.id === this.parentId)?.dimensions
          //   result = this.compareTwoArrOfKpis(KPIS, kpis ? kpis : []);
          // } else {
          //   result = this.compareTwoArrOfKpis(KPIS, this.FormStructure.kpis);
          // }
          // this.KPIS = result;
          // this.KPIS.push(...this.getKpis(id));
          this.KPIS = this.KPIS.concat(this.getKpis(id));
          this.showKPIS = true;
        } else {
          this.showKPIS = false;
          this.isDimensionsLoaded = false;
          this.copyKpisForm.get('KPIS')?.setValue('');
          this.copyKpisForm.get('dimensions')?.setValue('');
          this.KPIS = [];
          this.Dimensions = [];
        }
        this.isKPISLoaded = true;
      })
    );
  }
  getKpis(id) {
    debugger;
    return this.subSections.find(s => s.subSectionId == id).kpIs
  }
  // KPIS
  onKPISChange() {
    this.subscription.add(
      this.copyKpisForm.get('KPIS').valueChanges.subscribe((value) => {
        this.targetKPIS = null;
        this.isKPISLoaded = false;
        if (value) {
          this.targetKPIS = value;
          this.fromStructureReference.forEach((f, index) => {
            if (f.formId == this.targetSubSection.formId) {
              this.fromStructureReference[index].subSection.kpIs = value?.map(k => new KPIDto({ kpiId: k, kpiTitle: this.findKpiOnSubsections(k)?.kpiTitle, structureId: this.findKpiOnSubsections(k)?.structureId }));
            }
          })
        } else {
          this.KPIS = [];
        }
        this.isKPISLoaded = true;
      })
    );
  }

  compareFn(item, selected) {
    return item.kpiId === selected.kpiId;
  }
  getFormTitle(id) {
    return this.forms.find(f => f.formId === id).formName;
  }
  reset() {
    this.copyKpisForm.reset();
    this.subSections = [];
    this.KPIS = [];
  }

  save() {
    this.formSubmitted = true
    if (this.copyKpisForm.valid) {
      this.isloaded = true;
      let body = new StructureReferenceDto();
      // body.currentParentId = this.FormStructure.id;
      debugger;
      body.currentParentId = this.parentId;
      body.forms = this.fromStructureReference;

      if (this.type === 'CopyAsKPI') {
        this._formDesignerService.getReferencedKPIsStructureAsKPI(body).subscribe((res: FormDesignerKPIDto[]) => {
          debugger;

          this.CopySumRes.emit(res);
          this.isloaded = false;
        })
      } else {
        this._formDesignerService.getReferencedKPIsStructureAsDimension(body).subscribe((res: FormDesignerDimensionDataDto[]) => {
          debugger;
          this.CopySumRes.emit(res);
          this.isloaded = false;
        })
      }
    }
  }

  orderFormColumnId(kpi: FormDesignerKPIDto) {
    if (kpi?.cells) {
      const res = kpi.cells.map((cell, i) => {
        cell.formColumnId = this.FormStructure.columns[i].id
        return cell;
      })
    }
    return kpi;
  }

  compareTwoArrOfKpis(kpis1: KPIDto[], kpis2: any[]) {
    return kpis1?.filter(kpi => kpi.structureId !== kpis2?.find(kpi2 => kpi2.referenceId > 0)?.structureId);
  }

  findKpiOnSubsections(id) {
    let res;
    for (let sub of this.subSections) {
      const t = sub.kpIs.find(kpi => kpi.kpiId == id);
      if (t) {
        res = t;
        break;
      }
    }
    return res;
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
