import {formatCurrency} from './util';
(<any>window).EXPLANATIONS = (<any>window).EXPLANATIONS || []
// EXPLANATIONS is a Window object defined via YAML in Jekyll which
// has the structure of:
// EXPLANATIONS: []< { scenario: <string - uninque key for financial data of the same name>, sentence: <string>} >

function feasibilityScale(opts: any) {
    let totalSources = opts.debtAmt + opts.equityAmt;
    let totalUses = opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice;
    return `
    Feasibility: <span class="t-${opts.surplus > 0 ? 'positive' : 'negative'}">${opts.surplus > 0 ? 'Feasible' : 'Infeasible'}</span>
     <div class="scale ${totalUses > totalSources ? 'left' : 'right'}">
        <div class="scale-left ${totalUses > totalSources ? 'taller' : ''}">
            <div class="scale-title">Uses</div>

            <div class="block" style="flex: ${opts.developerFeePerTDC};">
                <span>Developer's Fee: ${opts.developerFeePerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.landPricePerTDC};">
                <span>Land Acquisition Cost: ${opts.landPricePerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.softCostsPerTDC};">
                <span>Design & Financing: ${opts.softCostsPerTDC}%</span>
            </div>
            <div class="block" style="flex: ${opts.constructionPricePerTDC};">
                <span>Construction Costs: ${opts.constructionPricePerTDC}%</span>
            </div>
        </div>
        <div class="scale-right ${totalUses < totalSources ? 'taller' : ''}">
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
    let description = (<any>window).EXPLANATIONS.filter((e: any) => e .scenario === opts.scenario)[0];
    let descriptionHTML = '';
    if (description && description.sentence) {
        return `<h2 class="outcomes__description">${ description[lesson] || description.sentence}</h2>`;
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
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} Construction</li>
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
            <li class="outcome__item" data-val="feasibility">
            ${feasibilityScale(opts)}
            </li>
            <li class="outcome__item" data-val="returnOnCost">${opts.returnOnCost.toFixed(2)}% Return on Cost</li>
            <li class="outcome__item" data-val="expenses">Expenses: ${opts.expensesPropofEGI}% of Effective Gross Income</li>
            <li class="outcome__item" data-val="netIncome">Net Income: ${opts.noiPropOfEGI}% of Effective Gross Income </li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="tdcPerUnit">Total Development Cost per Apartment: $${opts.tdcPerUnit.toLocaleString()}</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per Apartment</li>
            <li class="outcome__item" data-val="permitProcess">Permitting Process: ${opts.permitProcess}</li>
        </ul>


    `;
}

const lessonTemplate3 = (opts: any) => {
    return `
        ${getDescription(opts, '3')}
         <ul class="outcomes__list">
            <li class="outcome__item" data-val="numParking">${opts.numParking} Parking Spaces</li>
            <li class="outcome__item" data-val="parkingPrice">Total Parking Construction Cost: $${opts.parkingPrice.toFixed(2)}</li>
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
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} Apartments</li>
            <li class="outcome__item" data-val="numFloors">${opts.numFloors} Floors</li>
            <li class="outcome__item" data-val="height">${opts.height} ft.</li>
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} Construction</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} Residents</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="tdcPerUnit">Total Development Cost per Apartment: $${opts.tdcPerUnit.toLocaleString()}</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio*100).toFixed(2)}% Coverage</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per Apartment</li>
            <li class="outcome__item" data-val="permitProcess">Permitting Process: ${opts.permitProcess}</li>
            <li class="outcome__item" data-val="feasibility">
                ${feasibilityScale(opts)}
            </li>
            <li class="outcome__item" data-val="numParking">${opts.numParking} Parking Spaces</li>
            <li class="outcome__item" data-val="parkingPrice">Total Parking Construction Cost: $${opts.parkingPrice.toFixed(2)}</li>
            <li class="outcome__item" data-val="returnOnCost">${opts.returnOnCost.toFixed(2)}% return on cost</li>
            <li class="outcome__item" data-val="expenses">Expenses: ${opts.expensesPropofEGI}% of Effective Gross Income</li>
            <li class="outcome__item" data-val="netIncome">Net Income: ${opts.noiPropOfEGI}% of Effective Gross Income </li>
        </ul>

    `;
}



export default function outcomeTemplating (options: any, lesson: number) {

    let tpl = '';

    if (lesson === 1) {
        tpl = lessonTemplate1(options);
    }
    if (lesson === 2) {
        tpl = lessonTemplate2(options);
    }
    if (lesson === 3) {
        tpl = lessonTemplate3(options);
    }
    if (lesson === 4) {
        tpl = lessonTemplate4(options);
    }

    return tpl;
}
