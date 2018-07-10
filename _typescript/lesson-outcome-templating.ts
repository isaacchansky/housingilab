import {formatCurrency} from './util';

const lessonTemplate1Summary = (opts: any) => {
    return `
        ${opts.numApts} units, ${opts.numFloors} floors, ${opts.constructionType}, ${opts.type}
    `;
}

const lessonTemplate1Full = (opts: any) => {
    return `

        <h2 class="outcome-description">
            We're looking at <span class="outcome-info-user" title="Based on your selection for 'Development Size'">${opts.numApts}</span> units total, in <span class="outcome-info-user" title="Based on your selection for 'Number of Floors'">${opts.numFloors}</span> floors, which means a <span class="outcome-info-machine" title="This type of construction is required based on the scenario. It is most influenced by the selection of '${opts.numFloors} floors'.">${opts.constructionType}</span> type of construction.
        </h2>

        <table>
            <tr>
                <th>Apartments</th>
                <td>${opts.calcNumApts}</td>
            </tr>
            <tr>
                <th>Construction Type</th>
                <td>${opts.constructionType}</td>
            </tr>

        </table>

    `;
}

const lessonTemplate2Summary = (opts: any) => {
    return `
        <strong>${opts.margin > 0 ? 'Feasible': 'Not feasible'}</strong> ${opts.numApts} units, ${opts.numFloors} floors, ${opts.constructionType}, ${opts.type}
    `;
}

const lessonTemplate2Full = (opts: any) => {
    let totalSources = opts.debtAmt + opts.equityAmt;
    let totalUses = opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice;
    return `
        <h2 class="outcome-description">
            Your selection makes this <span class="outcome-info-machine" title="Feasibility involves many factors, many of which are financial.">${opts.margin > 0 ? 'feasible': 'not feasible'}</span>.
        </h2>

        <h3>Budget Overview</h3>
        <div class="scale ${totalUses > totalSources ? 'left' : 'right'}">
            <div class="scale-left ${totalUses > totalSources ? 'taller' : ''}">
                <h4>Uses: $${formatCurrency(opts.developerFee + opts.landPrice + opts.softCosts + opts.constructionPrice)}</h4>
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
                <h4>Sources: $${formatCurrency(opts.debtAmt + opts.equityAmt)}</h4>
                <div class="block" style="flex: ${opts.debtAmt};">
                    <span>Construction Dept: $${formatCurrency(opts.debtAmt)}</span>
                </div>
                <div class="block" style="flex: ${opts.equityAmt};">
                    <span>Equity: $${formatCurrency(opts.equityAmt)}</span>
                </div>
            </div>
            <div class="scale-base">
            </div>
        </div>

        <table>
            <tr>
                <th>Apartments</th>
                <td>${opts.calcNumApts}</td>
            </tr>

            <tr>
                <th>Construction Type</th>
                <td>${opts.constructionType}</td>
            </tr>

            <tr>
                <th>Margin</th>
                <td class="t-financial">${opts.margin}</td>
            </tr>

        </table>

    `;
}

const lessonTemplate3Summary = (opts: any) => {
    return `
        <strong>${opts.margin > 0 ? 'Feasible': 'Not feasible'}</strong> parking: $${formatCurrency(opts.parkingPrice)}, ${opts.numApts} units, ${opts.numFloors} floors
    `;
}

const lessonTemplate3Full = (opts: any) => {
    return `
         <table>
            <tr>
                <th>Apartments</th>
                <td>${opts.calcNumApts}</td>
            </tr>

            <tr>
                <th>Construction Type</th>
                <td>${opts.constructionType}</td>
            </tr>
            <tr>
                <th>Parking price</th>
                <td>$${formatCurrency(opts.parkingPrice)}</td>
            </tr>

            <tr>
                <th>Margin</th>
                <td class="t-financial">${opts.margin}</td>
            </tr>

        </table>

    `;
}

