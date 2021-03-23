export default function getLicenseFromSource(_source: number): string | null {
  const identifiers = getPlayerIdentifiers(_source.toString());
  const filteredLicense = identifiers.find((identifier) =>
    identifier.includes('license')
  );
  if (!filteredLicense) throw new Error('License was not parsed properly');

  return filteredLicense;
}
