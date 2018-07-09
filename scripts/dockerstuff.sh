docker build -t node_one .
docker build -t node_two .

docker run --rm -it -p 8312:8312 --net=ETH --name=my_node_one node_one
docker run --rm -it -p 8313:8313 --net=ETH --name=my_node_two node_two
docker run --rm -it -p 8312:8312 --net=ETH --name=node_one node_1

geth --identity="NODE_ONE" --networkid="7" --verbosity=3 --mine --minerthreads=1 --rpc --rpcport=8312 --rpcaddr 0.0.0.0   --unlock 0 --password "config/password" console

geth --identity="NODE_TWO" --networkid="7" --verbosity=3 --mine --minerthreads=1 --rpc --rpcport=8313 --rpcaddr 0.0.0.0   --unlock 0 --password "config/password" console

geth --identity="NODE_ONE" --networkid="7" --verbosity=3 --mine --minerthreads=1 --rpc --rpcport=8312 --rpcaddr 0.0.0.0 console


docker run -d -it -p 8312:8312 --net=ETH --name=node_one node_1


-v ~/vols/data/prometheus:/prometheus-data prom/prometheus

docker run -it -p 8312:8312 --net=ETH -v ~/vols/data/ethereum-1/10:/home/eth_user/.ethereum --name=node_1_a -d node_one_a
docker run -it -p 8312:8312 --net=ETH -v ~/vols/data/ethereum-1/10:/home/eth_user/.ethereum --name=node_1 -d node_one
docker run -it -p 8312:8312 --net=ETH --name=node_1 -d node_one

---
client-go docker

docker run --rm -it -p 8312:8312 --net=ETH --name=my_node_one node_one
docker run -it -p 8302:8302 --net=ETH --name=node_oneish -p 30303:30303 ethereum/client-go --rpc --rpcaddr "0.0.0.0" --unlock 0 --password="password"
