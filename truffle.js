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

 Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0xdd2aa68431035fb1ced3dd1aca6ce20ac2849d90397967027681da07bafda339
  AnalystRegistry: 0xa66e306716edde1f3dc1d0b688e4809ea4f98606
  Deploying RatingAgency...
  ... 0xa3e433ac84647955f7905a0eb274f614cedb95209969303ef2a43d92f42102c4
  RatingAgency: 0x20f5f3ec573b626b74c4ef0e22a3fd6e228d8f71
  Deploying TokenERC20...
  ... 0x0d31694c4397159df8721e4ded0cbe6d28f33834e40e4453d7fd367f0cce795e
  TokenERC20: 0x016668daaed7fce158f02b91804ad1f1d74dc8c6
Saving successful migration to network...
  ... 0xf5444180b32d87eaedf826326b24d6538d2d5ca2fdd4753aa7a90f3ac38f0704
  ... 0xe5aa2b85a717f4ff4ce7f474cc79ad2994e2e61e0ac17980f5060136e4c827c6
  ... 0xf9c97f840b8f4180a92a5c780311f77e6a6ef032eafa26908d9384138045c2cc
  ... 0x921f03faf473e55e90cedacf4d52ba925c80a001850cd32b93553b988f86964a
  ... 0x0b7265831c09a5df46650cccb7fc68b7d3f15fce6c39814e3bbdbf81485ecefe
  ... 0xf63bce36dba2ebaf102d08151337270985f5ecefc1f0ca120c04b2f8ce92b552
  ... 0xc1800a3f5f6fef6c89dfa29f7b52e630e135a6547c7a507bca4736b5b0013f5e
  ... 0xdaf8c3d08f6429d057ca13d8674f8ea4989df75bd0320335ae37dafdce3609f8
  ... 0x4b4fba251af849dad22d942462488d8a591fe87384d94ed4f7a697f57d634c5b
Saving artifacts...
erc address 0x7136648d25166a64b43352215d4aa6faeaf2a3be
erc address 0x20d7ab6936c7952b67e170377337b11833a715a0
erc address 0xdc61cb51b71dab7eab65fb5a053f9f87ace678cc
erc address 0xf235db98d9edb45010a3a0840fc59e13314a6ff1
erc address 0xbe6fbd9a56368ee04365e5432f35084afe0d3454
erc address 0x66641b2ba5983e36d5b02445024b7b971490e9f5
erc address 0x52ec5cedb37ae2b15daf71979791e697e396ca1a
erc address 0xb36957c5601027e4dcc16fed84b02e3d5c900f50

*/
