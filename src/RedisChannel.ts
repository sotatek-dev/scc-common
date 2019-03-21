import { createClient } from 'redis';

export function subForTokenChanged() {
  const sub = createClient();
  sub.on('message', (channel, message) => {
    process.exit(1);
  });
  sub.subscribe('tokenAddedChan');
}

export function shutDownRequest() {
  const pub = createClient();
  pub.publish('tokenAddedChan', 'newToken');
}
