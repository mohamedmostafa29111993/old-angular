import { FormDesignerSubSectionStructureDto, FormDimensionCubeMappingDto, ReferenceDimensionSumDto } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit, Input, EventEmitter, Output, OnChanges, SimpleChanges, AfterContentInit, AfterViewChecked, ViewChild, Renderer2 } from '@angular/core';
import { FormDisplayType } from '@shared/enums/form-display-type';
import { FormRowType } from '@shared/enums/form-row-type';
import { FormCellTypeDto, FormDesignerDimensionDataDto, FormDesignerServiceProxy, FormDimensionWeekDto, FormStructerDataCellDto, FormStructureColumnDto, PivotQueryServiceProxy, FormDesignerKPIDto } from '@shared/service-proxies/service-proxies';
import { NotifyService } from 'abp-ng2-module';
import { FormDesignerService } from '../form-designer.service';
import { SumDimensionsDialogComponent } from '../sum-dimensions-dialog/sum-dimensions-dialog.component';
import { BsModalService, BsModalRef } from 'ngx-bootstrap/modal';
import { FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: "[app-form-design-dimension]",
  templateUrl: "./form-design-dimension.component.html",
  styleUrls: [
    "./form-design-dimension.component.css",
    "./../../../assets/style/form.css",
  ],
})
export class FormDesignDimensionComponent implements OnInit, OnChanges {
  @Input() form: FormDesignerSubSectionStructureDto;
  @Input() formDimension: FormDesignerDimensionDataDto;
  @Input() formIndicator: FormDesignerKPIDto;
  @Input() formColumns: FormStructureColumnDto[];
  @Input() dimensionDataIndex: number;
  @Input() kpiIndex: number;
  @Input() formDisplayType: number = 0;
  @Input() weekDimensionStructureId: number;
  @Input() cellTypes: FormCellTypeDto[];
  @Output() deleteDimensionData = new EventEmitter<any>();
  @Input() dimensionsHierarchy: { [key: string]: string[] };
  dimensionsHierarchyData: { [key: string]: string[] };
  @Input() savedDimId: number;
  @ViewChild("checkmapping") checkmapping;
  isSummary: boolean;
  showValues: boolean;
  dimHierarchy: any;
  keys: any;
  dims: boolean;
  mappingExists: boolean;
  dimSchema: any;
  schemaChecking: any;
  mappingCheckingValue: any;
  dimDataSourceValidation: boolean;
  selectDimType: string;
  dimMapping: boolean;
  currentCheckedValue = null;
  highlight: FormGroup;
  isDistrbuted: boolean = false;
  constructor(private dimGetService: PivotQueryServiceProxy, public notify: NotifyService, public formDesignerService: FormDesignerService, private _modalService: BsModalService, private ren: Renderer2) {
  }
  ngOnChanges(change: SimpleChanges) {
    if (this.dimensionsHierarchy) {
      if (
        this.formDimension.dimensionCubMapping &&
        this.formDimension.dimensionCubMapping.schemaSelector != null
      ) {
        this.schemaChecking = this.checkDimensionMapping(this.formDimension);
        if (this.schemaChecking == false) {
          this.notify.error("Mapping to this dimension dropped");

          this.dropDimCubeMapping(this.formDimension);
        }
        this.checkDimensionDataMapping(this.formDimension) 
      }
    }
  }
  ngOnInit(): void {

    this.highlight = new FormGroup({
      mappingRadio: new FormControl([''])
    })
    this.fillCells()
    this.showValues = this.formDimension.id > 0 ? this.formDimension.showValues : true;
    this.isSummary = this.formDimension.rowTypeId == FormRowType.Summary ? true : false;
    //this.isSummary = this.formDimension.rowTypeId == FormRowType.Summary || this.formDisplayType == FormDisplayType.Summary ? true : false;
    // this.switchChange = this.isSummary;
    console.log("Form dimension in D component", this.formDimension);
    console.log("kpi Index", this.kpiIndex);
    console.log("dimension Data Index", this.dimensionDataIndex);
    this.selectDimType = this.formDimension?.dimensionCubMapping?.schemaSelector;
    this.highlight.get('mappingRadio').setValue(this.formDimension?.dimensionCubMapping?.dataSelector);
  }

