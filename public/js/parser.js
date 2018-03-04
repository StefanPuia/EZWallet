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
        for (let i in transactions){
            moneySpent += transactions[i].amount;
            newRecEl(transactions[i]);
        }
        setRemaining(moneySpent);
    });
}

function setRemaining(moneySpent){
    getBudget(function(budget){
        let onScreenBudget = document.getElementById("current-balance")
        onScreenBudget.innerText= "£" + (budget - moneySpent);
    });
}
