// import { FormDataServiceProxy } from './../../../shared/service-proxies/service-proxies';
import { Component, OnInit, AfterViewInit  } from '@angular/core';
import { FormServiceProxy, FormListDto, FormBusinessUnitServiceProxy, BusinessFormListDto } from '@shared/service-proxies/service-proxies';
import { Router, ActivatedRoute } from '@angular/router';
import { async } from 'rxjs';
import { AppSessionService } from '@shared/session/app-session.service';
import { MonthsList, WeeksList } from '../../../shared/enums/MonthsAndWeeks';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-form-header',
  templateUrl: './form-header.component.html',
  styleUrls: ['./form-header.component.css', '../../../assets/style/form.css'],
})

export class FormHeaderComponent implements OnInit, AfterViewInit  {
  selectedFormName = '';
  selectedFormId: number;
  selectedBuName = '';
  selectedBuId: number;
  formTypeId: any;
  formTypeArr: FormListDto[];
  FormList: FormListDto[];
  BusinessFormList: BusinessFormListDto[];

  enumYearsList = [];
  selectedYearValueId: number;
  MonthValueList = MonthsList;
  enumMonthsList = [];
  selectedMonthValueId: number;

  WeekValueList = WeeksList;
  enumWeeksList = [];
  selectedWeekValueId: number;
  isClose: boolean;
  weekValueId = new FormControl();

  constructor(
    private formService: FormServiceProxy,
    private businessUnitFormService: FormBusinessUnitServiceProxy,
    private router: Router,
    private appSessionService: AppSessionService) {
    this.selectedFormId = 0;
    this.selectedBuId = 0;
    this.selectedYearValueId = 0;
    this.selectedMonthValueId = 0;
    this.selectedWeekValueId = 0;
    this.enumMonthsList = Object.keys(this.MonthValueList).filter(f => !isNaN(Number(f)));
    this.enumWeeksList = Object.keys(this.WeekValueList).filter(f => !isNaN(Number(f)));
  }

  ngOnInit(): void {
    const year = new Date().getFullYear();
    this.enumYearsList.push(year - 1);
    this.enumYearsList.push(year);
    this.enumYearsList.push(year + 1);
    console.log(this.enumYearsList);
  }

  ngAfterViewInit() {
    this.getFormsList();
  }

  public getFormsList(): void {
    this.formService.getAllForms(this.appSessionService.userId).pipe()
      .subscribe((result: FormListDto[]) => {
        this.FormList = result;
        if (this.selectedFormId > 0) {
          this.getBusinessUnitsListByForm(this.selectedFormId);
        }
      });
  }

  public getBusinessUnitsListByForm(formId: number): void {
    this.BusinessFormList = null;
    this.businessUnitFormService.getAllBusinessUnitsAssigneToUserByForm(formId, this.appSessionService.userId).pipe()
      .subscribe((result: BusinessFormListDto[]) => {
        this.BusinessFormList = result;
        console.log('businessunit', result);
        if (this.selectedBuId > 0) {
          this.formTypeArr = this.FormList.filter(form => {
            return form.formId === this.selectedFormId;
          });
          this.formTypeId = this.formTypeArr[0].formTypeID;
          //  this.getMonthsList(this.selectedFormId, this.formTypeId, this.selectedBuId);
        }
      });
  }

  public getFormId(Id): void {
    this.selectedBuId = 0;
    this.selectedMonthValueId = 0;
    this.selectedWeekValueId = 0;
    if (Id > 0) {
      this.selectedFormId = Id;
      this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId]);
      this.getBusinessUnitsListByForm(Id);
    } else {
      this.BusinessFormList = null;
      this.router.navigate(['/app/business-form/data/view-edit/']);

    }
  }

  public getBusinessUnitId(Id): void {
    if (Id > 0) {
      this.formTypeArr = this.FormList.filter(form => {
        return form.formId === this.selectedFormId;
      });
      this.formTypeId = this.formTypeArr[0].formTypeID;
      this.selectedBuId = Id;
      if (this.selectedYearValueId > 0 && this.selectedMonthValueId > 0 && this.selectedWeekValueId >= 0) {
        // tslint:disable-next-line: max-line-length
        this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId, this.formTypeId, this.selectedBuId, this.selectedYearValueId, this.selectedMonthValueId, this.selectedWeekValueId ]);
       }
    } else {
      this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId]);
    }
  }
  public getYearValueById(Id): void {
    if (Id >= 0) {
      this.selectedYearValueId = Id;
      if (this.selectedBuId > 0 && this.selectedMonthValueId > 0 && this.selectedWeekValueId >= 0) {
        // tslint:disable-next-line: max-line-length
        this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId, this.selectedBuId, this.selectedYearValueId, this.selectedMonthValueId, this.selectedWeekValueId]);
       }
    }
  }
  public getMonthValueById(Id): void {
    if (Id > 0) {
      this.formTypeArr = this.FormList.filter(form => {
        return form.formId === this.selectedFormId;
      });
     // this.formTypeId = this.formTypeArr[0].formTypeID;
      this.selectedMonthValueId = Id;
      this.getWeekValueById(this.selectedWeekValueId);
      if (this.selectedBuId > 0 && this.selectedYearValueId > 0  && this.selectedWeekValueId >= 0) {
        // tslint:disable-next-line: max-line-length
        this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId, this.selectedBuId, this.selectedYearValueId, this.selectedMonthValueId, this.selectedWeekValueId]);
       }
    } else {
      this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId]);
    }
  }

  public getWeekValueById(Id): void {
    this.isClose = false;
    if (Id >= 0) {
      this.isClose = true;
      this.selectedWeekValueId = Id;
      this.selectedWeekValueId = this.weekValueId.value && this.weekValueId.value.toString();
      console.log('selected week value: ', this.selectedWeekValueId);
      this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId, this.selectedBuId, this.selectedYearValueId, this.selectedMonthValueId, Id]);
   } else {
      this.router.navigate(['/app/business-form/data/view-edit/', this.selectedFormId]);
    }
  }

  // public getMonthsList(formId: number, formTypeId: number, buId: number): void {
  //   this.formDataServiceProxy.getMonthsList(formId, formTypeId, buId).pipe()
  //     .subscribe((result: MonthsValue[]) => {
  //       this.MonthValueList = result;
  //       this.getWeeksList();
  //     });
  //   console.log(this.selectedMonthValueId);
  // }

  // public getWeeksList(): void {
  //   this.formDataServiceProxy.getWeeksList().pipe()
  //     .subscribe((result: WeeksValue[]) => {
  //       this.WeekValueList = result;
  //     });
  //   console.log(this.selectedWeekValueId);
  // }
}


