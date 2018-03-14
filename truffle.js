module.exports = {
  migrations_directory: "./migrations",
  networks: { 
    development: {
      host: "localhost", //10.0.0.3", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x9F943eD85fb1B63b2a68aF79290e5023D32F5E96",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
/*
^C^Crednaxus@whitewolf:~/workspace/veva/veva-engr$ ps aux | grep ganache
rednaxus 19427  0.0  0.0  14228   928 pts/1    S+   13:09   0:00 grep --color=auto ganache
rednaxus@whitewolf:~/workspace/veva/veva-engr$ ganache-cli --s dog1 --i 7
Ganache CLI v6.0.3 (ganache-core: 2.0.2)

Available Accounts
==================
(0) 0x9f943ed85fb1b63b2a68af79290e5023d32f5e96
(1) 0x77e8f0b7d306ce5dc00347e1c6b91a6fd6f0555c
(2) 0x68c0db14ee31f6f97c326f20bfc7cdb12f13aef4
(3) 0x1702eba21dc4d62527babb1f24c04e3074fe5a32
(4) 0x102f2daffd8c56df798e3bec933dddac5234293d
(5) 0x2e225be25f2491c728ed280c69775b4dea9d7b5f
(6) 0xb5bc651bfe7e3f8c49f9e6a3d13c3b19eaadee6e
(7) 0xff12f8fba68186e5ca11aad363978b92a82f56ad
(8) 0x0df719e9c0a33d3bf5a78c69fcd0d82bfe08fa1a
(9) 0xdbbaaaa263d2d169a2318fa90a63985596d2d369

Private Keys
==================
(0) feabed97e9caf644dc9ddd3658ee7a97e81b0718e59f2e9b2fe358cdadd29d38
(1) 5e3ba346706ab2e35903e30e54fa5e427ac039cf69be08bac2da89329a2043da
(2) 1b382e63b8a3da99e6a3229c0e3e7b425fb7e5dd0025dad223808cc62b171cd3
(3) 82be2520adde0e978b6cf61d02345ffa611d89961d6e1fa1833429b956c8d1c7
(4) f689dc57739baa83fae457c55afa507122d98cd126f92ef53bfc52839331ea38
(5) 884bf4266530354e67bce9f38dca2675ccab058940df68174005bd530bd9053a
(6) 4f3c5ab7c1602cde425ea9d0b9cf32f5b0709a0281b44e5ed98cc283ab7a5e8d
(7) db251a24188cf3262ba46c213cd9c209a20e945515daba672dece746041c0781
(8) cc795917d616e3081f81472d3f70e8dab089c553f657ece621fbe415d8ae9383
(9) febe96c13696534cf00cedaa4797d232e7bcc828ab83fbb3d3298a9628df8c8a

HD Wallet
==================
Mnemonic:      noodle library tide trial funny cricket fork bonus receive away protect found
Base HD Path:  m/44'/60'/0'/0/{account_index}

URunning migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xe1dcc7db753169c6d2f4f40d6e092d21e8bc467e8c7cbd55ebc2bb8572924788
  Migrations: 0xe0ba8bebe2a9f06871005460c6a5bef056dcbe92
Saving successful migration to network...
  ... 0xd7b8d8157d7e98c970cb886b0c2822e10d2f65555ccb3b2fd53e370ef7a4feec
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0xf13bfe99e69ffef30bad5d5589ab221b69a10da6077342afee20e181a8073aa3
  AnalystRegistry: 0x71550fb9f99430404870295a56a166d6858dc899
  Deploying RatingAgency...
  ... 0xba71cb5a188bd960ffc1996cc1561361620aa91217e5a1daf8aad259447f4112
  RatingAgency: 0xadd48aac37be1d4bdc70bf8a26ac103fa4f800a7
  Deploying TokenERC20...
  ... 0xe93de0647ce1f5fc7189e60a9d2b53ba6fba59359af6f84f7bbb27d2d73e0497
  TokenERC20: 0x1ce3ba215d09207b12a9052bdbd8a396bdae5cb3
Saving successful migration to network...
  ... 0xe932dd29fa3e419c80141ee7e337b128cb103b3df58327fab8e91ac5858717c6
  ... 0x3cd2e42be02f4def66e2e02be2518420d63f6ead4e5946684e64cc1d68e5f822
  ... 0x0aeb86b230c19d6cea124470f1db9f1f8c2ad8fc9c256f93d0586cbb6f16cf79
  ... 0x4965b2b0e412d6a6db1be4dc47cb4fc4583a2e6fe7be68ce2a9a26c4a5ebaa48
  ... 0x82b04ff8978237dcb825298d8239dab8aae56183427666b1984e7589fa156f95
  ... 0xe327eb68808cceb59dde71deb4414647b9ac31db4945fa5fb2c7192eef63fc4e
  ... 0x5a7d4efa71efdd4e710c8cfc4f9466935c8a6f1e6fc7f88f0abbe3e5e6916262
  ... 0x603781f5824840aff42121a957e7729341fdfbb89d0d781a3babd27d0e8f315c
  ... 0xbb4d41572827dbbfb2c7d3d572ec054704d63e0426d09ca5b5fad20ef039775a
Saving artifacts...
erc address 0xf2cb4e553610dc1057edfc922a80dfe2e28fc782
erc address 0x5b15b3ea7b91056cb4cdab1ffe0de6b9724ce629
erc address 0xd1bf271b3dc7e17ca7db370cf6c8c9f56cda16c1
erc address 0xede1506ef5367b6ff14fba2e0e702757abf8c5b8
erc address 0xda3838c9f12e2518c6c1ea328d6f7cb463cd5b0d
erc address 0x42b96babe718a97e2b3f04baf92187352d09396b
erc address 0xfc604af8aae8958071902ed5ad365a43e31d83ed
erc address 0xc6e3faec99ab636c990e6b53d2b9554539363712



*/
