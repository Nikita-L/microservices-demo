import {Client, Config} from "hazelcast-client";

export class HazelcastService {
  private static instance: HazelcastService;

  private client: any;

  public constructor() { }

  static getInstance() {
      if (!HazelcastService.instance) {
          HazelcastService.instance = new HazelcastService();

          let config = new Config.ClientConfig();
          config.networkConfig.addresses.push('http://localhost:5701');

          Client.newHazelcastClient(config).then(function (client) {
              console.log(client);
              HazelcastService.instance.client = client;
          });
      }

      return HazelcastService.instance;
  }

  insertPerson(accessToken) {
    console.log(HazelcastService.instance.client);
      // HazelcastService.instance.client.getMap('persons').
      // put(accessToken, accessToken).then(function (previousValue) {
      //     console.log("Insert value: ", previousValue);
      // });
  };
}




