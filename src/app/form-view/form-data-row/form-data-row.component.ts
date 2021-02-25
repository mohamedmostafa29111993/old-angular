import { AddMeetingComponent } from './../add-meeting/add-meeting.component';
import { Component, OnInit, Input, Output, EventEmitter, } from "@angular/core";
import {  UpdateFormDataDto,ActivitiesCellDto, FormDataServiceProxy, FormDimensionDataDto, FormDimensionWeekDto, FormKPIDto, FormStructerDataCellDto, FormStructureColumnDto,ActivityCountDto, FormDataCellDto} from "@shared/service-proxies/service-proxies";
import { FormStructureType, } from "@shared/enums/form-structure-type"
import { AffectedParentRowsIds } from "@shared/custom-dtos/output-events-emitter-dto"
import { FormCellType } from "@shared/enums/form-cell-type"
import { FormRowType } from "@shared/enums/form-row-type"
import { NotifyService } from "abp-ng2-module";
import { AppSessionService } from "@shared/session/app-session.service";
import { ActivityOutputDto, ActivityUpdateCountDto } from "@shared/custom-dtos/activities-Dto";
import { Observable } from "rxjs";
import { ActivityType } from "@shared/enums/activity-type";
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AddTaskComponent } from "../add-task/add-task.component";


@Component({
  selector: "[app-form-data-row]",
  templateUrl: "./form-data-row.component.html",
  styleUrls: [
    "./form-data-row.component.css",
    "../../../assets/style/form.css",
  ],
})
export class FormDataRowComponent implements OnInit {
  @Input() formId: number;
  @Input() businessUnitId: number;
  //@Input() year : number;
  @Input() Month: number;
  @Input() Year: number;
  @Input() Weeks: number[];
  @Input() kpi: FormKPIDto;
  @Input() dimensionData: FormDimensionDataDto;
  @Input() perentKpiId: number;
  @Input() perentDimensionDataId: number;
  @Input() dimensionWeek: FormDimensionWeekDto;
  @Input() columns: FormStructureColumnDto[];
  @Input() structureTypeId: number;
  @Output() updateAffectedRows = new EventEmitter<AffectedParentRowsIds>();
  cells: FormStructerDataCellDto[];
  formDataInput : UpdateFormDataDto;
  prevCellValue: number;
  activityCount: ActivityCountDto;
  @Output() addMeeting = new EventEmitter<ActivityOutputDto>();
  @Output() addTaskAndIssue = new EventEmitter<ActivityOutputDto>();
  @Input() updateActivitiesCountEvent :Observable<ActivityUpdateCountDto>;
  ActivityRowID : number;
  ActivityWeek : number;
  ActivityMonth : number;
  ActivityYear: number;
   colPercentage : any;

  constructor(private notify: NotifyService,
    private formDataService: FormDataServiceProxy,
      private appSessionService: AppSessionService,
      private _modalService: BsModalService) {
      this.formDataInput = new UpdateFormDataDto();
  }
  ngOnInit(): void {
     this.fillCells(this.structureTypeId);

  }

