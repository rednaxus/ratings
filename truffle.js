module.exports = {
  migrations_directory: "./migrations",
  networks: { 
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x98692a01576A169028cBc4552b3bd14fc8EEeeF4",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
/*
Running migration: 2_deploy_contracts.js
  Deploying AnalystRegistry...
  ... 0x12e689511a599aaa000fedc0eb979cb9518a64f26ff8724bfd4a415d5a0bbce4
  AnalystRegistry: 0x0424c9c56a9e119706ce23e35d0ecf9fc841acdc
  Deploying RatingAgency...
  ... 0x83ab887ad4ac36b61c216dd6d7d6740a3d4636fc2176dccd3f46a688462649df
  RatingAgency: 0x3cd8359ca1653c80bf52347dbcadc17235fa9655
  Running step...
Saving successful migration to network...
  ... 0xec4fea162f438927b6ab9603d89e379a46e2d9c325926b3fd1a61d1e8086576f
  ... 0x9e82124042297326bfda92058cbf4176fb5734c60b768e32c0ffbc3bbe1005f8
  ... 0x2dee87d9bc60ae290de2bb8429d99579042e07a10c6ad828a4fd0acdd50b7966
  ... 0x551fc45db5d479578b9eaae129ce6b012f7358d5d35a897a55cb90ee2181a270
  ... 0x4e49aa8a53fa1fdfdd9365084fe39f2ec281bdb1357f1dd7413216e83d72a142
Saving artifacts...
erc address 0x212741036e02424bb297c63145be5e54a2a2b53e
erc address 0xd654c8cdda019de6994c29b0b02940c22ba2d200
erc address 0x110d8848fd7ae8128342fd6ebc6d44b539295cf9
erc address 0xfc7b77a574f6cf230e9bdcddb9e7ee7e02ea6166


*/
