function gcd(a, b) {
  let x, y;
  if (a > b) {
    x = a;
    y = b;
  } else {
    x = b;
    y = a;
  }

  while (y !== 0) {
    const temp = x % y;
    x = y;
    y = temp;
  }
  return x;
}

function extendedGCD(a, b) {
  let x = a;
  let y = b;
  let u1 = 1;
  let v1 = 0;
  let u2 = 0;
  let v2 = 1;

  while (y !== 0) {
    const r = x % y;
    const q = Math.floor((x - r) / y);
    const u = u1 - q * u2;
    const v = v1 - q * v2;
    x = y;
    y = r;
    u1 = u2;
    v1 = v2;
    u2 = u;
    v2 = v;
  }
  return [u1, v1];
}

function findModInverse(a, m) {
  if (gcd(a, m) !== 1) {
    return null;
  }
  const [u] = extendedGCD(a, m);
  return u % m;
}

function RabinMiller(n) {
  if (n < 2) {
    return false;
  }
  if (n === 2) {
    return true;
  }
  if (n % 2 === 0) {
    return false;
  }

  let d = n - 1;
  let s = 0;

  while (d % 2 === 0) {
    s += 1;
    d = d / 2;
  }

  for (let i = 0; i < 50; i++) {
    const a = Math.floor(Math.random() * (n - 2)) + 2;
    if (gcd(a, n) !== 1) {
      return false;
    }
    let b = bigInt(a).modPow(bigInt(d), bigInt(n)).toString();
    if (b === "1" || b === bigInt(n).minus(1).toString()) {
      continue;
    }
    let isWitness = true;
    let r = 1;
    while (r < s && isWitness) {
      b = bigInt(b).modPow(2, bigInt(n)).toString();
      if (b === bigInt(n).minus(1).toString()) {
        isWitness = false;
      }
      r += 1;
    }
    if (isWitness) {
      return false;
    }
  }
  return true;
}

function isPrime(n) {
  if (n < 2) {
    return false;
  }
  const smallPrimes = [
    2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53, 59, 61, 67, 71,
    73, 79, 83, 89, 97, 101, 103, 107, 109, 113, 127, 131, 137, 139, 149, 151,
    157, 163, 167, 173, 179, 181, 191, 193, 197, 199, 211, 223, 227, 229, 233,
    239, 241, 251, 257, 263, 269, 271, 277, 281, 283, 293, 307, 311, 313, 317,
    331, 337, 347, 349, 353, 359, 367, 373, 379, 383, 389, 397, 401, 409, 419,
    421, 431, 433, 439, 443, 449, 457, 461, 463, 467, 479, 487, 491, 499, 503,
    509, 521, 523, 541, 547, 557, 563, 569, 571, 577, 587, 593, 599, 601, 607,
    613, 617, 619, 631, 641, 643, 647, 653, 659, 661, 673, 677, 683, 691, 701,
    709, 719, 727, 733, 739, 743, 751, 757, 761, 769, 773, 787, 797, 809, 811,
    821, 823, 827, 829, 839, 853, 857, 859, 863, 877, 881, 883, 887, 907, 911,
    919, 929, 937, 941, 947, 953, 967, 971, 977, 983, 991, 997,
  ];

  if (smallPrimes.includes(n)) {
    return true;
  }

  for (const p of smallPrimes) {
    if (n % p === 0) {
      return false;
    }
  }

  for (const base of [2, 3, 5, 7, 11]) {
    if (
      bigInt(base)
        .modPow(bigInt(n - 1), bigInt(n))
        .notEquals(1)
    ) {
      return false;
    }
  }

  return RabinMiller(n);
}

function findPrime(bits = 256, tries = 200) {
  const x = bigInt(2).pow(bits - 1);
  const y = bigInt(2).times(x);

  for (let i = 0; i < tries; i++) {
    const n = bigInt.randBetween(x, y).add(1);

    if (n.mod(2).equals(0)) {
      n.add(1);
    }

    if (isPrime(n)) {
      return n.toString();
    }
  }

  return null;
}

export default {
  findModInverse,
  findPrime,
  gcd,
  extendedGCD,
  isPrime
};
