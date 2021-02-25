import { IFromStructureReferenceDto, IKPIDto, ISubSectionWithSectionNameDto, ReferenceDimensionSumDto } from './../../../shared/service-proxies/service-proxies';
export class KPIDto implements IKPIDto {
    kpiId: number;
    kpiTitle: string | undefined;
    structureId: number | undefined;
    dimensions: ReferenceDimensionSumDto[]
    constructor(data?: IKPIDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.kpiId = _data["kpiId"];
            this.kpiTitle = _data["kpiTitle"];
            this.structureId = _data["structureId"];
        }
    }

    static fromJS(data: any): KPIDto {
        data = typeof data === 'object' ? data : {};
        let result = new KPIDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["kpiId"] = this.kpiId;
        data["kpiTitle"] = this.kpiTitle;
        data["structureId"] = this.structureId;
        return data;
    }

    clone(): KPIDto {
        const json = this.toJSON();
        let result = new KPIDto();
        result.init(json);
        return result;
    }
}
export class SubSectionWithSectionNameDto implements ISubSectionWithSectionNameDto {
    formId: number;
    subSectionId: number;
    subSectionTitle: string | undefined;
    kpIs: KPIDto[] | undefined;

    constructor(data?: ISubSectionWithSectionNameDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.formId = _data["formId"];
            this.subSectionId = _data["subSectionId"];
            this.subSectionTitle = _data["subSectionTitle"];
            if (Array.isArray(_data["kpIs"])) {
                this.kpIs = [] as any;
                for (let item of _data["kpIs"])
                    this.kpIs.push(KPIDto.fromJS(item));
            }
        }
    }

    static fromJS(data: any): SubSectionWithSectionNameDto {
        data = typeof data === 'object' ? data : {};
        let result = new SubSectionWithSectionNameDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["formId"] = this.formId;
        data["subSectionId"] = this.subSectionId;
        data["subSectionTitle"] = this.subSectionTitle;
        if (Array.isArray(this.kpIs)) {
            data["kpIs"] = [];
            for (let item of this.kpIs)
                data["kpIs"].push(item.toJSON());
        }
        return data;
    }

    clone(): SubSectionWithSectionNameDto {
        const json = this.toJSON();
        let result = new SubSectionWithSectionNameDto();
        result.init(json);
        return result;
    }
}
export class FromStructureReferenceDto implements IFromStructureReferenceDto {
    formId: number;
    subSection: SubSectionWithSectionNameDto;

    constructor(data?: IFromStructureReferenceDto) {
        if (data) {
            for (var property in data) {
                if (data.hasOwnProperty(property))
                    (<any>this)[property] = (<any>data)[property];
            }
        }
    }

    init(_data?: any) {
        if (_data) {
            this.formId = _data["formId"];
            this.subSection = _data["subSection"] ? SubSectionWithSectionNameDto.fromJS(_data["subSection"]) : <any>undefined;
        }
    }

    static fromJS(data: any): FromStructureReferenceDto {
        data = typeof data === 'object' ? data : {};
        let result = new FromStructureReferenceDto();
        result.init(data);
        return result;
    }

    toJSON(data?: any) {
        data = typeof data === 'object' ? data : {};
        data["formId"] = this.formId;
        data["subSection"] = this.subSection ? this.subSection.toJSON() : <any>undefined;
        return data;
    }

    clone(): FromStructureReferenceDto {
        const json = this.toJSON();
        let result = new FromStructureReferenceDto();
        result.init(json);
        return result;
    }
}