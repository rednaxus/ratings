module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x7e5bce8ee498f6c29e4ddad10cb816d6e2f139f7",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
