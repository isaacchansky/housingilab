import {formatCurrency} from './util';
(<any>window).SCENARIO_DESCRIPTIONS = (<any>window).SCENARIO_DESCRIPTIONS || []
// SCENARIO_DESCRIPTIONS is a Window object defined via YAML in Jekyll which
// has the structure of:
// SCENARIO_DESCRIPTIONS: []< { scenario: <string - uninque key for financial data of the same name>, scenarioDescriptions: <{ lessonOrder: description, ... }>} >

function feasibilityScale(opts: any) {

    let optsObj: any = {};

    opts.forEach((outcome:any) => {
        optsObj[outcome.name] = outcome.value;
    });

    let baseHeight = 20; // in rems
    let totalSources = optsObj.debtProp + optsObj.equityProp;
    let totalUses = optsObj.devFeeProp + optsObj.landProp + optsObj.softProp + optsObj.constructionProp;
    let smallerHeight = totalSources > totalUses ? (baseHeight * (totalUses/totalSources)) : (baseHeight * (totalSources/totalUses));
    return `
    <div class="feasibility-scale">
        Feasibility: <span class="t-${optsObj.surplus > 0 ? 'positive' : 'negative'}">${optsObj.surplus > 0 ? 'Feasible' : 'Infeasible'}</span>
        <div class="scale">
            <div class="scale-left" style="height: ${totalUses > totalSources ? baseHeight : smallerHeight}rem">
                <div class="scale-title">Uses</div>

                <div class="block" style="flex: ${optsObj.landProp};">
                    <span>Land Acquisition Cost: ${(optsObj.landProp / totalUses * 100).toFixed(1)}%</span>
                </div>
                <div class="block" style="flex: ${optsObj.constructionProp};">
                    <span>Construction Cost: ${(optsObj.constructionProp / totalUses * 100).toFixed(1)}%</span>
                </div>
                <div class="block" style="flex: ${optsObj.parkingProp};">
                    <span>Parking Cost: ${(optsObj.parkingProp / totalUses * 100).toFixed(1)}%</span>
                </div>
                <div class="block" style="flex: ${optsObj.softProp};">
                    <span>Design & Financing: ${(optsObj.softProp / totalUses * 100).toFixed(1)}%</span>
                </div>
                <div class="block" style="flex: ${optsObj.devFeeProp};">
                    <span>Developer's Fee: ${(optsObj.devFeeProp / totalUses * 100).toFixed(1)}%</span>
                </div>
            </div>
            <div class="scale-right" style="height: ${totalUses > totalSources ?  smallerHeight: baseHeight}rem">
                <div class="scale-title">Sources</div>
                <div class="block" style="flex: ${optsObj.debtProp};">
                    <span>Construction Debt: ${(optsObj.debtProp / totalSources * 100).toFixed(1)}%</span>
                </div>
                <div class="block" style="flex: ${optsObj.equityProp};">
                    <span>Equity: ${(optsObj.equityProp / totalSources * 100).toFixed(1)}%</span>
                </div>
            </div>
        </div>
    </div>
    `;
}

function descriptionTemplate(opts: any, lesson: string) {
    let description = (<any>window).SCENARIO_DESCRIPTIONS.filter((e: any) => e.scenario === opts.scenario)[0];
    if (description && description.lessonDescriptions[lesson]) {
        return `<h2 class="outcomes__description">${description.lessonDescriptions[lesson]}</h2>`;
    } else {
        return '';
    }
}

const outcomeItemTemplate = (outcome: any) => {
    const img = `<img class="outcome__item-icon" src="images/${outcome.icon}" />`;
    return `
        <li class="outcome__item" data-val="${outcome.name}">
            <label for="${outcome.name}">
                ${ outcome.icon ? img : '' }
                <span>${outcome.title}</span>
            </label>
            <div class="outcome__item-value" id="${outcome.name}">
                ${outcome.text}
            </div>
        </li>
    `;
};

const sectionTemplate = (section: string, opts: any) => {
    const items = opts.map( (outcome: any) => {
        return outcomeItemTemplate(outcome);
    }).join('');
    return `
        <div class="outcomes__section">
            <button class="outcomes__section-title">${section}</button>
            <ul class="outcomes__section-list">
             ${items}
            </ul>
        </div>
    `;
};

const lessonOutcomeTemplate = (groupedOpts: any, opts: any, lesson: string) => {
    const sections = Object.keys(groupedOpts).map( section => {
        return sectionTemplate(section, groupedOpts[section]);
    }).join('');
    return `
        ${descriptionTemplate(groupedOpts, lesson)}
        ${sections}
        ${feasibilityScale(opts)}
    `;
};


function groupBy(xs: any, key: string) {
    return xs.reduce(function (rv: any, x: any) {
        (rv[x[key]] = rv[x[key]] || []).push(x);
        return rv;
    }, {});
};


export default function outcomeTemplating (options: any, lesson: number) {
    let tpl = '';
    // don't want to show certain items in the outcomes array
    options = options.filter( (o:any) => {
        return o.name !== 'feasibilityColor';
    })
    let groupedOptions = groupBy(options, 'section');
    return lessonOutcomeTemplate(groupedOptions, options, lesson.toString());
}