  showValuesEvent(value: boolean) {
    this.showValues = value;
    this.formDimension.showValues = this.showValues;
  }



  isSummaryEvent(value: boolean) {
    this.isSummary = value;
    this.formDimension.rowTypeId = this.isSummary
      ? FormRowType.Summary
      : FormRowType.Details;
  }

  addWeekDimension(isDistrbuted: boolean) {
    // ;
    let weeksLenght = this.formDimension.dimensionWeeks?.filter(
      (x) => !x.isDeleted
    )?.length;
    if (weeksLenght <= 4 || !weeksLenght) {
      let weekIndex = isNaN(weeksLenght) ? 1 : weeksLenght + 1;
      this.formDimension.dimensionWeeks = this.formDimension.dimensionWeeks
        ? this.formDimension?.dimensionWeeks
        : [];
      let week = new FormDimensionWeekDto();
      week.rowTypeId = null;
      week.structureTypeId = 6;
      week.order = weekIndex;
      week.week = weekIndex;
      week.structureId = this.weekDimensionStructureId;
      week.cells = [];
      this.formDimension.dimensionWeeks.push(week);
      week.isDistrbuted = true;
    } else {
      this.notify.warn("Cannot add more than 5 week dimensions!");
    }

  }

  addWeekDimensionForDistribution() {
    this.isDistrbuted = true;
    let weeksLenght = this.formDimension.dimensionWeeks?.filter(
      (x) => !x.isDeleted
    )?.length;
    if (weeksLenght <= 0 || !weeksLenght) {
      for (let i = 0; i < 4; i++) {
        this.addWeekDimension(this.isDistrbuted);
      }
    }
  }

  deleteDimension() {
    this.deleteDimensionData.emit({
      kpiIndex: this.kpiIndex,
      dimensionDataIndex: this.dimensionDataIndex,
    });
  }

  checkDimensionMapping(formDimension) {
    debugger;
    let schemaChecking: any;
    if (formDimension?.dimensionCubMapping?.id > 0) {
      schemaChecking = this.checkSchemanExisting(formDimension);
      console.log("Schema Checking", schemaChecking);
    } else {
      schemaChecking = "This Dimension is not Binded to data Source";
    }
    return schemaChecking;
  }

  // ICON
  checkDimensionDataMapping(formDimension) {
    let dimChecking;
    if (formDimension?.dimensionCubMapping?.id > 0) {
      dimChecking = true;
    } else {
      dimChecking = false;
    }
    return dimChecking;
  }

  checkSchemanExisting(formDimension: FormDesignerDimensionDataDto) {
    let mappingExists: any = false;
    this.dimSchema = formDimension?.dimensionCubMapping?.schemaSelector;
    debugger;
    if (this.dimensionsHierarchy) {
      for (let key in this.dimensionsHierarchy) {
        if (this.dimSchema == key) {
          mappingExists = true;
          console.log("keys", key);
          console.log("Mapped Schema Exists");
          break;
        } else {
          console.log("KeY", key);
          mappingExists = false;
          console.log("Schema Dropped");
        }
      }
    }
    else {
      mappingExists = false;
    }
    return mappingExists;
  }

  dropDimCubeMapping(cubeMapper: FormDesignerDimensionDataDto) {
    debugger;
    cubeMapper.dimensionCubMapping.isDeleted = true;
  }

  checkDimId() {
    if (this.formDimension.id > 0) {
      this.dimDataSourceValidation = true;
    } else {
      this.dimDataSourceValidation = false;
    }
    return this.dimDataSourceValidation;
  }

  fillCells() {
    //
    let cells: FormStructerDataCellDto[] = [];
    if (this.formColumns) {
      this.formColumns.forEach((col) => {
        let cell = this.formDimension?.cells?.find(
          (x) => x.columnBindSource == col.bindSource
        );
        //
        if (!cell) {
          cell = new FormStructerDataCellDto();
          cell.typeId = 1;
          cell.structureId = 0;
          cell.columnBindSource = col.bindSource;
          cell.isDeleted = false;
        }
        cells.push(cell);
      });
    }
    this.formDimension.cells = cells;
  }
  assignCellType(typeId: number, i: number, sentCell) {
    let cell = this.formDimension.cells[i];
    sentCell.typeId = typeId;
    cell = sentCell;
  }
  getCellTypeName(id: number) {
    return this.cellTypes.find((x) => x.id == id)?.type;
  }

