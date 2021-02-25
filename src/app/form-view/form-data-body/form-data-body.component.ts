import { Component, Input, OnInit } from '@angular/core';
import { FormStructureType } from '@shared/enums/form-structure-type';
import { FormDimensionDataDto, FormKPIDto, FormSubsectionDto } from '@shared/service-proxies/service-proxies';
import { AffectedParentRowsIds } from "@shared/custom-dtos/output-events-emitter-dto"
import { FormRowType } from '@shared/enums/form-row-type';

@Component({
  selector: '[app-form-data-body]',
  templateUrl: './form-data-body.component.html',
  styleUrls: ['./form-data-body.component.css', '../../../assets/style/form.css']
})
export class FormDataBodyComponent implements OnInit {
  @Input() formId: number;
  @Input() Month: number;
  @Input() Weeks: number[];
  @Input() Year: number[];
  @Input() businessUnitId: number;
  @Input() subsection: FormSubsectionDto;
  kpis: FormKPIDto[];
  isLoaded = false;
  constructor() {
    this.kpis = [];
  }
  ngOnInit(): void {
    //debugger
    if (this.subsection?.kpis) {
      this.isLoaded = true;
      this.kpis = this.subsection?.kpis;

    }
  }
  updateAffectedRows(affectedRows: AffectedParentRowsIds) {
    debugger
    this.updateSummaryRow(affectedRows);
  }
  updateSummaryRow(affectedRows: AffectedParentRowsIds) {
    let kpi = this.kpis.find(x => x.id == affectedRows.kpiId);
    if (kpi) {
      let dimentionData = kpi.dimensions.find(x => x.id == affectedRows.dimensionDataId);
      if (affectedRows.dimensionDataId > 0) {
        if(dimentionData.rowTypeId == this.rowType.Details){
          dimentionData.cells.forEach(cell => {
            cell.value = this.getWeeksSumValueForDimention(cell.formColumnId, dimentionData);
          });
        }
      }
      if(affectedRows.week> 0 && kpi.dimensionWeeks?.length > 0 && kpi.dimensions?.length > 0)
      {
         let week = kpi.dimensionWeeks.find(x=>x.week == affectedRows.week);
          week?.cells.forEach(cell=>{
             cell.value = this.getSumValueForKpiWeekDimension(cell.formColumnId,kpi,week.week);
          });
      }
      if(kpi.rowTypeId == this.rowType.Details){
        debugger;
        let sumOnKpiLevel = kpi.dimensionWeeks?.length > 0 ? true : false;
        kpi.cells.forEach(cell => {
          cell.value = this.getWeeksSumValueForKpi(cell.formColumnId, kpi, sumOnKpiLevel);
        });
      }
    }
  }
  getWeeksSumValueForDimention(formColumnId: number, dimentionData: FormDimensionDataDto): number {
   debugger
    let value = 0;
    let isPercentage = false;
    const dimensionWeeksLength= dimentionData?.dimensionWeeks.length;
    dimentionData.dimensionWeeks?.forEach(x => {
      value += x.cells?.find(c => c.formColumnId == formColumnId)?.value
      isPercentage = x.cells?.find(c => c.formColumnId == formColumnId).columnIsPercentage;
    });
    return  value = (isPercentage && dimensionWeeksLength != undefined) ? value / dimensionWeeksLength : value;;
  }
  getWeeksSumValueForKpi(formColumnId: number, kpi: FormKPIDto, onKpiLevel: boolean): number {
    debugger
    let value = 0;
    let isPercentage = false;
    if (onKpiLevel) {
      const dimensionWeeksLength= kpi?.dimensionWeeks.length;
      kpi.dimensionWeeks.forEach(w => {
        value += w.cells?.find(c => c.formColumnId == formColumnId).value
        isPercentage = w.cells?.find(c => c.formColumnId == formColumnId).columnIsPercentage;
      });
      value = (isPercentage && dimensionWeeksLength != undefined) ? value / dimensionWeeksLength : value;
    }
    else {
      const dimensionLength =  kpi?.dimensions?.length;
      kpi.dimensions?.forEach(d => {
        if(d.dimensionWeeks?.length>0){
          value += this.getWeeksSumValueForDimention(formColumnId,d);
          isPercentage = d.cells?.find(c => c.formColumnId == formColumnId).columnIsPercentage;
        }
        else{
          value += d.cells?.find(c => c.formColumnId == formColumnId).value
          isPercentage = d.cells?.find(c => c.formColumnId == formColumnId).columnIsPercentage;
        }
      });
      value = (isPercentage && dimensionLength != undefined)?  value / dimensionLength : value;
    }
    return value;
  }
  getSumValueForKpiWeekDimension(formColumnId: number,kpi: FormKPIDto,week:number):number{
    debugger;
    let value = 0;
    let isPercentage = false;
       const dimensionLength =  kpi?.dimensions?.length;
    kpi.dimensions.forEach(d=>{
      let weekDimension = d.dimensionWeeks.find(x=>x.week == week);
      if(weekDimension){
        value += weekDimension.cells?.find(c => c.formColumnId == formColumnId).value;
        isPercentage = weekDimension.cells?.find(c => c.formColumnId == formColumnId).columnIsPercentage;
      }
    });
    value = (isPercentage && dimensionLength != undefined)?  value / dimensionLength : value;
    return value;
  }
  get structureType() {
    return FormStructureType;
  }
  get rowType(){
    return FormRowType;
  }
}
