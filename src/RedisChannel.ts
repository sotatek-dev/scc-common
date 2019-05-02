import { createClient } from 'redis';
import { EnvConfigRegistry } from './registries';

export function subForTokenChanged() {
  const sub = createClient();
  const appId = EnvConfigRegistry.getAppId();
  sub.subscribe(`${appId}`);

  sub.on('message', (channel, message) => {
    console.log(`################# RedisChannel TODO: handle me channel=${channel}, message=${message}`);
  });
}
