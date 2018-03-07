'use strict';
function fillDash(month, year){
    let date = {
        'month': month,
        'year': year
    };

    if(!month || !year){
        let d = new Date();
        date.month = d.getMonth() + 1;
        date.year = d.getFullYear();
    }

    getTransactions(date,function(transactions){
        let moneySpent = 0;
        for(let i in transactions){
            moneySpent += transactions[i].Amount;
            //fills records
            newRecEl(transactions[i]);
        }
        setRemaining(moneySpent,transactions);
    });
}

function setRemaining(moneySpent,transactions){
    getBudget(function(budget){
        let onScreenBudget = document.getElementById("current-balance")
        onScreenBudget.innerText= "£" + (budget - moneySpent);
        calcTotals(moneySpent,transactions,budget);
    });
}


function calcTotals(moneySpent,transactions,budget){
    let totals = {
        Remaining: budget - moneySpent
    };

    for(let i in transactions){
        if(totals[transactions[i].Category]){
            totals[transactions[i].Category] += transactions[i].Amount;
        }else{
            totals[transactions[i].Category] = 0;
            totals[transactions[i].Category] += transactions[i].Amount;
        }
    }

    let chartData = [
        ["Categories","Budget Spent"]
    ];

    Object.keys(totals).map(function(k) {chartData.push([k,totals[k]])});
    drawDashChart(chartData);

    ;

}
