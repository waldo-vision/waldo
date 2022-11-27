// just creating helper functions... no logic or type etc rn.
const api_url = 'http://localhost:8001/';
const handleUploadFileLogic = async (
  url: string | undefined,
  userId: string,
  type: string,
) => {
  let result;
  const options = {
    method: 'POST',
    body: JSON.stringify({ id: parseInt(userId), url: url, type: type }),
    headers: { 'Content-Type': 'application/json' },
  };
  const options2 = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json' },
  };
  try {
    const request = await fetch(api_url + 'footage', options);
    const response = await request.json();

    const request2 = await fetch(api_url + 'discord/' + userId, options2);
    const response2 = await request2.json();
    if (response.error) {
      result = { message: response.error.message, error: true };
    } else if (!response2.data.isInGuild) {
      result = { message: response2.data.message, error: true };
    } else {
      result = {
        message: response.data.message,
        isInGuild: response2.data.isInGuild,
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
