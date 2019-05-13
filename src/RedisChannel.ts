import { createClient } from 'redis';
import { EnvConfigRegistry } from './registries';
import { getLogger } from './Logger';

const logger = getLogger('RedisChannel');

export function subForTokenChanged() {
  const sub = createClient();
  const appId = EnvConfigRegistry.getAppId();
  sub.subscribe(`${appId}`);

  // TODO: Make this more generic
  sub.on('message', (channel, message) => {
    // To reload data, just exit and let supervisor starts process again
    if (message === 'EVENT_NEW_ERC20_TOKEN_ADDED' || message === 'EVENT_NEW_ERC20_TOKEN_REMOVED') {
      logger.warn(`RedisChannel::subForTokenChanged on message=${message}. Will exit to respawn...`);
      process.exit(0);
    }
  });
}