  customDimMap(
    dimType: string,
    dimData: string,
    formDimension: FormDesignerDimensionDataDto,
    checked
  ) {
    debugger;
    let dimCubeMapping = formDimension?.dimensionCubMapping;
    if (checked && dimCubeMapping) {
      this.highlight.reset();
      this.selectDimType = null;
      if (dimCubeMapping.id > 0) {
        this.dropDimCubeMapping(formDimension);
      }
    } else {
      this.highlight.get('mappingRadio').setValue(dimData);
      if (dimCubeMapping?.id > 0) {
        dimCubeMapping.dataSelector = dimData;
        dimCubeMapping.schemaSelector = dimType;
        this.selectDimType = dimCubeMapping.schemaSelector;
        return
      }
      else {
        this.formDimension.dimensionCubMapping = new FormDimensionCubeMappingDto();
        this.formDimension.dimensionCubMapping.formStructureRowId = formDimension.id;
        this.formDimension.dimensionCubMapping.schemaSelector = dimType;
        this.formDimension.dimensionCubMapping.dataSelector = dimData;
        this.formDimension.dimensionCubMapping.isMeasure = false;
        // this.formDimension.dimensionCubMapping.isDeleted = false;
        this.selectDimType = dimType;


      }
    }

    this.checkDimensionMapping(formDimension);
  }

  checkExistingDataSource(dimData: string, checked) {
    let dimcubemapping;
    if (!checked) {
      dimcubemapping = null
    } else {
      let dim = this.formDimension?.dimensionCubMapping?.dataSelector == dimData;

      if (dim) {
        dimcubemapping = this.formDimension?.dimensionCubMapping;
      }
    }
    return dimcubemapping;
  }

  // sum dimensions modal
  openSumPopup() {
    if (!this.formDimension) {
      abp.message.error(
        "Invalid Form Structure !",
        undefined,
        (result: boolean) => { }
      );
    } else {
      let SumModal: BsModalRef;
      SumModal = this._modalService.show(SumDimensionsDialogComponent, {
        class: "modal-xl modal-dialog-centered",
        backdrop: "static",
        initialState: {
          FormDimension: this.formDimension,
          FormStructure: this.form,
          title: "Sum Dimensions",
          columns: this.formColumns,
        },
      });

      SumModal.content.sumRes.subscribe((res: ReferenceDimensionSumDto[]) => {
        if (res) {
          debugger;
          if (!this.formDimension?.refDimensionSum) {
            this.formDimension.refDimensionSum = [];
          }
          this.formDimension?.refDimensionSum.push(...res);
          SumModal.hide();
        }
      });
    }
  }

  // checkState(el) {
  //   for (let key in this.dimensionsHierarchy) {
  //     let value = this.dimensionsHierarchy[key];
  //     // Use `key` and `value`
  // }

  //   setTimeout(() => {
  //     if (this.currentCheckedValue && this.currentCheckedValue === el.value) {
  //       el.checked = false;
  //       this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-focused');
  //       this.ren.removeClass(el['_elementRef'].nativeElement, 'cdk-program-focused');
  //       this.currentCheckedValue = null;
  //       this.dimensionsHierarchy = null;
  //     } else {
  //       this.currentCheckedValue = el.value
  //     }
  //   })
  // }

  checkState(el) {
    setTimeout(() => {
      if (this.currentCheckedValue && this.currentCheckedValue === el.value) {

        let checkStateArray = () => {
          for (let key in this.dimensionsHierarchy) {
            let value = this.dimensionsHierarchy[key];
            // Use `key` and `value`
          }
        };

        el.checked = false;
        this.ren.removeClass(el["_elementRef"].nativeElement, "cdk-focused");
        this.ren.removeClass(
          el["_elementRef"].nativeElement,
          "cdk-program-focused"
        );
        this.currentCheckedValue = null;

        checkStateArray = null;

        console.log("test 1");
      } else {
        this.currentCheckedValue = el.value;
        console.log("test 2");
      }
      console.log("test 3");
    });
  }
}
