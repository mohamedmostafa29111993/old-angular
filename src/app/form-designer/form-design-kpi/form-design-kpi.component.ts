import { FormStructurePercentageDto } from './../../../shared/service-proxies/service-proxies';
import { FormDesignerService } from './../form-designer.service';
import { Component, Input, OnInit, EventEmitter, Output, AfterViewInit, OnChanges, ChangeDetectorRef, DoCheck, IterableDiffers, KeyValueDiffers } from '@angular/core';
import {
  FormDesignerMetaData, FormDesignerServiceProxy, FormDesignerSubSectionStructureDto,
  FormColumnOutputDto, FormDesignerKPIDto, FormDimensionWeekDto, FormStructerDataCellDto, FormStructureColumnDto, FormCellTypeDto
} from '@shared/service-proxies/service-proxies';
//import {  DimentionTypeServiceProxy,DimentionTypeListDto,FormIndicatorDimentionOutputDto} from '@shared/service-proxies/service-proxies';
import { FormBuilder, FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { FormDesignerAddDimensionDialogComponent } from '../form-designer-add-dimension-dialog/form-designer-add-dimension-dialog.component';
import { ActivatedRoute } from '@angular/router';
import { FormRowType } from '@shared/enums/form-row-type';
import { FormDisplayType } from '@shared/enums/form-display-type';
import { NotifyService } from 'abp-ng2-module';

@Component({
  selector: '[app-form-design-kpi]',
  templateUrl: './form-design-kpi.component.html',
  styleUrls: ['./form-design-kpi.component.css', './../../../assets/style/form.css']
})
export class FormDesignKpiComponent implements OnInit, OnChanges, AfterViewInit {
  @Input() form: FormDesignerSubSectionStructureDto;
  formId: number = 0;
  @Input() formIndicator: FormDesignerKPIDto;
  @Input() formColumns: FormStructureColumnDto[];
  @Input() indicatorIndex: number;
  @Output() deleteKPIid = new EventEmitter<any>();
  @Output() selectedDimentionForBody = new EventEmitter<any>();
  @Input() formDisplayType;
  @Input() weekDimensionStructureId: number;
  @Input() cellTypes: FormCellTypeDto[];
  @Output() selectedIndicator = new EventEmitter<any>();
  @Output() copyKpiAsDimension: EventEmitter<{ title: string, type: string, parentId: number, percentages: FormStructurePercentageDto[] }> = new EventEmitter<{ title: string, type: string, parentId: number, percentages: FormStructurePercentageDto[] }>();
  activeIndicator: boolean = false;
  // dimentionTypeList:DimentionTypeListDto[];
  SelectedIndicatorId: string;
  // addDimentionPlus:boolean=false;
  // indicatorDimentionOutputDto:FormIndicatorDimentionOutputDto[];
  // indicatorDimention:FormIndicatorDimentionOutputDto;
  checkAll: boolean = false;
  isSummary = false;
  showValues = false;
  constructor(
    private _formDesignerService: FormDesignerServiceProxy,
    private _modalService: BsModalService,
    private route: ActivatedRoute,
    public notify: NotifyService,
    public formDesignerService: FormDesignerService
  ) {
  }

  ngOnChanges() {
    this.formColumns = [...this.formColumns];
  }
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.formId = +params.get("formId");
    });

    this.showValues = this.formIndicator.id > 0 ? this.formIndicator.showValues : true;
    this.isSummary = this.formIndicator.rowTypeId == FormRowType.Summary || (this.formIndicator.rowTypeId == null && this.formDisplayType == FormDisplayType.Summary) ? true : false;
    this.fillCells();
    console.log("formDisplayType" + this.formDisplayType)
  }
  ngAfterViewInit() { }
  showValuesEvent(value: boolean) {
    this.showValues = value;
    this.formIndicator.showValues = this.showValues;
  }
  isSummaryEvent(value: boolean) {
    //debugger;
    this.isSummary = value;
    this.formIndicator.rowTypeId = this.isSummary ? FormRowType.Summary : FormRowType.Details;

  }
  openDimensionDialog(indicatorData: FormDesignerKPIDto) {
    //debugger;
    let indicatorIndex = this.indicatorIndex;
    let dimensionDialog: BsModalRef;
    let excludedDimensionIds: number[] = [];
    if (indicatorData.dimensions != undefined && indicatorData.dimensions.length > 0) {
      excludedDimensionIds = indicatorData.dimensions.filter(e => !e.isDeleted)
        .map(function (a) { return a.structureId; });
    }
    dimensionDialog = this._modalService.show(
      FormDesignerAddDimensionDialogComponent,
      {
        class: 'modal-md',
        backdrop: 'static',
        initialState: {
          formId: this.formId,
          excludedDimensionIds: excludedDimensionIds
        },
      }
    );

    dimensionDialog.content.onSave.subscribe((result) => {
      this.selectedDimentionForBody.emit({ result, indicatorIndex });
    });
  }

  deleteKPI(indicatorId: number) {
    this.deleteKPIid.emit(indicatorId);
  }
  addWeekDimension() {
    let weeksLenght = this.formIndicator.weeks?.filter(x => !x.isDeleted)?.length;
    if (weeksLenght <= 4 || !weeksLenght) {
      let weekIndex = isNaN(weeksLenght) ? 1 : weeksLenght + 1;
      this.formIndicator.weeks = this.formIndicator.weeks ? this.formIndicator.weeks : [];
      let week = new FormDimensionWeekDto();
      week.rowTypeId = null;
      week.structureTypeId = 6;
      week.order = weekIndex;
      week.week = weekIndex;
      week.structureId = this.weekDimensionStructureId;
      week.cells = [];
      this.formIndicator?.weeks.push(week);
    }
    else {
      this.notify.warn('Cannot add more than 5 week dimensions!');
    }
  }
  fillCells() {
    debugger
    let cells: FormStructerDataCellDto[] = [];
    if (this.formColumns) {
      this.formColumns.forEach(col => {
        let cell = this.formIndicator.cells?.find(x => x.columnBindSource == col.bindSource );
        if (!cell) {
          cell = new FormStructerDataCellDto();
          cell.typeId = 1;
          cell.structureId = 0;
          cell.columnBindSource = col.bindSource;
          cell.formColumnId = (col.id == null) ? 0 : col.id;
          cell.isDeleted = col.isDeleted;
        }
        cells.push(cell);
      });
    }
    this.formIndicator.cells = cells;
  }
  assignCellType(typeId: number, i: number, sentCell) {
    let cell = this.formIndicator.cells[i];
    sentCell.typeId = typeId;
    cell = sentCell;
  }
  getCellTypeName(id: number) {
    return this.cellTypes.find(x => x.id == id)?.type;
  }

  getdisabledSummary() {
    let condition = this.formIndicator.weeks?.filter(x => !x.isDeleted)?.length > 0 ||
      this.formIndicator.dimensions?.filter(x => !x.isDeleted)?.length > 0;
    return condition;
  }

  // getDimentionType()
  // { this.dimentionTypeList=new Array<DimentionTypeListDto>();
  //   this._dimentionTypeService.getAllDimentionTypes().subscribe(
  //     data=>{
  //       this.dimentionTypeList=data;
  //       this.formIndicator.dimentions.forEach(d=>

  //         this.dimentionTypeList.splice(this.dimentionTypeList.findIndex(x => x.id === d.dimentionTypeId),1)
  //      )
  //     }
  //   );


  // }
  // onCheckboxChange(event) {

  //   if (event.target.checked) {

  //     //this.dimentionTypeSelectedList.push(this.dimentionTypeList.find(d=>d.id==event.target.value));
  //     this.indicatorDimention=new FormIndicatorDimentionOutputDto();
  //     this.indicatorDimention.dimentionTitle=this.dimentionTypeList.find(d=>d.id==event.target.value).title;
  //     this.indicatorDimention.dimentionTypeId=this.dimentionTypeList.find(d=>d.id==event.target.value).id;
  //     this.indicatorDimentionOutputDto.push(this.indicatorDimention);
  //   } else {
  //      var selectedindex = this.indicatorDimentionOutputDto.find(x => x.dimentionTypeId == event.target.value);
  //      var index = this.indicatorDimentionOutputDto.indexOf(selectedindex,0);
  //      this.indicatorDimentionOutputDto.splice(index,1);
  //      console.log("ind  "+selectedindex+"  ");
  //   }
  // }
  onCheckAllChange(event) {
    //   this.checkAll=!this.checkAll;
    //   if(this.checkAll)
    //   { this.indicatorDimentionOutputDto=[];
    //     this.dimentionTypeList.forEach(d=>{
    //     this.indicatorDimention=new FormIndicatorDimentionOutputDto();
    //     this.indicatorDimention.dimentionTitle=d.title;
    //     this.indicatorDimention.dimentionTypeId=d.id;
    //     this.indicatorDimentionOutputDto.push(this.indicatorDimention);
    //     });

    //   }
    //   else{
    //     this.indicatorDimentionOutputDto=[];

    //   }
  }
  submit() {
    //this.addDimentionPlus= !this.addDimentionPlus;
    //    console.log(this.indicatorDimentionOutputDto);
    //    this.selectedDimentionForBody.emit(this.indicatorDimentionOutputDto);
    //    this.activeIndicator=false;
    //    this.checkAll=false;
    //    this.indicatorDimentionOutputDto.forEach(d=>

    //     this.dimentionTypeList.splice(this.dimentionTypeList.findIndex(x => x.id === d.dimentionTypeId),1)
    //  );
    //  this.indicatorDimentionOutputDto=[];
  }

  addDimentionPlusClicked(indicatorId) {
    // if(!this.activeIndicator)
    //   {
    //     this.activeIndicator=true;
    //     this.selectedIndicator.emit(indicatorId);
    //   }
    //   else
    //   { this.activeIndicator=false;
    //     this.selectedIndicator.emit(null);
    //   }

  }

  // switchChange = false;
  // onChange(value: boolean) {
  //   this.switchChange = value;
  // }
  addWeekDimensionForKpiDistribution() {
    // console.log('hellllooooooooooooooooooooooooooooooooooooooo');
    //   let x =new Array<number>(4);
    //   x.forEach((i) => {
    //     debugger;
    // });
    let weeksLenght = this.formIndicator.weeks?.filter(x => !x.isDeleted)?.length;
    if (weeksLenght <= 0 || !weeksLenght) {

      for (let i = 0; i < 4; i++) {
        this.addWeekDimension();

      }
    }
  }


}