  getCell(bindSource: string, structureTypeId: number): FormStructerDataCellDto {
    //debugger
    let cell = null;
    if (structureTypeId == FormStructureType.KPI) {
      //debugger
      cell = this.kpi.cells?.find(x => x.columnBindSource === bindSource);
    }
    else if (structureTypeId == FormStructureType.DimensionData) {
      cell = this.dimensionData.cells?.find(x => x.columnBindSource === bindSource);

    }
    else if (structureTypeId == FormStructureType.DimensionWeek) {
      cell = this.dimensionWeek.cells?.find(x => x.columnBindSource === bindSource);

    }
    return cell;
  }
  fillCells(structureTypeId: number) {
    this.cells = [];
    this.columns.forEach(
      (col: FormStructureColumnDto) => {
        this.colPercentage =  this.kpi?.formStructurePercentages.find(a => a.formStructureRowId == this.kpi.id && a.formStructureColumnId == col.id);
      let cell: FormStructerDataCellDto = this.getCell(col.bindSource, structureTypeId);
    //  debugger
        if (!cell) {
          cell = new FormStructerDataCellDto();
          cell.dataId = 0;
          cell.structureId = 0;
          cell.value = 0;
          cell.formColumnId = col.id
          cell.columnBindSource = col.bindSource;
          cell.columnHeader = col.header;
          cell.columnIsPercentage = /* col.isPercentage */ (this.colPercentage  != undefined)? this.colPercentage.isPercentage : col.isPercentage;
        }
        cell.columnIsPercentage = (this.colPercentage  != undefined)? this.colPercentage.isPercentage : col.isPercentage;
        this.cells.push(cell);
      }
    );
    if(structureTypeId == FormStructureType.KPI) {
      this.kpi.cells = this.cells;
      if(this.kpi.rowTypeId == FormRowType.Details  && this.kpi.showValues ){
        this.updateAffectedRows.emit({ kpiId: this.kpi.id, dimensionDataId: 0,week : 0 });
      }
    }
    else if (structureTypeId == FormStructureType.DimensionData) {
      this.dimensionData.cells = this.cells;
      if(this.dimensionData.rowTypeId == FormRowType.Details && this.dimensionData.showValues ){
        this.updateAffectedRows.emit({ kpiId: this.perentKpiId, dimensionDataId: this.dimensionData.id ,week : 0});
      }
    }
    else if (structureTypeId == FormStructureType.DimensionWeek) {
      this.dimensionWeek.cells = this.cells;
      this.updateAffectedRows.emit({ kpiId: this.perentKpiId, dimensionDataId: this.perentDimensionDataId ,week : this.dimensionWeek.week});
    }
  }
  inputClick(cellIndex: number) {
    let cell = this.cells[cellIndex];
    this.prevCellValue = cell.value;
    cell.value = cell.value == 0 ? null : cell.value;
  }
  inputChange(cellIndex: number) {
    let changedCell = this.cells[cellIndex];
    changedCell.value = changedCell.value == null ? 0 : changedCell.value;
    if (this.prevCellValue != changedCell.value) {
      this.notify.info("Saving Data ...", "", {
        autoDismiss: false,
      });
      this.formDataInput.userId = this.appSessionService.userId;
      this.formDataInput.changedCellStructureId = changedCell.structureId;
      this.formDataInput.changedCellDataId = changedCell.dataId;
      this.formDataInput.formId = this.formId;
      this.formDataInput.businessUnitId = this.businessUnitId;
      let cellData:FormDataCellDto;
      this.formDataInput.formDataCells =[];
      this.cells.forEach(cell=>{
        cellData = new FormDataCellDto();
        cellData.structureId = cell.structureId;
        cellData.dataId = cell.dataId;
        cellData.value = cell.value;
        cellData.columnBindSource = cell.columnBindSource;
        if(this.structureTypeId == FormStructureType.DimensionWeek){
          cellData.week = this.dimensionWeek.order;
        }
        cellData.month = this.Month;
        cellData.year = this.Year;
        cellData.structureId = cell.structureId;
        this.formDataInput.formDataCells.push(cellData);
      });
     // this.formDataInput.formDataCells = this.cells;
      this.formDataService
        .insertUpdateUserFormData(this.formDataInput)
        .subscribe(
          (data) => {
            this.cells.forEach(x=>{
              debugger;
              let newCell = data.find(d=>d.structureId == x.structureId);
              x.value = newCell?.value;
              x.dataId = newCell?.dataId;
            })
            this.updateAffectedRows.emit({ kpiId: this.perentKpiId, dimensionDataId: this.perentDimensionDataId,week : this.dimensionWeek?.week });
            this.notify.success("Data Saved Successfully");
          },
          (error) => {
            this.notify.error("Data not Saved");
          }
        );
    } else {
      this.notify.warn("No Change in Data ");
    }
  }
  get structureType() {
    return FormStructureType;
  }
  get cellType() {
    return FormCellType;
  }
  get activityType() {
    return ActivityType;
  }
  openPopupIssueAndTask(Cells:any, activityTypeId:number ,StructureActivityCount:ActivityCountDto) {
    let ActivityDataDto = new ActivityOutputDto();
    ActivityDataDto = this.SetDataToActivity();
    ActivityDataDto.activityTypeId =activityTypeId;
    ActivityDataDto.cells = new Array<ActivitiesCellDto>();
    if (Cells.constructor.name == "Array") {
      Cells.forEach(Cell => {
        let NewCell = new ActivitiesCellDto();
        NewCell.id = Cell.structureId;
        NewCell.value = Cell.value;
        ActivityDataDto.cells.push(NewCell);
      });
    } else {
      let NewCell = new ActivitiesCellDto();
      NewCell.id = Cells.structureId;
      NewCell.value = Cells.value;
      ActivityDataDto.cells.push(NewCell);
    }
    let addActivityDialog: BsModalRef;
    addActivityDialog = this._modalService.show(
      AddTaskComponent,
      {
        class: 'modal-lg',
        backdrop: 'static',
        initialState: {
          activityDto: ActivityDataDto
        },
      });
      addActivityDialog.content.onSave.subscribe((res) => {
        StructureActivityCount.taskCount += res.taskCount;
        StructureActivityCount.issueCount += res.issueCount;
      });
  }

