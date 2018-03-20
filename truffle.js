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

 Running migration: 1_initial_migration.js
  Deploying Migrations...
  ... 0x016467056065db46303c3d0067501075917277a838c145bd8e31c327720e3504
  Migrations: 0x380cb3e3fc13e0728170a8299fd85085269bfef8
Saving successful migration to network...
  ... 0xdb5f4da617661528f0460f361e8ee6621c0c0388bd7a79314614bbd145706589
Saving artifacts...
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0x0a33d13224489a49e5969a1c776d7b92c1403b7ab6344e719569e3b05a532a99
  AnalystRegistry: 0x5fcc303fc970394afadff52a1c5224ad0a677c4d
  Deploying RatingAgency...
  ... 0x565da9921edc48f155b50aba424e06e50107da3b7017409edeb22359ee99cf59
  RatingAgency: 0x594274b7619fd1b9ce9b83b771bcf6ec4a4efa95
  Deploying TokenERC20...
  ... 0x5d00f5903b00185c7b565a6cbb61e3efdaab9205bae222ca82a490384cbfa470
  TokenERC20: 0x3ae851d5780725853de7118c73d0bd2a303c7fff
Saving successful migration to network...
  ... 0x4f2b3fa11ed6d00cdac540af2fd411fd2225157bf2b21db0ceb76db02cfde893
  ... 0xd66668a31a3e2e1b3f364ee57b5577169acd39da0b1c831b1a0ad53cda59e06b
  ... 0x4b0f0acd207e707982f0ee41ecfc244c9acfe4a9058f9943bfec93522d6b93eb
  ... 0xce35cdb7152d9a97130b38aa8dad0acb9528e21e9c644a9b10643ffc416f0495
  ... 0x4c7d7a3e19bc5ee5dd010f189892905f1339cab1cc1b37610a8800197727f671
  ... 0xddb1e0a179812bacb3f01d1d71d0435e298c5f25730ffb29cca28d8205c82993
  ... 0x14a9d0dc59f89716e0f7093fdd05beb5987a3df35f7ec134ebfd5de7c088956c
  ... 0x0ec19b1d7b173a01a854091cd0fdb8a483609e14fd4f10ca09234f1bb525f61d
  ... 0x417225660e96505fc3a25665a3d28a39491924340428ae7b3477cf6fd1cbefc7
Saving artifacts...
erc address 0xaa9bceb2d84ded2147e971de3c579ffee2a677ce
erc address 0xc2dbef2e183c87decca0e7d2dec03626a238b976
erc address 0x4d42601f5b28db47399b53bb733d983db92150af
erc address 0x1febab846f93bdd6d52f2ee0c2efbfba48e5fca4
erc address 0x94cddd6267919e75f0d41dbc63cafa3a3c5bac26
erc address 0x8f47d813663af0c146a7dc72d842072cd5bef787
erc address 0xa6308e97435ebba53c6da8bdb23333f8e49f1935
erc address 0x44ea6933b03ce304c81c81eca4b8515b7793d884*/
