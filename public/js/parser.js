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
            console.log(transactions[i]);
        }
        getBudget(function(budget){
            $('#current-balance').innerText = "£" + (budget - moneySpent);
        });
    });
}
