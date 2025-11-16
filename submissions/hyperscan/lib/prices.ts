export async function fetchHypePrice(): Promise<number | null> {
  try {
    const endpoint = process.env.NEXT_PUBLIC_PRICE_ENDPOINT;
    if (endpoint) {
      const res = await fetch(endpoint, { cache: "no-store" });
      const data = await res.json();
      const price = Number(data?.price ?? data?.hype ?? data?.HYPE);
      if (Number.isFinite(price)) return price;
    }
    // Placeholder fallback
    return 1.2345;
  } catch {
    return null;
  }
}