  openPopupMeeting(dimentionCells:any, activityTypeId:number , StructureActivityCount:ActivityCountDto) {
    let ActivityDataDto = new ActivityOutputDto();
    ActivityDataDto = this.SetDataToActivity();
    ActivityDataDto.activityTypeId =activityTypeId;
    ActivityDataDto.cells = new Array<ActivitiesCellDto>();

    if (dimentionCells.constructor.name == "Array") {
      dimentionCells.forEach(Cell => {
        let NewCell = new ActivitiesCellDto();
        NewCell.id = Cell.structureId;
        NewCell.value = Cell.value;
        ActivityDataDto.cells.push(NewCell);
      });
    } else {
      let NewCell = new ActivitiesCellDto();
      NewCell.id = dimentionCells.structureId;
      NewCell.value = dimentionCells.value;
      ActivityDataDto.cells.push(NewCell);
    }

    let addActivityDialog: BsModalRef;
    addActivityDialog = this._modalService.show(
      AddMeetingComponent,
      {
        class: 'modal-lg',
        backdrop: 'static',
        initialState: {
          activityDto: ActivityDataDto
        },
      });
    addActivityDialog.content.onSave.subscribe((res) => {
      StructureActivityCount.meetingCount += res.meetingCount;
    });
  }


  SetDataToActivity(): any{
    let ActivityDataDto = new ActivityOutputDto();
    if (this.structureTypeId == FormStructureType.KPI) {

      ActivityDataDto.RowId =this.kpi?.id;
      ActivityDataDto.Week = 0;
      ActivityDataDto.Month = this.Month;
      ActivityDataDto.Year = this.Year;
    }
    else if (this.structureTypeId == FormStructureType.DimensionData) {
      ActivityDataDto.RowId =this.dimensionData?.id;
      ActivityDataDto.Week = 0;
      ActivityDataDto.Month = this.Month;
      ActivityDataDto.Year = this.Year;
    }
    else if (this.structureTypeId == FormStructureType.DimensionWeek) {
      ActivityDataDto.RowId =this.dimensionWeek?.id;
      ActivityDataDto.Week = this.dimensionWeek?.week;
      ActivityDataDto.Month = this.dimensionWeek?.month;
      ActivityDataDto.Year = this.dimensionWeek?.year;
    }
    return ActivityDataDto;
  }
}
