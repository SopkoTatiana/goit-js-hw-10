export function fetchCountries(name) {
  const FIELDS = ['name', 'capital', 'population', 'flags', 'languages '];
  return fetch(
    `https://restcountries.com/v3.1/name/${name}?fields=${FIELDS.join(',')}`
  ).then(response => {
    if (!response.ok) {
      throw new Error(response.status);
    }
    return response.json();
  });
}
