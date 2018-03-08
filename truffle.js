module.exports = {
  migrations_directory: "./migrations",
  networks: { 
    development: {
      host: "localhost", //10.0.0.3", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x7e5bce8ee498f6c29e4ddad10cb816d6e2f139f7",
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

Using network 'development'.

Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0xfa820ae6910db7c9676e87268950be3969bfe92efb57619cab337210ba5c745a
  Migrations: 0x380cb3e3fc13e0728170a8299fd85085269bfef8
Saving successful migration to network...
  ... 0xdb5f4da617661528f0460f361e8ee6621c0c0388bd7a79314614bbd145706589
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0x12e689511a599aaa000fedc0eb979cb9518a64f26ff8724bfd4a415d5a0bbce4
  AnalystRegistry: 0x5fcc303fc970394afadff52a1c5224ad0a677c4d
  Deploying RatingAgency...
  ... 0x0f6e49d8ef4baa3072bf8821df761ea6482139dd0e64631d9ab9d9232a099dcd
  RatingAgency: 0x594274b7619fd1b9ce9b83b771bcf6ec4a4efa95
  Deploying TokenERC20...
  ... 0xfd2868ed48e6a78fe99ecd6db0ae2617369d5becfd03177f1ef5b07097263b86
  TokenERC20: 0x3ae851d5780725853de7118c73d0bd2a303c7fff
Saving successful migration to network...
  ... 0x9e82124042297326bfda92058cbf4176fb5734c60b768e32c0ffbc3bbe1005f8
  ... 0x2dee87d9bc60ae290de2bb8429d99579042e07a10c6ad828a4fd0acdd50b7966
  ... 0x551fc45db5d479578b9eaae129ce6b012f7358d5d35a897a55cb90ee2181a270
  ... 0x4e49aa8a53fa1fdfdd9365084fe39f2ec281bdb1357f1dd7413216e83d72a142
  ... 0xd35d5cb734ec2aedae92a9fbdeb8a70d5d7ca28bdd67d83b37bd6f1a002f13a6
  ... 0x21560b1caeb9bbf1c82c54adc73ee7ec62c7b82e7dd3b72000961fd5b0cf76a8
  ... 0x66eddaf17e1399136afdcab1668916ee7207934badda6e82bf89496f4c5d924f
  ... 0x021235065b69b5cd47b2a46debad362388b4cbdd2b78c1a52da68011938c0581
  ... 0x417225660e96505fc3a25665a3d28a39491924340428ae7b3477cf6fd1cbefc7
Saving artifacts...
erc address 0xaa9bceb2d84ded2147e971de3c579ffee2a677ce
erc address 0x4d42601f5b28db47399b53bb733d983db92150af
erc address 0xc2dbef2e183c87decca0e7d2dec03626a238b976
erc address 0x1febab846f93bdd6d52f2ee0c2efbfba48e5fca4
erc address 0x94cddd6267919e75f0d41dbc63cafa3a3c5bac26
erc address 0x8f47d813663af0c146a7dc72d842072cd5bef787
erc address 0xa6308e97435ebba53c6da8bdb23333f8e49f1935
erc address 0x44ea6933b03ce304c81c81eca4b8515b7793d884





*/
