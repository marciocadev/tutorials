export const handler = async () => {
  const v = 'versão inicial';
  // const v = 'versão de desenvolvimento';
  return {
    statusCode: "200",
    body: v
  }
}