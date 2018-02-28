module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0xa7602a071EBBF80496Af0E630917bCba9B0BE617",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
/*
Saving successful migration to network...
  ... 0x511526650492e6003703abc300e83d2c029b211446d4f7b8f69d241e31b40c39
  ... 0x6ce5793f99a4cba50a62a84e740e6f2c204a3c5d37888e3619238892a38584ae
  ... 0xc268e945d06dbfc8cf37c135f404f61f8e6f0a2dc099dae51e5b27b037dd0fa2
  ... 0xb4c9b6433e4f182e9349894494c954c77ef89782c74141df02defa92717eb483
  ... 0x14088f5ced6b6a9caf7f041a8756768b693feb86ca4ab07caf1e03e9a4b65f17
Saving artifacts...
  Deploying AnalystRegistry...
  ... 0x287a0e0a2d00115e3dd5c4b533fdf7ffc46115817850daf529148abef45341a7
  AnalystRegistry: 0xb350d3e0fd4724a920b80ce00cecc222a8afa2ce
  Running step...
  ... 0x9ac790483122465143cdca27fe81dbc022bed7ba6e039d009f907ca8c7c81380
rating agency instance 0xae430411298a339e391444d49a4d39233de70ff7
erc address 0x491d1260a898a4334c0abbfd049d2a97a7601f6e
erc address 0x76465e5ec7e8abd6daa8b2f39224b2b3618c82cb
erc address 0x8a2769f8c99235946d74b125a3428fade52ce06e
erc address 0x919f20f55a7537fd880165075ab650d6f68a0a90

*/
