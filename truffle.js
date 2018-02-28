module.exports = {
  migrations_directory: "./migrations",
  networks: { 
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x048A0a93F00E58d7AB103c1ac85B20b80769C6cF",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
/*
  Deploying AnalystRegistry...
  ... 0xa396fa78efc333e32fad362985b9cf0935061910319cddeada7a85327717e816
  AnalystRegistry: 0x82b0827145d8833db0675bf802479dae839c2eb6
  Deploying RatingAgency...
  ... 0x11fde3e90b1c9b1ec447a8ebda0d4bffec326eeaaa2aebabc99a54ca749375f7
  RatingAgency: 0xf7179b052816957c89b8baf57362a0f4e0df6a95
  Running step...
Saving successful migration to network...
  ... 0x363418607c20bce7ab3017e013da2cbe61a2082e07879db2708f705f6cd7d4c6
  ... 0xe1197d1d62df23d53a846033c8fbaa362d96ac2d8e2e0cc38c9d03cbc70ca2bf
  ... 0x6062594030eb85f14db728f61bcb95cfd519b417eb214ffc6212add05c70b6b3
  ... 0x4935be891ded569ebffa497862252a050df5516f1d766fe080a8de8d24167150
  ... 0xaca4d8e0eb53bdcaafef713cbac77bbba69dd9d1eb351be515d71a24d8ee0d1d
Saving artifacts...
erc address 0x9fa989c64a23effaf8408a2071c85ab9e34d9c25
erc address 0x5fb66c52cfa0c1c5b291a180dc370ed3f58328f2
erc address 0x3669f0845c614885073451422473f0796974dd30
erc address 0x8f5a1e2c9a2a57b5ddd1660e7876fddf67363a60


*/
