angular.module("invoice1",[]).controller("InvoiceController",function(){this.qty=1,this.cost=2,this.inCurr="EUR",this.currencies=["USD","EUR","CNY"],this.usdToForeignRates={USD:1,EUR:.74,CNY:6.09},this.total=function(t){return this.convertCurrency(this.qty*this.cost,this.inCurr,t)},this.convertCurrency=function(t,i,n){return t*this.usdToForeignRates[n]*1/this.usdToForeignRates[i]},this.pay=function(){window.alert("Thanks!")}});