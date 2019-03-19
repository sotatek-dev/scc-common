const registry: any = {};
const pub = (name: string, ...args: any) => {
  if (!registry[name]) {
    return;
  }

  registry[name].forEach((x: { apply: (arg0: any, arg1: any) => void }) => {
    x.apply(null, args);
  });
};

const sub = (name: string, fn: any) => {
  if (!registry[name]) {
    registry[name] = [fn];
  } else {
    registry[name].push(fn);
  }
};

export let Pub = pub;
export let Sub = sub;
