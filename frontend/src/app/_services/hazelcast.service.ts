import {Client, Config} from "hazelcast-client";

export class HazelcastService {
  private static instance: HazelcastService;

  private client: any;

  public constructor() { }

  static getInstance() {
      if (!HazelcastService.instance) {
          HazelcastService.instance = new HazelcastService();

          let config = new Config.ClientConfig();
          config.networkConfig.addresses.push('0.0.0.0:5701');

          HazelcastService.instance.client = Client.newHazelcastClient(config).then(function (client) {
              console.log(client);
          });
      }

      return HazelcastService.instance;
  }

  insertPerson(accessToken) {
      HazelcastService.instance.client.getMap('persons').
      put(accessToken, accessToken).then(function (previousValue) {
          console.log("Insert value: ", previousValue);
      });
  };
}




