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

            <div class="block" style="flex: ${opts.developerFee};">
                <span>Developer's Fee: $${formatCurrency(opts.developerFee)}</span>
            </div>
            <div class="block" style="flex: ${opts.landPrice};">
                <span>Land Acquisition Cost: $${formatCurrency(opts.landPrice)}</span>
            </div>
            <div class="block" style="flex: ${opts.softCosts};">
                <span>Design & Financing: $${formatCurrency(opts.softCosts)}</span>
            </div>
            <div class="block" style="flex: ${opts.constructionPrice};">
                <span>Construction Costs: $${formatCurrency(opts.constructionPrice)}</span>
            </div>
        </div>
        <div class="scale-right ${totalUses < totalSources ? 'taller' : ''}">
            <div class="scale-title">Sources</div>
            <div class="block" style="flex: ${opts.debtAmt};">
                <span>Construction Debt: $${formatCurrency(opts.debtAmt)}</span>
            </div>
            <div class="block" style="flex: ${opts.equityAmt};">
                <span>Equity: $${formatCurrency(opts.equityAmt)}</span>
            </div>
        </div>
    </div>
    `;
}

function getDescription(opts: any) {
    let description = (<any>window).EXPLANATIONS.filter((e: any) => e .scenario === opts.scenario)[0];
    let descriptionHTML = '';
    if (description && description.sentence) {
        return `<h2 class="outcomes__description">${description.sentence}</h2>`;
    } else {
        return '';
    }
}


const lessonTemplate1 = (opts: any) => {
    return `
        ${getDescription(opts)}
        <ul class="outcomes__list">
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} apartments</li>
            <li class="outcome__item" data-val="numFloors">${opts.numFloors} floors</li>
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} construction</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} residents</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio*100).toFixed(2)}% coverage</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per apartment</li>
            <li class="outcome__item" data-val="permitProcess">${opts.permitProcess}</li>
        </ul>

    `;
}

const lessonTemplate2 = (opts: any) => {

    return `
        ${getDescription(opts)}
        <ul class="outcomes__list">
            <li class="outcome__item" data-val="feasibility">
            ${feasibilityScale(opts)}
            </li>
            <li class="outcome__item" data-val="returnOnCost">${opts.returnOnCost.toFixed(2)} % return on cost</li>
            <li class="outcome__item" data-val="expenses">${opts.expensesPropofEGI} </li>
            <li class="outcome__item" data-val="netIncome">${opts.noiPropOfEGI} </li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="tdcPerUnit">$${opts.tdcPerUnit.toFixed(2)}</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per apartment</li>
            <li class="outcome__item" data-val="permitProcess">${opts.permitProcess}</li>
        </ul>


    `;
}

const lessonTemplate3 = (opts: any) => {
    return `
        ${getDescription(opts)}
         <ul class="outcomes__list">
            <li class="outcome__item" data-val="numParking">${opts.numParking} Parking Spaces</li>
            <li class="outcome__item" data-val="parkingPrice">$${opts.parkingPrice.toFixed(2)} Total Parking Construction Cost</li>
            <li class="outcome__item" data-val="feasibility">
                ${feasibilityScale(opts)}
            </li>
        </ul>

    `;
}

const lessonTemplate4 = (opts: any) => {
    return `
        ${getDescription(opts)}
         <ul class="outcomes__list">
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} apartments</li>
            <li class="outcome__item" data-val="numFloors">${opts.numFloors} floors</li>
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} construction</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} residents</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio*100).toFixed(2)}% coverage</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per apartment</li>
            <li class="outcome__item" data-val="permitProcess">${opts.permitProcess}</li>
            <li class="outcome__item" data-val="feasibility">
                ${feasibilityScale(opts)}
            </li>
            <li class="outcome__item" data-val="returnOnCost">${opts.returnOnCost.toFixed(2)} % return on cost</li>
            <li class="outcome__item" data-val="expenses">${opts.expensesPropofEGI} </li>
            <li class="outcome__item" data-val="netIncome">${opts.noiPropOfEGI} </li>
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
        console.log(options);
        tpl = lessonTemplate3(options);
    }
    if (lesson === 4) {
        tpl = lessonTemplate4(options);
    }

    return tpl;
}
