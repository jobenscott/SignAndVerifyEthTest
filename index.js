require('ethjs');
//var ethUtil = require('ethereumjs-util');

var message = "Please sign and verify this is you to see your kitties!"; 
getAccount();

var sig;
var retrieved_sig;
//var existing_sig;



function getAccount() {
	var from = web3.eth.accounts[0];
	checkForExistingSig(from);
}

function checkForExistingSig(from) {
	retrieved_sig = localStorage.getItem('pk_'+from);
	if (retrieved_sig != null) {
		verifySig(retrieved_sig);

	} else {
		sign(from);
	}
}

function sign(from) {
	message = "0x" + ascii_to_hexa(message);
	web3.personal.sign(message, from, function (error, result) {
		console.log(result);
		sig = result;
		var localVar = 'pk_'+from;
		localStorage.setItem(localVar, sig.toString());
		getKitties(from);
	});
}


function verifySig(retrieved_sig) {
	web3.personal.ecRecover(message,retrieved_sig, function (error, result) {
		getKitties(result);
	});	
}

function getKitties(address) {
	jQuery(function($){
		$.ajax({
			url: 'https://api.cryptokitties.co/kitties?owner_wallet_address='+address,
			success: function(data){
				console.log(data);
				for(var i in data.kitties) {
					$('body').append('<img src="'+data.kitties[i]['image_url']+'" width="100px" height="100px">');
				}
			}
		});
	});
}

function ascii_to_hexa(str) {
	var arr1 = [];
	for (var n = 0, l = str.length; n < l; n ++)  {
		var hex = Number(str.charCodeAt(n)).toString(16);
		arr1.push(hex);
	}
	return arr1.join('');
}