import {formatCurrency} from './util';
(<any>window).SCENARIO_DESCRIPTIONS = (<any>window).SCENARIO_DESCRIPTIONS || []
// SCENARIO_DESCRIPTIONS is a Window object defined via YAML in Jekyll which
// has the structure of:
// SCENARIO_DESCRIPTIONS: []< { scenario: <string - uninque key for financial data of the same name>, scenarioDescriptions: <{ lessonOrder: description, ... }>} >

function feasibilityScale(opts: any) {
    let baseHeight = 20; // in rems
    let totalSources = opts.debtAmt + opts.equityAmt;
    let totalUses = opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice;
    let smallerHeight = totalSources > totalUses ? (baseHeight * (totalUses/totalSources)) : (baseHeight * (totalSources/totalUses));

    return `
    Feasibility: <span class="t-${opts.surplus > 0 ? 'positive' : 'negative'}">${opts.surplus > 0 ? 'Feasible' : 'Infeasible'}</span>
     <div class="scale">
        <div class="scale-left" style="height: ${totalUses > totalSources ? baseHeight : smallerHeight}rem">
            <div class="scale-title">Uses</div>

            <div class="block" style="flex: ${opts.landPricePerTDC};">
                <span>Land Acquisition Cost: ${opts.landPricePerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.constructionPricePerTDC};">
                <span>Construction Cost: ${opts.constructionPricePerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.parkingPricePerTDC};">
                <span>Parking Cost: ${opts.parkingPricePerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.softCostsPerTDC};">
                <span>Design & Financing: ${opts.softCostsPerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.developerFeePerTDC};">
                <span>Developer's Fee: ${opts.developerFeePerTDC}%</span>
            </div>
        </div>
        <div class="scale-right" style="height: ${totalUses > totalSources ?  smallerHeight: baseHeight}rem">
            <div class="scale-title">Sources</div>
            <div class="block" style="flex: ${opts.debtAmtPerTDC};">
                <span>Construction Debt: ${opts.debtAmtPerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.equityAmtPerTDC};">
                <span>Equity: ${opts.equityAmtPerTDC}%</span>
            </div>
        </div>
    </div>
    `;
}

function getDescription(opts: any, lesson: string) {
    let description = (<any>window).SCENARIO_DESCRIPTIONS.filter((e: any) => e.scenario === opts.scenario)[0];
    console.log(opts.scenario);
    console.log(description);
    if (description && description.lessonDescriptions[lesson]) {
        return `<h2 class="outcomes__description">${description.lessonDescriptions[lesson]}</h2>`;
    } else {
        return '';
    }
}


const lessonTemplate1 = (opts: any) => {
    return `
        ${getDescription(opts, '1')}
        <ul class="outcomes__list">
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} Apartments</li>
            <li class="outcome__item" data-val="numFloors">${opts.numFloors} Floors</li>
            <li class="outcome__item" data-val="height">${opts.height} ft.</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} Residents</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio).toFixed(0)}% Coverage</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per Apartment</li>
            <li class="outcome__item" data-val="permitProcess">Permitting Process: ${opts.permitProcess}</li>
        </ul>

    `;
}

const lessonTemplate2 = (opts: any) => {

    return `
        ${getDescription(opts, '2')}
        <ul class="outcomes__list">
            <li class="outcome__item" data-val="rentScenario">${opts.rentScenario}</li>
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} Construction</li>
            <li class="outcome__item" data-val="returnOnCost">${opts.returnOnCost.toFixed(2)}% Return on Cost</li>
            <li class="outcome__item" data-val="expenses">Expenses: ${opts.expensesPropofEGI}% of Effective Gross Income</li>
            <li class="outcome__item" data-val="netIncome">Net Income: ${opts.noiPropOfEGI}% of Effective Gross Income </li>
            <li class="outcome__item" data-val="noiPerApt">Net Income per Apartment: $${opts.noiPerApt.toLocaleString()}</li>
            <li class="outcome__item" data-val="tdcPerUnit">Total Development Cost per Apartment: $${opts.tdcPerUnit.toLocaleString()}</li>
            <li class="outcome__item" data-val="tdcPerGSF">Total Development Cost per GSF: $${opts.tdcPerGSF.toLocaleString()}</li>
            <li class="outcome__item" data-val="landPricePerTDC">Land Price per Total Development Cost: $${opts.landPricePerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="constructionPricePerTDC">Construction Price per Total Development Cost: $${opts.constructionPricePerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="softCostsPerTDC">Desgin & Financing per Total Development Cost: $${opts.softCostsPerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="developerFeePerTDC">Developer Fee per Total Development Cost: $${opts.developerFeePerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="debtAmtPerTDC">Debt Amount per Total Development Cost: $${opts.debtAmtPerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="equityAmtPerTDC">Equity Amount per Total Development Cost: $${opts.equityAmtPerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="feasibility">
            ${feasibilityScale(opts)}
            </li>
        </ul>


    `;
}

