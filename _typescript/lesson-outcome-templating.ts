import {formatCurrency} from './util';

const lessonTemplate1 = (opts: any) => {
    return `

        <h2 class="outcomes__description">
            There are multiple ways to arrange and organize apartments in an urban site.
        </h2>
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
    let totalSources = opts.debtAmt + opts.equityAmt;
    let totalUses = opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice;
    return `
        <h2 class="outcomes__description">
            The amount of income this development generates through rents is not enough to support its construction. Subsidies will have to be sought through Government programs.
        </h2>

        <ul class="outcomes__list">
            <li class="outcome__item" data-val="feasibility"><span>${opts.surplus > 0 ? 'feasible' : 'infeasible'}</span>
                 <div class="scale ${totalUses > totalSources ? 'left' : 'right'}">
                    <div class="scale-left ${totalUses > totalSources ? 'taller' : ''}">

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
                        <div class="block" style="flex: ${opts.debtAmt};">
                            <span>Construction Debt: $${formatCurrency(opts.debtAmt)}</span>
                        </div>
                        <div class="block" style="flex: ${opts.equityAmt};">
                            <span>Equity: $${formatCurrency(opts.equityAmt)}</span>
                        </div>
                    </div>
                </div>
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
    let totalSources = opts.debtAmt + opts.equityAmt;
    let totalUses = opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice;

    return `
        <h2 class="outcomes__description">While there are no dedicated off-street parking spaces for residents, this development is near a bus stop and has partnered with a share-car service that utilizes four on-street reserved spaces. Doing so means it is financially feasible.</h2>

         <ul class="outcomes__list">
            <li class="outcome__item" data-val="numParking">${opts.numParking}</li>
            <li class="outcome__item" data-val="parkingPrice">$${opts.parkingPrice.toFixed(2)}</li>
            <li class="outcome__item" data-val="feasibility"><span>${opts.surplus > 0 ? 'feasible' : 'infeasible'}</span>
                 <div class="scale ${totalUses > totalSources ? 'left' : 'right'}">
                    <div class="scale-left ${totalUses > totalSources ? 'taller' : ''}">

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
                        <div class="block" style="flex: ${opts.debtAmt};">
                            <span>Construction Debt: $${formatCurrency(opts.debtAmt)}</span>
                        </div>
                        <div class="block" style="flex: ${opts.equityAmt};">
                            <span>Equity: $${formatCurrency(opts.equityAmt)}</span>
                        </div>
                    </div>
                </div>
            </li>
        </ul>

    `;
}

const lessonTemplate4 = (opts: any) => {
    let totalSources = opts.debtAmt + opts.equityAmt;
    let totalUses = opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice;

    return `

         <ul class="outcomes__list">
            <li class="outcome__item" data-val="calcNumApts">${opts.calcNumApts} apartments</li>
            <li class="outcome__item" data-val="numFloors">${opts.numFloors} floors</li>
            <li class="outcome__item" data-val="constructionType">${opts.constructionType} construction</li>
            <li class="outcome__item" data-val="numResidents">${Math.floor(opts.numResidents)} residents</li>
            <li class="outcome__item" data-val="far">${opts.far} F.A.R</li>
            <li class="outcome__item" data-val="coverageRatio">${(opts.coverageRatio*100).toFixed(2)}% coverage</li>
            <li class="outcome__item" data-val="avgAptSize">${opts.avgAptSize} ft<sup>2</sup> per apartment</li>
            <li class="outcome__item" data-val="permitProcess">${opts.permitProcess}</li>
            <li class="outcome__item" data-val="feasibility"><span>${opts.surplus > 0 ? 'feasible' : 'infeasible'}</span>
                 <div class="scale ${totalUses > totalSources ? 'left' : 'right'}">
                    <div class="scale-left ${totalUses > totalSources ? 'taller' : ''}">

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
                        <div class="block" style="flex: ${opts.debtAmt};">
                            <span>Construction Debt: $${formatCurrency(opts.debtAmt)}</span>
                        </div>
                        <div class="block" style="flex: ${opts.equityAmt};">
                            <span>Equity: $${formatCurrency(opts.equityAmt)}</span>
                        </div>
                    </div>
                </div>
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
        tpl = lessonTemplate3(options);
    }
    if (lesson === 4) {
        tpl = lessonTemplate4(options);
    }

    return tpl;
}
