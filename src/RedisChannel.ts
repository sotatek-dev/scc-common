import { createClient } from 'redis';
import { CCEnv } from '..';

export function subForTokenChanged() {
  const sub = createClient();
  const appId = CCEnv.getAppId();
  sub.subscribe(`${appId}`);

  sub.on('message', (channel, message) => {
    console.log(`################# RedisChannel TODO: handle me channel=${channel}, message=${message}`);
  });
}
