module.exports = {
  migrations_directory: "./migrations",
  networks: { 
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x02C43124f86467Fa82B615Dd946f7866D0d398aA",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
/*
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0xce3310f6af7e9894dd04c0e0e96a4e1ebdc70650a0e834a4a4558e198f5cc979
  AnalystRegistry: 0x284f0923427b1e93260ef25146bd5a5f1877c58b
  Deploying RatingAgency...
  ... 0xc5757dfba6911779fafb3af02d09e904c152f38f898185749aa9cba609d4bf86
  RatingAgency: 0xf786c62faadbc5389f00fc1c5ebb60daf7b01070
  Running step...
Saving successful migration to network...
  ... 0x18816b80e24b4820e5baa39edb784ba009f83be56f772518047f610e13ae9c14
  ... 0x8a8bd3a6282fe43f4508a2bf4bb3523dcebc20544531e6d50421ecb34e43ac5f
  ... 0x72daaacff59831b25787137543e818a4a66c7001370272846b6b36eea37ea12d
  ... 0x6c72f36c07d6e07f03d0b35d05453658e4776207848d9ee9ffbf8197a15517f6
  ... 0x5a91b04cc67577e19167e3ea77c2c8e2103e1e02848fd52ecb73475a26c22d98
Saving artifacts...
erc address 0xcefd3bc1cfe77d40fcaf4d9d273de384d2e12164
erc address 0xc689bf45b3d8fc8686c33b1392410e0b826c8be0
erc address 0xfbd2840773bfcacc0cf5fe3215687d3325fe1810
erc address 0xdd9752bc73f5c85af3e76c3cf3e99b37a2acff81





*/
