const readApiResponse = async (response) => {
  const text = await response.text();

  if (!text) return null;

  try {
    return JSON.parse(text);
  } catch {
    throw new Error(`La API devolvio HTML en vez de JSON. Revisar que ${response.url} llegue al backend.`);
  }
};

export default readApiResponse;
