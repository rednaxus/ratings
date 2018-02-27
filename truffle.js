module.exports = {
  migrations_directory: "./migrations",
  networks: {
    development: {
      host: "localhost", // veva.one"
      port: 8545,
      network_id: "*", // Match any network id
      from: "0x627306090abaB3A6e1400e9345bC60c78a8BEf57",
      gas: 4700000
    }
  }
};
// ethereum typical gas: 3141592
