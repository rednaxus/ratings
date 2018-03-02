module.exports = {
  migrations_directory: "./migrations",
  networks: { 
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x115F2C501F4506a71e2D313A1074729aa1dae9E4",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
/*
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0x12e689511a599aaa000fedc0eb979cb9518a64f26ff8724bfd4a415d5a0bbce4
  AnalystRegistry: 0xa5a4f84827fc7854ce6bd77221b9c4f3a5367627
  Deploying RatingAgency...
  ... 0xc401c03f216c37260a235fcc34f8db94477fd2e4f06f55636b30b842111346fb
  RatingAgency: 0x44ef55e4c8fce81b72ad0f3d78246629ebaa3549
  Running step...
Saving successful migration to network...
  ... 0xbe4af2ff3c2383b1a1bc280e0ce93456c05b3bd4e85fa95f9de81ad7ca8eda25
  ... 0x9e82124042297326bfda92058cbf4176fb5734c60b768e32c0ffbc3bbe1005f8
  ... 0x2dee87d9bc60ae290de2bb8429d99579042e07a10c6ad828a4fd0acdd50b7966
  ... 0x551fc45db5d479578b9eaae129ce6b012f7358d5d35a897a55cb90ee2181a270
  ... 0x4e49aa8a53fa1fdfdd9365084fe39f2ec281bdb1357f1dd7413216e83d72a142
Saving artifacts...
erc address 0xb843526938c407395757d8a1f9aaa9f98b3c4d0c
erc address 0xe4b345d0fc139f27741f948e7466d165a0d4202c
erc address 0xcd58c177baf0251a54085bddc87eb3fb7d42a68f
erc address 0x646312f31837cc1302e4b4a190b8cc2e45d65f05



*/