const lessonTemplate4Summary = (opts: any) => {
    return `
        <strong>${ opts.margin > 0 ? 'Feasible': 'Not feasible'} - cost per unit: $${formatCurrency(opts.tdcPerUnit)}</strong> parking: $${formatCurrency(opts.parkingPrice)}, ${opts.type}
    `;
}

const lessonTemplate4Full = (opts: any) => {
    return `

    <table>
            <tr>
                <th>Apartments</th>
                <td>${opts.calcNumApts}</td>
            </tr>
            <tr>
                <th>Construction Price</th>
                <td class="t-financial">$${formatCurrency(opts.constructionPrice)}</td>
            </tr>
            <tr>
                <th>Construction Type</th>
                <td>${opts.constructionType}</td>
            </tr>
            <tr>
                <th>Debt Amount</th>
                <td class="t-financial">$${formatCurrency(opts.debtAmt)}</td>
            </tr>
            <tr>
                <th>Debt Service Amount</th>
                <td class="t-financial">$${formatCurrency(opts.debtServiceAmt)}</td>
            </tr>
            <tr>
                <th>Developer Fee</th>
                <td class="t-financial">$${formatCurrency(opts.developerFee)}</td>
            </tr>
            <tr>
                <th>Equity Amount</th>
                <td class="t-financial">$${formatCurrency(opts.equityAmt)}</td>
            </tr>
            <tr>
                <th>Expenses Per Apartment</th>
                <td class="t-financial">$${formatCurrency(opts.expensesPerApt)}</td>
            </tr>
            <tr>
                <th>Land Price</th>
                <td class="t-financial">$${formatCurrency(opts.landPrice)}</td>
            </tr>
            <tr>
                <th>Margin</th>
                <td class="t-financial">$${formatCurrency(opts.margin)}</td>
            </tr>
            <tr>
                <th>N.O.I (?)</th>
                <td class="t-financial">$${formatCurrency(opts.noi)}</td>
            </tr>
            <tr>
                <th>N.O.I per apartment (?)</th>
                <td class="t-financial">$${formatCurrency(opts.noiPerApt)}</td>
            </tr>
            <tr>
                <th>N.O.I prop of EGI (?)</th>
                <td class="t-financial">$${formatCurrency(opts.noiPropOfEGI)}</td>
            </tr>
            <tr>
                <th>Parking Price</th>
                <td class="t-financial">$${formatCurrency(opts.parkingPrice)}</td>
            </tr>
            <tr>
                <th>Return on Cost</th>
                <td>${opts.returnOnCost}</td>
            </tr>
            <tr>
                <th>Soft Costs</th>
                <td class="t-financial">$${formatCurrency(opts.softCosts)}</td>
            </tr>
            <tr>
                <th>Surplus</th>
                <td class="t-financial">$${formatCurrency(opts.surplus)}</td>
            </tr>
            <tr>
                <th>tdcPerGSF (?)</th>
                <td class="t-financial">$${formatCurrency(opts.tdcPerGSF)}</td>
            </tr>
            <tr>
                <th>tdcPerUnit (?)</th>
                <td class="t-financial">$${formatCurrency(opts.tdcPerUnit)}</td>
            </tr>
            <tr>
                <th>Total Dev Cost</th>
                <td class="t-financial">$${formatCurrency(opts.totalDevCost)}</td>
            </tr>
            <tr>
                <th>Total Sources</th>
                <td class="t-financial">$${formatCurrency(opts.totalSources)}</td>
            </tr>

        </table>

    `;
}



export default function outcomeTemplating (options: any, lesson: number) {
    let summary = '';
    let full = '';


    if (lesson === 1) {
        summary = lessonTemplate1Summary(options);
        full = lessonTemplate1Full(options);
    }
    if (lesson === 2) {
        summary = lessonTemplate2Summary(options);
        full = lessonTemplate2Full(options);
    }
    if (lesson === 3) {
        summary = lessonTemplate3Summary(options);
        full = lessonTemplate3Full(options);
    }
    if (lesson === 4) {
        summary = lessonTemplate4Summary(options);
        full = lessonTemplate4Full(options);
    }

    return {
        summary,
        full
    }
}