const lessonTemplate3 = (opts: any) => {
    return `
        ${getDescription(opts, '3')}
         <ul class="outcomes__list">
            <li class="outcome__item" data-val="numParking">${opts.numParking} Parking Spaces</li>
            <li class="outcome__item" data-val="parkingRatio">Parking Ratio: ${opts.ratioParking}</li>
            <li class="outcome__item" data-val="numParkingAtGrade">Parking at Grade: ${opts.numParkingAtGrade}</li>
            <li class="outcome__item" data-val="numParkingUnderground">Parking Underground: ${opts.numParkingUnderground}</li>
            <li class="outcome__item" data-val="parkingPricePerTDC">Parking Price per Total Development Cost: $${opts.parkingPrice.toFixed(2)}</li>
            <li class="outcome__item" data-val="feasibility">
                ${feasibilityScale(opts)}
            </li>
        </ul>

    `;
}

const lessonTemplate4 = (opts: any) => {
    return `
        ${getDescription(opts, '4')}
         <ul class="outcomes__list">
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} Construction</li>
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} Apartments</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per Apartment</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio*100).toFixed(2)}% Coverage</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="height">${opts.height} ft.</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} Residents</li>
            <li class="outcome__item" data-val="feasibility">
                ${feasibilityScale(opts)}
            </li>
        </ul>

    `;
}


const lessonTemplateFull = (opts: any) => {

    return `
        ${getDescription(opts, '5')}
        <ul class="outcomes__list">
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} Construction</li>
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} Apartments</li>
            <li class="outcome__item" data-val="numFloors">${opts.numFloors} Floors</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per Apartment</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio*100).toFixed(2)}% Coverage</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="height">${opts.height} ft.</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} Residents</li>
            <li class="outcome__item" data-val="rentScenario">${opts.rentScenario}</li>
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} Construction</li>
            <li class="outcome__item" data-val="permitProcess">Permitting Process: ${opts.permitProcess}</li>
            <li class="outcome__item" data-val="returnOnCost">${opts.returnOnCost.toFixed(2)}% Return on Cost</li>
            <li class="outcome__item" data-val="expenses">Expenses: ${opts.expensesPropofEGI}% of Effective Gross Income</li>
            <li class="outcome__item" data-val="netIncome">Net Income: ${opts.noiPropOfEGI}% of Effective Gross Income </li>
            <li class="outcome__item" data-val="noiPerApt">Net Income per Apartment: $${opts.noiPerApt.toLocaleString()}</li>
            <li class="outcome__item" data-val="tdcPerUnit">Total Development Cost per Apartment: $${opts.tdcPerUnit.toLocaleString()}</li>
            <li class="outcome__item" data-val="tdcPerGSF">Total Development Cost per GSF: $${opts.tdcPerGSF.toLocaleString()}</li>
            <li class="outcome__item" data-val="landPricePerTDC">Land Price per Total Development Cost: $${opts.landPricePerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="constructionPricePerTDC">Construction Price per Total Development Cost: $${opts.constructionPricePerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="softCostsPerTDC">Desgin & Financing per Total Development Cost: $${opts.softCostsPerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="developerFeePerTDC">Developer Fee per Total Development Cost: $${opts.developerFeePerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="debtAmtPerTDC">Debt Amount per Total Development Cost: $${opts.debtAmtPerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="equityAmtPerTDC">Equity Amount per Total Development Cost: $${opts.equityAmtPerTDC.toLocaleString()}</li>
            <li class="outcome__item" data-val="numParking">${opts.numParking} Parking Spaces</li>
            <li class="outcome__item" data-val="parkingRatio">Parking Ratio: ${opts.ratioParking}</li>
            <li class="outcome__item" data-val="numParkingAtGrade">Parking at Grade: ${opts.numParkingAtGrade}</li>
            <li class="outcome__item" data-val="numParkingUnderground">Parking Underground: ${opts.numParkingUnderground}</li>
            <li class="outcome__item" data-val="parkingPricePerTDC">Parking Price per Total Development Cost: $${opts.parkingPrice.toFixed(2)}</li>
            <li class="outcome__item" data-val="feasibility">
            ${feasibilityScale(opts)}
            </li>
        </ul>


    `;
}



export default function outcomeTemplating (options: any, lesson: number) {

    let tpl = '';

    if (lesson === 1) {
        tpl = lessonTemplate1(options);
    } else if (lesson === 2) {
        tpl = lessonTemplate2(options);
    } else if (lesson === 3) {
        tpl = lessonTemplate3(options);
    } else if (lesson === 4) {
        tpl = lessonTemplate4(options);
    } else {
        tpl = lessonTemplateFull(options);
    }

    return tpl;
}
