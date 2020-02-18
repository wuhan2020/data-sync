export function pointsDistance(lat1: number, long1: number, lat2: number, long2: number) {

  const haverSin = (theta: number): number => {
    const v = Math.sin(theta / 2);
    return v * v;
  };
  const degToRad = (d: number): number => {
    return d * Math.PI / 180;
  };

  long1 = degToRad(long1);
  lat1 = degToRad(lat1);
  long2 = degToRad(long2);
  lat2 = degToRad(lat2);

  const vLon = Math.abs(long1 - long2);
  const vLat = Math.abs(lat1 - lat2);

  const h = haverSin(vLat) + Math.cos(lat1) * Math.cos(lat2) * haverSin(vLon);

  return 2 * 6371 * Math.asin(Math.sqrt(h));
}
