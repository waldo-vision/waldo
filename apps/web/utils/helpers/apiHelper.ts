// just creating helper functions... no logic or type etc rn.
const api_url = 'http://localhost:4500/';
const handleUploadFileLogic = async (
  url: string | undefined,
  userId: string | number,
  type: string,
) => {
  let result;  
  const options = {
    method: 'POST',
    body: JSON.stringify({ id: userId, url: url, type: type }),
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const request = await fetch(api_url + 'footage', options);
    const response = await request.json();

    if (response.error) {
      result = { message: response.error.message, error: true };
    } else {
      result = {
        message: response.data.message,
      };
    }
  } catch (error) {
    result = {
      message:
        'Sorry, but our server seems to be down. Please try again later.',
      error: true,
    };
  }
  return result;
};

const checkURL = (url: string): boolean => {
  const p =
    // eslint-disable-next-line max-len
    /^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/;
  if (url.match(p)) {
    return true;
  }
  return false;
};
export { handleUploadFileLogic, checkURL };
