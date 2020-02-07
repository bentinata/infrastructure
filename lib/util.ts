export function mapList(list: string[], prefix: string): {[key: string]: string} {
  let map: {[key: string]: string} = {};

  for (let element of list) {
    map[element] = `${prefix}_${element}`;
  }

  return map;
}
