const web3module = require("web3");
const fs = require("fs");
const cc = require("node-console-colors");
const axios = require("axios");

var FILE = "wallets.txt"; // Cüzdanların okunacağı dosyanın konumu
var networks = [ 
    {
        "name": "BSC",
        "rpc": "https://bsc-dataseed.binance.org/",
        "pair": "BNB",
        "web3": null
    },
    {
        "name": "AVAX",
        "rpc": "https://api.avax.network/ext/bc/C/rpc",
        "pair": "AVAX",
        "web3": null
    },
    {
        "name": "ETH",
        "rpc": "https://mainnet.infura.io/v3/937f5a2c211d4f8cae81e86a06675e4d",
        "pair": "ETH",
        "web3": null,
    },
    {
        "name": "MATIC",
        "rpc": "https://polygon-rpc.com/",
        "pair": "MATIC",
        "web3": null
    }
];

async function main() {
    var wallets = fs.readFileSync(FILE, { encoding: "utf-8" }).split("\n"); // Cüzdanların bulunduğu metin dosyasını satırlara böler
    var write = ""; // Çıktının kaydedildiği değişken
    for (var walletIndex in wallets) {
        var wallet = wallets[walletIndex].trim(); // Daha kolay erişmek için metin dosyasındaki satırı değişken olarak tutar
        write += (parseInt(walletIndex) + 1) + " - " + cc.set("fg_red", wallet) + "\n"; // Index değeri ile cüzdanı yazdırmak üzere değişkene ekler
        for (var networkIndex in networks) {
            var network = networks[networkIndex];  // Daha kolay erişmek için RPC adreslerini ve diğer değerlerini tutan index'i değişkene atar
            try {
                if (!network.web3) networks[networkIndex].web3 = new web3module(network.rpc); // Programı hızlandırmak için sadece ilk açılışta yeni class referansı tanımlar
                var balance = ((await networks[networkIndex].web3.eth.getBalance(wallet))/100000000000000000); // Cüzdandaki bakiyeyi WEI cinsinden ETHER'e çevirir   
                balance = (await axios.get(`https://min-api.cryptocompare.com/data/price?fsym=${network.pair.toUpperCase()}&tsyms=USD`)).data.USD * balance ; // Bakiyeyi dolara çevir
                // balance = balance.includes(".") ? balance.split(".")[0] + "." + balance.split(".")[1].slice(0, 5) : balance; // Eğer bakiye tam sayı değil ise sadece 5 basamağı dahil et
                write += cc.set("fg_blue", network.name) + " ".repeat(9 - network.name.length) +  ":  " + cc.set("fg_green", "$" + balance) + (networkIndex < networks.length - 1 ? "\n" : "\n\n" ); // Çıktının renklendirilip program bitiminde yazdırılacak değişkene eklenir                 
            } catch (error) {
                continue; // Herhangi bir hata meydana gelebileceği durumlarda döngüyü atla 
            }
        };
    };
    console.log(write);
};
main();